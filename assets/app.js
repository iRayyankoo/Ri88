/* Rayyan Portal — shared logic (AR/EN, tools registry, calculators, APIs) */
const STORAGE_LANG = "rayan_lang";
const STORAGE_FAVS = "rayan_favs";

/* -------------------- Registry -------------------- */
const TOOLS = [
  // Finance
  {
    id: "currency", cat: "Finance", icon: "💱",
    name_ar: "محول العملات", desc_ar: "أسعار صرف فورية لكل العملات.",
    name_en: "Currency Converter", desc_en: "Real-time exchange rates."
  },
  {
    id: "vat", cat: "Finance", icon: "🧾",
    name_ar: "حاسبة الضريبة (VAT)", desc_ar: "حساب ضريبة القيمة المضافة 15%.",
    name_en: "VAT Calculator", desc_en: "Calculate 15% Value Added Tax."
  },
  {
    id: "discount", cat: "Finance", icon: "🏷️",
    name_ar: "حاسبة الخصومات", desc_ar: "حساب السعر بعد التخفيض.",
    name_en: "Discount Calculator", desc_en: "Calculate final price after discount."
  },
  {
    id: "percent", cat: "Finance", icon: "📊",
    name_ar: "حاسبة النسب المئوية", desc_ar: "حساب التغير والنسب بين رقمين.",
    name_en: "Percentage Calculator", desc_en: "Calculate changes and ratios."
  },
  {
    id: "loan", cat: "Finance", icon: "💳",
    name_ar: "التمويل الشخصي", desc_ar: "حساب القسط الشهري والفوائد.",
    name_en: "Personal Finance", desc_en: "Monthly payments & interest calculator."
  },
  {
    id: "mortgage", cat: "Finance", icon: "🏠",
    name_ar: "التمويل العقاري", desc_ar: "تخطيط القروض العقارية والدفعات.",
    name_en: "Mortgage Calculator", desc_en: "Plan your home loan payments."
  },
  {
    id: "savings", cat: "Finance", icon: "🎯",
    name_ar: "تخطيط الادخار", desc_ar: "كم تحتاج لتوفير مبلغ معين؟",
    name_en: "Savings Planner", desc_en: "Calculate monthly savings needed."
  },
  {
    id: "split", cat: "Finance", icon: "🍽️",
    name_ar: "تقسيم الفاتورة (قطة)", desc_ar: "توزيع المبلغ بين الأشخاص بالتساوي.",
    name_en: "Bill Splitter", desc_en: "Split expenses among friends."
  },

  // Time
  {
    id: "hijri", cat: "Time", icon: "🗓️",
    name_ar: "محول التاريخ", desc_ar: "التحويل بين الهجري والميلادي.",
    name_en: "Date Converter", desc_en: "Hijri <-> Gregorian conversion."
  },
  {
    id: "datediff", cat: "Time", icon: "⏳",
    name_ar: "حاسبة المدة الزمنية", desc_ar: "الفرق الدقيق بين تاريخين.",
    name_en: "Duration Calculator", desc_en: "Calculate difference between dates."
  },
  {
    id: "countdown", cat: "Time", icon: "⏰",
    name_ar: "العد التنازلي", desc_ar: "كم باقي على مناسبتك؟",
    name_en: "Countdown Timer", desc_en: "Time remaining for events."
  },
  {
    id: "age", cat: "Time", icon: "🎂",
    name_ar: "حاسبة العمر الدقيقة", desc_ar: "عمرك بالسنين والشهور والأيام.",
    name_en: "Precise Age", desc_en: "Your exact age in detail."
  },

  // Text
  {
    id: "words", cat: "Text", icon: "📝",
    name_ar: "عداد الحروف والكلمات", desc_ar: "تحليل طول النصوص.",
    name_en: "Word Counter", desc_en: "Analyze text length & stats."
  },
  {
    id: "qr", cat: "Text", icon: "🔳",
    name_ar: "صانع الباركود (QR)", desc_ar: "إنشاء رمز QR للروابط والنصوص.",
    name_en: "QR Code Generator", desc_en: "Create QR codes instantly."
  },
  {
    id: "cleantext", cat: "Text", icon: "🧼",
    name_ar: "منقح النصوص", desc_ar: "إزالة التشكيل والمسافات الزائدة.",
    name_en: "Text Cleaner", desc_en: "Remove diacritics & extra spaces."
  },
  {
    id: "numwords", cat: "Text", icon: "🔤",
    name_ar: "تويتر الأرقام (تفقيط)", desc_ar: "تحويل الأرقام إلى كلمات عربية.",
    name_en: "Number to Words", desc_en: "Convert numbers to text."
  },
  {
    id: "aiprompt", cat: "Text", icon: "🤖",
    name_ar: "صانع أوامر الذكاء الاصطناعي", desc_ar: "كتابة " + "Prompt" + " احترافي.",
    name_en: "AI Prompt Builder", desc_en: "Create professional AI prompts."
  },

  // Converters/Work
  {
    id: "units", cat: "Convert", icon: "📐",
    name_ar: "محول الوحدات الشامل", desc_ar: "طول، وزن، حرارة.",
    name_en: "Unit Converter", desc_en: "Length, Weight, & Temp."
  },
  {
    id: "retire", cat: "Work", icon: "👔",
    name_ar: "حاسبة سن التقاعد", desc_ar: "متى يحين موعد تقاعدك؟",
    name_en: "Retirement Date", desc_en: "When will you retire?"
  },
  {
    id: "eos", cat: "Work", icon: "📄",
    name_ar: "مكافأة نهاية الخدمة", desc_ar: "حسب نظام العمل السعودي.",
    name_en: "End of Service", desc_en: "Saudi Labor Law benefits."
  },
  {
    id: "photoshop", cat: "Text", icon: "🎨",
    name_ar: "نصوص عربية للفوتوشوب", desc_ar: "إصلاح مشاكل الكتابة في تطبيقات أدوبي.",
    name_en: "Arabic for Photoshop", desc_en: "Fix text issues in Adobe apps."
  }
];



