# Show Prompt — Saudi Upskilling Intelligence

Cards appear one at a time in a swipeable portrait carousel on mobile. Each card must be self-contained.

## Card Types (7)

### `job`
A job listing with apply button. Show multiple jobs as separate cards.

Props: `title`, `company?`, `location?`, `salary?`, `type?` (e.g. "Full-time"), `tags?` (string[]), `description?`, `posted?`

### `skill`
A skill profile with progress and update button. Show multiple skills as separate cards.

Props: `name`, `level?` (e.g. "Intermediate"), `progress?` (0-100), `category?`, `demand?` (e.g. "High"), `description?`, `relatedJobs?` (string[])

### `training`
A training program with start button. Show multiple programs as separate cards.

Props: `title`, `provider?`, `duration?`, `format?` (e.g. "Online"), `cost?`, `level?`, `description?`, `modules?` (string[]), `certificate?` (boolean)

### `interview`
Interview tips and practice questions with practice button. Show multiple topics as separate cards.

Props: `title`, `role?`, `difficulty?` (Easy/Medium/Hard), `tips?` (array of `{text, type?}` where type is "tip"|"question"|"warning"), `questions?` (string[]), `description?`

### `data-table`
Header stats + tabular data.

Props: `title?`, `headerStats?` (`{label, value, change?}`[]), `columns?` (string[]), `rows?` (`{cells: string[]}`[]), `footer?`

### `tile-grid`
Mini tiles in a 2-column grid.

Props: `title?`, `subtitle?`, `tiles?` (`{label, value?, icon?}`[] up to 6), `footer?`

### `spotlight`
Avatar/image + area chart trend line.

Props: `title?`, `subtitle?`, `imageUrl?`, `tag?`, `points?` (`{label, value}`[]), `caption?`

## Rules

- Do NOT set `badge`, `footerLeft`, or `footerRight` on scenes
- Each card is one swipeable panel — keep content concise
- Use `job`, `skill`, `training`, `interview` for domain content
- Use `data-table`, `tile-grid`, `spotlight` for data visualization
- Buttons on cards send actions back to the voice agent via onAction

## Example

```json
{
  "cards": [
    {
      "type": "job",
      "title": "Cloud Engineer",
      "company": "Saudi Aramco",
      "location": "Riyadh",
      "salary": "18K-25K SAR/mo",
      "type": "Full-time",
      "tags": ["AWS", "Kubernetes", "Python"],
      "posted": "2 days ago"
    },
    {
      "type": "training",
      "title": "AWS Cloud Practitioner",
      "provider": "Saudi Digital Academy",
      "duration": "3 months",
      "format": "Online",
      "cost": "Free",
      "certificate": true,
      "modules": ["Cloud Concepts", "Security", "Architecture", "Billing"]
    },
    {
      "type": "skill",
      "name": "Cloud Computing",
      "level": "Beginner",
      "progress": 25,
      "category": "Technology",
      "demand": "High",
      "relatedJobs": ["Cloud Engineer", "DevOps", "Solutions Architect"]
    },
    {
      "type": "interview",
      "title": "Cloud Engineer Interview",
      "role": "Cloud Engineer at Saudi Aramco",
      "difficulty": "Medium",
      "tips": [
        {"text": "Explain your experience with AWS services", "type": "question"},
        {"text": "Prepare examples of cost optimization", "type": "tip"},
        {"text": "Know the shared responsibility model", "type": "tip"}
      ]
    }
  ]
}
```
