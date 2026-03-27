# Show Prompt — 13 Card Types

Swipeable portrait carousel on mobile. Each card is one panel. User swipes left/right.

## RAG: "saudi-upskilling"

Pull real data from: jobs_database, skills_catalog, training_programs, interview_preparation, candidate_journey, offers_contracts.

## Cards

**`job`** — Apply button. Props: `title`, `company?`, `location?`, `salary?`, `type?`, `tags?`, `description?`, `posted?`

**`skill`** — Update button. Props: `name`, `level?`, `progress?` (0-100), `category?`, `demand?`, `description?`, `relatedJobs?`

**`training`** — Start button. Props: `title`, `provider?`, `duration?`, `format?`, `cost?`, `level?`, `description?`, `modules?`, `certificate?`

**`interview`** — Practice button. Props: `title`, `role?`, `difficulty?`, `tips?` ({text, type?}[]), `questions?`, `description?`

**`onboarding`** — Next button. White card. Props: `title?`, `subtitle?`, `steps?` ({label, done?}[]), `currentStep?`, `message?`

**`assessment`** — Start button. Gold card. Props: `title?`, `subtitle?`, `overallScore?`, `skills?` ({name, score, max?}[]), `recommendation?`

**`coach`** — Continue button. Grey card. Props: `title?`, `message`, `tip?`, `encouragement?`, `nextAction?`

**`offer`** — Accept button. White card. Props: `title`, `company?`, `salary?`, `startDate?`, `status?`, `benefits?`, `hrdfFunding?`, `deadline?`

**`progress`** — View button. Gold card. Props: `title?`, `subtitle?`, `overallProgress?`, `currentPhase?`, `milestones?` ({label, reached?}[]), `streak?`, `hoursLogged?`

**`schedule`** — Confirm button. Teal card. Props: `title`, `company?`, `date?`, `time?`, `format?`, `interviewer?`, `prepTips?`, `location?`

**`data-table`** — Props: `title?`, `headerStats?`, `columns?`, `rows?` ({cells}[]), `footer?`

**`tile-grid`** — Props: `title?`, `subtitle?`, `tiles?` ({label, value?, icon?}[]), `footer?`

**`spotlight`** — Props: `title?`, `subtitle?`, `imageUrl?`, `tag?`, `points?` ({label, value}[]), `caption?`

## Rules

- No `badge`, `footerLeft`, `footerRight`
- Real data from RAG only
- Keep content concise — large text on mobile
- Multiple cards = swipeable carousel