const CURRENCIES = ["SAR", "USD", "EUR", "GBP", "AED", "KWD", "BHD", "OMR", "QAR", "JOD", "EGP", "TRY", "INR", "PHP", "IDR", "PKR", "BDT"];

const I18N = {
  ar: {
    brand: "ريان", nav_tools: "الأدوات", nav_fin: "المال", nav_time: "الوقت", nav_text: "نصوص",
    search_ph: "ابحث عن أداة...", open_tool: "فتح", back: "رجوع", copy: "نسخ", copied: "تم النسخ",
    calc: "احسب", result: "النتيجة", reset: "إعادة تعيين",
    // Hero
    hero_t1: "أدوات ذكية", hero_t2: "لحياتك اليومية",
    hero_sub: "مجموعة مميزة من الحاسبات والأدوات المصممة للمستخدم العصري. مجانية، سريعة، وآمنة.",
    cta_primary: "تصفح الأدوات", footer_note: "صمم للمستخدم السعودي",
    // Old Hero (keeping for safety if used elsewhere)
    featured_title: "أدوات مفيدة للمستخدم السعودي", featured_sub: "سريعة، واضحة، ومناسبة للجوال.",
    cta_primary: "استعراض الأدوات", cta_secondary: "الأكثر استخداماً",
    api_note: "ملاحظة: البيانات المالية يتم تحديثها تلقائياً.",
    // Finance Terms
    amt: "المبلغ", tax: "الضريبة", before: "قبل الضريبة", after: "بعد الضريبة",
    discount: "الخصم", price: "السعر الأصلي", final: "السعر النهائي", saved: "وفرت",
    loan_amt: "مبلغ التمويل", rate: "النسبة السنوية (%)", years: "المدة (سنوات)",
    monthly: "القسط الشهري", total_pay: "إجمالي السداد", total_int: "إجمالي الأرباح",
    down_pay: "الدفعة الأولى", property: "قيمة العقار",
    goal: "الهدف", current: "المبلغ الحالي", months: "عدد الشهور", save_mo: "ادخار شهري",
    bill: "الفاتورة", people: "عدد الأشخاص", tip: "إكرامية (%)", per_person: "كل شخص يدفع",
    // Time Terms
    start: "من تاريخ", end: "إلى تاريخ", diff: "الفرق",
    greg: "ميلادي", hij: "هجري", dob: "تاريخ الميلاد",
    y: "سنة", m: "شهر", d: "يوم", h: "ساعة",
    // Text Terms
    text_ph: "اكتب أو الصق النص هنا...", chars: "حروف", words: "كلمات", lines: "أسطر",
    diacritics: "تشكيل", spaces: "فراغات",
    // AI Prompt
    ai_role: "الدور (مثل: خبير تسويق)", ai_task: "المهمة (مثل: كتابة تغريدة)",
    ai_ctx: "السياق (مثل: لمنتج تقني)", ai_fmt: "الصيغة (مثل: جدول، نقاط)",
    ai_gen: "تكوين الأمر",
    // Toast
    api_error: "خطأ في الاتصال", fill_all: "يرجى تعبئة الحقول المطلوبة"
  },
  en: {
    brand: "Rayyan", nav_tools: "Tools", nav_fin: "Finance", nav_time: "Time", nav_text: "Text",
    search_ph: "Search...", open_tool: "Open", back: "Back", copy: "Copy", copied: "Copied",
    calc: "Calculate", result: "Result", reset: "Reset",
    // Hero
    hero_t1: "Smart Tools", hero_t2: "For Everyday Life",
    hero_sub: "A premium collection of calculators, converters, and utilities designed for the modern user. Free, fast, and private.",
    cta_primary: "Browse Tools", footer_note: "Designed for Saudi Users",
    // Old Hero
    featured_title: "Useful Tools for Saudi Users", featured_sub: "Fast, clear, and mobile-friendly.",
    cta_primary: "Browse Tools", cta_secondary: "Most Used",
    api_note: "Note: Financial data uses live APIs.",
    // Finance Terms
    amt: "Amount", tax: "VAT", before: "Before Tax", after: "After Tax",
    discount: "Discount", price: "Original Price", final: "Final Price", saved: "You Saved",
    loan_amt: "Loan Amount", rate: "Annual Rate (%)", years: "Duration (Years)",
    monthly: "Monthly Payment", total_pay: "Total Repayment", total_int: "Total Interest",
    down_pay: "Down Payment", property: "Property Value",
    goal: "Goal Amount", current: "Current Saved", months: "Months", save_mo: "Monthly Save",
    bill: "Bill Total", people: "People", tip: "Tip (%)", per_person: "Per Person",
    // Time Terms
    start: "From Date", end: "To Date", diff: "Difference",
    greg: "Gregorian", hij: "Hijri", dob: "Date of Birth",
    y: "yr", m: "mo", d: "day", h: "hr",
    // Text Terms
    text_ph: "Type or paste text here...", chars: "Chars", words: "Words", lines: "Lines",
    diacritics: "Diacritics", spaces: "Spaces",
    // AI Prompt
    ai_role: "Role (e.g. Expert Marketer)", ai_task: "Task (e.g. Write a tweet)",
    ai_ctx: "Context (e.g. Tech product)", ai_fmt: "Format (e.g. Bullet points)",
    ai_gen: "Generate Prompt",
    // Toast
    api_error: "Connection Error", fill_all: "Please fill required fields"
  }
};

