/**
 * CardDef — Canonical card definition shared by parseDSL and GridView.
 *
 * parseDSL produces these (flat props, no nesting).
 * GridView consumes them — accepting both flat and nested (props: {}) shapes.
 *
 * This is the single source of truth. Do not define CardDef elsewhere.
 */

// ── Per-card prop interfaces ──

export interface JobCardProps {
    title: string;
    company?: string;
    location?: string;
    salary?: string;
    type?: string;
    tags?: string[] | string;
    description?: string;
    posted?: string;
    onAction?: (phrase: string) => void;
}

export interface SkillCardProps {
    name: string;
    level?: string;
    progress?: number;
    category?: string;
    demand?: string;
    description?: string;
    relatedJobs?: string[] | string;
    onAction?: (phrase: string) => void;
}

export interface TrainingCardProps {
    title: string;
    provider?: string;
    duration?: string;
    format?: string;
    cost?: string;
    level?: string;
    description?: string;
    modules?: string[] | string;
    certificate?: boolean;
    onAction?: (phrase: string) => void;
}

export interface InterviewTip {
    text: string;
    type?: 'tip' | 'question' | 'warning';
}

export interface InterviewCardProps {
    title: string;
    role?: string;
    difficulty?: string;
    tips?: InterviewTip[] | string;
    questions?: string[] | string;
    description?: string;
    onAction?: (phrase: string) => void;
}

export interface OnboardingStep {
    label: string;
    done?: boolean;
}

export interface OnboardingCardProps {
    title?: string;
    subtitle?: string;
    steps?: OnboardingStep[] | string;
    currentStep?: number;
    message?: string;
    onAction?: (phrase: string) => void;
}

export interface SkillScore {
    name: string;
    score: number;
    max?: number;
}

export interface AssessmentCardProps {
    title?: string;
    subtitle?: string;
    overallScore?: number;
    skills?: SkillScore[] | string;
    recommendation?: string;
    onAction?: (phrase: string) => void;
}

export interface CoachCardProps {
    title?: string;
    message: string;
    tip?: string;
    encouragement?: string;
    nextAction?: string;
    onAction?: (phrase: string) => void;
}

export interface OfferCardProps {
    title: string;
    company?: string;
    salary?: string;
    startDate?: string;
    status?: string;
    benefits?: string[] | string;
    hrdfFunding?: boolean;
    deadline?: string;
    onAction?: (phrase: string) => void;
}

export interface Milestone {
    label: string;
    reached?: boolean;
}

export interface ProgressCardProps {
    title?: string;
    subtitle?: string;
    overallProgress?: number;
    currentPhase?: string;
    milestones?: Milestone[];
    streak?: number;
    hoursLogged?: number;
    onAction?: (phrase: string) => void;
}

export interface ScheduleCardProps {
    title: string;
    company?: string;
    date?: string;
    time?: string;
    format?: string;
    interviewer?: string;
    prepTips?: string[] | string;
    location?: string;
    onAction?: (phrase: string) => void;
}

export interface HeaderStat {
    label: string;
    value: string;
    change?: string;
}

export interface DataTableRow {
    cells: string[];
}

export interface DataTableCardProps {
    title?: string;
    headerStats?: HeaderStat[];
    columns?: string[];
    rows?: DataTableRow[];
    footer?: string;
}

export interface Tile {
    label: string;
    value?: string;
    icon?: string;
}

export interface TileGridCardProps {
    title?: string;
    subtitle?: string;
    tiles?: Tile[];
    footer?: string;
}

export interface SpotlightDataPoint {
    label: string;
    value: number;
}

export interface SpotlightCardProps {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    tag?: string;
    points?: SpotlightDataPoint[];
    caption?: string;
}

export interface ResponseCardProps {
    text?: string;
    avatar?: string;
    live?: boolean;
    isStreaming?: boolean;
}

// ── Union type for all card data ──

export type CardPropsUnion =
    | ({ type: 'job' } & JobCardProps)
    | ({ type: 'skill' } & SkillCardProps)
    | ({ type: 'training' } & TrainingCardProps)
    | ({ type: 'interview' } & InterviewCardProps)
    | ({ type: 'onboarding' } & OnboardingCardProps)
    | ({ type: 'assessment' } & AssessmentCardProps)
    | ({ type: 'coach' } & CoachCardProps)
    | ({ type: 'offer' } & OfferCardProps)
    | ({ type: 'progress' } & ProgressCardProps)
    | ({ type: 'schedule' } & ScheduleCardProps)
    | ({ type: 'data-table' } & DataTableCardProps)
    | ({ type: 'tile-grid' } & TileGridCardProps)
    | ({ type: 'spotlight' } & SpotlightCardProps)
    | ({ type: 'response' } & ResponseCardProps);

// ── CardDef (runtime shape — accepts both flat and nested props) ──

export interface CardDef {
    type: string;
    span?: 'full';
    borderless?: boolean;
    props?: Record<string, any>;  // nested props (certified slides use this)
    [key: string]: any;           // flat props (DSL output uses this)
}
