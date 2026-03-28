# Saudi Upskilling Intelligence — Agent Guide

> **For coding agents** (Claude Code, Cursor, Copilot, etc.) working on the Saudi Upskilling Intelligence platform.

---

## Architecture Overview

This is a **voice AI client website** deployed on the Mobeus platform. It features a persistent voice overlay powered by LiveKit that lets a voice AI agent ("Magic") control the UI — showing card-based scenes, navigating layouts, and guiding candidates through their upskilling journey aligned with Saudi Arabia's Vision 2030.

**Key concepts:**
- The **voice agent** (Python, runs server-side) controls the UI by emitting DSL scene descriptions
- The **DSL parser** (`src/utils/parseDSL.ts`) converts pipe-delimited text into `SceneData` with cards and layout
- **GridView** renders scenes as responsive card grids/mosaics using lazy-loaded card components
- Cards live in `src/components/cards/` and are registered in GridView's `CARD_MAP`
- **Site functions** in `src/site-functions/` let the agent call frontend actions via RPC

---

## Directory Structure

```
src/
├── app/                              ← Next.js 15 pages (single-page app)
│   ├── layout.tsx                    ← Root layout + providers + fonts
│   ├── page.tsx                      ← Home → renders WelcomeLanding
│   └── globals.css                   ← Global styles + CSS theme vars
│
├── components/
│   ├── cards/                        ← Card components (THE MAIN LIBRARY)
│   │   ├── GridView.tsx              ← Card grid renderer + mosaic layout engine
│   │   ├── CardErrorBoundary.tsx     ← Error boundary per card
│   │   ├── JobCard.tsx               ← Job listings
│   │   ├── SkillCard.tsx             ← Skill profiles + progress
│   │   ├── TrainingCard.tsx          ← Training programs
│   │   ├── InterviewCard.tsx         ← Interview tips & questions
│   │   ├── OnboardingCard.tsx        ← Profile setup steps
│   │   ├── AssessmentCard.tsx        ← Skill gap analysis
│   │   ├── OfferCard.tsx             ← Job offers + HRDF funding
│   │   ├── ProgressCard.tsx          ← Learning journey milestones
│   │   ├── ScheduleCard.tsx          ← Interview scheduling
│   │   ├── DataTableCard.tsx         ← Comparison tables
│   │   ├── TileGridCard.tsx          ← Category overview tiles
│   │   ├── BarChartCard.tsx          ← Horizontal bar charts
│   │   ├── DonutChartCard.tsx        ← Donut/pie charts
│   │   └── ResponseCard.tsx          ← Agent text response (supports streaming)
│   │
│   ├── voice/                        ← Voice infrastructure (DO NOT MODIFY)
│   │   ├── VoiceSessionProvider.tsx  ← Root provider + keyboard shortcuts
│   │   ├── SceneManager.tsx          ← Renders current scene (GridView or layout)
│   │   ├── SceneLayout.tsx           ← Scene viewport wrapper
│   │   ├── ControlBar.tsx            ← Connection + mute controls
│   │   ├── ChatPanel.tsx             ← Chat mode sidebar
│   │   ├── WelcomeLanding.tsx        ← Idle landing page with carousel
│   │   ├── BackgroundLayer.tsx       ← Dark teal background + hero image
│   │   └── ToolCallIndicator.tsx     ← Visual feedback during agent actions
│   │
│   ├── layouts/                      ← Custom full-page layouts (replace GridView)
│   │   ├── HeroLayout.tsx            ← Hero section layout
│   │   └── SlideLayout.tsx           ← Portrait slide layout
│   │
│   └── ui/                           ← shadcn/ui primitives
│
├── site-functions/                   ← Frontend functions the agent can RPC-call
│   ├── register.ts                   ← Manifest + window registration
│   └── setTheme.ts                   ← Example: switch theme
│
├── lib/
│   ├── stores/voice-session-store.ts ← Zustand store (DO NOT MODIFY)
│   └── utils.ts                      ← Utility functions
│
├── types/
│   ├── index.ts                      ← ComponentTemplate, SessionDefaults, SceneData
│   └── cards.ts                      ← CardDef union type (all card prop interfaces)
│
├── utils/
│   ├── parseDSL.ts                   ← Converts pipe-delimited DSL → SceneData
│   ├── informTele.ts                 ← Agent communication helper
│   └── soundGenerator.ts            ← Audio feedback utilities
│
├── hooks/
│   └── useIsMobile.ts
│
├── data/
│   └── certifiedLayoutRecipes.ts     ← Pre-built layout templates
│
└── assets/                           ← Static images
```