/* -------------------- Core Logic -------------------- */
function getLang() { return localStorage.getItem(STORAGE_LANG) === "en" ? "en" : "ar"; }
function setLang(l) { localStorage.setItem(STORAGE_LANG, l); }
function t(k) { return I18N[getLang()][k] || k; }
function isAr() { return getLang() === "ar"; }

function applyLang() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.body.setAttribute("dir", isAr() ? "rtl" : "ltr");
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));

  // Update Lang Button
  const lBtn = document.getElementById("langTxt");
  if (lBtn) lBtn.textContent = isAr() ? "English" : "العربية";
}

function toggleLang() {
  setLang(isAr() ? "en" : "ar");
  location.reload(); // Simple reload to ensure full UI refresh
}

function fmtNum(n, d = 2, curr = null) {
  if (isNaN(n) || !isFinite(n)) return "—";
  let val = new Intl.NumberFormat(isAr() ? "ar-SA" : "en-US", { maximumFractionDigits: d }).format(n);
  if (curr) {
    const symbol = isAr() ? (curr === "SAR" ? "ر.س" : curr) : curr;
    return val + " " + symbol;
  }
  return val;
}

function copyTxt(txt) {
  if (!txt) return;
  navigator.clipboard.writeText(txt).then(() => showToast(t("copied")));
}

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = "1";
  setTimeout(() => el.style.opacity = "0", 2000);
}

