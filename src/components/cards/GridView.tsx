import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { SlideLayout } from '@/components/layout/SlideLayout';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { CardDef } from '@/types/cards';
import { CardErrorBoundary } from '@/components/cards/CardErrorBoundary';

// Lazy-load card components for code splitting
const DataTableCard = lazy(() => import('./DataTableCard').then(m => ({ default: m.DataTableCard })));
const TileGridCard = lazy(() => import('./TileGridCard').then(m => ({ default: m.TileGridCard })));
const BarChartCard = lazy(() => import('./BarChartCard').then(m => ({ default: m.BarChartCard })));
const DonutChartCard = lazy(() => import('./DonutChartCard').then(m => ({ default: m.DonutChartCard })));
const JobCard = lazy(() => import('./JobCard').then(m => ({ default: m.JobCard })));
const SkillCard = lazy(() => import('./SkillCard').then(m => ({ default: m.SkillCard })));
const TrainingCard = lazy(() => import('./TrainingCard').then(m => ({ default: m.TrainingCard })));
const InterviewCard = lazy(() => import('./InterviewCard').then(m => ({ default: m.InterviewCard })));
const OnboardingCard = lazy(() => import('./OnboardingCard').then(m => ({ default: m.OnboardingCard })));
const AssessmentCard = lazy(() => import('./AssessmentCard').then(m => ({ default: m.AssessmentCard })));
const OfferCard = lazy(() => import('./OfferCard').then(m => ({ default: m.OfferCard })));
const ProgressCard = lazy(() => import('./ProgressCard').then(m => ({ default: m.ProgressCard })));
const ScheduleCard = lazy(() => import('./ScheduleCard').then(m => ({ default: m.ScheduleCard })));
const ResponseCard = lazy(() => import('./ResponseCard').then(m => ({ default: m.ResponseCard })));

/* ═══════════════════════════════════════════════════════════
   GridView — 13 Card Types

   Data:     data-table, tile-grid, spotlight
   Domain:   job, skill, training, interview
   Journey:  onboarding, assessment, coach, offer, progress, schedule
   ═══════════════════════════════════════════════════════════ */

/* ═══ Types ═══ */

interface GridViewProps {
    badge?: string;
    layout?: string;
    cards?: CardDef[];
    maxRows?: number;
    onLogoClick?: () => void;
}

/* ═══ Card Renderer ═══ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CARD_MAP: Record<string, React.LazyExoticComponent<React.FC<any>>> = {
    'data-table': DataTableCard,
    'tile-grid': TileGridCard,
    'bar-chart': BarChartCard,
    'donut-chart': DonutChartCard,
    'job': JobCard,
    'skill': SkillCard,
    'training': TrainingCard,
    'interview': InterviewCard,
    'onboarding': OnboardingCard,
    'assessment': AssessmentCard,
    'offer': OfferCard,
    'progress': ProgressCard,
    'schedule': ScheduleCard,
    'response': ResponseCard,
};

/* ═══ Card Size Tiers ═══ */

const CARD_SIZE: Record<string, number> = {
    'data-table': 3, 'tile-grid': 3, 'bar-chart': 3, 'donut-chart': 3,
    'job': 3, 'skill': 3, 'training': 3, 'interview': 3,
    'onboarding': 3, 'assessment': 3,
    'offer': 3, 'progress': 3, 'schedule': 3,
};

function getRowWeight(rowCards: CardDef[]): number {
    if (rowCards.length === 0) return 2;
    // ?? 2 ensures unknown card types don't produce NaN
    const raw = Math.max(...rowCards.map(c => CARD_SIZE[c.type] ?? 2));
    return isNaN(raw) ? 2 : raw;
}

// Lazy-load shimmer fallback for Suspense
const CardLazyFallback = () => (
    <div className="h-full w-full animate-pulse rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
);

