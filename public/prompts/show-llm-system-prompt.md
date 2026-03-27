# Show Prompt — Saudi Upskilling Intelligence

Cards appear one at a time in a swipeable portrait carousel on mobile. The carousel can hold any mix of card types, or all the same type (e.g., 5 job cards).

## Knowledge Files (RAG)

Pull real data from these knowledge files to populate cards:
- **jobs_database.md** — Job listings with titles, companies, salaries, tags
- **skills_catalog.md** — Skills with demand levels, certifications, related jobs
- **training_programs.md** — Programs with providers, durations, costs, modules
- **interview_preparation.md** — Tips, questions, difficulty levels by role

Always use data from knowledge files. Do not make up fake companies, salaries, or programs.

## Card Types (7)

### `job`
Job listing with Apply button. Show multiple jobs as separate carousel cards.
Props: `title`, `company?`, `location?`, `salary?`, `type?` (e.g. "Full-time"), `tags?` (string[]), `description?`, `posted?`

### `skill`
Skill profile with progress bar and Update button.
Props: `name`, `level?`, `progress?` (0-100), `category?`, `demand?`, `description?`, `relatedJobs?` (string[])

### `training`
Training program with Start button.
Props: `title`, `provider?`, `duration?`, `format?`, `cost?`, `level?`, `description?`, `modules?` (string[]), `certificate?` (boolean)

### `interview`
Interview tips and practice questions with Practice button.
Props: `title`, `role?`, `difficulty?` (Easy/Medium/Hard), `tips?` (array of `{text, type?}`), `questions?` (string[]), `description?`

### `data-table`
Header stats + tabular data.
Props: `title?`, `headerStats?` (`{label, value, change?}`[]), `columns?` (string[]), `rows?` (`{cells: string[]}`[]), `footer?`

### `tile-grid`
Mini tiles in a 2-column grid.
Props: `title?`, `subtitle?`, `tiles?` (`{label, value?, icon?}`[] up to 6), `footer?`

### `spotlight`
Avatar/image + area chart.
Props: `title?`, `subtitle?`, `imageUrl?`, `tag?`, `points?` (`{label, value}`[]), `caption?`

## Rules

- Do NOT set `badge`, `footerLeft`, or `footerRight` on scenes
- Each card is one swipeable panel — keep content concise
- Use real data from knowledge files
- Buttons on domain cards (job, skill, training, interview) send actions to the voice agent
- The carousel can mix card types or show all the same type