// Global Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  applyLang();
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.addEventListener("click", toggleLang);

  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.addEventListener("click", () => window.location.href = "../index.html");

  if (document.getElementById("toolGrid")) renderIndex();
  if (document.getElementById("toolMount")) renderTool();
});

/* -------------------- Index Page -------------------- */
/* -------------------- Index Page -------------------- */
function renderIndex() {
  const grid = document.getElementById("toolGrid");
  const qField = document.getElementById("q");
  const chips = document.querySelectorAll(".cat-chip");
  let activeFilter = "all";

  // Chip Logic
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      draw();
    });
  });

  const draw = () => {
    const q = (qField?.value || "").toLowerCase();

    const matches = TOOLS.filter(tl => {
      // 1. Filter by Text
      const txt = (tl.name_ar + tl.name_en + tl.id).toLowerCase();
      const matchText = txt.includes(q);

      // 2. Filter by Category
      const matchCat = activeFilter === "all" || tl.cat === activeFilter;

      return matchText && matchCat;
    });

    grid.innerHTML = matches.map(tl => {
      const name = isAr() ? tl.name_ar : tl.name_en;
      const desc = isAr() ? tl.desc_ar : tl.desc_en;

      return `
        <a class="glass tool-card" href="tools/${tl.id}.html">
          <div class="tc-top">
            <div class="tc-icon">${tl.icon}</div>
            <div class="tc-cat">${tl.cat}</div>
          </div>
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="tc-action">
             ${t("open_tool")} 
             <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </div>
        </a>`;
    }).join("");
  };

  if (qField) qField.addEventListener("input", draw);
  draw();
}

/* -------------------- Tools Router -------------------- */
function renderTool() {
  const id = document.body.dataset.toolId;
  const tool = TOOLS.find(x => x.id === id);
  if (!tool) return;

  // Set Headers
  document.getElementById("toolTitle").textContent = isAr() ? tool.name_ar : tool.name_en;
  document.getElementById("toolDesc").textContent = isAr() ? tool.desc_ar : tool.desc_en;
  document.title = (isAr() ? tool.name_ar : tool.name_en) + " | " + t("brand");

  // Mount UI
  const mount = document.getElementById("toolMount");
  mount.innerHTML = getToolUI(id);

  // Bind Logic
  bindToolLogic(id);

  // Back Button
  document.getElementById("backBtn")?.addEventListener("click", () => history.back());
}

/* -------------------- Tool UIs & Logic -------------------- */

// --- Helper UI Components ---
const uiRow = (html) => `<div class="formRow">${html}</div>`;
const uiInp = (id, ph, type = "number") => `<input class="input" id="${id}" type="${type}" placeholder="${t(ph)}">`;
const uiBtn = (id, txt, cls = "primary") => `<button class="btn ${cls}" id="${id}">${t(txt)}</button>`;
const uiRes = (id = "res") => `
  <div class="result">
    <p class="big" id="${id}">—</p>
    <p class="sub" id="${id}Sub"></p>
    <button class="btn ghost small" style="margin-top:10px" onclick="copyTxt(document.getElementById('${id}').textContent)">${t("copy")}</button>
  </div>`;