/** Clamp weights so no content row gets more than 2× the height of the smallest row. */
function clampRowWeights(weights: number[]): number[] {
    if (weights.length <= 1) return weights;
    const contentWeights = weights.filter(w => w > 1);
    if (contentWeights.length === 0) return weights;
    const minW = Math.min(...contentWeights);
    return weights.map(w => w <= 1 ? w : Math.min(w, minW * 2));
}

function renderCard(card: CardDef, index: number) {
    const Component = CARD_MAP[card.type];
    if (!Component) {
        console.warn(`[GridView] Unknown card type: ${card.type}`);
        return (
            <div className="card-glass h-full flex items-center justify-center" role="alert">
                <span className="text-xs text-white/30 font-data uppercase">{card.type}</span>
            </div>
        );
    }
    const { type: _t, span: _s, props: nestedProps, ...flatProps } = card;
    const effectiveProps = { ...(nestedProps || {}), ...flatProps };

    return (
        <div className="card-glass h-full" style={{ animationDelay: `${index * 100}ms` }} role="article" aria-label={`${card.type} card`}>
            <CardErrorBoundary cardType={card.type}>
                <Suspense fallback={<CardLazyFallback />}>
                    <Component key={index} {...effectiveProps} />
                </Suspense>
            </CardErrorBoundary>
        </div>
    );
}

/* ═══ Layout Engine ═══ */

/**
 * Best-fit hybrid layout for a given card count.
 * Ranked by visual balance — returned when the requested layout doesn't match card count.
 */
const HYBRID_LAYOUTS: Record<number, string> = {
    1: '1',
    2: '1-1',
    3: '1-2',
    4: '1-3',
    5: '2-3',
    6: '1-2-3',
    7: '1-3-3',
    8: '2-3-3',
    9: '3-3-3',
};

/* ═══ Mosaic Templates ═══
 * Named CSS Grid Area templates for mixed-size tile layouts.
 * LLM sends layout: "m:hero-sidebar" → engine returns the grid definition.
 */
interface MosaicDef {
    areas: string;      // CSS grid-template-areas value
    columns: string;    // CSS grid-template-columns value
    rowsDef: string;    // CSS grid-template-rows value
    slots: number;      // expected card count
}

const MOSAIC_TEMPLATES: Record<string, MosaicDef> = {
    'hero-sidebar': {
        areas: '"hero side1" "hero side2" "hero side3"',
        columns: '2fr 1fr',
        rowsDef: '1fr 1fr 1fr',
        slots: 4,
    },
    'hero-footer': {
        areas: '"hero hero hero" "a b c"',
        columns: '1fr 1fr 1fr',
        rowsDef: '2fr 1fr',
        slots: 4,
    },
    'cinema': {
        areas: '"hero hero" "a b"',
        columns: '1fr 1fr',
        rowsDef: '2fr 1fr',
        slots: 3,
    },
    'split': {
        areas: '"left right"',
        columns: '1fr 1fr',
        rowsDef: '1fr',
        slots: 2,
    },
    't-layout': {
        areas: '"wide wide wide" "tall a a" "tall b b"',
        columns: '1fr 1fr 1fr',
        rowsDef: 'auto 1fr 1fr',
        slots: 4,
    },
    'quad-focus': {
        areas: '"focus focus side1" "focus focus side2" "bot1 bot2 side2"',
        columns: '1fr 1fr 1fr',
        rowsDef: '1fr 1fr 1fr',
        slots: 5,
    },
    'magazine': {
        areas: '"tall1 wide wide" "tall1 sm1 sm2"',
        columns: '1fr 1fr 1fr',
        rowsDef: '1fr 1fr',
        slots: 5,
    },
    'dashboard': {
        areas: '"kpi kpi kpi" "med1 med2 med2" "sm1 sm2 sm3"',
        columns: '1fr 1fr 1fr',
        rowsDef: 'auto 1fr 1fr',
        slots: 6,
    },
};

/** Layout mode: how cards are arranged */
type LayoutMode = 'row' | 'vertical' | 'mosaic';