---

## Creating a New Card Component

### Step 1: Define the props interface

Add to `src/types/cards.ts`:

```ts
export interface MyCardProps {
    title: string;
    items?: string[];
    onAction?: (phrase: string) => void;
}
```

Add to the `CardPropsUnion`:
```ts
| ({ type: 'my-card' } & MyCardProps)
```

### Step 2: Create the component

Create `src/components/cards/MyCard.tsx`:

```tsx
'use client';

import type { MyCardProps } from '@/types/cards';

/**
 * MyCard — Brief description of what this card renders.
 *
 * Props:
 *   title: string           — Main heading
 *   items?: string[]        — List items
 */
export function MyCard({ title, items = [] }: MyCardProps) {
  if (!title) return null;

  return (
    <div className="w-full space-y-3 p-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {items.map((item, i) => (
        <p key={i} className="text-sm text-white/70">{item}</p>
      ))}
    </div>
  );
}
```

### Step 3: Register in GridView

In `src/components/cards/GridView.tsx`:

1. Add the lazy import:
```ts
const MyCard = lazy(() => import('./MyCard').then(m => ({ default: m.MyCard })));
```

2. Add to `CARD_MAP`:
```ts
'my-card': MyCard,
```

### Step 4: Add DSL parsing support

In `src/utils/parseDSL.ts`, add a case for `'my-card'` so the voice agent's DSL output can produce this card type.

---

## Card Conventions (MUST FOLLOW)

### 1. File & naming
- **Filename**: PascalCase (e.g. `MyCard.tsx`)
- **Card type**: kebab-case in `CARD_MAP` and DSL (e.g. `'my-card'`)
- **Location**: `src/components/cards/`
- **Export**: Named export `export function MyCard`

### 2. Props interface
All card props are defined in `src/types/cards.ts` with typed interfaces. Cards receive flat props (from DSL) or nested `props: {}` (from certified layouts). GridView normalizes both shapes.

### 3. Defensive rendering
- Always handle missing/empty data gracefully
- Return `null` if essential data is missing
- Default arrays to `[]`, booleans to sensible defaults
- Never crash on unexpected data shapes

### 4. Styling
- Use Tailwind CSS classes only (no CSS modules, no styled-components)
- Follow the app's color palette:
  - **Teal**: `#1A3A4B` (backgrounds)
  - **Gold**: `#C8962E` (accents, highlights)
  - **White/glass**: `rgba(255,255,255,0.05)` with `backdrop-filter: blur`
- Use `text-white`, `text-white/70` for primary/secondary text on dark backgrounds
- Keep components responsive (mobile-first)
- Fonts: Outfit (headings), Instrument Sans (body), JetBrains Mono (data)

### 5. Interactivity
- Use `onAction?.(phrase)` to send user interactions back to the voice agent
- The agent receives the action phrase and can respond conversationally

### 6. Documentation
- Add a JSDoc comment listing all props with types and descriptions

### 7. No external dependencies
- Cards must use ONLY: React, Tailwind, and existing UI primitives
- SVG-based charts preferred over chart libraries
- No additional npm packages

---

## Built-in Card Types (14)

