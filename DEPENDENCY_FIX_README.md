# Phase 1 Dependency Fix

This ZIP contains the original CilikLab Phase 1 project, with only the dependency declaration corrected.

## What changed

- Removed a direct `esbuild: ^0.25.0` dev dependency from `package.json`.
- Synchronized the root dependency manifest in `bun.lock`.
- Existing student/teacher screens, lessons, and other source files are unchanged.

Vite 8.3.5 requires esbuild `^0.27.0 || ^0.28.0` if esbuild is installed in a peer position. The older explicit root dependency led to npm ERESOLVE. Vite manages any compatible tooling as needed.

## Windows PowerShell

1. Extract the ZIP into a new folder.
2. Open PowerShell inside the `ciliklab-main` folder.
3. Check `node -v` (Vite 8 needs a sufficiently current Node 20.19+ or Node 22.12+).
4. Run:

```powershell
npm install
npm run dev
```

If you already extracted the previous ZIP instead, you can repair its manifest without downloading this one:

```powershell
npm pkg delete devDependencies.esbuild
npm install
npm run dev
```

Do not use `--force` or `--legacy-peer-deps` for this conflict.

This package manifest fix was validated locally, but a full npm install and browser build were not verified in this environment.