interface ParsedLayout {
    mode: LayoutMode;
    gridClass: string;
    isHybrid: boolean;
    rows: number[];
    clampCount?: number;
    resolvedLayout?: string;
    // Vertical mode
    cols?: number[];
    // Mosaic mode
    mosaicTemplate?: MosaicDef;
    mosaicName?: string;
}

/**
 * Parses layout code into CSS grid classes.
 *
 * MODE PREFIXES:
 *   (none)  → Row mode (default) — cards fill horizontal rows
 *   "v:"    → Vertical mode — cards stack in columns left-to-right
 *   "m:"    → Mosaic mode — named CSS Grid Area template
 *
 * Row-mode layouts:
 *   Simple grids: "CxR" → C columns, R rows
 *   Hybrid layouts: "A-B-C" → row A has A cols, row B has B cols, …
 *
 * AUTO-DOWNGRADE: if slot count ≠ cardCount, the engine silently picks
 * the best-fit row layout. The mismatch is reported to the Tele.
 */
function parseLayout(layout: string, cardCount: number, maxRows: number = 3): ParsedLayout {

    // ── MOSAIC MODE: "m:hero-sidebar" ──
    if (layout.startsWith('m:')) {
        const templateName = layout.slice(2);
        const template = MOSAIC_TEMPLATES[templateName];
        if (template) {
            // Auto-downgrade if card count doesn't match mosaic slots
            if (cardCount > 0 && cardCount !== template.slots) {
                const bestLayout = HYBRID_LAYOUTS[cardCount] ?? (cardCount >= 9 ? '3-3-3' : '1-2-3');
                const bestRows = bestLayout.split('-').map(Number);
                return { mode: 'row', gridClass: '', isHybrid: true, rows: bestRows, resolvedLayout: bestLayout };
            }
            return {
                mode: 'mosaic',
                gridClass: '',
                isHybrid: false,
                rows: [],
                mosaicTemplate: template,
                mosaicName: templateName,
            };
        }
        // Unknown mosaic name — fall back to row auto-detect below
    }

    // ── VERTICAL MODE: "v:2-1-3" ──
    if (layout.startsWith('v:')) {
        const colSpec = layout.slice(2);
        let cols = colSpec.split('-').map(Number).filter(n => n > 0);
        if (cols.length === 0) cols = [cardCount]; // single column fallback
        const expectedCount = cols.reduce((a, b) => a + b, 0);

        // Auto-downgrade if card count doesn't match
        if (cardCount > 0 && cardCount !== expectedCount) {
            // Try to redistribute into same number of columns
            const numCols = cols.length;
            const perCol = Math.floor(cardCount / numCols);
            const remainder = cardCount % numCols;
            cols = Array.from({ length: numCols }, (_, i) => perCol + (i < remainder ? 1 : 0));
        }

        return {
            mode: 'vertical',
            gridClass: '',
            isHybrid: false,
            rows: [],
            cols,
            resolvedLayout: `v:${cols.join('-')}`,
        };
    }

    // ── ROW MODE (default) ──

    // Hybrid layout: "1-2", "2-1", "1-2-1", etc.
    if (layout.includes('-')) {
        let rows = layout.split('-').map(Number);
        // Hard-clamp to maxRows
        if (rows.length > maxRows) {
            const overflow = rows.slice(maxRows - 1).reduce((a, b) => a + b, 0);
            rows = [...rows.slice(0, maxRows - 1), overflow];
        }
        const expectedCount = rows.reduce((a, b) => a + b, 0);

        // AUTO-DOWNGRADE: if card count doesn't match, silently pick best-fit
        if (cardCount > 0 && cardCount !== expectedCount) {
            const bestLayout = HYBRID_LAYOUTS[cardCount] ?? (cardCount >= 9 ? '3-3-3' : '1-2-3');
            const bestRows = bestLayout.split('-').map(Number);
            return { mode: 'row', gridClass: '', isHybrid: true, rows: bestRows, resolvedLayout: bestLayout };
        }

        return { mode: 'row', gridClass: '', isHybrid: true, rows };
    }

    // Simple grid: "CxR"
    const match = layout.match(/^(\d)x(\d)$/);
    if (match) {
        const cols = parseInt(match[1]);
        const rows = parseInt(match[2]);
        const colClass = cols === 1 ? 'grid-cols-1'
            : cols === 2 ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        const clampCount = cols * rows;
        return { mode: 'row', gridClass: colClass, isHybrid: false, rows: [], clampCount };
    }

    // Fallback: auto-detect based on card count
    const autoCols = cardCount <= 2 ? 1 : cardCount <= 4 ? 2 : 3;
    const colClass = autoCols === 1 ? 'grid-cols-1'
        : autoCols === 2 ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return { mode: 'row', gridClass: colClass, isHybrid: false, rows: [], clampCount: undefined };
}

