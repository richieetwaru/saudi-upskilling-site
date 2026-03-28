import React from 'react';

interface Tip {
  text: string;
  type?: 'tip' | 'question' | 'warning';
}

interface InterviewCardProps {
  title: string;
  role?: string;
  difficulty?: string;
  tips?: Tip[] | string;
  questions?: string[] | string;
  description?: string;
  onAction?: (phrase: string) => void;
}

/** Extract text from {text:...,type:...} or {text:...} format */
function extractTextField(s: string): { text: string; type?: string } {
  // Match {text:VALUE} or {"text":"VALUE","type":"VALUE"}
  const textMatch = s.match(/["']?text["']?\s*[:=]\s*["']?([^"'}]+)["']?/);
  const typeMatch = s.match(/["']?type["']?\s*[:=]\s*["']?([^"'}]+)["']?/);
  if (textMatch) {
    return { text: textMatch[1].trim(), type: typeMatch?.[1]?.trim() };
  }
  // Plain string
  return { text: s.replace(/^[{[\s]+|[}\]\s]+$/g, '').trim() };
}

/** Safely parse tips — handles arrays, stringified JSON, or plain strings */
function parseTips(raw: Tip[] | string | undefined): Tip[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    // Try JSON parse first
    try {
      const parsed = JSON.parse(raw.startsWith('[') ? raw : `[${raw}]`);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    // Split by semicolons or }; pattern and extract text fields
    return raw.split(/;\s*(?=\{|$)/).map(s => s.trim()).filter(Boolean).map(s => {
      const extracted = extractTextField(s);
      return { text: extracted.text, type: (extracted.type || 'tip') as Tip['type'] };
    }).filter(t => t.text.length > 0);
  }
  return [];
}

function parseQuestions(raw: string[] | string | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw.startsWith('[') ? raw : `[${raw}]`);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
    // Handle {text:...} format or plain semicolon-delimited
    return raw.split(/;\s*(?=\{|"|$)/).map(s => {
      const extracted = extractTextField(s);
      return extracted.text;
    }).map(s => s.replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  return [];
}

const TYPE_STYLES: Record<string, { bg: string; dot: string }> = {
  tip: { bg: 'rgba(200,150,46,0.08)', dot: '#C8962E' },
  question: { bg: 'rgba(26,58,75,0.3)', dot: '#60a5fa' },
  warning: { bg: 'rgba(239,68,68,0.08)', dot: '#ef4444' },
};

export const InterviewCard: React.FC<InterviewCardProps> = ({
  title,
  role,
  difficulty,
  tips: rawTips,
  questions: rawQuestions,
  description: rawDescription,
  onAction,
}) => {
  // If description contains JSON array of tips, extract them
  let description = rawDescription;
  let extraTips: Tip[] = [];
  if (typeof rawDescription === 'string' && rawDescription.trim().startsWith('[{')) {
    extraTips = parseTips(rawDescription);
    description = undefined;
  }
  const tips = [...parseTips(rawTips), ...extraTips];
  const questions = parseQuestions(rawQuestions);
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Difficulty badge */}
      {difficulty && (
        <span
          className="self-start rounded-full px-3 py-1 text-[10px] font-data uppercase tracking-wider mb-3"
          style={{
            background: difficulty.toLowerCase() === 'easy' ? 'rgba(34,197,94,0.15)' :
              difficulty.toLowerCase() === 'hard' ? 'rgba(239,68,68,0.15)' : 'rgba(200,150,46,0.15)',
            color: difficulty.toLowerCase() === 'easy' ? '#22c55e' :
              difficulty.toLowerCase() === 'hard' ? '#ef4444' : '#C8962E',
          }}
        >
          {difficulty}
        </span>
      )}

      {/* Title */}
      <h3 className="font-hero text-lg font-bold text-white leading-tight">{title}</h3>

      {/* Role */}
      {role && (
        <div className="font-voice text-sm text-white/60 mt-1">{role}</div>
      )}

      {/* Description */}
      {description && (
        <p className="font-voice text-sm text-white/50 mt-2 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div className="mt-3 space-y-2 flex-1 min-h-0 overflow-auto">
          {tips.slice(0, 4).map((tip, i) => {
            const style = TYPE_STYLES[tip.type || 'tip'] || TYPE_STYLES.tip;
            return (
              <div
                key={i}
                className="rounded-lg p-2.5 flex items-start gap-2"
                style={{ background: style.bg }}
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: style.dot }} />
                <span className="font-voice text-xs text-white/70 leading-relaxed">{tip.text}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && tips.length === 0 && (
        <div className="mt-3 space-y-2 flex-1 min-h-0 overflow-auto">
          {questions.slice(0, 4).map((q, i) => (
            <div
              key={i}
              className="rounded-lg p-2.5 flex items-start gap-2"
              style={{ background: 'rgba(26,58,75,0.3)' }}
            >
              <span className="font-data text-xs shrink-0 mt-0.5" style={{ color: '#C8962E' }}>Q{i + 1}</span>
              <span className="font-voice text-xs text-white/70 leading-relaxed">{q}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0" />

      {/* Practice button */}
      <div className="flex justify-end mt-4 pt-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => onAction?.(`Practice interview for ${role || title}`)}
          className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider transition-all duration-200 hover:brightness-110"
          style={{ background: '#1A3A4B', color: '#fff', border: '1px solid #C8962E' }}
        >
          Practice
        </button>
      </div>
    </div>
  );
};
