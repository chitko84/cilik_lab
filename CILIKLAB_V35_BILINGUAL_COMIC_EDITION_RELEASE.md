# CilikLab v35 — Ten Comics, Two Flipbook Editions Per Card

## What changed

- Added **10 new featured ComicCode story cards** to the existing comic library.
- Each card has exactly two separate edition links: **Read English** and **Bahasa Melayu · Soon**. These are actual website URL links (`?comicBook=<slug>&comicLang=en` or `ms`), so they can be saved and revisited. A new browser tab/deep link is supported.
- The **English editions are interactive internal flipbooks**: each has eight authored story pages with narration, character dialogue, preserved Python code examples, page-turning, swipe and keyboard controls, progress indicator and local reading-position persistence. 10 × 8 = **80 English pages**.
- The **Malay links are not broken or fake**: each opens the correct book's explicit coming-soon page with the option to read English. Malay translations are NOT published yet, as requested.
- Preserved the original three Classic Stories, their content, IDs and completed reading progress.
- Added original CSS story illustration previews, based on the existing Ciko mascot asset, and responsive layouts. **The 90 finalized illustrated images are NOT included**; publish them separately after image generation and quality approval. The saved image asset paths are reserved in `src/data/comicSeries.ts` and correspond to the companion image production plan.
- The 10 books were sourced from the previously agreed full 10-comic image-generation plan; script copy is in `CILIKLAB_V35_ENGLISH_FLIPBOOK_SCRIPTS.md`.

## Where to find the implementation

- `src/data/comicSeries.ts`: ten stories and 80 English page scripts.
- `src/pages/comics/SeriesReader.tsx`: card grid, edition links, English flipbook reader and Malay upcoming page.
- `src/pages/comics/ComicLibrary.tsx`: new featured collection and preserved classic collection.
- `src/App.tsx`: deep links to the Comic Library.
- `src/website-v35-comics.css`: responsive flipbook UI and child-friendly art previews.
- `scripts/v35-comics-bilingual-smoke.cjs`: source-level tests.

## How to view

1. Extract this project's ZIP, run `npm install` and `npm run dev`.
2. Open the **ComicCode** library from the student dashboard or navigation.
3. Choose **Read English** on any featured card. Navigate with buttons, arrow keys, touch swipes or page dots.
4. Select **Bahasa Melayu · Soon** to inspect the reserved Malay edition link; it does not pretend the Malay book is published.
5. Open **Classic Comic Stories** to find the three existing original comics.

## Quality checks and limitations

- All existing v34 regression tests passed, including Arcade games, daily solver, quiz, Ciko, translations, meetings and messaging.
- The v35 check passed for 10 new book records, 80 English pages, bilingual edition URLs and the untouched classic comic records.
- TypeScript syntax checks passed for the new/modified TSX and TS files. Stylesheet syntax was validated; ZIP integrity is verified.
- **Production Vite build and actual browser/mobile rendering were not verified** because project dependencies are unavailable in the runtime.
- Current image panels are previews. The finished illustrated cover/page assets remain to be created and integrated. No external published Heyzine/FlipHTML5 URLs were invented.
- Malay scripts are to be translated and reviewed in the next edition, with Malay content and the same book IDs/URLs. Other UI languages are not separately localized for these ten new English editions yet.
