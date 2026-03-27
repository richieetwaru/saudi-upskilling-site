# Saudi Upskilling Intelligence — Redesign Brief

## Source: ThoughtWorks & PIF trAIn Co Platform (Jan 2026)

---

## 1. Candidate Journey (Extracted from Presentation)

The talent journey has 7 stages. Magic (the tele) guides candidates through each:

| Stage | What Happens | Card Types Needed |
|-------|-------------|-------------------|
| **1. Sign Up & Onboarding** | Registration, profile creation, visual account approval | Onboarding card (welcome, profile steps) |
| **2. Profile & CV Upload** | CV upload, AI-parsed profile, visual profile completion | Profile card (completion %, skills detected) |
| **3. AI Coach & Learning Buddy** | Conversational AI from sign-up, voice + text, scripted guided experience | Coach card (tips, next action, encouragement) |
| **4. Skill Assessment** | Skills baseline report, skill gap analysis, role recommendations | Skill card (existing), Assessment card (new) |
| **5. Interview Coordination** | Interview scheduling, AI-generated feedback draft, prep tips | Interview card (existing), Schedule card (new) |
| **6. Contract & Offer** | Offer approval flow, offer tracking dashboard, HRDF funding action | Offer card (new) |
| **7. Training & Learner Journey** | Training enrollment, skills being developed, narrative linkage to growth | Training card (existing), Progress card (new) |

---

## 2. Requirements

### 2.1 Home Page (Welcome / Idle State)
- Dark teal background with Magic avatar (background-hero.png)
- "Saudi Upskilling Intelligence" badge pill
- "Achieve Your Full Potential" headline (white + gold)
- Subtitle about AI-powered guidance
- **START CONVERSATION** pill button — positioned mid-screen, prominent
- No footer clutter — clean, focused on the CTA
- On mouse/touch interaction, background subtly brightens

### 2.2 Connect / Listening State
- START button animates down to bottom-center
- Transforms into **Listening** pill with gold pulsing dot
- Gold sparkle reveal when avatar video connects
- Crystalline sound on avatar reveal
- Welcome text fades out, avatar becomes the focus
- Scene title area appears for content headers

### 2.3 Disconnect / Control Bar
- Bottom-center fixed pill — the single control surface
- **Idle**: Gold "START CONVERSATION →" pill (mid-screen)
- **Connecting**: Pulsing "CONNECTING" pill with animated dot
- **Connected**: Split pill — "Listening" (left) + Mute toggle (center) + Disconnect X (right)
- Mute: mic icon toggles between active (white) and muted (red)
- All pill-shaped, glass-like on dark background

### 2.4 Carousel System
- Fixed to bottom of viewport (`bottom: 72px`, clearing control bar)
- Portrait cards: 58vh tall, full viewport width
- CSS scroll-snap for native swipe (left/right)
- Auto-scroll every 4 seconds, pauses on touch, resumes after 6s
- Dot indicators below carousel (gold active, white/30 inactive)
- Can hold any mix of card types or all same type
- **Pre-select sequences**: Agent can send ordered card sequences that tell a story
  - e.g., Job → Skill gap → Training → Interview prep (the full candidate journey)

### 2.5 Card System

#### Existing Cards (7)
| Card | Button | Purpose |
|------|--------|---------|
| `job` | Apply | Job listings from RAG |
| `skill` | Update | Skill profiles with progress |
| `training` | Start | Training programs from RAG |
| `interview` | Practice | Interview tips and questions |
| `data-table` | — | Tabular comparisons |
| `tile-grid` | — | Category overview tiles |
| `spotlight` | — | Profile + trend chart |

#### New Cards Needed (from journey stages)
| Card | Button | Purpose | Visual Style |
|------|--------|---------|-------------|
| `onboarding` | Next | Profile setup steps, welcome flow | White card, large icons, step indicators |
| `assessment` | Start | Skill baseline test, gap analysis | Orange/gold card, radar chart or score |
| `coach` | Continue | AI coach tip, encouragement, next action | Grey card, large motivational icon |
| `offer` | Accept | Job offer details, salary, HRDF status | White card, green/gold status indicators |
| `progress` | View | Learning journey progress, milestones | Gold gradient card, progress rings |
| `schedule` | Confirm | Interview date/time, company, prep link | Teal card, calendar icon, countdown |

