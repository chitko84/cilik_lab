# Windows Arcade Test Compatibility Fix

## What was fixed

The previous package.json referenced TypeScript 7.0.2. The two existing Node-based Arcade tests transpile TypeScript using the `typescript` JavaScript compiler API (`ScriptTarget`, `ModuleKind`, and `transpileModule`). That API is not compatible with TypeScript 7.0.2, causing the displayed `Cannot read properties of undefined` errors before any gameplay checks run.

The project now pins `typescript` to **5.9.3** in `devDependencies`. Both existing test scripts and their gameplay assertions remain unchanged. This is a development tooling compatibility fix, not a change to gameplay, user data, application routes, graphics, or scoring.

## Windows PowerShell

Open a terminal in `ciliklab-main` and run:

```powershell
npm install
npm run test:arcade
npm run test:arcade:expanded
npm run lint
npm run build
npm run dev
```

If you reused a folder containing the old dependency installation, and `node -p "require('typescript/package.json').version"` still prints `7.0.2`, run:

```powershell
npm install --save-dev --save-exact typescript@5.9.3
npm run test:arcade
npm run test:arcade:expanded
```

If problems remain with old installed modules, a clean reinstall in PowerShell is:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm install
```

Do not remove application data or reset your browser's local storage. Arcade best scores and other existing progress are not affected by this fix.

## Verification limits

This bundle has been checked with an available local TypeScript 5.x compiler API, including both test scripts. Network restrictions in the packaging environment prevented installing the exact npm package from the registry, so an independent installation and full browser test should be performed on Windows.

This repo includes a legacy `bun.lock` from an earlier package resolution. npm does not use that file. Bun users should regenerate its lockfile when upgrading dependencies rather than relying on the old TypeScript 7 resolution.
