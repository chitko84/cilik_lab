# CilikLab v16 — Honest Localization Coverage

This update modifies localization infrastructure, selector, typography/RTL rules, and Ciko translations only. Existing site/game designs and progress rules remain unchanged.

| Locale | Existing core UI resource keys | Ciko translated Q/A | RTL | Status |
|---|---:|---:|---|---|
| Bahasa Melayu (ms-MY) | 110/110 | 120/120 | No | Original language |
| English (en) | 110/110 | 120/120 | No | Original language |
| বাংলা (bn-BD) | 110/110 | 12/120 | No | Partial / Beta |
| မြန်မာဘာသာ (my-MM) | 110/110 | 12/120 | No | Partial / Beta |
| Nigerian Pidgin (pcm-NG) | 110/110 | 12/120 | No | Partial / Beta |
| دری (fa-AF) | 110/110 | 12/120 | Yes | Partial / Beta |
| العربية (ar) | 110/110 | 12/120 | Yes | Partial / Beta |
| Bahasa Indonesia (id-ID) | 110/110 | 12/120 | No | Partial / Beta |

**Important:** These totals measure only the central `t(...)` interface keys and Ciko answer resources. They do NOT measure the complete website. Most Arcade game level names, questions, hints, wins, teacher-authored content, comics, and many screen-specific hardcoded messages still use their original Malay/English content in the added languages. The selector explicitly marks them Beta.

Ciko displays only the locally translated entries in each new locale (12 genuine entries spanning 9 topics); the full 120 remain unchanged and accessible by choosing Malay or English. No machine translations, fake locale files or invented voice availability are claimed.

Audio: speech synthesis is offered only when the browser returns a compatible installed language voice. This has code-level verification only; playback, pronunciation, RTL interactions and fonts require browser/device tests.

Programming keywords, commands, internal game IDs, scores, saved progress, images, teachers’ material, and the Arcade engines are not translated or reset.