/* ═══ Main Component ═══ */

/* ═══ Skeleton Shimmer — 250ms loading state ═══ */
const CardSkeleton: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
    <div
        className="h-full rounded-xl overflow-hidden"
        style={{
            background: 'var(--theme-card-bg, rgba(255,255,255,0.04))',
            border: '1px solid var(--theme-card-border, rgba(255,255,255,0.06))',
            animationDelay: `${delay}ms`,
        }}
    >
        <div className="h-full w-full animate-pulse" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
    </div>
);

/* ═══ Mobile Carousel — swipeable single-card view with auto-scroll ═══ */

const AUTO_SCROLL_INTERVAL = 4000;
const AUTO_SCROLL_RESUME_DELAY = 6000;

const MobileCarousel: React.FC<{
    cards: CardDef[];
    showSkeleton: boolean;
    renderCard: (card: CardDef, index: number) => React.ReactNode;
}> = ({ cards, showSkeleton, renderCard }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isPausedRef = useRef(false);

    const cardCount = cards.length;

    // Track current card via scroll position
    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el || cardCount === 0) return;
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setActiveIndex(Math.min(idx, cardCount - 1));
    }, [cardCount]);

    // Scroll to a specific card
    const scrollToCard = useCallback((idx: number) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
    }, []);

    // Auto-scroll logic
    const startAutoScroll = useCallback(() => {
        if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        autoScrollRef.current = setInterval(() => {
            if (isPausedRef.current) return;
            const el = scrollRef.current;
            if (!el || cardCount <= 1) return;
            const currentIdx = Math.round(el.scrollLeft / el.clientWidth);
            const nextIdx = (currentIdx + 1) % cardCount;
            el.scrollTo({ left: nextIdx * el.clientWidth, behavior: 'smooth' });
        }, AUTO_SCROLL_INTERVAL);
    }, [cardCount]);

    const pauseAutoScroll = useCallback(() => {
        isPausedRef.current = true;
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
            isPausedRef.current = false;
        }, AUTO_SCROLL_RESUME_DELAY);
    }, []);

    // Start auto-scroll on mount
    useEffect(() => {
        startAutoScroll();
        return () => {
            if (autoScrollRef.current) clearInterval(autoScrollRef.current);
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        };
    }, [startAutoScroll]);

    // Pause on touch
    const handleTouchStart = useCallback(() => {
        pauseAutoScroll();
    }, [pauseAutoScroll]);

    return (
        <div style={{ position: 'fixed', bottom: '85px', left: 0, right: 0, zIndex: 10 }}>
            {/* Carousel — portrait cards anchored to bottom of viewport */}
            <div
                ref={scrollRef}
                className="mobile-carousel flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ height: '55vh' }}
                onScroll={handleScroll}
                onTouchStart={handleTouchStart}
                onMouseDown={handleTouchStart}
            >
                {showSkeleton
                    ? cards.map((card, i) => (
                        <div
                            key={`skel-${card.type}-${i}`}
                            className="snap-start shrink-0 px-4"
                            style={{ width: '100vw', height: '55vh' }}
                        >
                            <div className="card-glass h-full rounded-xl skeleton-shimmer-bg" />
                        </div>
                    ))
                    : cards.map((card, i) => (
                        <div
                            key={`${card.type}-${i}`}
                            className="snap-start shrink-0 px-4"
                            style={{ width: '100vw', height: '55vh' }}
                        >
                            <div className="h-full overflow-auto">
                                {renderCard(card, i)}
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Dot indicators */}
            {cardCount > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 pb-2">
                    {cards.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { scrollToCard(i); pauseAutoScroll(); }}
                            aria-label={`Go to card ${i + 1} of ${cardCount}`}
                            aria-current={i === activeIndex ? 'true' : undefined}
                            className="transition-all duration-300"
                            style={{
                                width: i === activeIndex ? 20 : 8,
                                height: 8,
                                borderRadius: 4,
                                background: i === activeIndex ? '#C8962E' : 'rgba(255,255,255,0.3)',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const GridView: React.FC<GridViewProps> = ({
    badge,
    layout = '2x2',
    cards = [],
    maxRows = 3,
    onLogoClick,
}) => {
    const isMobile = useIsMobile();
    const { mode, gridClass, isHybrid, rows, clampCount, resolvedLayout, cols, mosaicTemplate, mosaicName } = parseLayout(layout, cards.length, maxRows);

    // For CxR simple grids, clip cards to exactly cols×rows to prevent viewport overflow
    const displayCards = clampCount != null ? cards.slice(0, clampCount) : cards;

    // Layout mismatch validation — moved to useEffect to avoid side effects during render
    // Uses a ref so the same layout:count combo doesn't fire repeatedly, but resets when layout/cards change
    const lastReportedMismatchRef = useRef<string>('');

    useEffect(() => {
        const currentKey = `${layout}:${cards.length}`;
        if (currentKey === lastReportedMismatchRef.current) return;

        // Hybrid layout mismatch
        if (isHybrid && rows.length > 0 && cards.length > 0) {
            const originalRows = layout.includes('-') ? layout.split('-').map(Number) : rows;
            const expectedCount = originalRows.reduce((a, b) => a + b, 0);
            if (cards.length !== expectedCount) {
                lastReportedMismatchRef.current = currentKey;
            }
        }

        // Simple CxR grid mismatch
        if (!isHybrid && clampCount != null && cards.length > 0 && cards.length !== clampCount) {
            lastReportedMismatchRef.current = currentKey;
        }

        // Unknown card type validation
        const unknownTypes = cards
            .map(c => c.type)
            .filter(t => !CARD_MAP[t])
            .filter((t, i, arr) => arr.indexOf(t) === i); // unique
        if (unknownTypes.length > 0) {
            console.warn('[GridView] Unknown card types:', unknownTypes.join(', '));
        }
    }, [layout, cards.length, isHybrid, rows, clampCount, resolvedLayout]);

    const [showSkeleton, setShowSkeleton] = useState(true);
    const cardsKey = useRef(displayCards.map(c => c.type).join(','));

    useEffect(() => {
        const newKey = displayCards.map(c => c.type).join(',');
        if (newKey !== cardsKey.current) {
            const prevKey = cardsKey.current;
            cardsKey.current = newKey;

            // Don't flash skeleton if:
            // - response card was added/kept as first card (data cards arrived behind it)
            // - only the response card existed before and now data cards joined it
            const prevTypes = prevKey.split(',').filter(Boolean);
            const newTypes = newKey.split(',').filter(Boolean);
            const responseStayed = newTypes[0] === 'response' && (
                prevTypes[0] === 'response' ||           // response was already first
                prevTypes.length === 0                     // was empty
            );

            if (!responseStayed) {
                setShowSkeleton(true);
            }
        }
        const timer = setTimeout(() => setShowSkeleton(false), 250);
        return () => clearTimeout(timer);
    }, [displayCards]);

    /* ═══ EMPTY CARDS GUARD (fix #10) ═══ */
    if (displayCards.length === 0) {
        return (
            <SlideLayout badge={badge} onLogoClick={onLogoClick}>
                <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--muted-foreground, #5A6B75)' }}>
                    <span className="font-data text-base uppercase tracking-widest">Awaiting data…</span>
                </div>
            </SlideLayout>
        );
    }

    /* ═══ MOBILE: Swipeable single-card carousel ═══ */
    if (isMobile) {
        return (
            <SlideLayout
                badge={badge}
                onLogoClick={onLogoClick}
            >
                <MobileCarousel
                    cards={displayCards}
                    showSkeleton={showSkeleton}
                    renderCard={renderCard}
                />
            </SlideLayout>
        );
    }

    /* ═══ DESKTOP RENDER ═══ */

    /* ── Render helper: Vertical columns ── */
    const renderVerticalLayout = () => {
        if (!cols || cols.length === 0) return null;
        let cardIndex = 0;
        let globalIndex = 0;
        const colGroups = cols.map(count => {
            const group = displayCards.slice(cardIndex, cardIndex + count);
            cardIndex += count;
            return group;
        });
        return (
            <div
                className="flex-1 grid gap-3 md:gap-4 min-h-0"
                style={{
                    gridTemplateColumns: cols.map(() => '1fr').join(' '),
                    gridTemplateRows: '1fr',
                    height: '100%',
                }}
            >
                {colGroups.map((colCards, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-3 md:gap-4 min-h-0 h-full">
                        {colCards.map((card, ci) => {
                            const seqIndex = globalIndex++;
                            return (
                                <div key={`${card.type}-${ci}`} className="min-h-0 flex-1">
                                    {renderCard(card, seqIndex)}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    /* ── Render helper: Mosaic grid areas ── */
    const renderMosaicLayout = () => {
        if (!mosaicTemplate) return null;
        // Extract unique area names in order from the areas string
        const areaNames = mosaicTemplate.areas
            .replace(/"/g, '')
            .split(/\s+/)
            .filter((v, i, a) => a.indexOf(v) === i); // unique, in order
        return (
            <div
                className="flex-1 min-h-0"
                style={{
                    display: 'grid',
                    gridTemplateAreas: mosaicTemplate.areas,
                    gridTemplateColumns: mosaicTemplate.columns,
                    gridTemplateRows: mosaicTemplate.rowsDef,
                    gap: 'clamp(0.75rem, 1vw, 1rem)',
                    height: '100%',
                }}
            >
                {areaNames.map((areaName, i) => {
                    const card = displayCards[i];
                    if (!card) return <div key={areaName} style={{ gridArea: areaName }} />;
                    return (
                        <div
                            key={`${card.type}-${i}`}
                            className="min-h-0 h-full"
                            style={{ gridArea: areaName }}
                        >
                            {renderCard(card, i)}
                        </div>
                    );
                })}
            </div>
        );
    };

    /* ── Render helper: Row layout (existing hybrid + simple) ── */
    const renderRowLayout = () => {
        if (isHybrid) {
            return (
                <div className="flex-1 flex flex-col gap-3 md:gap-4 min-h-0">
                    {(() => {
                        let cardIndex = 0;
                        let globalIndex = 0;
                        const allRowCards = rows.map(colCount => {
                            const rc = displayCards.slice(cardIndex, cardIndex + colCount);
                            cardIndex += colCount;
                            return rc;
                        });
                        const rawWeights = allRowCards.map(rc => getRowWeight(rc));
                        const clampedWeights = clampRowWeights(rawWeights);

                        return allRowCards.map((rowCards, rowIndex) => {
                            if (rowCards.length === 0) return null;

                            const effectiveCols = Math.min(rows[rowIndex], rowCards.length);
                            const colCls = effectiveCols === 1 ? 'grid-cols-1'
                                : effectiveCols === 2 ? 'grid-cols-1 md:grid-cols-2'
                                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

                            const rowWeight = clampedWeights[rowIndex];

                            const isSemiCompact = rowCards.every(c =>
                                c.type === 'callout' &&
                                !c.props?.body && !c.props?.subtitle
                            );
                            const flexStyle = isSemiCompact
                                ? '1 1 0%'
                                : `${rowWeight} 1 0%`;

                            return (
                                <div key={rowIndex} className={`grid ${colCls} gap-3 md:gap-4 min-h-0`}
                                    style={{ flex: flexStyle }}>
                                    {rowCards.map((card, ci) => {
                                        const useFullSpan = card.span === 'full' && rowCards.length === 1;
                                        const seqIndex = globalIndex++;
                                        return (
                                            <div
                                                key={`${card.type}-${ci}`}
                                                className={`min-h-0 h-full ${useFullSpan ? 'col-span-full' : ''}`}
                                            >
                                                {renderCard(card, seqIndex)}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        });
                    })()}
                </div>
            );
        }
        // Simple grid layout
        return (
            <div className={`grid ${gridClass} gap-3 md:gap-4 flex-1 min-h-0`}
                style={{ gridAutoRows: '1fr', alignItems: 'stretch' }}>
                {displayCards.map((card, i) => (
                    <div
                        key={`${card.type}-${i}`}
                        className={`min-h-0 h-full ${card.span === 'full' ? 'col-span-full' : ''}`}
                    >
                        {renderCard(card, i)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <SlideLayout
            badge={badge}
            onLogoClick={onLogoClick}
        >
            <div className="relative grid-container flex flex-col h-full gap-3 md:gap-4">

                {/* ── Nav-pending skeleton overlay ── */}
                <div
                    className="nav-skeleton-overlay absolute inset-0 z-20 flex flex-col gap-3 md:gap-4"
                    style={{ pointerEvents: 'none' }}
                >
                    {isHybrid ? (
                        rows.map((colCount, rowIndex) => {
                            const colCls = colCount === 1 ? 'grid-cols-1'
                                : colCount === 2 ? 'grid-cols-1 md:grid-cols-2'
                                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
                            const rowCards = displayCards.slice(
                                rows.slice(0, rowIndex).reduce((a, b) => a + b, 0),
                                rows.slice(0, rowIndex).reduce((a, b) => a + b, 0) + colCount
                            );
                            if (rowCards.length === 0) return null;
                            return (
                                <div key={rowIndex} className={`grid ${colCls} gap-3 md:gap-4 min-h-0 flex-1`}>
                                    {rowCards.map((card, ci) => (
                                        <div key={`${card.type}-${ci}`} className="min-h-0 h-full">
                                            <CardSkeleton delay={(rowIndex * 3 + ci) * 40} />
                                        </div>
                                    ))}
                                </div>
                            );
                        })
                    ) : (
                        <div className={`grid ${gridClass} gap-3 md:gap-4 flex-1 min-h-0`}
                            style={{ gridAutoRows: '1fr', alignItems: 'stretch' }}>
                            {displayCards.map((card, i) => (
                                <div key={`${card.type}-${i}`} className={`min-h-0 h-full ${card.span === 'full' ? 'col-span-full' : ''}`}>
                                    <CardSkeleton delay={i * 40} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showSkeleton ? (
                    <div className={`grid ${gridClass} gap-3 md:gap-4 flex-1 min-h-0`}
                        style={{ gridAutoRows: '1fr', alignItems: 'stretch' }}>
                        {displayCards.map((card, i) => (
                            <div key={`${card.type}-${i}`} className={`min-h-0 h-full ${card.span === 'full' ? 'col-span-full' : ''}`}>
                                <CardSkeleton delay={i * 50} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {mode === 'vertical' && renderVerticalLayout()}
                        {mode === 'mosaic' && renderMosaicLayout()}
                        {mode === 'row' && renderRowLayout()}
                    </>
                )}
            </div>
        </SlideLayout>
    );
};

export default GridView;
