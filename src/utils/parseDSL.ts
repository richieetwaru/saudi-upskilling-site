/**
 * parseDSL — Pipe-delimited card DSL parser
 * v3.0 — Clean rewrite for 13 card types only
 *
 * SUPPORTED CARD TYPES (13):
 *   Domain:   job · skill · training · interview
 *   Journey:  onboarding · assessment · coach · offer · progress · schedule
 *   Data:     data-table · tile-grid · spotlight
 *
 * FORMAT:
 *   layout:CODE
 *   TYPE|field1|field2|field3|...
 *   TYPE|field1|field2|...
 *   ...
 */

export { type CardDef } from '@/types/cards';
import type { CardDef } from '@/types/cards';

export interface ParsedDSL {
    layout?: string;
    badge?: string;
    cards: CardDef[];
}

/** Strip HTML tags and dangerous patterns to prevent XSS from agent output */
function sanitize(val: string): string {
    return val
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
}

/** Normalize field — empty/'-' → undefined, sanitize output */
function n(val: string | undefined): string | undefined {
    if (!val) return undefined;
    const trimmed = val.trim();
    if (trimmed === '' || trimmed === '-' || trimmed === 'undefined' || trimmed === 'null') return undefined;
    return sanitize(trimmed);
}

const VALID_TYPES = new Set([
    'job', 'skill', 'training', 'interview',
    'onboarding', 'assessment', 'offer', 'progress', 'schedule',
    'data-table', 'tile-grid', 'bar-chart', 'donut-chart',
    'response',
]);

