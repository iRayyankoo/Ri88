Rayyan Portal (Bilingual AR/EN) — Glassmorphism + Saudi Touch (C)
-----------------------------------------------------------------------
This is a static HTML portal with multiple utility tools, designed for Saudi users.

Folders:
- index.html
- assets/app.css  (shared UI)
- assets/app.js   (shared logic: i18n, tools, calculators, API calls)
- tools/*.html    (one page per tool)

Run locally:
- Open index.html in your browser (or serve via a static server).
Host on GitHub Pages:
- Put files at repo root
- Settings → Pages → Deploy from a branch → main → /(root)

APIs (editable inside assets/app.js):
- Currency: https://open.er-api.com/v6/latest/{BASE}
- Hijri converter (Aladhan): https://api.aladhan.com/v1/gToH?date=DD-MM-YYYY , hToG
- QR generator: https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=...

Notes:
- Work-related calculators (Retirement / End of Service) are simplified estimators and show a disclaimer.
