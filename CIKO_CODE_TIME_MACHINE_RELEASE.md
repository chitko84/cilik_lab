# Ciko Code Time Machine — implementation and validation

This is a **working Python execution tracer**, not a canned animation. Its engine is
`public/time-machine/tracer.py`, executed by Pyodide (Python 3 in WebAssembly) in
`public/time-machine/python-worker.js`.

## What has been added

- Student sidebar **Coding & Practice → Ciko Code Time Machine** (also in Quick Find).
- **Debug in Time Machine** handoff from Coding Workspace and Python Daily Coding Challenge.
- Editable Python editor, saved local draft, Tab indentation, Ctrl+Enter to record.
- **24 actual runnable Python programs** across variables, lists, loops, conditions,
  functions, recursion, algorithms, errors and debugging.
- Real Python `sys.settrace()` line, function-return, exception, and call-stack
  recording; variable snapshots and stdout at each event.
- Timeline slider, first/previous/next/last, auto-play, four speeds, playback
  stops (breakpoint marks), error line highlighting, execution-stale warning.
- Variable memory inspector, local call stack with named frames, before/after
  output comparison between two recorded runs.
- Context-sensitive, bilingual English/Bahasa Melayu Ciko explanations of
  actual recorded values, branching, loops, errors and program output.
- Ciko read-aloud via browser speech synthesis where a suitable voice is installed.
- Responsive mobile/tablet panels with full-width editor and touch-sized buttons.
- A worker with a hard host timeout, student-code AST restrictions, 650-event
  tracing limit, and 5,000-character output limit.

## Python support and limits

This feature executes **real CPython semantics using Pyodide** for a safe,
**supported educational subset** of Python, not an arbitrary unrestricted Python
environment. It supports variables, conditions, loops, functions, recursion,
list/dict/string operations, comprehensions and standard exceptions. It does not
support user imports, filesystem, networking, classes, input(), or arbitrary
unsafe introspection. This is a deliberate child-appropriate teaching boundary,
not a claim that browser worker isolation alone is a security sandbox.

**Internet is required on the first runtime load.** Pyodide 0.27.7 is fetched
from the version-pinned jsDelivr CDN; the project itself does not need any new
npm dependency, API credential or extra Vercel server. Offline use from the
first visit is not supported. If CDN access is blocked by the deployment or
school network, the app reports the loading failure, rather than silently
pretending to run Python.

Ciko's question helper is **trace-grounded, bilingual and deterministic**, and
operates without keys or external AI service. It is *not* general-purpose
AI chat. The existing Ciko Assistant elsewhere in CilikLab is unchanged.

## Validate locally

```powershell
npm install
npm run test:time-machine
npm run test:creator
npm run test:robolab
npm run build
npm run dev
```

Navigate to **Student View → Coding & Practice → Ciko Code Time Machine**.
Click **Example Library**, select *Three Hero Jumps*, then **Record Execution**.
Use Next, Previous, Play, the slider, Memory and Call Stack. Try **Find the
Missing Variable** to see a real NameError. Switch language to Malay to see
bilingual explanations. Try a custom Python program and confirm the trace
changes. Use the *Debug in Time Machine* button from Coding Workspace.

## Validation done in artifact-building environment

- `npm run test:time-machine`: passed. All 24 starter programs executed using
  native CPython against the **same** tracing engine, alongside runtime,
  exception, output, syntax and unsafe-code tests.
- Existing `test:creator`, `test:robolab`, `test:arcade`, `test:v32`, `test:v35`,
  `test:operator`, `test:hero`, and `test:landing:mobile-cta`: passed.
- JavaScript worker syntax and TypeScript/TSX syntax checks passed.
- **Full Vite build and browser Pyodide/Web Worker integration could not be
  tested here**. The package registry and CDN are not accessible from this
  build environment. Run the build and a live-browser smoke check before
  using this in a judged presentation or production.

## Files added/changed

Added:
- `public/time-machine/python-worker.js`
- `public/time-machine/tracer.py`
- `src/pages/time-machine/CodeTimeMachine.tsx`
- `src/pages/time-machine/codeTimeMachine.css`
- `src/pages/time-machine/samples.ts`
- `scripts/time-machine-smoke.cjs`
- `scripts/time-machine-tracer-tests.py`

Modified (only to connect feature or update tests):
- `src/App.tsx`, `src/components/layout/Sidebar.tsx`,
  `src/components/layout/QuickNavigator.tsx`,
  `src/pages/coding/CodingWorkspace.tsx`,
  `src/pages/daily/DailyCodingSolver.tsx`, `package.json`,
  `scripts/operator-nav-smoke.cjs`.

Existing games, comics, operator data, unlocked RoboLab missions and language
settings are retained.
