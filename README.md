# CilikLab — Little Learners’ Lab

> **Phase 1 update (28 October 2026):** CilikLab now includes a refreshed landing page, mobile bottom navigation, Malay/English language preference, Malay translations of four interactive introductory lessons, updated branding and an app manifest. All original student and teacher features are retained. See [PHASE1_RELEASE_NOTES.md](PHASE1_RELEASE_NOTES.md) for exactly what changed, verification status and remaining Phase 2/3 work.


A creative coding education platform designed for young learners and beginner programmers to explore, write Python code, debug with progressive clues, and receive structured educator guidance.

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript linter
npm run lint

# Build for production
npm run build
```

---

## 🔑 Demo Login Accounts

Both student and teacher roles can be accessed via instant 1-click buttons on the Landing Page or Top Bar, or using the credentials:

| Role | Email | Demo Password | Default Persona |
| :--- | :--- | :--- | :--- |
| **Student** | `student@ciliklab.demo` | `CilikLab123!` | Sarah Ahmad (Grade 5 Explorer, 7-day streak) |
| **Teacher** | `teacher@ciliklab.demo` | `CilikLab123!` | Mr. Razak Mansor (Lead Educator & Curriculum Mentor) |

---

## 🌟 Key Implemented Features

### 1. Student Experience
- **Interactive Landing Page**: Clean introduction, quick role switcher, live interactive Python sampler preview.
- **Student Dashboard**: Personalized greeting, learning streak, average score metrics, active courses progress, and weekly practice chart.
- **Explore Classes**: 4-column responsive desktop grid of 12 rich coding classes, category filtering, keyword search, difficulty tags, and syllabus enrollment drawer.
- **My Classes**: In-progress / completed filters with one-click exercise resume.
- **Interactive Lessons**: Bite-sized concept cards with interactive sandboxes (loop counter slider, variable memory boxes, condition evaluation).
- **Coding Workspace (Centerpiece)**:
  - 3-zone layout (Instructions, Python Code Editor with line numbers & auto-indentation, Multi-tab Learning Support).
  - Client-side safe Python execution engine supporting `print`, variables, arithmetic, lists, loops, and conditions.
  - Test suite evaluation with real-time pass/fail status and celebratory confetti.
  - **Plain-Language Error Explanations**: Kid-friendly translations for `SyntaxError`, `NameError`, `TypeError`, `IndentationError`, `ZeroDivisionError`, and `IndexError` with "What to inspect" and "Tiny next action".
  - **Progressive Debugging Hints**: 3-stage ladder (Stage 1 Concept → Stage 2 Guiding Question → Stage 3 Actionable Step) with feedback reporting.
  - **Visual Code Tracing**: Step-by-step playback highlighting active lines, real-time memory variable snapshots, and standard output accumulation.
  - **Compare Attempts**: Side-by-side diff comparing past and current code versions.
  - **Explain My Changes**: Reflection form saving student reasoning beside code attempts.
  - **Contextual Help Request**: Category selection with automatic code/error snapshot bundling and explicit privacy consent toggle.
- **Student Progress**: Score bar charts, practice minutes timeline, key strengths, and constructive class encouragement board.
- **Student Profile & Settings**: Avatar selector, bio customization, draft cleanup for shared school computers, and factory demo data reset.

### 2. Teacher Experience
- **Teacher Dashboard**: KPI summary cards, average scores by class chart, student activity timelines, score distribution donut, and urgent intervention cards.
- **Class Management**: 4-column class grid, syllabus inspector, and interactive **Create Class** workflow with custom modules and learning outcomes.
- **Exercise Management**: Add coding challenges with custom starter code, test assertions, and 3-stage reviewed hints.
- **Student Performance**: Searchable roster, filter by status (Needs Help, On Track, Advanced), attempt timeline inspector, and direct feedback composer.
- **Support Queue**: Actionable intervention cards for student help requests and repeated error patterns, with code inspection and guidance reply.
- **Class Support (Shared Misconceptions)**: Pattern clustering (e.g. loop boundaries, accumulator resets, string/int mixing) with one-click mini-lesson broadcast.
- **Guidance Library**: Reusable repository of teacher-approved explanations and progressive hints filterable by topic and error type.
- **Feedback Review**: Workflow to inspect hints flagged by students and approve replacements.
- **Reports & Analytics**: Cohort analytics, hint reach rates, and **genuine downloadable CSV export** of the student roster.

### 3. Class Community & Peer Code Review
- Moderated discussion feed for project showcases, questions, and coding tips.
- **Structured Peer Code Review**: Line-specific peer feedback with observation, guiding question, and constructive hint.

---

## ℹ️ Technical Implementation Notes

- **Code Execution**: Runs client-side Python execution using a deterministic parser and runtime engine that executes arithmetic, string formatting, variables, lists, for/while loops, and conditionals, evaluates test cases, captures standard output, detects syntax/runtime errors, and steps through execution state.
- **Guidance & Diagnostics**: Errors and progressive hints utilize pedagogical, teacher-approved curriculum guidance designed specifically for children rather than calling external paid AI APIs.
- **Persistence**: All user actions (class enrollment, code attempts, drafts, help requests, reflection notes, guidance resources, and community posts) are reactively saved and restored using browser `localStorage` under `ciliklab_app_state_v1`.