#### Design Language for New Cards
- **White cards**: Clean, informational (onboarding, offer)
- **Orange/gold cards**: Action-oriented, achievement (assessment, progress)
- **Grey cards**: Supportive, conversational (coach tips)
- **Teal cards**: Structured, scheduled (interview schedule)
- Large icons (lucide-react) for visual weight
- Infographic elements (progress rings, radar charts, step indicators)
- All pill-shaped buttons matching brand colors

---

## 3. Build Order

### Phase 1: RAG Knowledge
1. Rewrite `jobs_database.md` — align to PIF trAIn sectors and real Saudi companies
2. Rewrite `skills_catalog.md` — include assessment baselines and gap mapping
3. Rewrite `training_programs.md` — align to SDA, Tuwaiq, Doroob, Tamheer journey
4. Rewrite `interview_preparation.md` — include AI-generated feedback draft concept
5. Add `candidate_journey.md` — the 7-stage flow with transitions and triggers
6. Add `offers_contracts.md` — HRDF funding, offer templates, contract stages
7. Update `knowledge-tags.json` with new file triggers

### Phase 2: Card System & Carousel
1. Build 6 new card components (onboarding, assessment, coach, offer, progress, schedule)
2. Register all 13 cards in GridView CARD_MAP and parseDSL FLAT_TYPES
3. Define pre-select card sequences for common journeys:
   - **Discovery flow**: tile-grid → job → job → job
   - **Upskilling flow**: assessment → skill → training → training
   - **Interview flow**: interview → interview → schedule
   - **Full journey**: onboarding → assessment → skill → training → interview → offer → progress
4. Update carousel to support named sequences (agent sends sequence name)

### Phase 3: Speak Prompt
1. Update Magic's personality to be a journey guide (not just Q&A)
2. Add journey stage awareness — Magic knows where the candidate is
3. Add transition phrases between stages
4. Reference all 13 card types with when/why to use each
5. Add pre-select sequence triggers to the prompt

### Phase 4: Show Prompt
1. Document all 13 card types with props
2. Document pre-select sequences
3. Add journey-aware examples (not just standalone cards)
4. Emphasize: pull real data from RAG, don't fabricate

---

## 4. Control Bar Redesign (Mute Addition)

Current: `[Listening] [X Disconnect]`

New: `[Listening 🟡] [🎤 Mute] [X Disconnect]`

- Mute button in the center of the connected pill
- Mic icon (white) when active, MicOff icon (red) when muted
- Tapping mute pauses voice input but keeps connection
- Visual feedback: "Muted" text replaces "Listening" when muted

---

## 5. Pre-Select Card Sequences

Named sequences the agent can invoke to show a curated carousel:

```
SEQUENCE|discovery → tile-grid (sectors) + 3 job cards
SEQUENCE|upskill → assessment + 2 skill cards + 2 training cards
SEQUENCE|interview-prep → 2 interview cards + schedule card
SEQUENCE|full-journey → onboarding + assessment + skill + training + interview + offer + progress
SEQUENCE|jobs-in-{sector} → 4 job cards filtered by sector from RAG
```

---

## 6. Visual Identity Recap

| Element | Color | Usage |
|---------|-------|-------|
| Teal `#1A3A4B` | Primary dark | Backgrounds, teal cards, secondary buttons |
| Gold `#C8962E` | Accent | CTAs, active dots, progress bars, highlights |
| White `#FFFFFF` | Content | Card text, clean card backgrounds |
| Grey `#F0F0F0` / `#5A6B75` | Muted | Coach cards, secondary text |
| Glass `rgba(255,255,255,0.05)` | Overlay | Default card glass on dark bg |

Fonts: Outfit (hero), Instrument Sans (voice), JetBrains Mono (data)
Buttons: All pill-shaped (`border-radius: 9999px`)
Cards: Portrait (58vh), glass blur (2px mobile, 6px desktop)