| Category | Type | Component | Purpose |
|----------|------|-----------|---------|
| **Data Viz** | `bar-chart` | BarChartCard | Horizontal bar charts |
| | `donut-chart` | DonutChartCard | Donut/pie distributions |
| | `data-table` | DataTableCard | Tabular comparisons |
| | `tile-grid` | TileGridCard | Category overview tiles |
| **Domain** | `job` | JobCard | Job listings from RAG |
| | `skill` | SkillCard | Skill profiles + progress |
| | `training` | TrainingCard | Training programs |
| | `interview` | InterviewCard | Interview tips & questions |
| **Journey** | `onboarding` | OnboardingCard | Profile setup steps |
| | `assessment` | AssessmentCard | Skill gap analysis |
| | `offer` | OfferCard | Job offers + HRDF funding |
| | `progress` | ProgressCard | Learning journey milestones |
| | `schedule` | ScheduleCard | Interview scheduling |
| **System** | `response` | ResponseCard | Agent text response (streaming) |

---

## GridView Layout System

GridView supports multiple layout modes via the `layout` prop:

- **Hybrid**: `1`, `1-1`, `1-2`, `1-3`, `2-3`, `1-2-3` — auto grid balancing
- **Mosaic**: `m:hero-sidebar`, `m:stats-side` — CSS Grid named templates
- **Vertical**: `v:2-1`, `v:1-2` — vertical column splits

---

## Creating a Site Function

Site functions let the voice agent call frontend actions via RPC.

### Step 1: Create the function

Create `src/site-functions/myFunction.ts`:

```ts
export default function myFunction(args: Record<string, any>) {
  // Do something in the browser
  return { success: true };
}
```

### Step 2: Register in manifest

In `src/site-functions/register.ts`, add to `siteFunctionManifest`:

```ts
myFunction: {
  fn: myFunction,
  description: 'What this function does (used as agent tool description)',
  schema: { /* JSON Schema for params */ },
  defaults: { /* default values */ },
},
```

---

## How the Voice Agent Uses Cards

The Python voice agent outputs DSL (pipe-delimited text) describing scenes:

```
layout:1-2|job|title:Software Engineer|company:Aramco|salary:25,000 SAR||skill|name:Python|progress:85
```

The flow:
1. Agent emits DSL text → sent to frontend via RPC
2. `parseDSL` converts DSL → `SceneData` (layout + cards array)
3. `SceneManager` passes scene to `GridView`
4. `GridView` lazy-loads card components from `CARD_MAP` and renders them in the specified layout
5. Cards appear in the scene viewport with transition animations

---

## Knowledge Base

The voice agent has RAG access to domain knowledge in `public/knowledge/`:

| File | Content |
|------|---------|
| `jobs_database.md` | Saudi job market aligned to 6 sectors |
| `skills_catalog.md` | Skill profiles + assessment baselines |
| `training_programs.md` | SDA, Tuwaiq, Doroob, Tamheer programs |
| `interview_preparation.md` | Saudi company interview tips |
| `candidate_journey.md` | 7-stage candidate flow + pre-select sequences |
| `offers_contracts.md` | HRDF funding details, offer stages |
| `tile_grid_data.md` | Sector overview tile data |

Agent prompts live in `public/prompts/`:
- `show-llm-system-prompt.md` — Visual (DSL) output rules + card reference
- `speak-llm-system-prompt.md` — Conversational output rules

---

## DO NOT MODIFY

These files are platform infrastructure. Changes will break the voice session:

- `src/components/voice/*` — Voice overlay, scene management, controls
- `src/lib/stores/voice-session-store.ts` — Zustand store
- `src/types/index.ts` — Core type definitions (ComponentTemplate, SceneData, etc.)

---

## Quick Reference: Adding a Card

```bash
# 1. Add props interface to src/types/cards.ts
# 2. Add to CardPropsUnion in same file
# 3. Create src/components/cards/MyCard.tsx
# 4. Add lazy import + CARD_MAP entry in GridView.tsx
# 5. Add DSL parsing case in src/utils/parseDSL.ts
```
