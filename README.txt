Rayyan Portal (Bilingual AR/EN) — Glassmorphism + Saudi Touch
----------------------------------------------------------------
What you get:
- A modern landing page (index) with search + categories + featured cards.
- Separate pages for each tool (tools/*.html) sharing a single UI system (assets/app.css + assets/app.js).
- Language toggle (AR/EN) + persistent preference (localStorage).
- Currency converter supports BOTH: Live API + Manual rate mode.
- Hijri/Gregorian converter supports API mode (default) + manual toggle.

How to run:
1) Put these files in a folder as shown.
2) Open index.html (or serve with any static server).
   - Recommended: VS Code Live Server, or any nginx/apache.
3) If you host on HTTPS, APIs will work normally.

API endpoints (editable in assets/app.js):
- Currency (default): https://open.er-api.com/v6/latest/{base}
  You can replace with any provider you prefer.
- Hijri conversion (default): https://api.aladhan.com/v1/gToH?date=DD-MM-YYYY and hToG
  You can replace with another provider.

Important notes:
- Some work-related calculators are estimators and include a visible disclaimer.
- You can add/remove tools by editing TOOLS array in assets/app.js and adding a corresponding tools/{id}.html page.

Saudi touch palette (suggested):
- Background: #070818 → #050612
- Accent Green: #00B67A (soft Saudi green)
- Accent Teal:  #05ADAD (fresh)
- Support Purple: #7C5CFF (subtle, not dominant)
- Warm Highlight: #FFB86B (very light use)


