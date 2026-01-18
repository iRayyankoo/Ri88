/* Rayyan Portal — shared logic (AR/EN, tools registry, calculators, APIs) */
const STORAGE_LANG = "rayan_lang";
const STORAGE_FAVS = "rayan_favs";

const TOOLS = [{"id": "currency", "cat": "Finance", "name_ar": "تحويل العملات", "name_en": "Currency Converter", "icon": "💱", "desc_ar": "تحويل فوري مع خيار سعر يدوي.", "desc_en": "Live conversion with optional manual rate."}, {"id": "vat", "cat": "Finance", "name_ar": "حاسبة ضريبة 15%", "name_en": "VAT (15%) Calculator", "icon": "🧾", "desc_ar": "شامل/غير شامل.", "desc_en": "Inclusive/exclusive modes."}, {"id": "discount", "cat": "Finance", "name_ar": "حاسبة الخصم", "name_en": "Discount Calculator", "icon": "🏷️", "desc_ar": "قبل/بعد + نسبة.", "desc_en": "Before/after with percent."}, {"id": "percent", "cat": "Finance", "name_ar": "حاسبة النسبة", "name_en": "Percentage Calculator", "icon": "📊", "desc_ar": "نسبة من رقم أو فرق.", "desc_en": "Percent of a number or change."}, {"id": "loan", "cat": "Finance", "name_ar": "حاسبة القروض", "name_en": "Loan Calculator", "icon": "💳", "desc_ar": "قسط شهري + جدول سداد.", "desc_en": "Monthly payment + amortization."}, {"id": "mortgage", "cat": "Finance", "name_ar": "حاسبة التمويل العقاري", "name_en": "Mortgage Estimator", "icon": "🏠", "desc_ar": "دفعة أولى + مدة + هامش.", "desc_en": "Down payment + term + rate."}, {"id": "savings", "cat": "Finance", "name_ar": "حاسبة الادخار", "name_en": "Savings Goal", "icon": "🎯", "desc_ar": "هدف + مدة = ادخار شهري.", "desc_en": "Goal + timeframe => monthly save."}, {"id": "split", "cat": "Finance", "name_ar": "تقسيم الفاتورة", "name_en": "Split the Bill", "icon": "🍽️", "desc_ar": "عدد أشخاص + إكرامية.", "desc_en": "People + tip."}, {"id": "hijri", "cat": "Time", "name_ar": "تحويل التاريخ", "name_en": "Date Converter", "icon": "🗓️", "desc_ar": "هجري ↔ ميلادي (API) + يدوي.", "desc_en": "Hijri ↔ Gregorian (API) + manual."}, {"id": "datediff", "cat": "Time", "name_ar": "فرق بين تاريخين", "name_en": "Date Difference", "icon": "⏳", "desc_ar": "أيام/أسابيع/شهور تقريبية.", "desc_en": "Days/weeks/approx months."}, {"id": "countdown", "cat": "Time", "name_ar": "عدّاد إلى تاريخ", "name_en": "Countdown", "icon": "⏰", "desc_ar": "باقي على موعدك.", "desc_en": "Time remaining to an event."}, {"id": "age", "cat": "Time", "name_ar": "حاسبة العمر", "name_en": "Age Calculator", "icon": "🎂", "desc_ar": "عمر بالسنوات والأيام.", "desc_en": "Age in years/days."}, {"id": "units", "cat": "Convert", "name_ar": "تحويل الوحدات", "name_en": "Unit Converter", "icon": "📐", "desc_ar": "مسافة/وزن/حرارة/مساحة.", "desc_en": "Length/weight/temp/area."}, {"id": "words", "cat": "Text", "name_ar": "عدّاد الكلمات", "name_en": "Word Counter", "icon": "📝", "desc_ar": "كلمات/حروف/زمن قراءة.", "desc_en": "Words/chars/reading time."}, {"id": "qr", "cat": "Text", "name_ar": "مولّد QR", "name_en": "QR Generator", "icon": "🔳", "desc_ar": "رابط/نص → QR.", "desc_en": "URL/text → QR."}, {"id": "cleantext", "cat": "Text", "name_ar": "تنظيف النص", "name_en": "Text Cleaner", "icon": "🧼", "desc_ar": "إزالة فراغات/أسطر.", "desc_en": "Trim spaces/newlines."}, {"id": "numwords", "cat": "Text", "name_ar": "رقم إلى كتابة", "name_en": "Number to Words", "icon": "🔤", "desc_ar": "عربي/إنجليزي مبسّطة.", "desc_en": "Arabic/English (simple)."}, {"id": "retire", "cat": "Work", "name_ar": "حاسبة التقاعد (تقديرية)", "name_en": "Retirement (Estimator)", "icon": "👔", "desc_ar": "تقدير تقريبي.", "desc_en": "Rough estimate."}, {"id": "eos", "cat": "Work", "name_ar": "نهاية الخدمة (تقديرية)", "name_en": "End of Service (Estimator)", "icon": "📄", "desc_ar": "تقديري حسب المدة.", "desc_en": "Approx based on tenure."}];

