/* Rayyan Portal — shared logic (AR/EN, tools, calculators, APIs) */
const STORAGE_LANG = "rayan_lang";
const STORAGE_FAVS = "rayan_favs";

const TOOLS = [{"id": "currency", "cat": "Finance", "name_ar": "تحويل العملات", "name_en": "Currency Converter", "icon": "💱", "desc_ar": "تحويل فوري مع خيار سعر يدوي أو API.", "desc_en": "Live conversion with manual or API mode."}, {"id": "vat", "cat": "Finance", "name_ar": "حاسبة ضريبة 15%", "name_en": "VAT (15%) Calculator", "icon": "🧾", "desc_ar": "شامل/غير شامل مع صافي/ضريبة/إجمالي.", "desc_en": "Inclusive/exclusive with net/VAT/total."}, {"id": "discount", "cat": "Finance", "name_ar": "حاسبة الخصم", "name_en": "Discount Calculator", "icon": "🏷️", "desc_ar": "سعر + نسبة خصم → السعر النهائي.", "desc_en": "Price + discount % → final price."}, {"id": "percent", "cat": "Finance", "name_ar": "حاسبة النسبة", "name_en": "Percentage Calculator", "icon": "📊", "desc_ar": "نسبة من رقم أو نسبة تغيّر.", "desc_en": "Percent of a number or percent change."}, {"id": "loan", "cat": "Finance", "name_ar": "حاسبة القروض", "name_en": "Loan Calculator", "icon": "💳", "desc_ar": "قسط شهري + جدول سداد مبسط.", "desc_en": "Monthly payment + amortization table."}, {"id": "mortgage", "cat": "Finance", "name_ar": "حاسبة التمويل العقاري", "name_en": "Mortgage Estimator", "icon": "🏠", "desc_ar": "دفعة أولى + مدة + نسبة → قسط تقديري.", "desc_en": "Down payment + term + rate → estimate."}, {"id": "savings", "cat": "Finance", "name_ar": "حاسبة الادخار", "name_en": "Savings Goal", "icon": "🎯", "desc_ar": "هدف + مدة → ادخار شهري.", "desc_en": "Goal + timeframe → monthly save."}, {"id": "split", "cat": "Finance", "name_ar": "تقسيم الفاتورة", "name_en": "Split the Bill", "icon": "🍽️", "desc_ar": "تقسيم المبلغ على أشخاص + إكرامية.", "desc_en": "Split total by people + tip."}, {"id": "hijri", "cat": "Time", "name_ar": "تحويل التاريخ", "name_en": "Date Converter", "icon": "🗓️", "desc_ar": "هجري ↔ ميلادي (API) + يدوي.", "desc_en": "Hijri ↔ Gregorian (API) + manual."}, {"id": "datediff", "cat": "Time", "name_ar": "فرق بين تاريخين", "name_en": "Date Difference", "icon": "⏳", "desc_ar": "حساب الأيام والأسابيع والسنوات.", "desc_en": "Compute days/weeks/years between dates."}, {"id": "countdown", "cat": "Time", "name_ar": "عدّاد إلى تاريخ", "name_en": "Countdown", "icon": "⏰", "desc_ar": "عدّاد مباشر حتى موعدك.", "desc_en": "Live countdown to your event."}, {"id": "age", "cat": "Time", "name_ar": "حاسبة العمر", "name_en": "Age Calculator", "icon": "🎂", "desc_ar": "عمر بالسنوات/الأشهر/الأيام.", "desc_en": "Age in years/months/days."}, {"id": "units", "cat": "Convert", "name_ar": "تحويل الوحدات", "name_en": "Unit Converter", "icon": "📐", "desc_ar": "مسافة/وزن/حرارة/مساحة.", "desc_en": "Length/weight/temp/area."}, {"id": "words", "cat": "Text", "name_ar": "عدّاد الكلمات", "name_en": "Word Counter", "icon": "📝", "desc_ar": "كلمات/حروف/زمن قراءة.", "desc_en": "Words/chars/reading time."}, {"id": "qr", "cat": "Text", "name_ar": "مولّد QR", "name_en": "QR Generator", "icon": "🔳", "desc_ar": "نص/رابط → QR (عبر API).", "desc_en": "Text/URL → QR (via API)."}, {"id": "cleantext", "cat": "Text", "name_ar": "تنظيف النص", "name_en": "Text Cleaner", "icon": "🧼", "desc_ar": "إزالة الفراغات والأسطر الزائدة.", "desc_en": "Remove extra spaces/newlines."}, {"id": "numwords", "cat": "Text", "name_ar": "رقم إلى كتابة", "name_en": "Number to Words", "icon": "🔤", "desc_ar": "تحويل رقم إلى كلمات (مبسّط).", "desc_en": "Convert number to words (simple)."}, {"id": "retire", "cat": "Work", "name_ar": "حاسبة التقاعد (تقديرية)", "name_en": "Retirement (Estimator)", "icon": "👔", "desc_ar": "تقدير مبسّط (غير رسمي).", "desc_en": "Simplified estimate (not official)."}, {"id": "eos", "cat": "Work", "name_ar": "نهاية الخدمة (تقديرية)", "name_en": "End of Service (Estimator)", "icon": "📄", "desc_ar": "تقدير مبسّط (غير رسمي).", "desc_en": "Simplified estimate (not official)."}];

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
    calculate: "احسب",
    convert: "حوّل",
    clear: "مسح",
    manual: "يدوي",
    live: "لحظي",
    amount: "المبلغ",
    from: "من",
    to: "إلى",
    result: "النتيجة",
    net: "الصافي",
    vat: "الضريبة",
    total: "الإجمالي",
    inclusive: "شامل الضريبة",
    exclusive: "غير شامل الضريبة",
    price: "السعر",
    discount: "الخصم %",
    final: "السعر النهائي",
    saved: "التوفير",
    percent_of: "نسبة من رقم",
    percent_change: "نسبة التغيّر",
    base: "الأساس",
    new_value: "الجديد",
    change: "التغيّر",
    loan_amount: "مبلغ القرض",
    rate_apr: "نسبة سنوية %",
    years: "سنوات",
    months: "أشهر",
    monthly_payment: "القسط الشهري",
    schedule: "جدول السداد",
    principal: "الأصل",
    interest: "الفائدة",
    balance: "الرصيد",
    down_payment: "الدفعة الأولى",
    home_price: "سعر العقار",
    goal: "الهدف",
    people: "عدد الأشخاص",
    tip: "إكرامية %",
    per_person: "لكل شخص",
    start_date: "تاريخ البداية",
    end_date: "تاريخ النهاية",
    days: "أيام",
    weeks: "أسابيع",
    years_lbl: "سنوات",
    months_lbl: "أشهر",
    target_datetime: "الموعد",
    birthdate: "تاريخ الميلاد",
    reading_time: "زمن القراءة",
    words: "كلمات",
    characters: "حروف",
    no_spaces: "بدون مسافات",
    text: "النص",
    size: "الحجم",
    generate: "إنشاء",
    cleaned: "النص المنظّف",
    remove_extra_spaces: "إزالة الفراغات الزائدة",
    remove_empty_lines: "إزالة الأسطر الفارغة",
    trim_edges: "حذف الفراغات من البداية/النهاية",
    number: "الرقم",
    estimate_only: "تنبيه: هذه النتائج تقديرية وغير رسمية.",
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
    calculate: "Calculate",
    convert: "Convert",
    clear: "Clear",
    manual: "Manual",
    live: "Live",
    amount: "Amount",
    from: "From",
    to: "To",
    result: "Result",
    net: "Net",
    vat: "VAT",
    total: "Total",
    inclusive: "VAT included",
    exclusive: "VAT excluded",
    price: "Price",
    discount: "Discount %",
    final: "Final price",
    saved: "You save",
    percent_of: "Percent of a number",
    percent_change: "Percent change",
    base: "Base",
    new_value: "New",
    change: "Change",
    loan_amount: "Loan amount",
    rate_apr: "APR %",
    years: "Years",
    months: "Months",
    monthly_payment: "Monthly payment",
    schedule: "Amortization",
    principal: "Principal",
    interest: "Interest",
    balance: "Balance",
    down_payment: "Down payment",
    home_price: "Home price",
    goal: "Goal",
    people: "People",
    tip: "Tip %",
    per_person: "Per person",
    start_date: "Start date",
    end_date: "End date",
    days: "Days",
    weeks: "Weeks",
    years_lbl: "Years",
    months_lbl: "Months",
    target_datetime: "Target",
    birthdate: "Birthdate",
    reading_time: "Reading time",
    words: "Words",
    characters: "Characters",
    no_spaces: "No spaces",
    text: "Text",
    size: "Size",
    generate: "Generate",
    cleaned: "Cleaned text",
    remove_extra_spaces: "Collapse extra spaces",
    remove_empty_lines: "Remove empty lines",
    trim_edges: "Trim edges",
    number: "Number",
    estimate_only: "Note: These results are simplified estimates (not official).",
    api_note: "Note: You can change the API provider in assets/app.js."
  }
};

