# Activity Generator — Demo Guide

## What it is

A new WeLearn feature that lets a teacher describe their teaching context, choose a pedagogical format, and get a fully structured activity guide — with step-by-step instructions, debrief questions, teacher notes, and links to relevant WeLearn resources from the database.

The user experience is deliberately similar to the existing Chat feature: the teacher describes their need, WeLearn "thinks", and produces a sourced, ready-to-use output. The difference is that this is optimised for *activity design* rather than Q&A, and produces a structured document rather than a conversational reply.

---

## The demo flow, step by step

### 1. Landing on the page

Navigate to `/activity`. The page opens in a two-column layout:
- **Left panel**: the form (always visible)
- **Right panel**: empty at first, fades in when generation starts

The nav shows "Activities" with a pencil icon.

### 2. Filling the form

Five fields:

| Field | Options | Notes |
|---|---|---|
| Subject / topic | Free text | This is intentionally open — "Climate policy", "Urban biodiversity", "the French Revolution" all work |
| Activity type | Structured Debate, Case Study, Role Play, Think-Pair-Share, Jigsaw, Project-Based Learning, Flipped Classroom | Each produces a *different* activity template |
| Class level | Secondary, Undergraduate, Graduate | Appears in the output header |
| Number of students | 4 ranges (≤10, 11–25, 26–40, 40+) | Appears in the output header |
| Duration | 30 min, 1h, 2h, 3h | Appears in the output header |

The "Generate activity" button is **disabled until a subject is entered**. This is intentional — subject is the only field that can't have a sensible default.

### 3. Generating

Click the button. Two things happen in sequence:

**Phase 1 (~1.8 seconds):** A pulsing status line appears in the right panel next to the WeLearn assistant avatar: *"Searching WeLearn database for relevant resources..."*. This mimics what the real feature would do — retrieve relevant documents before generating the activity.

**Phase 2:** The status line changes to *"Generating activity guide..."* and the content starts appearing character by character, like an AI typing in real time. A blinking cursor follows the text as it streams in.

**On completion:** The cursor disappears, and a "WeLearn resources used" section appears at the bottom with 3 source cards — the same card format used across Search and Chat, with bookmark and open-article actions.

---

## What's mocked vs. what would be real

This is important to be clear about in the demo.

### What's mocked (i.e. doesn't touch the API)

- **The generation itself.** The activity content is pre-written text stored in the frontend code. There are 4 full templates (Debate, Case Study, Role Play, Think-Pair-Share) and a generic fallback for the other 3 types. The subject, level, duration, and student count are injected into the template, so the output *looks* personalised — it uses the exact subject you typed in the title and instructions.

- **The "searching" phase.** The 1.8s pause and status message is a `setTimeout`. No API call is made.

- **The sources.** The 3 documents shown at the bottom are hardcoded objects that mimic the real `Document` type. They look identical to real search results (same cards, same bookmark functionality).

- **The typewriter animation.** The content is revealed 10 characters at a time every 20ms. It's purely cosmetic — the full content is already in memory the moment you click Generate.

### What would be real in production

- The form inputs would be sent to a new API endpoint (e.g. `POST /activity/generate`) with the context as the request body.
- The backend would run a semantic search against Qdrant to retrieve relevant documents for that subject, then pass them + the form context to an LLM (same pattern as the existing Chat and Tutor features).
- The response would likely be streamed back (same pattern as the existing `fetchStream` in `utils/fetch.ts`), which would make the typewriter effect real rather than simulated.
- The sources shown would be the actual retrieved documents, not hardcoded ones.

In short: **the UX flow, the layout, and the output format are accurate representations of what the real feature would feel like**. Only the data is fake.

---

## Design decisions worth explaining

**Why a two-column layout?** The form stays visible on the left so the teacher can see what they entered while reading the output — and can tweak and regenerate without scrolling back. This is different from the Tutor flow (which is a linear multi-step wizard) because activity generation is a quick, iterative action.

**Why free-text subject instead of a dropdown?** The existing subject dropdown (Biology, Economics, etc.) is too coarse for pedagogy. A teacher preparing a session on "the ethics of AI in healthcare" or "Paris Agreement implementation" shouldn't have to pick "Medicine" or "Political Science" and lose specificity. The real API would benefit from this free-form input too.

**Why are the activity types specific?** Each format has very different pedagogical logic — a debate needs role assignments and rebuttal rounds, a Think-Pair-Share needs individual reflection time and a good question. Separate templates produce outputs that actually fit the format rather than generic "do an activity" instructions. In the real implementation, the LLM prompt would be adapted per activity type.

**Why does the subject field gate the Generate button?** All other fields have defaults that produce a valid output. Subject is the only field where an empty value would produce meaningless content ("Structured Debate: "). This avoids a confusing result without adding unnecessary validation noise.

---

## Likely questions from the team

**"Is this using the real database?"**
No — the sources and the generated content are mocked. The feature is a front-end prototype to validate the UX concept before building the backend. The real version would query Qdrant and call the LLM exactly as Chat and Tutor do today.

**"How long would the real generation take?"**
Based on the existing Tutor feature (which also calls an LLM), probably 10–20 seconds for the full activity. Streaming would make it feel faster because content starts appearing immediately.

**"Would it support French?"**
The UI is already fully bilingual — all labels and form options translate to French automatically (switch with `?lang=fr`). The generated content itself would be in whatever language the LLM responds in. With the right prompting, it could match the teacher's preferred language — the same way Chat and Tutor handle this today.

**"Can teachers edit the output?"**
Not in this prototype, but it's a logical next step. The Tutor feature already has inline editing for the syllabus — the same pattern could apply here.

**"What's the difference from just asking the Chat?"**
Chat gives a conversational answer grounded in sources. This gives a *structured pedagogical document* — with timing, logistics, teacher instructions, debrief questions. Different output format for a different use case: planning a session vs. answering a content question.

**"How much work is left to make this real?"**
Frontend is mostly done (this prototype). The main work is backend: a new `/activity/generate` endpoint, a prompt template per activity type, and wiring it to Qdrant + the LLM. The streaming integration already exists in the codebase (`fetchStream` in `utils/fetch.ts`) so that part is boilerplate.