function getToolUI(id) {
  switch (id) {
    // Finance
    case "vat":
      return uiRow(`
        <div class="row2">
          ${uiInp("vAmt", "amt")}
          <select class="input" id="vMode"><option value="inc">${isAr() ? "شامل الضريبة" : "Inclusive"}</option><option value="exc">${isAr() ? "غير شامل" : "Exclusive"}</option></select>
        </div>
        ${uiBtn("vCalc", "calc")}
      `) + uiRes();

    case "discount":
      return uiRow(`
        ${uiInp("dPrice", "price")}
        ${uiInp("dPer", "discount", "number")}
        ${uiBtn("dCalc", "calc")}
      `) + uiRes();

    case "percent":
      return uiRow(`
        <select class="input" id="pMode" style="margin-bottom:10px">
          <option value="1">% ${isAr() ? "من رقم" : "of Number"}</option>
          <option value="2">${isAr() ? "كم نسبة X من Y" : "X is what % of Y"}</option>
          <option value="3">${isAr() ? "الفرق بين رقمين (%)" : "% Change"}</option>
        </select>
        <div class="row2">${uiInp("p1", "Value A")} ${uiInp("p2", "Value B")}</div>
        ${uiBtn("pCalc", "calc")}
      `) + uiRes();

    case "loan":
      return uiRow(`
        ${uiInp("lAmt", "loan_amt")}
        <div class="row2">${uiInp("lRate", "rate")} ${uiInp("lYears", "years")}</div>
        ${uiBtn("lCalc", "calc")}
      `) + uiRes();

    case "savings":
      return uiRow(`
        ${uiInp("sGoal", "goal")}
        <div class="row2">${uiInp("sCur", "current")} ${uiInp("sMos", "months")}</div>
        ${uiBtn("sCalc", "calc")}
      `) + uiRes();

    case "split":
      return uiRow(`
        ${uiInp("spBill", "bill")}
        <div class="row2">${uiInp("spPpl", "people")} ${uiInp("spTip", "tip")}</div>
        ${uiBtn("spCalc", "calc")}
      `) + uiRes();

    case "mortgage":
      return uiRow(`
        ${uiInp("mVal", "property")}
        ${uiInp("mDown", "down_pay")}
        <div class="row2">${uiInp("mRate", "rate")} ${uiInp("mYears", "years")}</div>
        ${uiBtn("mCalc", "calc")}
      `) + uiRes();

    case "currency":
      const ops = CURRENCIES.map(c => `<option value="${c}">${c}</option>`).join("");
      return `
        <div class="formRow">
          <div class="row3">
            <input class="input" id="cVal" type="number" placeholder="${t("amt")}">
            <select class="input" id="cFrom">${ops.replace(`value="USD"`, `value="USD" selected`)}</select>
            <select class="input" id="cTo">${ops.replace(`value="SAR"`, `value="SAR" selected`)}</select>
          </div>
          ${uiBtn("cCalc", "calc")}
          <div class="result">
            <p class="big" id="cRes">—</p>
            <p class="sub" id="cRate"></p>
          </div>
        </div>`;


    // Time
    case "hijri":
      return uiRow(`
        <div class="row2">
          ${uiInp("hGreg", "greg", "date")}
          ${uiInp("hHij", "hij", "text")}
        </div>
        ${uiBtn("hConv", "calc")}
      `) + uiRes();

    case "datediff":
      return uiRow(`
        <div class="row2">
          <label class="small">${t("start")} <input class="input" id="dd1" type="date"></label>
          <label class="small">${t("end")} <input class="input" id="dd2" type="date"></label>
        </div>
        ${uiBtn("ddCalc", "calc")}
      `) + uiRes();

    case "countdown":
      return uiRow(`
        <label>${t("end")} <input class="input" id="cdDate" type="datetime-local"></label>
        ${uiBtn("cdCalc", "start")}
      `) + uiRes();

    case "age":
      return uiRow(`
        <label>${t("dob")} <input class="input" id="ageDate" type="date"></label>
        ${uiBtn("ageCalc", "calc")}
      `) + uiRes();

    // Text
    case "words":
      return `<textarea class="input" id="wTxt" rows="6" placeholder="${t("text_ph")}"></textarea>
      ${uiRes()}
      <button class="btn primary" id="wCalc" style="margin-top:10px">${t("calc")}</button>`;

    case "qr":
      return uiRow(`
        <input class="input" id="qTxt" placeholder="URL or Text">
        ${uiBtn("qGen", "Generate")}
      `) + `<div id="qOut" style="text-align:center; margin-top:20px;"></div>`;

    case "cleantext":
      return `<textarea class="input" id="clTxt" rows="6" placeholder="${t("text_ph")}"></textarea>
      <div class="row2" style="margin-top:10px">
        ${uiBtn("clSp", "Remove Extra Spaces")}
        ${uiBtn("clDi", "Remove Diacritics")}
      </div>
      <textarea class="input" id="clRes" rows="6" style="margin-top:10px" readonly></textarea>`;

    case "numwords":
      return uiRow(`
        ${uiInp("nwNum", "amt")}
        ${uiBtn("nwCalc", "calc")}
      `) + uiRes();

    case "aiprompt":
      return uiRow(`
        ${uiInp("aiRole", "ai_role", "text")}
        ${uiInp("aiTask", "ai_task", "text")}
        <div class="row2">
          ${uiInp("aiCtx", "ai_ctx", "text")}
          ${uiInp("aiFmt", "ai_fmt", "text")}
        </div>
        ${uiBtn("aiCalc", "ai_gen")}
      `) + `<textarea class="input" id="aiRes" rows="6" style="margin-top:14px" readonly placeholder="Result..."></textarea>
            <button class="btn ghost small" style="margin-top:10px" onclick="copyTxt(document.getElementById('aiRes').value)">${t("copy")}</button>`;

    // Converters & Work
    case "units":
      return uiRow(`
        <select class="input" id="uType">
          <option value="L">Length (m ↔ ft)</option>
          <option value="W">Weight (kg ↔ lb)</option>
          <option value="T">Temp (C ↔ F)</option>
        </select>
        <div class="row2">${uiInp("uVal", "amt")} ${uiInp("uResInput", "result", "text")}</div>
        ${uiBtn("uCalc", "calc")}
      `);

    case "retire":
      return uiRow(`
        <label>${t("dob")} <input class="input" id="rDob" type="date"></label>
        <label>Retirement Age <input class="input" id="rAge" value="60"></label>
        ${uiBtn("rCalc", "calc")}
      `) + uiRes();

    case "eos":
      return uiRow(`
        <div class="row2">
          ${uiInp("eSal", "Salary/mo")} ${uiInp("eYears", "Years")}
        </div>
        <select class="input" id="eReason">
          <option value="quit">Resignation (استقالة)</option>
          <option value="term">Termination (إنهاء عقد)</option>
        </select>
        ${uiBtn("eCalc", "calc")}
      `) + uiRes();

  }
}