const I18N = {
  ar: {
    brand: "ريان",
    nav_tools: "الأدوات",
    nav_fin: "المال والتمويل",
    nav_time: "الوقت والتاريخ",
    nav_text: "أدوات نصية",
    nav_more: "المزيد",
    search_ph: "ابحث عن أداة (مثال: عملات، قرض، تاريخ...)",
    cta_primary: "استعراض الأدوات",
    cta_secondary: "الأكثر استخداماً",
    featured_title: "أدوات مفيدة للمستخدم السعودي",
    featured_sub: "سريعة، واضحة، ومناسبة للجوال.",
    chip_fin: "المال والتمويل",
    chip_time: "الوقت والتاريخ",
    chip_text: "أدوات نصية سريعة",
    open_tool: "فتح",
    back: "رجوع",
    copy: "نسخ",
    copied: "تم النسخ",
    manual: "يدوي",
    live: "لحظي",
    disclaimer_est: "تنبيه: هذه النتائج تقديرية وقد تختلف حسب الأنظمة والسياسات.",
    api_note: "ملاحظة: يمكن تغيير مزوّد الـ API من ملف assets/app.js."
  },
  en: {
    brand: "Rayyan",
    nav_tools: "Tools",
    nav_fin: "Finance",
    nav_time: "Time & Dates",
    nav_text: "Quick Text",
    nav_more: "More",
    search_ph: "Search a tool (e.g., currency, loan, date...)",
    cta_primary: "Browse tools",
    cta_secondary: "Most used",
    featured_title: "Useful utilities for Saudi users",
    featured_sub: "Fast, clear, and mobile-first.",
    chip_fin: "Finance",
    chip_time: "Time & Dates",
    chip_text: "Quick Text Tools",
    open_tool: "Open",
    back: "Back",
    copy: "Copy",
    copied: "Copied",
    manual: "Manual",
    live: "Live",
    disclaimer_est: "Note: These results are estimates and may vary based on policies and regulations.",
    api_note: "Note: You can change the API provider in assets/app.js."
  }
};

function getLang(){
  const saved = localStorage.getItem(STORAGE_LANG);
  return saved === "en" ? "en" : "ar";
}
function setLang(lang){
  localStorage.setItem(STORAGE_LANG, lang);
}
function t(key){
  return I18N[getLang()][key] || key;
}
function applyLangToDocument(){
  const lang = getLang();
  document.documentElement.lang = lang;
  document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const k = el.getAttribute("data-i18n-ph");
    el.setAttribute("placeholder", t(k));
  });
}

function toggleLang(){
  setLang(getLang()==="ar" ? "en" : "ar");
  applyLangToDocument();
  if (window.renderIndex) window.renderIndex();
  if (window.renderTool) window.renderTool();
}

