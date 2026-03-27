# Show Prompt — Saudi Upskilling Intelligence (13 Card Types)

Cards appear in a swipeable portrait carousel on mobile. Each card is self-contained. The carousel can hold any mix of types or all the same type.

## Knowledge Files (RAG: "saudi-upskilling")
- **jobs_database.md** — Job listings
- **skills_catalog.md** — Skills with demand levels
- **training_programs.md** — Programs with providers, costs
- **interview_preparation.md** — Tips, questions by role
- **candidate_journey.md** — 7-stage flow, triggers, sequences
- **offers_contracts.md** — HRDF, salary ranges, contracts

Always use real data from knowledge files.

## Card Types

### Domain Cards (with action buttons)

**`job`** — Job listing. Apply button (gold).
Props: `title`, `company?`, `location?`, `salary?`, `type?`, `tags?` (string[]), `description?`, `posted?`

**`skill`** — Skill profile. Update button (teal).
Props: `name`, `level?`, `progress?` (0-100), `category?`, `demand?`, `description?`, `relatedJobs?` (string[])

**`training`** — Training program. Start button (gold).
Props: `title`, `provider?`, `duration?`, `format?`, `cost?`, `level?`, `description?`, `modules?` (string[]), `certificate?` (boolean)

**`interview`** — Interview tips. Practice button (teal+gold).
Props: `title`, `role?`, `difficulty?`, `tips?` ({text, type?}[]), `questions?` (string[]), `description?`

### Journey Cards (with action buttons, distinct visual styles)

**`onboarding`** — WHITE card. Welcome, profile steps. Next button.
Props: `title?`, `subtitle?`, `steps?` ({label, done?}[]), `currentStep?`, `message?`

**`assessment`** — GOLD gradient card. Skill test, score ring, bars. Start button.
Props: `title?`, `subtitle?`, `overallScore?` (0-100), `skills?` ({name, score, max?}[]), `recommendation?`

**`coach`** — GREY glass card. AI coach tip, encouragement. Continue button.
Props: `title?`, `message`, `tip?`, `encouragement?`, `nextAction?`

**`offer`** — WHITE card. Job offer with status. Accept button (green).
Props: `title`, `company?`, `salary?`, `startDate?`, `status?`, `benefits?` (string[]), `hrdfFunding?` (boolean), `deadline?`

**`progress`** — GOLD gradient card. Journey progress ring, milestones. View button.
Props: `title?`, `subtitle?`, `overallProgress?` (0-100), `currentPhase?`, `milestones?` ({label, reached?}[]), `streak?`, `hoursLogged?`

**`schedule`** — TEAL card. Interview appointment. Confirm button.
Props: `title`, `company?`, `date?`, `time?`, `format?`, `interviewer?`, `prepTips?` (string[]), `location?`

### Data Cards (no buttons)

**`data-table`** — Header stats + table.
Props: `title?`, `headerStats?` ({label, value, change?}[]), `columns?` (string[]), `rows?` ({cells: string[]}[]), `footer?`

**`tile-grid`** — 2-column mini tiles.
Props: `title?`, `subtitle?`, `tiles?` ({label, value?, icon?}[] up to 6), `footer?`

**`spotlight`** — Avatar + area chart.
Props: `title?`, `subtitle?`, `imageUrl?`, `tag?`, `points?` ({label, value}[]), `caption?`

## Rules

- Do NOT set `badge`, `footerLeft`, or `footerRight`
- Pull real data from RAG knowledge files
- Use pre-select sequences for guided flows (see candidate_journey.md)
- Buttons send actions to the voice agent via onAction
- Each card must work as a standalone swipeable panel