function getLang(){
  const saved = localStorage.getItem(STORAGE_LANG);
  return saved === "en" ? "en" : "ar";
}
function setLang(lang){ localStorage.setItem(STORAGE_LANG, lang); }
function t(key){ return (I18N[getLang()] && I18N[getLang()][key]) ? I18N[getLang()][key] : key; }

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

function toast(msg){
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = "1";
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(() => el.style.opacity = "0", 1200);
}

function copyText(text){
  navigator.clipboard?.writeText(String(text)).then(() => toast(t("copied")));
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
  hijriHtoG: "https://api.aladhan.com/v1/hToG?date=",  // DD-MM-YYYY
  qrBase: "https://api.qrserver.com/v1/create-qr-code/?size="
};

async function fetchCurrencyRates(base){
  const url = API.currencyBaseUrl + encodeURIComponent(base.toUpperCase());
  const res = await fetch(url);
  if (!res.ok) throw new Error("Currency API error");
  const data = await res.json();
  const finalRates = data.rates || data.conversion_rates;
  if (!finalRates) throw new Error("Rates missing");
  return {
    rates: finalRates,
    updated: data.time_last_update_utc || ""
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

function modePills(idPrefix){
  return `
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
      <button class="btn small" type="button" id="${idPrefix}Live">${t("live")}</button>
      <button class="btn small" type="button" id="${idPrefix}Manual">${t("manual")}</button>
    </div>
  `;
}

function setActivePills(liveBtn, manBtn, mode){
  liveBtn.style.opacity = mode==="live" ? "1" : ".7";
  manBtn.style.opacity  = mode==="manual" ? "1" : ".7";
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
            <button class="btn small" type="button" onclick="event.preventDefault(); favToggle('${tl.id}'); renderIndex();" style="padding:8px 12px;">
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

/* -------------------- Tool templates -------------------- */
function currencyUI(){
  return `
  <div class="formRow">
    <div class="row3">
      <input class="input" id="curAmount" inputmode="decimal" data-i18n-ph="amount" placeholder="${t("amount")}">
      <input class="input" id="curFrom" value="SAR" data-i18n-ph="from" placeholder="${t("from")}">
      <input class="input" id="curTo" value="USD" data-i18n-ph="to" placeholder="${t("to")}">
    </div>
    ${modePills("curMode")}
    <div id="curManualWrap" style="display:none; margin-top:8px;">
      <input class="input" id="curManualRate" inputmode="decimal" placeholder="${getLang()==="ar" ? "سعر الصرف (1 من العملة الأساسية = ؟ من العملة الأخرى)" : "Manual rate (1 base = ? target)"}">
    </div>

    <div class="result">
      <p class="big" id="curResult">—</p>
      <p class="sub" id="curMeta">—</p>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="curCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="curCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function vatUI(){
  return `
  <div class="formRow">
    <div class="row2">
      <input class="input" id="vatAmount" inputmode="decimal" data-i18n-ph="amount" placeholder="${t("amount")}">
      <select class="input" id="vatMode">
        <option value="exclusive">${t("exclusive")}</option>
        <option value="inclusive">${t("inclusive")}</option>
      </select>
    </div>
    <div class="result">
      <p class="big" id="vatBig">—</p>
      <div class="kv" id="vatKv"></div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="vatCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="vatCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function discountUI(){
  return `
  <div class="formRow">
    <div class="row2">
      <input class="input" id="dPrice" inputmode="decimal" data-i18n-ph="price" placeholder="${t("price")}">
      <input class="input" id="dPct" inputmode="decimal" data-i18n-ph="discount" placeholder="${t("discount")}">
    </div>
    <div class="result">
      <p class="big" id="dBig">—</p>
      <div class="kv" id="dKv"></div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="dCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="dCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function percentUI(){
  return `
  <div class="formRow">
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <button class="btn small" type="button" id="pTabOf">${t("percent_of")}</button>
      <button class="btn small" type="button" id="pTabCh">${t("percent_change")}</button>
    </div>

    <div id="pOfWrap" style="margin-top:8px;">
      <div class="row3">
        <input class="input" id="pOfBase" inputmode="decimal" data-i18n-ph="base" placeholder="${t("base")}">
        <input class="input" id="pOfPct" inputmode="decimal" placeholder="%">
        <input class="input" id="pOfOut" readonly placeholder="${t("result")}">
      </div>
    </div>

    <div id="pChWrap" style="display:none; margin-top:8px;">
      <div class="row3">
        <input class="input" id="pChOld" inputmode="decimal" placeholder="${getLang()==="ar" ? "القيمة القديمة" : "Old"}">
        <input class="input" id="pChNew" inputmode="decimal" data-i18n-ph="new_value" placeholder="${t("new_value")}">
        <input class="input" id="pChOut" readonly placeholder="${t("change")}">
      </div>
    </div>

    <div class="result">
      <p class="big" id="pBig">—</p>
      <p class="sub" id="pSub">—</p>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="pCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="pCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function loanUI(){
  return `
  <div class="formRow">
    <div class="row3">
      <input class="input" id="lAmount" inputmode="decimal" data-i18n-ph="loan_amount" placeholder="${t("loan_amount")}">
      <input class="input" id="lAPR" inputmode="decimal" data-i18n-ph="rate_apr" placeholder="${t("rate_apr")}">
      <input class="input" id="lYears" inputmode="numeric" data-i18n-ph="years" placeholder="${t("years")}">
    </div>
    <div class="result">
      <p class="big" id="lBig">—</p>
      <div class="kv" id="lKv"></div>
      <div class="tableWrap" id="lTableWrap" style="display:none;">
        <table class="table" id="lTable"></table>
      </div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="lCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="lCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function mortgageUI(){
  return `
  <div class="formRow">
    <div class="row2">
      <input class="input" id="mHome" inputmode="decimal" data-i18n-ph="home_price" placeholder="${t("home_price")}">
      <input class="input" id="mDown" inputmode="decimal" data-i18n-ph="down_payment" placeholder="${t("down_payment")}">
    </div>
    <div class="row2">
      <input class="input" id="mAPR" inputmode="decimal" data-i18n-ph="rate_apr" placeholder="${t("rate_apr")}">
      <input class="input" id="mYears" inputmode="numeric" data-i18n-ph="years" placeholder="${t("years")}">
    </div>
    <div class="result">
      <p class="big" id="mBig">—</p>
      <div class="kv" id="mKv"></div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="mCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="mCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function savingsUI(){
  return `
  <div class="formRow">
    <div class="row3">
      <input class="input" id="sGoal" inputmode="decimal" data-i18n-ph="goal" placeholder="${t("goal")}">
      <input class="input" id="sMonths" inputmode="numeric" data-i18n-ph="months" placeholder="${t("months")}">
      <input class="input" id="sInitial" inputmode="decimal" placeholder="${getLang()==="ar" ? "موجود حالياً" : "Already saved"}">
    </div>
    <div class="result">
      <p class="big" id="sBig">—</p>
      <div class="kv" id="sKv"></div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="sCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="sCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function splitUI(){
  return `
  <div class="formRow">
    <div class="row3">
      <input class="input" id="spTotal" inputmode="decimal" data-i18n-ph="total" placeholder="${t("total")}">
      <input class="input" id="spPeople" inputmode="numeric" data-i18n-ph="people" placeholder="${t("people")}">
      <input class="input" id="spTip" inputmode="decimal" data-i18n-ph="tip" placeholder="${t("tip")}">
    </div>
    <div class="result">
      <p class="big" id="spBig">—</p>
      <div class="kv" id="spKv"></div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="spCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="spCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function hijriUI(){
  return `
  <div class="formRow">
    <div class="row2">
      <label>
        <div class="small">${getLang()==="ar" ? "ميلادي" : "Gregorian"}</div>
        <input class="input" id="gDate" type="date">
      </label>
      <label>
        <div class="small">${getLang()==="ar" ? "هجري (DD-MM-YYYY)" : "Hijri (DD-MM-YYYY)"}</div>
        <input class="input" id="hDate" placeholder="DD-MM-YYYY">
      </label>
    </div>
    ${modePills("hijMode")}
    <div class="note" id="hNote">${t("api_note")}</div>

    <div class="result">
      <p class="big" id="hResult">—</p>
      <p class="sub" id="hSub">—</p>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="hConvert" data-i18n="convert">${t("convert")}</button>
        <button class="btn" type="button" id="hCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function datediffUI(){
  return `
  <div class="formRow">
    <div class="row2">
      <label>
        <div class="small" data-i18n="start_date">${t("start_date")}</div>
        <input class="input" id="ddStart" type="date">
      </label>
      <label>
        <div class="small" data-i18n="end_date">${t("end_date")}</div>
        <input class="input" id="ddEnd" type="date">
      </label>
    </div>
    <div class="result">
      <p class="big" id="ddBig">—</p>
      <div class="kv" id="ddKv"></div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="ddCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="ddCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function countdownUI(){
  return `
  <div class="formRow">
    <label>
      <div class="small" data-i18n="target_datetime">${t("target_datetime")}</div>
      <input class="input" id="cdTarget" type="datetime-local">
    </label>
    <div class="result">
      <p class="big" id="cdBig">—</p>
      <p class="sub" id="cdSub">—</p>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="cdStart">${getLang()==="ar" ? "ابدأ" : "Start"}</button>
        <button class="btn" type="button" id="cdStop">${getLang()==="ar" ? "إيقاف" : "Stop"}</button>
      </div>
    </div>
  </div>
  `;
}

function ageUI(){
  return `
  <div class="formRow">
    <label>
      <div class="small" data-i18n="birthdate">${t("birthdate")}</div>
      <input class="input" id="ageBirth" type="date">
    </label>
    <div class="result">
      <p class="big" id="ageBig">—</p>
      <div class="kv" id="ageKv"></div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="ageCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="ageCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function unitsUI(){
  return `
  <div class="formRow">
    <div class="row2">
      <select class="input" id="uType">
        <option value="length">${getLang()==="ar" ? "مسافة" : "Length"}</option>
        <option value="weight">${getLang()==="ar" ? "وزن" : "Weight"}</option>
        <option value="temp">${getLang()==="ar" ? "حرارة" : "Temperature"}</option>
        <option value="area">${getLang()==="ar" ? "مساحة" : "Area"}</option>
      </select>
      <input class="input" id="uVal" inputmode="decimal" data-i18n-ph="amount" placeholder="${t("amount")}">
    </div>
    <div class="row2">
      <select class="input" id="uFrom"></select>
      <select class="input" id="uTo"></select>
    </div>
    <div class="result">
      <p class="big" id="uBig">—</p>
      <p class="sub" id="uSub">—</p>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="uCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="uCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function wordsUI(){
  return `
  <div class="formRow">
    <textarea class="input" id="wText" rows="7" data-i18n-ph="text" placeholder="${t("text")}" style="resize:vertical;"></textarea>
    <div class="result">
      <p class="big" id="wBig">—</p>
      <div class="kv" id="wKv"></div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn" type="button" id="wClear" data-i18n="clear">${t("clear")}</button>
        <button class="btn" type="button" id="wCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function qrUI(){
  return `
  <div class="formRow">
    <textarea class="input" id="qText" rows="4" data-i18n-ph="text" placeholder="${t("text")}" style="resize:vertical;"></textarea>
    <div class="row2">
      <input class="input" id="qSize" inputmode="numeric" data-i18n-ph="size" placeholder="${t("size")} (e.g., 220)" value="220">
      <button class="btn primary" type="button" id="qGen" data-i18n="generate">${t("generate")}</button>
    </div>
    <div class="result">
      <p class="big" id="qBig">—</p>
      <div id="qImgWrap" style="margin-top:10px; display:grid; place-items:center;"></div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn" type="button" id="qCopy" data-i18n="copy">${t("copy")}</button>
      </div>
      <div class="note">${getLang()==="ar" ? "يعتمد على QR API خارجي." : "Uses an external QR API."}</div>
    </div>
  </div>
  `;
}

function cleantextUI(){
  return `
  <div class="formRow">
    <textarea class="input" id="ctIn" rows="6" data-i18n-ph="text" placeholder="${t("text")}" style="resize:vertical;"></textarea>
    <div class="glass soft" style="padding:12px; border-radius:16px; border:1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04);">
      <label style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
        <input type="checkbox" id="ctTrim" checked>
        <span class="small" data-i18n="trim_edges">${t("trim_edges")}</span>
      </label>
      <label style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
        <input type="checkbox" id="ctSpaces" checked>
        <span class="small" data-i18n="remove_extra_spaces">${t("remove_extra_spaces")}</span>
      </label>
      <label style="display:flex; gap:10px; align-items:center;">
        <input type="checkbox" id="ctEmpty" checked>
        <span class="small" data-i18n="remove_empty_lines">${t("remove_empty_lines")}</span>
      </label>
      <div class="sep"></div>
      <button class="btn primary" type="button" id="ctRun" data-i18n="calculate">${t("calculate")}</button>
    </div>

    <div class="result">
      <p class="big" id="ctBig">${t("cleaned")}</p>
      <textarea class="input" id="ctOut" rows="6" readonly style="resize:vertical;"></textarea>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn" type="button" id="ctCopy" data-i18n="copy">${t("copy")}</button>
        <button class="btn" type="button" id="ctClear" data-i18n="clear">${t("clear")}</button>
      </div>
    </div>
  </div>
  `;
}

function numwordsUI(){
  return `
  <div class="formRow">
    <div class="row2">
      <input class="input" id="nwNum" inputmode="numeric" data-i18n-ph="number" placeholder="${t("number")}">
      <button class="btn primary" type="button" id="nwRun" data-i18n="convert">${t("convert")}</button>
    </div>
    <div class="result">
      <p class="big" id="nwBig">—</p>
      <p class="sub" id="nwSub">${getLang()==="ar" ? "مبسّط للأعداد حتى 999,999" : "Simple up to 999,999"}</p>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn" type="button" id="nwCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function retireUI(){
  return `
  <div class="formRow">
    <div class="row3">
      <input class="input" id="rSalary" inputmode="decimal" placeholder="${getLang()==="ar" ? "الراتب الشهري" : "Monthly salary"}">
      <input class="input" id="rYears" inputmode="numeric" data-i18n-ph="years" placeholder="${t("years")}">
      <input class="input" id="rRate" inputmode="decimal" placeholder="${getLang()==="ar" ? "نسبة إحلال تقديرية %" : "Replacement rate %"}" value="60">
    </div>
    <div class="result">
      <p class="big" id="rBig">—</p>
      <div class="kv" id="rKv"></div>
      <div class="note" data-i18n="estimate_only">${t("estimate_only")}</div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="rCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="rCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function eosUI(){
  return `
  <div class="formRow">
    <div class="row3">
      <input class="input" id="eSalary" inputmode="decimal" placeholder="${getLang()==="ar" ? "آخر راتب شهري" : "Last monthly salary"}">
      <input class="input" id="eYears" inputmode="decimal" placeholder="${getLang()==="ar" ? "سنوات خدمة" : "Years of service"}">
      <select class="input" id="eType">
        <option value="end">${getLang()==="ar" ? "انتهاء عقد/استقالة؟" : "End/Resignation?"}</option>
        <option value="end">${getLang()==="ar" ? "انتهاء" : "End"}</option>
        <option value="resign">${getLang()==="ar" ? "استقالة (تقديري)" : "Resignation (est.)"}</option>
      </select>
    </div>
    <div class="result">
      <p class="big" id="eBig">—</p>
      <div class="kv" id="eKv"></div>
      <div class="note" data-i18n="estimate_only">${t("estimate_only")}</div>
      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn primary" type="button" id="eCalc" data-i18n="calculate">${t("calculate")}</button>
        <button class="btn" type="button" id="eCopy" data-i18n="copy">${t("copy")}</button>
      </div>
    </div>
  </div>
  `;
}

function toolTemplate(id){
  switch(id){
    case "currency": return currencyUI();
    case "vat": return vatUI();
    case "discount": return discountUI();
    case "percent": return percentUI();
    case "loan": return loanUI();
    case "mortgage": return mortgageUI();
    case "savings": return savingsUI();
    case "split": return splitUI();

    case "hijri": return hijriUI();
    case "datediff": return datediffUI();
    case "countdown": return countdownUI();
    case "age": return ageUI();

    case "units": return unitsUI();

    case "words": return wordsUI();
    case "qr": return qrUI();
    case "cleantext": return cleantextUI();
    case "numwords": return numwordsUI();

    case "retire": return retireUI();
    case "eos": return eosUI();
    default:
      return `<div class="note">${t("api_note")}</div>`;
  }
}

function bindTool(id){
  switch(id){
    case "currency": return bindCurrency();
    case "vat": return bindVAT();
    case "discount": return bindDiscount();
    case "percent": return bindPercent();
    case "loan": return bindLoan();
    case "mortgage": return bindMortgage();
    case "savings": return bindSavings();
    case "split": return bindSplit();

    case "hijri": return bindHijri();
    case "datediff": return bindDateDiff();
    case "countdown": return bindCountdown();
    case "age": return bindAge();

    case "units": return bindUnits();

    case "words": return bindWords();
    case "qr": return bindQR();
    case "cleantext": return bindCleanText();
    case "numwords": return bindNumWords();

    case "retire": return bindRetire();
    case "eos": return bindEOS();
    default: return;
  }
}

/* -------------------- Tool bindings -------------------- */
function bindCurrency(){
  let mode = "live";
  const liveBtn = document.getElementById("curModeLive");
  const manBtn  = document.getElementById("curModeManual");
  const manWrap = document.getElementById("curManualWrap");

  function setMode(m){
    mode = m;
    manWrap.style.display = (mode==="manual") ? "block" : "none";
    setActivePills(liveBtn, manBtn, mode);
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
    } catch {
      resultEl.textContent = "—";
      metaEl.textContent = (getLang()==="ar" ? "تعذر جلب الأسعار. جرّب مزود API آخر أو استخدم الوضع اليدوي." : "Failed to fetch rates. Try another provider or use manual mode.");
    }
  };

  document.getElementById("curCopy").onclick = () => copyText(document.getElementById("curResult").textContent);
}

function bindVAT(){
  const rate = 0.15;
  const big = document.getElementById("vatBig");
  const kv = document.getElementById("vatKv");

  function calc(){
    const amount = parseNum(document.getElementById("vatAmount").value);
    const mode = document.getElementById("vatMode").value;
    if (!isFinite(amount) || amount < 0) return;

    let net, vat, total;
    if (mode === "exclusive") {
      net = amount;
      vat = amount * rate;
      total = net + vat;
    } else {
      total = amount;
      net = total / (1 + rate);
      vat = total - net;
    }
    big.textContent = fmtNumber(total,2);
    kv.innerHTML = `
      <div><span>${t("net")}</span><b>${fmtNumber(net,2)}</b></div>
      <div><span>${t("vat")} (15%)</span><b>${fmtNumber(vat,2)}</b></div>
      <div><span>${t("total")}</span><b>${fmtNumber(total,2)}</b></div>
    `;
    return {net, vat, total};
  }

  document.getElementById("vatCalc").onclick = () => calc();
  document.getElementById("vatCopy").onclick = () => {
    const r = calc();
    if (!r) return;
    copyText(`${t("net")}: ${fmtNumber(r.net,2)} | ${t("vat")}: ${fmtNumber(r.vat,2)} | ${t("total")}: ${fmtNumber(r.total,2)}`);
  };
}

function bindDiscount(){
  const big = document.getElementById("dBig");
  const kv = document.getElementById("dKv");

  function calc(){
    const price = parseNum(document.getElementById("dPrice").value);
    const pct = parseNum(document.getElementById("dPct").value);
    if (!isFinite(price) || price < 0 || !isFinite(pct)) return;
    const off = price * (pct/100);
    const final = price - off;
    big.textContent = fmtNumber(final,2);
    kv.innerHTML = `
      <div><span>${t("price")}</span><b>${fmtNumber(price,2)}</b></div>
      <div><span>${t("saved")}</span><b>${fmtNumber(off,2)}</b></div>
      <div><span>${t("final")}</span><b>${fmtNumber(final,2)}</b></div>
    `;
    return {price, off, final};
  }

  document.getElementById("dCalc").onclick = () => calc();
  document.getElementById("dCopy").onclick = () => {
    const r = calc(); if(!r) return;
    copyText(`${t("final")}: ${fmtNumber(r.final,2)} | ${t("saved")}: ${fmtNumber(r.off,2)}`);
  };
}

function bindPercent(){
  let tab = "of";
  const tabOf = document.getElementById("pTabOf");
  const tabCh = document.getElementById("pTabCh");
  const ofWrap = document.getElementById("pOfWrap");
  const chWrap = document.getElementById("pChWrap");
  const big = document.getElementById("pBig");
  const sub = document.getElementById("pSub");

  function setTab(v){
    tab = v;
    ofWrap.style.display = tab==="of" ? "block" : "none";
    chWrap.style.display = tab==="ch" ? "block" : "none";
    tabOf.style.opacity = tab==="of" ? "1" : ".7";
    tabCh.style.opacity = tab==="ch" ? "1" : ".7";
    big.textContent = "—";
    sub.textContent = "—";
  }
  tabOf.onclick = () => setTab("of");
  tabCh.onclick = () => setTab("ch");
  setTab("of");

  function calc(){
    if (tab === "of") {
      const base = parseNum(document.getElementById("pOfBase").value);
      const pct = parseNum(document.getElementById("pOfPct").value);
      if (!isFinite(base) || !isFinite(pct)) return;
      const out = base * (pct/100);
      document.getElementById("pOfOut").value = fmtNumber(out, 2);
      big.textContent = fmtNumber(out,2);
      sub.textContent = `${fmtNumber(pct,2)}% × ${fmtNumber(base,2)}`;
      return out;
    } else {
      const oldV = parseNum(document.getElementById("pChOld").value);
      const newV = parseNum(document.getElementById("pChNew").value);
      if (!isFinite(oldV) || !isFinite(newV) || oldV === 0) return;
      const ch = ((newV - oldV) / Math.abs(oldV)) * 100;
      document.getElementById("pChOut").value = fmtNumber(ch, 2) + "%";
      big.textContent = fmtNumber(ch,2) + "%";
      sub.textContent = `${fmtNumber(oldV,2)} → ${fmtNumber(newV,2)}`;
      return ch;
    }
  }

  document.getElementById("pCalc").onclick = () => calc();
  document.getElementById("pCopy").onclick = () => {
    const r = calc(); if(!isFinite(r)) return;
    copyText(String(big.textContent));
  };
}

function amortize(P, apr, years){
  const n = Math.max(1, Math.round(years * 12));
  const r = (apr/100) / 12;
  const payment = (r === 0) ? (P / n) : (P * r) / (1 - Math.pow(1+r, -n));
  let bal = P;
  const rows = [];
  let totalInt = 0;
  for (let i=1; i<=n; i++) {
    const interest = bal * r;
    const principal = payment - interest;
    bal = Math.max(0, bal - principal);
    totalInt += interest;
    rows.push({i, payment, principal, interest, bal});
  }
  return {n, payment, totalInt, totalPaid: payment*n, rows};
}

function bindLoan(){
  const big = document.getElementById("lBig");
  const kv = document.getElementById("lKv");
  const tableWrap = document.getElementById("lTableWrap");
  const table = document.getElementById("lTable");

  function calc(){
    const P = parseNum(document.getElementById("lAmount").value);
    const apr = parseNum(document.getElementById("lAPR").value);
    const years = parseNum(document.getElementById("lYears").value);
    if (!isFinite(P) || P<=0 || !isFinite(apr) || apr<0 || !isFinite(years) || years<=0) return;

    const a = amortize(P, apr, years);
    big.textContent = fmtNumber(a.payment, 2);
    kv.innerHTML = `
      <div><span>${t("monthly_payment")}</span><b>${fmtNumber(a.payment,2)}</b></div>
      <div><span>${t("months")}</span><b>${a.n}</b></div>
      <div><span>${t("interest")}</span><b>${fmtNumber(a.totalInt,2)}</b></div>
      <div><span>${t("total")}</span><b>${fmtNumber(a.totalPaid,2)}</b></div>
    `;

    // table
    tableWrap.style.display = "block";
    const head = `
      <tr>
        <th>#</th>
        <th>${t("monthly_payment")}</th>
        <th>${t("principal")}</th>
        <th>${t("interest")}</th>
        <th>${t("balance")}</th>
      </tr>`;
    const body = a.rows.slice(0, 120).map(r => `
      <tr>
        <td>${r.i}</td>
        <td>${fmtNumber(r.payment,2)}</td>
        <td>${fmtNumber(r.principal,2)}</td>
        <td>${fmtNumber(r.interest,2)}</td>
        <td>${fmtNumber(r.bal,2)}</td>
      </tr>
    `).join("");
    table.innerHTML = head + body;

    return a;
  }

  document.getElementById("lCalc").onclick = () => calc();
  document.getElementById("lCopy").onclick = () => {
    const a = calc(); if(!a) return;
    copyText(`${t("monthly_payment")}: ${fmtNumber(a.payment,2)} | ${t("total")}: ${fmtNumber(a.totalPaid,2)}`);
  };
}

function bindMortgage(){
  const big = document.getElementById("mBig");
  const kv = document.getElementById("mKv");

  function calc(){
    const home = parseNum(document.getElementById("mHome").value);
    const down = parseNum(document.getElementById("mDown").value);
    const apr = parseNum(document.getElementById("mAPR").value);
    const years = parseNum(document.getElementById("mYears").value);
    if (!isFinite(home) || home<=0 || !isFinite(down) || down<0 || down>=home || !isFinite(apr) || apr<0 || !isFinite(years) || years<=0) return;

    const loan = home - down;
    const a = amortize(loan, apr, years);
    big.textContent = fmtNumber(a.payment,2);
    kv.innerHTML = `
      <div><span>${t("home_price")}</span><b>${fmtNumber(home,2)}</b></div>
      <div><span>${t("down_payment")}</span><b>${fmtNumber(down,2)}</b></div>
      <div><span>${t("loan_amount")}</span><b>${fmtNumber(loan,2)}</b></div>
      <div><span>${t("monthly_payment")}</span><b>${fmtNumber(a.payment,2)}</b></div>
    `;
    return {home, down, loan, payment:a.payment};
  }

  document.getElementById("mCalc").onclick = () => calc();
  document.getElementById("mCopy").onclick = () => {
    const r = calc(); if(!r) return;
    copyText(`${t("monthly_payment")}: ${fmtNumber(r.payment,2)} | ${t("loan_amount")}: ${fmtNumber(r.loan,2)}`);
  };
}

function bindSavings(){
  const big = document.getElementById("sBig");
  const kv = document.getElementById("sKv");

  function calc(){
    const goal = parseNum(document.getElementById("sGoal").value);
    const months = parseNum(document.getElementById("sMonths").value);
    const initial = parseNum(document.getElementById("sInitial").value || "0");
    if (!isFinite(goal) || goal<=0 || !isFinite(months) || months<=0 || !isFinite(initial) || initial<0) return;
    const remaining = Math.max(0, goal - initial);
    const per = remaining / months;
    big.textContent = fmtNumber(per,2);
    kv.innerHTML = `
      <div><span>${t("goal")}</span><b>${fmtNumber(goal,2)}</b></div>
      <div><span>${getLang()==="ar" ? "المتبقي" : "Remaining"}</span><b>${fmtNumber(remaining,2)}</b></div>
      <div><span>${t("months")}</span><b>${Math.round(months)}</b></div>
      <div><span>${getLang()==="ar" ? "ادخار شهري" : "Monthly save"}</span><b>${fmtNumber(per,2)}</b></div>
    `;
    return {per, goal, remaining, months};
  }

  document.getElementById("sCalc").onclick = () => calc();
  document.getElementById("sCopy").onclick = () => {
    const r = calc(); if(!r) return;
    copyText(`${getLang()==="ar" ? "الادخار الشهري" : "Monthly save"}: ${fmtNumber(r.per,2)}`);
  };
}

function bindSplit(){
  const big = document.getElementById("spBig");
  const kv = document.getElementById("spKv");

  function calc(){
    const total = parseNum(document.getElementById("spTotal").value);
    const people = parseNum(document.getElementById("spPeople").value);
    const tipPct = parseNum(document.getElementById("spTip").value || "0");
    if (!isFinite(total) || total<0 || !isFinite(people) || people<=0 || !isFinite(tipPct) || tipPct<0) return;
    const tip = total * (tipPct/100);
    const grand = total + tip;
    const per = grand / people;
    big.textContent = fmtNumber(per,2);
    kv.innerHTML = `
      <div><span>${t("total")}</span><b>${fmtNumber(total,2)}</b></div>
      <div><span>${t("tip")}</span><b>${fmtNumber(tip,2)}</b></div>
      <div><span>${t("people")}</span><b>${Math.round(people)}</b></div>
      <div><span>${t("per_person")}</span><b>${fmtNumber(per,2)}</b></div>
    `;
    return {per, total, tip, people};
  }

  document.getElementById("spCalc").onclick = () => calc();
  document.getElementById("spCopy").onclick = () => {
    const r = calc(); if(!r) return;
    copyText(`${t("per_person")}: ${fmtNumber(r.per,2)}`);
  };
}

function bindHijri(){
  let mode = "live";
  const liveBtn = document.getElementById("hijModeLive");
  const manBtn  = document.getElementById("hijModeManual");
  const note = document.getElementById("hNote");

  function setMode(m){
    mode = m;
    setActivePills(liveBtn, manBtn, mode);
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
        out.textContent = getLang()==="ar" ? "—" : "—";
        sub.textContent = getLang()==="ar" ? "اكتب التاريخ الآخر يدوياً" : "Enter the other date manually";
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

function bindDateDiff(){
  const big = document.getElementById("ddBig");
  const kv = document.getElementById("ddKv");

  function calc(){
    const s = document.getElementById("ddStart").value;
    const e = document.getElementById("ddEnd").value;
    if (!s || !e) return;
    const sd = new Date(s + "T00:00:00");
    const ed = new Date(e + "T00:00:00");
    const ms = ed - sd;
    const days = Math.round(ms / 86400000);
    const weeks = days / 7;
    const years = days / 365.25;
    const months = days / 30.44;

    big.textContent = (days >= 0 ? "" : "−") + Math.abs(days) + " " + t("days");
    kv.innerHTML = `
      <div><span>${t("days")}</span><b>${fmtNumber(days,0)}</b></div>
      <div><span>${t("weeks")}</span><b>${fmtNumber(weeks,2)}</b></div>
      <div><span>${t("months_lbl")}</span><b>${fmtNumber(months,2)}</b></div>
      <div><span>${t("years_lbl")}</span><b>${fmtNumber(years,2)}</b></div>
    `;
    return {days, weeks, months, years};
  }

  document.getElementById("ddCalc").onclick = () => calc();
  document.getElementById("ddCopy").onclick = () => {
    const r = calc(); if(!r) return;
    copyText(`${t("days")}: ${fmtNumber(r.days,0)}, ${t("weeks")}: ${fmtNumber(r.weeks,2)}, ${t("years_lbl")}: ${fmtNumber(r.years,2)}`);
  };
}

function bindCountdown(){
  const big = document.getElementById("cdBig");
  const sub = document.getElementById("cdSub");
  let timer = null;

  function format(ms){
    const s = Math.floor(ms/1000);
    const d = Math.floor(s/86400);
    const h = Math.floor((s%86400)/3600);
    const m = Math.floor((s%3600)/60);
    const sec = s%60;
    return `${d}d : ${pad2(h)}h : ${pad2(m)}m : ${pad2(sec)}s`;
  }

  function tick(target){
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      big.textContent = getLang()==="ar" ? "انتهى" : "Done";
      sub.textContent = "—";
      clearInterval(timer); timer=null;
      return;
    }
    big.textContent = format(diff);
    sub.textContent = getLang()==="ar" ? "المتبقي" : "Remaining";
  }

  document.getElementById("cdStart").onclick = () => {
    const v = document.getElementById("cdTarget").value;
    if (!v) return;
    const target = new Date(v).getTime();
    if (!isFinite(target)) return;
    if (timer) clearInterval(timer);
    tick(target);
    timer = setInterval(() => tick(target), 1000);
  };

  document.getElementById("cdStop").onclick = () => {
    if (timer) clearInterval(timer);
    timer = null;
    big.textContent = "—";
    sub.textContent = "—";
  };
}

function bindAge(){
  const big = document.getElementById("ageBig");
  const kv = document.getElementById("ageKv");

  function calc(){
    const v = document.getElementById("ageBirth").value;
    if (!v) return;
    const b = new Date(v + "T00:00:00");
    const now = new Date();

    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    let days = now.getDate() - b.getDate();

    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    big.textContent = `${years} ${t("years_lbl")}`;
    kv.innerHTML = `
      <div><span>${t("years_lbl")}</span><b>${years}</b></div>
      <div><span>${t("months_lbl")}</span><b>${months}</b></div>
      <div><span>${t("days")}</span><b>${days}</b></div>
    `;
    return {years, months, days};
  }

  document.getElementById("ageCalc").onclick = () => calc();
  document.getElementById("ageCopy").onclick = () => {
    const r = calc(); if(!r) return;
    copyText(`${r.years}y ${r.months}m ${r.days}d`);
  };
}

function bindUnits(){
  const typeEl = document.getElementById("uType");
  const fromEl = document.getElementById("uFrom");
  const toEl = document.getElementById("uTo");
  const valEl = document.getElementById("uVal");
  const big = document.getElementById("uBig");
  const sub = document.getElementById("uSub");

  const defs = {
    length: {
      base: "m",
      units: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344
      },
      labels: {
        ar: {m:"متر",km:"كيلومتر",cm:"سم",mm:"مم",in:"إنش",ft:"قدم",yd:"ياردة",mi:"ميل"},
        en: {m:"m",km:"km",cm:"cm",mm:"mm",in:"in",ft:"ft",yd:"yd",mi:"mi"}
      }
    },
    weight: {
      base: "kg",
      units: {
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.45359237,
        oz: 0.028349523125,
        ton: 1000
      },
      labels: {
        ar: {kg:"كجم",g:"جم",mg:"ملجم",lb:"رطل",oz:"أونصة",ton:"طن"},
        en: {kg:"kg",g:"g",mg:"mg",lb:"lb",oz:"oz",ton:"ton"}
      }
    },
    area: {
      base: "m2",
      units: {
        m2: 1,
        km2: 1_000_000,
        cm2: 0.0001,
        ha: 10_000,
        acre: 4046.8564224,
        ft2: 0.09290304
      },
      labels: {
        ar: {m2:"م²",km2:"كم²",cm2:"سم²",ha:"هكتار",acre:"فدان",ft2:"قدم²"},
        en: {m2:"m²",km2:"km²",cm2:"cm²",ha:"ha",acre:"acre",ft2:"ft²"}
      }
    },
    temp: {
      base: "c",
      units: { c:1, f:1, k:1 },
      labels: {
        ar: {c:"مئوي",f:"فهرنهايت",k:"كلفن"},
        en: {c:"Celsius",f:"Fahrenheit",k:"Kelvin"}
      }
    }
  };

  function populate(){
    const type = typeEl.value;
    const d = defs[type];
    const labels = d.labels[getLang()];
    fromEl.innerHTML = "";
    toEl.innerHTML = "";
    Object.keys(d.units).forEach(u => {
      const opt1 = document.createElement("option");
      opt1.value = u; opt1.textContent = labels[u] || u;
      const opt2 = opt1.cloneNode(true);
      fromEl.appendChild(opt1);
      toEl.appendChild(opt2);
    });
    // defaults
    fromEl.value = Object.keys(d.units)[0];
    toEl.value = Object.keys(d.units)[1] || Object.keys(d.units)[0];
  }

  function convert(){
    const type = typeEl.value;
    const d = defs[type];
    const v = parseNum(valEl.value);
    if (!isFinite(v)) return;

    const from = fromEl.value;
    const to = toEl.value;

    let out;
    if (type === "temp") {
      // temp conversions
      const c = (from==="c") ? v : (from==="f") ? (v-32)*(5/9) : (v-273.15);
      out = (to==="c") ? c : (to==="f") ? (c*(9/5)+32) : (c+273.15);
    } else {
      const base = v * d.units[from]; // to base (SI)
      out = base / d.units[to];
    }

    big.textContent = fmtNumber(out, 4);
    const labels = d.labels[getLang()];
    sub.textContent = `${fmtNumber(v,4)} ${labels[from]||from} → ${labels[to]||to}`;
    return out;
  }

  typeEl.onchange = () => { populate(); big.textContent="—"; sub.textContent="—"; };
  populate();

  document.getElementById("uCalc").onclick = () => convert();
  document.getElementById("uCopy").onclick = () => {
    const out = convert(); if(!isFinite(out)) return;
    copyText(big.textContent);
  };
}

function bindWords(){
  const txt = document.getElementById("wText");
  const big = document.getElementById("wBig");
  const kv = document.getElementById("wKv");

  function analyze(){
    const s = txt.value || "";
    const trimmed = s.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = s.length;
    const noSpaces = s.replace(/\s/g,"").length;
    const wpm = (getLang()==="ar") ? 180 : 200;
    const mins = words / wpm;
    const time = mins < 1 ? (getLang()==="ar" ? "أقل من دقيقة" : "< 1 min") : `${fmtNumber(mins,1)} min`;

    big.textContent = words + " " + t("words");
    kv.innerHTML = `
      <div><span>${t("words")}</span><b>${words}</b></div>
      <div><span>${t("characters")}</span><b>${chars}</b></div>
      <div><span>${t("no_spaces")}</span><b>${noSpaces}</b></div>
      <div><span>${t("reading_time")}</span><b>${time}</b></div>
    `;
    return {words, chars, noSpaces, time};
  }

  txt.addEventListener("input", analyze);
  analyze();

  document.getElementById("wClear").onclick = () => { txt.value=""; analyze(); };
  document.getElementById("wCopy").onclick = () => {
    const r = analyze();
    copyText(`${t("words")}: ${r.words} | ${t("characters")}: ${r.chars} | ${t("reading_time")}: ${r.time}`);
  };
}

function bindQR(){
  const big = document.getElementById("qBig");
  const wrap = document.getElementById("qImgWrap");
  let lastUrl = "";

  function gen(){
    const data = (document.getElementById("qText").value || "").trim();
    const size = parseNum(document.getElementById("qSize").value) || 220;
    if (!data) return;
    const s = Math.max(120, Math.min(900, Math.round(size)));
    lastUrl = API.qrBase + `${s}x${s}&data=` + encodeURIComponent(data);
    big.textContent = getLang()==="ar" ? "تم إنشاء QR" : "QR generated";
    wrap.innerHTML = `<img src="${lastUrl}" alt="QR" style="width:${s}px; height:${s}px; border-radius:14px; border:1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.08);"/>`;
    return lastUrl;
  }

  document.getElementById("qGen").onclick = () => gen();
  document.getElementById("qCopy").onclick = () => {
    const url = lastUrl || gen();
    if (!url) return;
    copyText(url);
  };
}

function bindCleanText(){
  const inp = document.getElementById("ctIn");
  const out = document.getElementById("ctOut");

  function run(){
    let s = inp.value || "";
    const trim = document.getElementById("ctTrim").checked;
    const spaces = document.getElementById("ctSpaces").checked;
    const empty = document.getElementById("ctEmpty").checked;

    if (trim) s = s.trim();
    if (spaces) {
      // collapse multiple spaces (keep newlines)
      s = s.replace(/[ \t]+/g, " ");
      s = s.replace(/\n[ \t]+/g, "\n");
      s = s.replace(/[ \t]+\n/g, "\n");
    }
    if (empty) {
      s = s.replace(/\n\s*\n+/g, "\n\n");
    }
    out.value = s;
    return s;
  }

  document.getElementById("ctRun").onclick = () => run();
  document.getElementById("ctCopy").onclick = () => copyText(out.value);
  document.getElementById("ctClear").onclick = () => { inp.value=""; out.value=""; };
}

function numToWordsEn(n){
  const ones = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  function under100(x){
    if (x<20) return ones[x];
    const t = Math.floor(x/10), r=x%10;
    return tens[t] + (r? "-" + ones[r] : "");
  }
  function under1000(x){
    const h = Math.floor(x/100), r=x%100;
    if (!h) return under100(r);
    return ones[h] + " hundred" + (r? " " + under100(r) : "");
  }
  if (n<1000) return under1000(n);
  const th = Math.floor(n/1000), r=n%1000;
  return under1000(th) + " thousand" + (r? " " + under1000(r) : "");
}

function numToWordsAr(n){
  // Simplified (not grammatical perfection)
  const ones = ["صفر","واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة","عشرة","أحد عشر","اثنا عشر","ثلاثة عشر","أربعة عشر","خمسة عشر","ستة عشر","سبعة عشر","ثمانية عشر","تسعة عشر"];
  const tens = ["","", "عشرون","ثلاثون","أربعون","خمسون","ستون","سبعون","ثمانون","تسعون"];
  const hundreds = ["","مئة","مئتان","ثلاثمئة","أربعمئة","خمسمئة","ستمئة","سبعمئة","ثمانمئة","تسعمئة"];
  function under100(x){
    if (x<20) return ones[x];
    const t = Math.floor(x/10), r=x%10;
    if (!r) return tens[t];
    return ones[r] + " و" + tens[t];
  }
  function under1000(x){
    const h = Math.floor(x/100), r=x%100;
    const hPart = hundreds[h] || "";
    if (!h) return under100(r);
    if (!r) return hPart;
    return hPart + " و" + under100(r);
  }
  if (n<1000) return under1000(n);
  const th = Math.floor(n/1000), r=n%1000;
  const thPart = (th===1) ? "ألف" : (th===2) ? "ألفان" : under1000(th) + " ألف";
  if (!r) return thPart;
  return thPart + " و" + under1000(r);
}

function bindNumWords(){
  const big = document.getElementById("nwBig");
  function run(){
    const n = parseNum(document.getElementById("nwNum").value);
    if (!isFinite(n) || n<0 || n>999999 || Math.floor(n)!==n) {
      big.textContent = getLang()==="ar" ? "اكتب رقم صحيح حتى 999,999" : "Enter an integer up to 999,999";
      return null;
    }
    const out = getLang()==="ar" ? numToWordsAr(n) : numToWordsEn(n);
    big.textContent = out;
    return out;
  }
  document.getElementById("nwRun").onclick = () => run();
  document.getElementById("nwCopy").onclick = () => {
    const out = run(); if(!out) return;
    copyText(out);
  };
}

function bindRetire(){
  const big = document.getElementById("rBig");
  const kv = document.getElementById("rKv");

  function calc(){
    const salary = parseNum(document.getElementById("rSalary").value);
    const years = parseNum(document.getElementById("rYears").value);
    const repl = parseNum(document.getElementById("rRate").value);
    if (!isFinite(salary) || salary<=0 || !isFinite(years) || years<=0 || !isFinite(repl) || repl<=0) return;
    // Simple: estimated pension = salary * (repl/100) adjusted by tenure factor capped at 1
    const factor = Math.min(1, years/30);
    const pension = salary * (repl/100) * factor;
    big.textContent = fmtNumber(pension,2);
    kv.innerHTML = `
      <div><span>${getLang()==="ar" ? "الراتب" : "Salary"}</span><b>${fmtNumber(salary,2)}</b></div>
      <div><span>${getLang()==="ar" ? "المدة" : "Tenure"}</span><b>${fmtNumber(years,1)} ${t("years_lbl")}</b></div>
      <div><span>${getLang()==="ar" ? "معامل المدة" : "Tenure factor"}</span><b>${fmtNumber(factor,2)}</b></div>
      <div><span>${getLang()==="ar" ? "تقدير معاش شهري" : "Est. monthly pension"}</span><b>${fmtNumber(pension,2)}</b></div>
    `;
    return pension;
  }

  document.getElementById("rCalc").onclick = () => calc();
  document.getElementById("rCopy").onclick = () => {
    const p = calc(); if(!isFinite(p)) return;
    copyText(big.textContent);
  };
}

function bindEOS(){
  const big = document.getElementById("eBig");
  const kv = document.getElementById("eKv");

  function calc(){
    const salary = parseNum(document.getElementById("eSalary").value);
    const years = parseNum(document.getElementById("eYears").value);
    const type = document.getElementById("eType").value;
    if (!isFinite(salary) || salary<=0 || !isFinite(years) || years<=0) return;

    // Simplified rule-of-thumb (NOT official):
    // End: first 5 years = 0.5 month per year, after = 1 month per year
    // Resign: apply factor 0.5
    const y1 = Math.min(5, years);
    const y2 = Math.max(0, years - 5);
    let monthsEq = (0.5*y1) + (1.0*y2);
    if (type === "resign") monthsEq *= 0.5;
    const payout = monthsEq * salary;

    big.textContent = fmtNumber(payout,2);
    kv.innerHTML = `
      <div><span>${getLang()==="ar" ? "الراتب" : "Salary"}</span><b>${fmtNumber(salary,2)}</b></div>
      <div><span>${getLang()==="ar" ? "سنوات الخدمة" : "Years"}</span><b>${fmtNumber(years,1)}</b></div>
      <div><span>${getLang()==="ar" ? "مكافأة بالأشهر" : "Months equivalent"}</span><b>${fmtNumber(monthsEq,2)}</b></div>
      <div><span>${getLang()==="ar" ? "تقدير المبلغ" : "Estimated payout"}</span><b>${fmtNumber(payout,2)}</b></div>
    `;
    return payout;
  }

  document.getElementById("eCalc").onclick = () => calc();
  document.getElementById("eCopy").onclick = () => {
    const p = calc(); if(!isFinite(p)) return;
    copyText(big.textContent);
  };
}

/* -------------------- Boot -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("toolGrid")) bindIndex();
  if (document.getElementById("toolMount")) window.renderTool();
});