function fmtNumber(n, digits=2){
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat(getLang()==="ar" ? "ar-SA" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(n);
}

function parseNum(v){
  if (typeof v !== "string") return Number(v);
  const cleaned = v.replace(/[,،\s]/g, "");
  return Number(cleaned);
}

function copyText(text){
  navigator.clipboard?.writeText(String(text)).then(() => {
    const el = document.getElementById("toast");
    if (el) {
      el.textContent = t("copied");
      el.style.opacity = "1";
      setTimeout(() => el.style.opacity = "0", 1200);
    }
  });
}

function favGet(){
  try { return JSON.parse(localStorage.getItem(STORAGE_FAVS) || "[]"); }
  catch { return []; }
}
function favToggle(id){
  const cur = new Set(favGet());
  if (cur.has(id)) cur.delete(id); else cur.add(id);
  localStorage.setItem(STORAGE_FAVS, JSON.stringify([...cur]));
}
function isFav(id){ return new Set(favGet()).has(id); }

/* -------------------- API Config (editable) -------------------- */
const API = {
  currencyBaseUrl: "https://open.er-api.com/v6/latest/",
  hijriGtoH: "https://api.aladhan.com/v1/gToH?date=", // DD-MM-YYYY
  hijriHtoG: "https://api.aladhan.com/v1/hToG?date="  // DD-MM-YYYY
};

async function fetchCurrencyRates(base){
  const url = API.currencyBaseUrl + encodeURIComponent(base.toUpperCase());
  const res = await fetch(url);
  if (!res.ok) throw new Error("Currency API error");
  const data = await res.json();
  const rates = data.rates || data.conversion_rates || data.conversion_rates || data.conversion_rates;
  // open.er-api uses "rates"; other providers may use "conversion_rates"
  const finalRates = data.rates || data.conversion_rates;
  if (!finalRates) throw new Error("Rates missing");
  return {
    rates: finalRates,
    updated: data.time_last_update_utc || data.time_last_update_unix || data.date || ""
  };
}

function pad2(n){ return String(n).padStart(2,"0"); }
function formatDMY(dateObj){
  return pad2(dateObj.getDate()) + "-" + pad2(dateObj.getMonth()+1) + "-" + dateObj.getFullYear();
}

async function gToH(dateObj){
  const dmy = formatDMY(dateObj);
  const res = await fetch(API.hijriGtoH + dmy);
  if (!res.ok) throw new Error("Hijri API error");
  const data = await res.json();
  const hijri = data?.data?.hijri?.date;
  if (!hijri) throw new Error("Hijri missing");
  return hijri;
}

async function hToG(hijriDmy){
  const res = await fetch(API.hijriHtoG + encodeURIComponent(hijriDmy));
  if (!res.ok) throw new Error("Hijri API error");
  const data = await res.json();
  const greg = data?.data?.gregorian?.date;
  if (!greg) throw new Error("Gregorian missing");
  return greg;
}

/* -------------------- Index rendering -------------------- */
window.renderIndex = function(){
  applyLangToDocument();

  const listEl = document.getElementById("toolGrid");
  const q = (document.getElementById("q")?.value || "").trim().toLowerCase();

  const byCat = {
    Finance: "chip_fin",
    Time: "chip_time",
    Text: "chip_text",
    Convert: "chip_time",
    Work: "chip_fin"
  };

  const filtered = TOOLS.filter(tl => {
    const name = getLang()==="ar" ? tl.name_ar : tl.name_en;
    const desc = getLang()==="ar" ? tl.desc_ar : tl.desc_en;
    const blob = (name + " " + desc + " " + tl.id + " " + tl.cat).toLowerCase();
    return !q || blob.includes(q);
  });

  if (listEl) {
    listEl.innerHTML = filtered.map(tl => {
      const name = getLang()==="ar" ? tl.name_ar : tl.name_en;
      const desc = getLang()==="ar" ? tl.desc_ar : tl.desc_en;
      const catLabel = t(byCat[tl.cat] || "nav_more");
      const fav = isFav(tl.id);
      return `
        <a class="glass card" href="tools/${tl.id}.html" aria-label="${name}">
          <div class="cardTop">
            <div class="icon">${tl.icon}</div>
            <div class="badge">${catLabel}</div>
          </div>
          <h3>${name}</h3>
          <p>${desc}</p>
          <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <span class="small" style="color:rgba(255,255,255,.6)">${t("open_tool")}</span>
            <button class="btn ghost" type="button" onclick="event.preventDefault(); favToggle('${tl.id}'); renderIndex();" style="padding:8px 12px;">
              ${fav ? "⭐" : "☆"}
            </button>
          </div>
        </a>
      `;
    }).join("");
  }
}

function bindIndex(){
  const q = document.getElementById("q");
  if (q) q.addEventListener("input", () => window.renderIndex());
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.addEventListener("click", toggleLang);
  window.renderIndex();
}

/* -------------------- Tool rendering -------------------- */
window.renderTool = function(){
  applyLangToDocument();
  const toolId = document.body.getAttribute("data-tool-id");
  const tl = TOOLS.find(x => x.id === toolId);
  if (!tl) return;

  const titleEl = document.getElementById("toolTitle");
  const descEl  = document.getElementById("toolDesc");
  if (titleEl) titleEl.textContent = (getLang()==="ar" ? tl.name_ar : tl.name_en);
  if (descEl)  descEl.textContent  = (getLang()==="ar" ? tl.desc_ar : tl.desc_en);

  const mount = document.getElementById("toolMount");
  if (!mount) return;
  mount.innerHTML = toolTemplate(toolId);

  document.getElementById("backBtn")?.addEventListener("click", () => history.back());
  document.getElementById("langBtn")?.addEventListener("click", toggleLang);

  bindTool(toolId);
};

function modePills(idPrefix){
  return `
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
      <button class="btn" type="button" id="${idPrefix}Live">${t("live")}</button>
      <button class="btn" type="button" id="${idPrefix}Manual">${t("manual")}</button>
    </div>
  `;
}

/* ---------- UI templates (subset) ---------- */
function currencyUI(){
  const am = getLang()==="ar" ? "المبلغ" : "Amount";
  const mr = getLang()==="ar" ? "سعر الصرف (1 من العملة الأساسية = ؟ من العملة الأخرى)" : "Manual rate (1 base = ? target)";
  const calc = getLang()==="ar" ? "احسب" : "Calculate";
  return `
  <div class="formRow">
    <div class="row3">
      <input class="input" id="curAmount" inputmode="decimal" placeholder="${am}">
      <input class="input" id="curFrom" value="SAR" placeholder="From (e.g., SAR)">
      <input class="input" id="curTo" value="USD" placeholder="To (e.g., USD)">
    </div>
    ${modePills("curMode")}
    <div id="curManualWrap" style="display:none; margin-top:8px;">
      <input class="input" id="curManualRate" inputmode="decimal" placeholder="${mr}">
    </div>

    <div class="result">
      <p class="big" id="curResult">—</p>
      <p class="sub" id="curMeta">—</p>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="curCalc">${calc}</button>
        <button class="btn" type="button" id="curCopy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function hijriUI(){
  const g = getLang()==="ar" ? "ميلادي" : "Gregorian";
  const h = getLang()==="ar" ? "هجري (DD-MM-YYYY)" : "Hijri (DD-MM-YYYY)";
  const conv = getLang()==="ar" ? "حوّل" : "Convert";
  return `
  <div class="formRow">
    <div class="row2">
      <label>
        <div class="small">${g}</div>
        <input class="input" id="gDate" type="date">
      </label>
      <label>
        <div class="small">${h}</div>
        <input class="input" id="hDate" placeholder="DD-MM-YYYY">
      </label>
    </div>
    ${modePills("hijMode")}
    <div class="note" id="hNote">${t("api_note")}</div>

    <div class="result">
      <p class="big" id="hResult">—</p>
      <p class="sub" id="hSub">—</p>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="hConvert">${conv}</button>
        <button class="btn" type="button" id="hCopy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

/* Minimal templates for remaining tools:
   To keep this TXT compact and safe, the remaining tool templates are loaded via a small registry below.
   You can expand any tool later by copying patterns from currency/hijri. */

function genericUI(titleKey, fieldsHtml, actionsHtml){
  return `
    <div class="formRow">
      ${fieldsHtml}
      <div class="result">
        <p class="big" id="genOut">—</p>
        <p class="sub" id="genSub">—</p>
        ${actionsHtml}
      </div>
    </div>
  `;
}

function toolTemplate(id){
  switch(id){
    case "currency": return currencyUI();
    case "hijri": return hijriUI();
    default:
      // Compact placeholder UI for other tools (expand freely)
      return `<div class="note">${t("api_note")}</div>
              <div class="note">This tool is scaffolded. Expand its UI/logic in assets/app.js.</div>`;
  }
}

function bindTool(id){
  switch(id){
    case "currency": return bindCurrency();
    case "hijri": return bindHijri();
    default: return;
  }
}

/* -------------------- Tool bindings (currency + hijri) -------------------- */
function bindCurrency(){
  let mode = "live";
  const liveBtn = document.getElementById("curModeLive");
  const manBtn  = document.getElementById("curModeManual");
  const manWrap = document.getElementById("curManualWrap");

  function setMode(m){
    mode = m;
    manWrap.style.display = (mode==="manual") ? "block" : "none";
    liveBtn.style.opacity = mode==="live" ? "1" : ".7";
    manBtn.style.opacity  = mode==="manual" ? "1" : ".7";
  }
  liveBtn.onclick = () => setMode("live");
  manBtn.onclick  = () => setMode("manual");
  setMode("live");

  document.getElementById("curCalc").onclick = async () => {
    const amount = parseNum(document.getElementById("curAmount").value);
    const from = (document.getElementById("curFrom").value || "SAR").toUpperCase();
    const to   = (document.getElementById("curTo").value || "USD").toUpperCase();

    if (!isFinite(amount) || amount < 0) return;

    const resultEl = document.getElementById("curResult");
    const metaEl   = document.getElementById("curMeta");

    try {
      if (mode === "manual") {
        const rate = parseNum(document.getElementById("curManualRate").value);
        if (!isFinite(rate) || rate <= 0) throw new Error("Bad manual rate");
        const out = amount * rate;
        resultEl.textContent = fmtNumber(out, 2) + " " + to;
        metaEl.textContent = (getLang()==="ar" ? "سعر يدوي" : "Manual rate") + `: 1 ${from} = ${fmtNumber(rate, 6)} ${to}`;
      } else {
        resultEl.textContent = getLang()==="ar" ? "جاري التحميل..." : "Loading...";
        const data = await fetchCurrencyRates(from);
        const rate = data.rates[to];
        if (!rate) throw new Error("Pair not available");
        const out = amount * rate;
        resultEl.textContent = fmtNumber(out, 2) + " " + to;
        metaEl.textContent = `1 ${from} = ${fmtNumber(rate, 6)} ${to}` + (data.updated ? ` • ${data.updated}` : "");
      }
    } catch (e) {
      resultEl.textContent = "—";
      metaEl.textContent = (getLang()==="ar" ? "تعذر جلب الأسعار. جرّب مزود API آخر أو استخدم الوضع اليدوي." : "Failed to fetch rates. Try another provider or use manual mode.");
    }
  };

  document.getElementById("curCopy").onclick = () => {
    copyText(document.getElementById("curResult").textContent);
  };
}

function bindHijri(){
  let mode = "live";
  const liveBtn = document.getElementById("hijModeLive");
  const manBtn  = document.getElementById("hijModeManual");
  const note = document.getElementById("hNote");

  function setMode(m){
    mode = m;
    liveBtn.style.opacity = mode==="live" ? "1" : ".7";
    manBtn.style.opacity  = mode==="manual" ? "1" : ".7";
    note.textContent = mode==="live" ? t("api_note") : (getLang()==="ar" ? "الوضع اليدوي: أدخل التاريخ الآخر بنفسك." : "Manual mode: enter the other date yourself.");
  }
  liveBtn.onclick = () => setMode("live");
  manBtn.onclick  = () => setMode("manual");
  setMode("live");

  document.getElementById("hConvert").onclick = async () => {
    const gVal = document.getElementById("gDate").value;
    const hVal = (document.getElementById("hDate").value || "").trim();
    const out = document.getElementById("hResult");
    const sub = document.getElementById("hSub");

    try {
      if (mode === "manual") {
        out.textContent = getLang()==="ar" ? "استخدم الإدخال اليدوي" : "Use manual input";
        sub.textContent = "—";
        return;
      }

      if (gVal) {
        out.textContent = getLang()==="ar" ? "جاري التحويل..." : "Converting...";
        const d = new Date(gVal + "T00:00:00");
        const hij = await gToH(d);
        out.textContent = hij;
        sub.textContent = (getLang()==="ar" ? "هجري" : "Hijri");
      } else if (hVal) {
        out.textContent = getLang()==="ar" ? "جاري التحويل..." : "Converting...";
        const greg = await hToG(hVal);
        out.textContent = greg;
        sub.textContent = (getLang()==="ar" ? "ميلادي (DD-MM-YYYY)" : "Gregorian (DD-MM-YYYY)");
      } else {
        out.textContent = "—";
        sub.textContent = "—";
      }
    } catch {
      out.textContent = "—";
      sub.textContent = (getLang()==="ar" ? "تعذر التحويل عبر API. جرّب لاحقاً أو غيّر المزود." : "Conversion failed. Try later or change provider.");
    }
  };

  document.getElementById("hCopy").onclick = () => copyText(document.getElementById("hResult").textContent);
}

/* -------------------- Boot -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("toolGrid")) bindIndex();
  if (document.getElementById("toolMount")) window.renderTool();
});