function parseCard(type: string, fields: string[]): CardDef | null {
    const card: CardDef = { type };

    switch (type) {
        case 'job': {
            const [title, company, location, salary, jobType, tagsStr, description, posted] = fields;
            return Object.assign(card, {
                title: n(title) ?? '', company: n(company), location: n(location),
                salary: n(salary), tags: n(tagsStr)?.split(/[;,]/).map(t => t.trim()).filter(Boolean) ?? [],
                description: n(description), posted: n(posted),
            });
        }
        case 'skill': {
            const [name, level, progressStr, category, demand, description, relatedStr] = fields;
            return Object.assign(card, {
                name: n(name) ?? '', level: n(level),
                progress: parseInt(n(progressStr) ?? '0', 10) || 0,
                category: n(category), demand: n(demand), description: n(description),
                relatedJobs: n(relatedStr)?.split(/[;,]/).map(t => t.trim()).filter(Boolean) ?? [],
            });
        }
        case 'training': {
            const [title, provider, duration, format, cost, level, description, modulesStr, certStr] = fields;
            return Object.assign(card, {
                title: n(title) ?? '', provider: n(provider), duration: n(duration),
                format: n(format), cost: n(cost), level: n(level), description: n(description),
                modules: n(modulesStr)?.split(/[;,]/).map(t => t.trim()).filter(Boolean) ?? [],
                certificate: n(certStr)?.toLowerCase() === 'true' || n(certStr)?.toLowerCase() === 'yes',
            });
        }
        case 'interview': {
            const [title, role, difficulty, description, ...rest] = fields;
            const tips = rest.filter(r => n(r)).map(r => {
                const text = n(r) ?? '';
                const isQ = text.startsWith('Q:') || text.startsWith('Q ');
                return { text: isQ ? text.slice(2).trim() : text, type: isQ ? 'question' : 'tip' };
            });
            return Object.assign(card, {
                title: n(title) ?? '', role: n(role), difficulty: n(difficulty),
                description: n(description), tips: tips.length > 0 ? tips : undefined,
            });
        }
        case 'onboarding': {
            const [title, subtitle, message, ...stepFields] = fields;
            const steps = stepFields.filter(s => n(s)).map(s => {
                const text = n(s) ?? '';
                const done = text.startsWith('[x]') || text.startsWith('[X]');
                return { label: done ? text.slice(3).trim() : text, done };
            });
            return Object.assign(card, {
                title: n(title) ?? 'Welcome', subtitle: n(subtitle), message: n(message),
                steps: steps.length > 0 ? steps : undefined,
            });
        }
        case 'assessment': {
            const [title, subtitle, scoreStr, recommendation, ...skillFields] = fields;
            const skills = skillFields.filter(s => n(s)).map(s => {
                const parts = (n(s) ?? '').split(':');
                return { name: parts[0]?.trim() ?? '', score: parseInt(parts[1]?.trim() ?? '0', 10) || 0, max: 100 };
            });
            return Object.assign(card, {
                title: n(title) ?? 'Skill Assessment', subtitle: n(subtitle),
                overallScore: parseInt(n(scoreStr) ?? '0', 10) || 0,
                recommendation: n(recommendation), skills: skills.length > 0 ? skills : undefined,
            });
        }
        case 'bar-chart': {
            const [title, subtitle, unit, footer, ...barFields] = fields;
            const bars = barFields.filter(b => n(b)).map(b => {
                const raw = n(b) ?? '';
                const sep = raw.includes(';') ? ';' : ':';
                const parts = raw.split(sep);
                const numMatch = parts[1]?.match(/[\d.]+/);
                return { label: parts[0]?.trim() ?? '', value: numMatch ? parseFloat(numMatch[0]) : 0 };
            });
            return Object.assign(card, {
                title: n(title), subtitle: n(subtitle), unit: n(unit), footer: n(footer),
                bars: bars.length > 0 ? bars : undefined,
            });
        }
        case 'offer': {
            const [title, company, salary, startDate, status, hrdfStr, deadline, ...benefitFields] = fields;
            return Object.assign(card, {
                title: n(title) ?? '', company: n(company), salary: n(salary),
                startDate: n(startDate), status: n(status) ?? 'Pending',
                hrdfFunding: n(hrdfStr)?.toLowerCase() === 'true' || n(hrdfStr)?.toLowerCase() === 'yes',
                deadline: n(deadline),
                benefits: benefitFields.filter(b => n(b)).map(b => n(b) ?? ''),
            });
        }
        case 'progress': {
            const [title, subtitle, progressStr, currentPhase, streakStr, hoursStr, ...milestoneFields] = fields;
            const milestones = milestoneFields.filter(m => n(m)).map(m => {
                const text = n(m) ?? '';
                const reached = text.startsWith('[x]') || text.startsWith('[X]');
                return { label: reached ? text.slice(3).trim() : text, reached };
            });
            return Object.assign(card, {
                title: n(title), subtitle: n(subtitle),
                overallProgress: parseInt(n(progressStr) ?? '0', 10) || 0,
                currentPhase: n(currentPhase),
                streak: parseInt(n(streakStr) ?? '0', 10) || 0,
                hoursLogged: parseInt(n(hoursStr) ?? '0', 10) || 0,
                milestones: milestones.length > 0 ? milestones : undefined,
            });
        }
        case 'schedule': {
            const [title, company, date, time, format, interviewer, location, ...tipFields] = fields;
            return Object.assign(card, {
                title: n(title) ?? '', company: n(company), date: n(date), time: n(time),
                format: n(format), interviewer: n(interviewer), location: n(location),
                prepTips: tipFields.filter(t => n(t)).map(t => n(t) ?? ''),
            });
        }
        case 'data-table': {
            const [title, footer, ...rest] = fields;
            return Object.assign(card, { title: n(title), footer: n(footer) });
        }
        case 'tile-grid': {
            const [title, subtitle, footer, ...tileFields] = fields;
            const tiles = tileFields.filter(t => n(t)).map(t => {
                const raw = n(t) ?? '';
                const sep = raw.includes(';') ? ';' : ':';
                const parts = raw.split(sep);
                return { label: parts[0]?.trim() ?? '', value: parts[1]?.trim(), icon: parts[2]?.trim() };
            });
            return Object.assign(card, {
                title: n(title), subtitle: n(subtitle), footer: n(footer),
                tiles: tiles.length > 0 ? tiles : undefined,
            });
        }
        case 'donut-chart': {
            const [title, subtitle, centerLabel, centerValue, footer, ...segFields] = fields;
            const segments = segFields.filter(s => n(s)).map(s => {
                const raw = n(s) ?? '';
                const sep = raw.includes(';') ? ';' : ':';
                const parts = raw.split(sep);
                const numMatch = parts[1]?.match(/[\d.]+/);
                return { label: parts[0]?.trim() ?? '', value: numMatch ? parseFloat(numMatch[0]) : 0 };
            });
            return Object.assign(card, {
                title: n(title), subtitle: n(subtitle),
                centerLabel: n(centerLabel), centerValue: n(centerValue), footer: n(footer),
                segments: segments.length > 0 ? segments : undefined,
            });
        }
        case 'response': {
            // All fields joined as the response text
            const text = fields.map(f => f.trim()).join(' ').trim();
            return Object.assign(card, { text: text || '' });
        }
        default:
            return null;
    }
}

/**
 * Parse DSL string into cards.
 * Lines: layout:CODE, badge:TEXT, or TYPE|field1|field2|...
 */
export function parseDSL(dsl: string): ParsedDSL {
    const result: ParsedDSL = { cards: [] };

    const lines = dsl
        .replace(/===CARDS===/g, '')
        .replace(/===END===/g, '')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

    for (const line of lines) {
        // Layout directive
        if (line.startsWith('layout:')) {
            result.layout = line.slice(7).trim();
            continue;
        }

        // Badge (ignored but parsed for compat)
        if (line.startsWith('badge:')) {
            result.badge = line.slice(6).trim();
            continue;
        }

        // Card line: TYPE|field1|field2|...
        const pipeIdx = line.indexOf('|');
        const type = pipeIdx >= 0 ? line.slice(0, pipeIdx).trim().toLowerCase() : line.trim().toLowerCase();
        const fields = pipeIdx >= 0 ? line.slice(pipeIdx + 1).split('|') : [];

        if (VALID_TYPES.has(type)) {
            const card = parseCard(type, fields);
            if (card) result.cards.push(card);
        } else {
            console.warn(`[parseDSL] Unknown card type: "${type}" — skipped`);
        }
    }

    return result;
}