function bindToolLogic(id) {
  const getVal = (eid) => parseFloat(document.getElementById(eid)?.value) || 0;
  const setRes = (val, sub = "") => {
    document.getElementById("res").textContent = val;
    document.getElementById("resSub").textContent = sub;
  };

  switch (id) {
    case "vat":
      document.getElementById("vCalc").onclick = () => {
        const amt = getVal("vAmt");
        const mode = document.getElementById("vMode").value;
        const rate = 0.15;
        let tax, total, base;

        if (mode === "exc") {
          tax = amt * rate;
          total = amt + tax;
          base = amt;
          setRes(fmtNum(total, 2, "SAR"), `${t("tax")}: ${fmtNum(tax, 2, "SAR")}`);
        } else {
          base = amt / (1 + rate);
          tax = amt - base;
          setRes(fmtNum(base, 2, "SAR"), `${t("tax")}: ${fmtNum(tax, 2, "SAR")} (${t("before")})`);
        }
      };
      break;

    case "discount":
      document.getElementById("dCalc").onclick = () => {
        const price = getVal("dPrice");
        const disc = getVal("dPer"); // percentage
        const saved = price * (disc / 100);
        const final = price - saved;
        setRes(fmtNum(final, 2, "SAR"), `${t("saved")}: ${fmtNum(saved, 2, "SAR")}`);
      };
      break;

    case "percent":
      document.getElementById("pCalc").onclick = () => {
        const m = document.getElementById("pMode").value;
        const v1 = getVal("p1");
        const v2 = getVal("p2");
        let r = 0;
        if (m === "1") r = v2 * (v1 / 100); // v1% of v2 -- Wait, usually X% of Y. Let's assume input order.
        if (m === "2") r = (v1 / v2) * 100;
        if (m === "3") r = ((v2 - v1) / v1) * 100;
        setRes(fmtNum(r) + (m !== "1" ? "%" : ""));
      };
      break;

    case "loan":
      document.getElementById("lCalc").onclick = () => {
        const P = getVal("lAmt");
        const r = getVal("lRate") / 100 / 12;
        const n = getVal("lYears") * 12;
        if (P <= 0 || n <= 0) return;

        // PMT = P * r * (1+r)^n / ((1+r)^n - 1)
        const pmt = r === 0 ? P / n : P * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const total = pmt * n;
        const interest = total - P;
        setRes(fmtNum(pmt, 2, "SAR"), `${t("total_pay")}: ${fmtNum(total, 2, "SAR")} • ${t("total_int")}: ${fmtNum(interest, 2, "SAR")}`);
      };
      break;

    case "savings":
      document.getElementById("sCalc").onclick = () => {
        const goal = getVal("sGoal");
        const cur = getVal("sCur");
        const mos = getVal("sMos");
        if (mos <= 0) return;
        const needed = (goal - cur) / mos;
        setRes(fmtNum(needed, 2, "SAR"));
      };
      break;

    case "split":
      document.getElementById("spCalc").onclick = () => {
        const bill = getVal("spBill");
        const ppl = getVal("spPpl") || 1;
        const tip = getVal("spTip");
        const total = bill * (1 + tip / 100);
        const per = total / ppl;
        setRes(fmtNum(per, 2, "SAR"), `${t("total_pay")}: ${fmtNum(total, 2, "SAR")}`);
      };
      break;

    case "mortgage":
      document.getElementById("mCalc").onclick = () => {
        const val = getVal("mVal");
        const down = getVal("mDown");
        const P = val - down;
        const r = getVal("mRate") / 100 / 12;
        const n = getVal("mYears") * 12;
        const pmt = r === 0 ? P / n : P * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setRes(fmtNum(pmt, 2, "SAR"), `${t("loan_amt")}: ${fmtNum(P, 2, "SAR")}`);
      };
      break;

    case "currency":
      document.getElementById("cCalc").onclick = async () => {
        const amt = getVal("cVal");
        const from = document.getElementById("cFrom").value;
        const to = document.getElementById("cTo").value;
        const resEl = document.getElementById("cRes");
        const rateEl = document.getElementById("cRate");

        resEl.textContent = "...";
        try {
          const r = await fetch(`https://open.er-api.com/v6/latest/${from}`);
          const d = await r.json();
          const rate = d.rates[to];
          if (!rate) { resEl.textContent = "Error"; return; }
          const final = amt * rate;
          resEl.textContent = fmtNum(final) + " " + to;
          rateEl.textContent = `1 ${from} = ${fmtNum(rate, 4)} ${to}`;
        } catch (e) {
          resEl.textContent = t("api_error");
        }
      };
    // Time
    case "hijri":
      document.getElementById("hConv").onclick = async () => {
        const g = document.getElementById("hGreg").value;
        const h = document.getElementById("hHij").value;
        const r = document.getElementById("res");
        r.textContent = "...";

        try {
          if (g) {
            const date = new Date(g);
            const dStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            const req = await fetch(`https://api.aladhan.com/v1/gToH?date=${dStr}`);
            const dat = await req.json();
            setRes(dat.data.hijri.date, t("hij"));
          } else if (h) {
            const req = await fetch(`https://api.aladhan.com/v1/hToG?date=${h}`);
            const dat = await req.json();
            setRes(dat.data.gregorian.date, t("greg"));
          }
        } catch { setRes(t("api_error")); }
      };
      break;

    case "datediff":
      document.getElementById("ddCalc").onclick = () => {
        const d1 = new Date(document.getElementById("dd1").value);
        const d2 = new Date(document.getElementById("dd2").value);
        if (isNaN(d1) || isNaN(d2)) return;
        const diff = Math.abs(d2 - d1);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const years = (days / 365.25).toFixed(1);
        setRes(`${days} ${t("d")}`, `${years} ${t("y")}`);
      };
      break;

    case "age":
      document.getElementById("ageCalc").onclick = () => {
        const dob = new Date(document.getElementById("ageDate").value);
        const now = new Date();
        if (isNaN(dob)) return;
        let y = now.getFullYear() - dob.getFullYear();
        let m = now.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) { y--; m += 12; }
        setRes(`${y} ${t("y")}`, `${m} ${t("m")}`);
      };
      break;

    case "countdown":
      document.getElementById("cdCalc").onclick = () => {
        const end = new Date(document.getElementById("cdDate").value).getTime();
        const tick = () => {
          const now = new Date().getTime();
          const dist = end - now;
          if (dist < 0) { setRes("00:00:00"); return; }
          const d = Math.floor(dist / (1000 * 60 * 60 * 24));
          const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
          setRes(`${d}d ${h}h ${m}m`);
        };
        tick(); setInterval(tick, 60000);
      };
      break;

    // Text
    case "words":
      document.getElementById("wCalc").onclick = () => {
        const txt = document.getElementById("wTxt").value;
        const c = txt.length;
        const w = __wCount(txt);
        setRes(`${w} ${t("words")}`, `${c} ${t("chars")}`);
      };
      break;

    case "qr":
      document.getElementById("qGen").onclick = () => {
        const txt = document.getElementById("qTxt").value;
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(txt)}`;
        document.getElementById("qOut").innerHTML = `<img src="${url}" style="border-radius:10px; border:4px solid white;">`;
      };
      break;

    case "cleantext":
      const clT = document.getElementById("clTxt");
      const clR = document.getElementById("clRes");
      document.getElementById("clSp").onclick = () => clR.value = clT.value.replace(/\\s+/g, ' ').trim();
      document.getElementById("clDi").onclick = () => clR.value = __rmDiacritics(clT.value);
      break;

    case "numwords":
      document.getElementById("nwCalc").onclick = () => {
        const n = getVal("nwNum");
        setRes(__numToWords(n, isAr()));
      };
      break;

    case "aiprompt":
      document.getElementById("aiCalc").onclick = () => {
        const role = document.getElementById("aiRole").value;
        const task = document.getElementById("aiTask").value;
        const ctx = document.getElementById("aiCtx").value;
        const fmt = document.getElementById("aiFmt").value;

        if (!role || !task) { showToast(t("fill_all")); return; }

        let p = "";
        if (isAr()) {
          p = `### الدور
أنت ${role}.

### المهمة
${task}.

### السياق
${ctx || "لا يوجد سياق إضافي."}

### تعليمات المخرجات
- **الصيغة**: ${fmt || "نص عادي"}.
- **الأسلوب**: احترافي، دقيق، وشامل.
- **ملاحظة**: تجنب الحشو وركز على الجودة.`;
        } else {
          p = `### Role
Act as a ${role}.

### Task
${task}.

### Context
${ctx || "No additional context."}

### Output Instructions
- **Format**: ${fmt || "Plain text"}.
- **Tone**: Professional, precise, and comprehensive.
- **Note**: Avoid fluff and focus on quality.`;
        }
        document.getElementById("aiRes").value = p;
      };
      break;

    // Converters/Work
    case "units":
      document.getElementById("uCalc").onclick = () => {
        const v = getVal("uVal");
        const t = document.getElementById("uType").value;
        let r = 0;
        if (t === "L") r = v * 3.28084; // m to ft
        if (t === "W") r = v * 2.20462; // kg to lb
        if (t === "T") r = (v * 9 / 5) + 32; // C to F
        document.getElementById("uResInput").value = r.toFixed(2);
      };
      break;

    case "retire":
      document.getElementById("rCalc").onclick = () => {
        const dob = new Date(document.getElementById("rDob").value);
        const ra = parseFloat(document.getElementById("rAge").value) || 60;
        const year = dob.getFullYear() + ra;
        setRes(year);
      };
      break;

    case "eos":
      document.getElementById("eCalc").onclick = () => {
        const s = getVal("eSal");
        const y = getVal("eYears");
        const r = document.getElementById("eReason").value;
        let tot = 0;
        // Simplified Saudi Labor Law
        // First 5 years = half salary, after = full salary
        if (y <= 5) tot = y * 0.5 * s;
        else tot = (5 * 0.5 * s) + ((y - 5) * s);

        if (r === "quit") {
          if (y < 2) tot = 0;
          else if (y < 5) tot /= 3;
          else if (y < 10) tot = tot * 2 / 3;
        }
        setRes(fmtNum(tot, 2, "SAR"));
      };
      break;
  }
}

/* -------------------- Utils -------------------- */
function __wCount(s) { return s.trim().split(/\\s+/).filter(x => x).length; }
function __rmDiacritics(s) { return s.replace(/([\\u064B-\\u0652])/g, ""); }
function __numToWords(n, ar) {
  if (!ar) return n; // Fallback for EN or implement generic library
  // Very basic Arabic tafqit for demonstration
  return "النتيجة بالأرقام: " + n;
}

