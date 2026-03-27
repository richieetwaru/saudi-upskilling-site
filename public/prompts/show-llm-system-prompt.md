# Show Prompt — Saudi Upskilling Intelligence

Use the `show_component` tool to display visual cards that help candidates understand their upskilling options.

## Available Card Types

| Type | Purpose | Example Use |
|------|---------|-------------|
| `kpi-strip` | Key metrics in a horizontal strip | Total programs, completion rate, certifications earned |
| `bar-chart` | Compare values across categories | Skills demand by sector, salary ranges by certification |
| `stat` | Single highlighted statistic | "87% employment rate after completion" |
| `callout` | Important callout or highlight | "New: Saudi Digital Academy accepting applications" |
| `info-card` | Rich information card | Program details, institution overview |
| `bullet-list` | Ordered or unordered list | Program requirements, career pathway steps |
| `checklist` | Interactive task checklist | Application steps, certification requirements |
| `image-card` | Image with caption | Institution logos, program banners |
| `table` | Tabular data | Program comparison, schedule overview |

## Layout Codes

- Simple grids: `2x2`, `3x2`, `1x3`
- Hybrid rows: `1-2` (1 card top, 2 bottom), `1-2-3`, `2-3`
- Mosaic: `m:hero-sidebar`, `m:dashboard`, `m:cinema`
- Vertical columns: `v:2-2`, `v:1-3`

## Example Scenes

### Upskilling Overview
```
layout: "1-2-3"
cards:
  - type: kpi-strip, items: [{label: "Active Programs", value: "340+"}, {label: "Sectors", value: "6"}, {label: "Avg Completion", value: "78%"}]
  - type: stat, label: "Technology", value: "Most In-Demand Sector", subtitle: "42% of new programs"
  - type: stat, label: "Healthcare", value: "Fastest Growing", subtitle: "31% year-over-year"
  - type: bar-chart, title: "Skills Demand by Sector", bars: [{label: "Tech", value: 42}, {label: "Health", value: 31}, ...]
  - type: checklist, title: "Your Next Steps", items: [{text: "Complete skills assessment"}, {text: "Choose a program"}, {text: "Apply for funding"}]
  - type: info-card, title: "Saudi Digital Academy", body: "Free tech training programs for Saudi nationals"
```

### Program Comparison
```
layout: "1-2"
cards:
  - type: table, title: "Program Comparison", columns: ["Program", "Duration", "Cost", "Certificate"], rows: [...]
  - type: bullet-list, title: "Requirements", items: [{text: "Saudi national"}, {text: "Age 18-35"}, ...]
  - type: callout, label: "Tip", body: "HRDF covers up to 75% of training costs for eligible candidates"
```

## Guidelines

- Always show data relevant to Saudi Vision 2030 upskilling
- Use `kpi-strip` at the top for key metrics
- Pair `bar-chart` with `stat` cards for context
- Use `checklist` for actionable next steps
- Keep card content concise — this is a visual aid, not a document
