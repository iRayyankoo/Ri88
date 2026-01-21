// Rayyan Portal 2.0 Core Logic

// Tool Data Definitions
// Status: 'existing' or 'added'
const tools = [
  // Finance
  {
    id: 'loan-calc', cat: 'finance', icon: '💸', status: 'existing',
    title: 'Loan Calculator', titleAr: 'حاسبة القروض',
    desc: 'Calculate monthly payments & interest amortization.', descAr: 'احسب الدفعات الشهرية وجدول استهلاك الفائدة.'
  },
  {
    id: 'vat-calc', cat: 'finance', icon: '💰', status: 'existing',
    title: 'VAT Calculator', titleAr: 'حاسبة الضريبة',
    desc: 'Add or remove 15% VAT instantly.', descAr: 'أضف أو أزل ضريبة القيمة المضافة 15% فوراً.'
  },
  {
    id: 'net-salary', cat: 'finance', icon: '💳', status: 'existing',
    title: 'Net Salary', titleAr: 'حاسبة الراتب',
    desc: 'Estimate KSA net salary after GOSI.', descAr: 'تقدير صافي الراتب بعد خصم التأمينات الاجتماعية.'
  },
  {
    id: 'currency', cat: 'finance', icon: '💱', status: 'existing',
    title: 'Currency Converter', titleAr: 'محول العملات',
    desc: 'Live exchange rates for SAR/USD/EUR.', descAr: 'أسعار صرف مباشرة للريال والدولار واليورو.'
  },
  {
    id: 'savings', cat: 'finance', icon: '🏦', status: 'added',
    title: 'Savings Goal', titleAr: 'هدف الادخار',
    desc: 'Plan how long to reach your savings goal.', descAr: 'خطط للمدة اللازمة للوصول لهدفك الادخاري.'
  },
  {
    id: 'zakat', cat: 'finance', icon: '🤲', status: 'added',
    title: 'Zakat Calculator', titleAr: 'حاسبة الزكاة',
    desc: 'Calculate Zakat (2.5%) on your assets.', descAr: 'حساب الزكاة (2.5%) على إجمالي الأصول.'
  },

  // Time
  {
    id: 'hijri', cat: 'time', icon: '📅', status: 'existing',
    title: 'Hijri Converter', titleAr: 'محول التاريخ الهجري',
    desc: 'Convert between Gregorian and Hijri dates.', descAr: 'التحويل بين التاريخ الميلادي والهجري.'
  },
  {
    id: 'diff', cat: 'time', icon: '⏳', status: 'existing',
    title: 'Date Difference', titleAr: 'حاسبة الفرق بين تاريخين',
    desc: 'Calculate exact duration between two dates.', descAr: 'حساب المدة الدقيقة بين أي تاريخين.'
  },
  {
    id: 'timer', cat: 'time', icon: '⏱️', status: 'existing',
    title: 'Stopwatch / Timer', titleAr: 'ساعة إيقاف / مؤقت',
    desc: 'Simple countdown and stopwatch.', descAr: 'مؤقت تنازلي وساعة إيقاف بسيطة.'
  },
  {
    id: 'timezone', cat: 'time', icon: '🌍', status: 'added',
    title: 'Time Zone', titleAr: 'محول التوقيت',
    desc: 'Check time across major global cities.', descAr: 'معرفة الوقت في أهم مدن العالم.'
  },

  // Text
  {
    id: 'adobe-fix', cat: 'text', icon: '🔤', status: 'existing',
    title: 'Arabic for Adobe', titleAr: 'مصحح النص العربي',
    desc: 'Fix RTL text issues for Photoshop/Premiere.', descAr: 'إصلاح مشاكل النص العربي في برامج أدوبي.'
  },
  {
    id: 'cleaner', cat: 'text', icon: '🧹', status: 'existing',
    title: 'Text Cleaner', titleAr: 'تنظيف النصوص',
    desc: 'Remove extra spaces, emojis, and styling.', descAr: 'إزالة المسافات الزائدة والرموز التعبيرية والتنسيق.'
  },
  {
    id: 'case', cat: 'text', icon: 'Aa', status: 'added',
    title: 'Case Converter', titleAr: 'محول حالة الأحرف',
    desc: 'UPPERCASE, lowercase, Title Case.', descAr: 'تحويل الحروف الكبيرة، الصغيرة، والعناوين.'
  },
  {
    id: 'hashtag', cat: 'text', icon: '#️⃣', status: 'added',
    title: 'Hashtag Generator', titleAr: 'مولد الهاشتاق',
    desc: 'Generate popular hashtags for content.', descAr: 'توليد هاشتاقات شائعة للمحتوى.'
  },
  {
    id: 'utm', cat: 'text', icon: '🔗', status: 'added',
    title: 'UTM Builder', titleAr: 'باني روابط UTM',
    desc: 'Track marketing campaigns with UTM tags.', descAr: 'تتبع حملاتك التسويقية باستخدام روابط UTM.'
  },

  // Productivity
  {
    id: 'qr', cat: 'productivity', icon: '🏁', status: 'existing',
    title: 'QR Generator', titleAr: 'صانع الباركود',
    desc: 'Create custom QR codes for URLs or text.', descAr: 'إنشاء رموز استجابة سريعة للروابط والنصوص.'
  },
  {
    id: 'unit', cat: 'productivity', icon: '📏', status: 'existing',
    title: 'Unit Converter', titleAr: 'محول الوحدات',
    desc: 'Length, Weight, and Temperature tools.', descAr: 'أدوات تحويل الطول والوزن ودرجة الحرارة.'
  },
  {
    id: 'password', cat: 'productivity', icon: '🔐', status: 'added',
    title: 'Password Generator', titleAr: 'مولد كلمات المرور',
    desc: 'Create strong, secure passwords.', descAr: 'إنشاء كلمات مرور قوية وآمنة.'
  },
  {
    id: 'speed', cat: 'productivity', icon: '🚀', status: 'added',
    title: 'Speed Test', titleAr: 'قياس السرعة',
    desc: 'Check your internet latency/speed.', descAr: 'فحص سرعة استجابة الإنترنت لديك.'
  },

  // Content
  {
    id: 'social-sizes', cat: 'content', icon: '📱', status: 'added',
    title: 'Social Media Sizes', titleAr: 'مقاسات السوشيال ميديا',
    desc: 'Check perfect dimensions for post & stories.', descAr: 'تعرف على المقاسات الصحيحة لمنشورات وقصص منصات التواصل.'
  },
  {
    id: 'caption', cat: 'content', icon: '✍️', status: 'added',
    title: 'Caption Templates', titleAr: 'قوالب العناوين',
    desc: 'Generate captions for social posts.', descAr: 'توليد عناوين لمنشورات التواصل الاجتماعي.'
  },
  {
    id: 'ideas', cat: 'content', icon: '💡', status: 'added',
    title: 'Content Ideas', titleAr: 'أفكار محتوى',
    desc: 'Get content pillars and weekly plans.', descAr: 'الحصول على أفكار وخطط أسبوعية للمحتوى.'
  },
  {
    id: 'proof', cat: 'content', icon: '🔎', status: 'added',
    title: 'Proofreading', titleAr: 'تدقيق لغوي',
    desc: 'Simple text checker for errors.', descAr: 'فحص بسيط للأخطاء اللغوية.'
  },

  // PDF
  {
    id: 'pdf-merge', cat: 'pdf', icon: '📎', status: 'added',
    title: 'Merge PDFs', titleAr: 'دمج ملفات PDF',
    desc: 'Combine multiple PDF files into one document.', descAr: 'دمج عدة ملفات PDF في ملف واحد.'
  },
  {
    id: 'pdf-split', cat: 'pdf', icon: '✂️', status: 'added',
    title: 'Split PDF', titleAr: 'تقسيم PDF',
    desc: 'Extract pages or split a file into multiple PDFs.', descAr: 'استخراج صفحات أو تقسيم ملف إلى عدة ملفات.'
  },
  {
    id: 'pdf-compress', cat: 'pdf', icon: '📉', status: 'added',
    title: 'Compress PDF', titleAr: 'ضغط PDF',
    desc: 'Reduce file size while keeping quality.', descAr: 'تقليل حجم الملف مع الحفاظ على الجودة.'
  },
  {
    id: 'pdf-to-img', cat: 'pdf', icon: '🖼️',
    title: 'PDF to Images', titleAr: 'تحويل PDF لصور',
    desc: 'Convert PDF pages to PNG or JPG images.', descAr: 'تحويل صفحات PDF إلى صور PNG أو JPG.'
  },
  {
    id: 'img-to-pdf', cat: 'pdf', icon: '📄',
    title: 'Images to PDF', titleAr: 'صور إلى PDF',
    desc: 'Convert multiple images into a single PDF.', descAr: 'تحويل مجموعة صور إلى ملف PDF واحد.'
  },
  {
    id: 'pdf-page-num', cat: 'pdf', icon: '🔢',
    title: 'Add Page Numbers', titleAr: 'أرقام الصفحات',
    desc: 'Add page numbers to your document.', descAr: 'إضافة أرقام الصفحات إلى ملفك.'
  },
  {
    id: 'pdf-rotate', cat: 'pdf', icon: '🔄',
    title: 'Rotate Pages', titleAr: 'تدوير الصفحات',
    desc: 'Rotate PDF pages permanently.', descAr: 'تدوير صفحات PDF بشكل دائم.'
  },
  {
    id: 'pdf-watermark', cat: 'pdf', icon: '💧',
    title: 'Add Watermark', titleAr: 'إضافة علامة مائية',
    desc: 'Stamp text or image on PDF pages.', descAr: 'إضافة نص أو صورة كعلامة مائية.'
  },
  {
    id: 'pdf-protect', cat: 'pdf', icon: '🔒',
  },
  {
    id: 'pdf-protect', cat: 'pdf', icon: '🔒',
    title: 'Protect PDF', titleAr: 'حماية PDF',
    desc: 'Encrypt PDF with a password.', descAr: 'تشفير ملف PDF بكلمة مرور.'
  },
  {
    id: 'pdf-unlock', cat: 'pdf', icon: '🔓',
    title: 'Unlock PDF', titleAr: 'فك حماية PDF',
    desc: 'Remove password from PDF (if known).', descAr: 'إزالة كلمة المرور من ملف PDF (إذا كنت تعرفها).'
  },
  {
    id: 'pdf-rem', cat: 'pdf', icon: '🧹', status: 'added',
    title: 'Remove Pages', titleAr: 'حذف صفحات',
    desc: 'Delete specific pages from PDF.', descAr: 'حذف صفحات محددة من الملف.'
  },
  {
    id: 'pdf-ord', cat: 'pdf', icon: '🔃', status: 'added',
    title: 'Reorder Pages', titleAr: 'ترتيب الصفحات',
    desc: 'Rearrange page order.', descAr: 'إعادة ترتيب صفحات الملف.'
  },
  {
    id: 'pdf-crop', cat: 'pdf', icon: '✂️', status: 'added',
    title: 'Crop Pages', titleAr: 'قص الصفحات',
    desc: 'Trim margins from PDF pages.', descAr: 'قص الهوامش من الصفحات.'
  },

  // Image Tools
  {
    id: 'img-compress', cat: 'image', icon: '📉', status: 'added',
    title: 'Image Compressor', titleAr: 'ضغط الصور',
    desc: 'Compress JPG/PNG/WebP images.', descAr: 'ضغط ملفات الصور مع الحفاظ على الجودة.'
  },
  {
    id: 'img-resize', cat: 'image', icon: '📏', status: 'added',
    title: 'Image Resizer', titleAr: 'تغيير الحجم',
    desc: 'Resize images by pixels.', descAr: 'تغيير أبعاد الصورة بالبكسل.'
  },
  {
    id: 'img-webp', cat: 'image', icon: '⚡', status: 'added',
    title: 'Convert to WebP', titleAr: 'تحويل لـ WebP',
    desc: 'Convert images to modern WebP format.', descAr: 'تحويل الصور لصيغة WebP الحديثة.'
  },
  {
    id: 'img-bg', cat: 'image', icon: '🎭', status: 'added',
    title: 'Remove Background', titleAr: 'إزالة الخلفية',
    desc: 'Remove image backgrounds (Link).', descAr: 'إزالة خلفية الصورة (رابط خارجي).'
  },
  {
    id: 'img-heic', cat: 'image', icon: '🍏', status: 'added',
    title: 'HEIC to JPG', titleAr: 'HEIC إلى JPG',
    desc: 'Convert iPhone photos to JPG.', descAr: 'تحويل صور الآيفون إلى JPG.'
  },
  {
    id: 'img-social', cat: 'image', icon: '🤳', status: 'added',
    title: 'Social Post Prep', titleAr: 'تجهيز صور التواصل',
    desc: 'Crop/Fit images for social media.', descAr: 'قص وتجهيز الصور لمنصات التواصل.'
  },
  {
    id: 'img-border', cat: 'image', icon: '🖼️', status: 'added',
    title: 'Add Frame', titleAr: 'إضافة إطار',
    desc: 'Add shadow and border to screenshots.', descAr: 'إضافة ظل وإطار للقطات الشاشة.'
  },
  {
    id: 'img-meta', cat: 'image', icon: '🕵️', status: 'added',
    title: 'Remove Metadata', titleAr: 'حذف البيانات الوصفية',
    desc: 'Strip EXIF data from photos.', descAr: 'مسح بيانات EXIF من الصور.'
  },

  // Developer
  {
    id: 'dev-json', cat: 'developer', icon: '{}', status: 'added',
    title: 'JSON Formatter', titleAr: 'منسق JSON',
    desc: 'Format, validate, and minify JSON.', descAr: 'تنسيق والتحقق من أكواد JSON.'
  },
  {
    id: 'dev-base64', cat: 'developer', icon: '64', status: 'added',
    title: 'Base64 Encoder', titleAr: 'ترميز Base64',
    desc: 'Encode and Decode Base64 strings.', descAr: 'ترميز وفك ترميز نصوص Base64.'
  },
  {
    id: 'dev-hash', cat: 'developer', icon: '#', status: 'added',
    title: 'Hash Generator', titleAr: 'مولد الهاش',
    desc: 'SHA-256, SHA-1, MD5 generator.', descAr: 'توليد رموز التشفير (Hash).'
  },
  {
    id: 'dev-url', cat: 'developer', icon: '🔗', status: 'added',
    title: 'URL Encoder', titleAr: 'ترميز الروابط',
    desc: 'Encode/Decode URL parameters.', descAr: 'ترميز وتصحيح الروابط.'
  },
  {
    id: 'dev-regex', cat: 'developer', icon: '.*', status: 'added',
    title: 'Regex Tester', titleAr: 'فاحص Regex',
    desc: 'Test regular expressions.', descAr: 'اختبار التعابير المنطقية.'
  },
  {
    id: 'dev-diff', cat: 'developer', icon: '⚖️', status: 'added',
    title: 'Diff Checker', titleAr: 'مقارنة النصوص',
    desc: 'Compare two texts for differences.', descAr: 'مقارنة الاختلافات بين نصين.'
  },

  // Saudi Tools
  {
    id: 'saudi-eos', cat: 'saudi', icon: '🇸🇦', status: 'added',
    title: 'End of Service', titleAr: 'مكافأة نهاية الخدمة',
    desc: 'Calculate KSA End of Service reward.', descAr: 'حساب مكافأة نهاية الخدمة حسب القانون السعودي.'
  },
  {
    id: 'saudi-leave', cat: 'saudi', icon: '✈️', status: 'added',
    title: 'Leave Calculator', titleAr: 'حاسبة الإجازات',
    desc: 'Calculate return date from leave.', descAr: 'حساب تاريخ العودة من الإجازة.'
  },

  // New Text/Prod
  {
    id: 'text-link', cat: 'text', icon: '🔗', status: 'added',
    title: 'Link Extractor', titleAr: 'استخراج الروابط',
    desc: 'Extract URLs from text.', descAr: 'استخراج الروابط من النصوص.'
  },
  {
    id: 'text-punc', cat: 'text', icon: '،', status: 'added',
    title: 'Arabic Punctuation', titleAr: 'ترقيم عربي',
    desc: 'Fix Arabic commas and quotes.', descAr: 'تصحيح الفواصل وعلامات التنصيص العربية.'
  },
  {
    id: 'text-dia', cat: 'text', icon: 'ً', status: 'added',
    title: 'Remove Tashkeel', titleAr: 'إزالة التشكيل',
    desc: 'Remove diacritics from Arabic text.', descAr: 'حذف الحركات والتشكيل من النص.'
  },
  {
    id: 'prod-iban', cat: 'productivity', icon: '💳', status: 'added',
    title: 'IBAN Validator', titleAr: 'فاحص الآيبان',
    desc: 'Validate Saudi IBAN format.', descAr: 'التحقق من صحة رقم الآيبان السعودي.'
  },
  {
    id: 'prod-inv', cat: 'productivity', icon: '🧾', status: 'added',
    title: 'Invoice Generator', titleAr: 'صانع الفواتير',
    desc: 'Simple invoice for printing.', descAr: 'فاتورة بسيطة جاهزة للطباعة.'
  },
  {
    id: 'pdf-extract-text', cat: 'pdf', icon: '📝', status: 'added',
    title: 'Extract Text', titleAr: 'استخراج النصوص',
    desc: 'Extract all text from PDF.', descAr: 'استخراج جميع النصوص من ملف PDF.'
  },
  {
    id: 'pdf-extract-imgs', cat: 'pdf', icon: '🖼️', status: 'added',
    title: 'Extract Images', titleAr: 'استخراج الصور',
    desc: 'Extract all images from PDF.', descAr: 'استخراج جميع الصور من ملف PDF.'
  },
];

// Translations
const translations = {
  en: {
    nav_tools: "Tools",
    nav_categories: "Categories",
    nav_about: "About",
    hero_title: "Smart tools for<br><span style='color:var(--accent-pink);'>everyday use</span>",
    hero_sub: "A premium collection of essential utilities for finance, productivity, and content creation. Free for everyone.",
    hero_cta: "Explore Tools",
    cat_title: "Explore by Category",
    cat_finance: "Finance",
    cat_time: "Time",
    cat_text: "Text",
    cat_prod: "Productivity",
    cat_content: "Content",
    cat_pdf: "PDF Tools",
    cat_image: "Image Tools",
    cat_developer: "Developer",
    cat_saudi: "Saudi Utils",
    all_tools: "All Tools",
    search_placeholder: "Search for tools..."
  },
  ar: {
    nav_tools: "الأدوات",
    nav_categories: "الفئات",
    nav_about: "عن الموقع",
    hero_title: "أدوات ذكية<br><span style='color:var(--accent-pink);'>لاستخدامك اليومي</span>",
    hero_sub: "مجموعة متميزة من الأدوات الأساسية للمالية والإنتاجية وصناعة المحتوى. مجانية للجميع.",
    hero_cta: "تصفح الأدوات",
    cat_title: "تصفح حسب الفئة",
    cat_finance: "المالية",
    cat_time: "الوقت",
    cat_text: "نصوص",
    cat_prod: "الإنتاجية",
    cat_content: "محتوى",
    cat_pdf: "أدوات PDF",
    cat_image: "صور",
    cat_developer: "للمبرمجين",
    cat_saudi: "خدمات سعودية",
    all_tools: "جميع الأدوات",
    search_placeholder: "ابحث عن أداة..."
  }
};

// State
let displayTools = [...tools];


// DOM Elements
const grid = document.getElementById('toolsGrid');
const searchInput = document.getElementById('searchInput');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const langToggle = document.getElementById('langToggle');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderTools();

  // Search Listener
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    displayTools = tools.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.desc.toLowerCase().includes(query)
    );
    renderTools();
    renderTools();
  });

  // Language Toggle
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
    // Init from local storage
    if (localStorage.getItem('rayyan_lang') === 'ar') {
      toggleLanguage(true); // force set without saving again needed? actually toggleLanguage toggles, so we need a set function or just check logic.
      // Better to just set it directly on load if checking storage, but reuse function if smart.
      // Let's make toggleLanguage handle 'target' or just simple toggle.
      // Simplest: Check storage, if AR, apply AR.
    }
  }
});

// RTL Logic
function toggleLanguage(forceAr = false) {
  const html = document.documentElement;
  const isRTL = html.getAttribute('dir') === 'rtl';

  if (forceAr === true || !isRTL) {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    langToggle.innerText = 'EN';
    localStorage.setItem('rayyan_lang', 'ar');
    updateTextContent('ar');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
    langToggle.innerText = 'عربي';
    localStorage.setItem('rayyan_lang', 'en');
    updateTextContent('en');
  }
}

function updateTextContent(lang) {
  // Update UI Elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      // Use innerHTML for keys that might have HTML (like hero_title)
      if (key === 'hero_title') el.innerHTML = translations[lang][key];
      else el.innerText = translations[lang][key];
    }
  });

  // Update Search Placeholder
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = translations[lang]['search_placeholder'];
  }

  // Re-render tools to update titles/descs
  renderTools();
}

// Render Grid
function renderTools() {
  grid.innerHTML = '';

  if (displayTools.length === 0) {
    grid.innerHTML = '<p style="color:#aaa; text-align:center; grid-column:1/-1;">No tools found.</p>';
    return;
  }

  const isAr = document.documentElement.getAttribute('lang') === 'ar';

  grid.innerHTML = displayTools.map(tool => {
    const title = isAr && tool.titleAr ? tool.titleAr : tool.title;
    const desc = isAr && tool.descAr ? tool.descAr : tool.desc;
    const actionText = isAr ? 'فتح الأداة' : 'Open Tool';

    return `
      <div class="glass-panel tool-card" onclick="openModal('${tool.id}')">
        <div class="tool-icon">${tool.icon}</div>
        <div>
          <div class="tool-title">${title}</div>
          <div class="tool-desc">${desc}</div>
        </div>
        <button class="tool-action">${actionText}</button>
      </div>
    `;
  }).join('');

  // Update Total Count
  updateTotalToolsCount(displayTools.length);

  // Debug/Inventory Console Log
  console.log(`Rendered ${displayTools.length} tools.`);
}

function updateTotalToolsCount(count) {
  const totalCountEl = document.getElementById('totalToolsCount');
  if (totalCountEl) {
    const isAr = document.documentElement.getAttribute('lang') === 'ar';
    totalCountEl.innerText = isAr ? `${count} أداة` : `${count} Tools`;
  } else {
    // If totalToolsCount element doesn't exist, try to inject it near the "All Tools" category button
    const allToolsButton = document.querySelector('.category-filter-btn[data-category="all"]');
    if (allToolsButton && !document.getElementById('dynTotalToolsCount')) {
      const countSpan = document.createElement('span');
      countSpan.id = 'dynTotalToolsCount';
      countSpan.style.marginLeft = '8px';
      countSpan.style.padding = '2px 8px';
      countSpan.style.backgroundColor = 'var(--accent-pink)';
      countSpan.style.borderRadius = '12px';
      countSpan.style.fontSize = '0.8em';
      countSpan.style.color = 'white';
      countSpan.style.fontWeight = 'bold';
      allToolsButton.appendChild(countSpan);
      updateTotalToolsCount(count); // Call again to set text on the newly created element
    }
  }
}


// Category Filter
function filterTools(category) {
  if (category === 'all') {
    displayTools = [...tools];
  } else {
    displayTools = tools.filter(t => t.cat === category);
  }
  document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
  renderTools();
}

// Modal Logic
function openModal(toolId) {
  const tool = tools.find(t => t.id === toolId);
  if (!tool) return;

  modalTitle.textContent = tool.title;
  // Routing to specific modules based on ID prefix or cat
  const category = tool.cat; // Get category from the found tool
  if (toolId.startsWith('loan') || toolId.startsWith('vat') || toolId.startsWith('net') || toolId.startsWith('curr') || toolId.startsWith('sav') || toolId === 'zakat') {
    if (toolId === 'loan-calc') FinanceTools.renderLoanCalc(modalBody);
    else if (toolId === 'vat-calc') FinanceTools.renderVAT(modalBody);
    else if (toolId === 'net-salary') FinanceTools.renderSalary(modalBody);
    else if (toolId === 'currency') FinanceTools.renderCurrency(modalBody);
    else if (toolId === 'savings') FinanceTools.renderSavings(modalBody);
    else if (toolId === 'zakat') FinanceTools.renderZakat(modalBody);
  }
  else if (category === 'time') {
    if (toolId === 'hijri') TimeTools.renderHijri(modalBody);
    else if (toolId === 'diff') TimeTools.renderDiff(modalBody);
    else if (toolId === 'timer') TimeTools.renderTimer(modalBody);
    else if (toolId === 'timezone') TimeTools.renderZone(modalBody);
  }
  else if (category === 'text') {
    if (toolId === 'adobe-fix') TextTools.renderAdobe(modalBody);
    else if (toolId === 'cleaner') TextTools.renderCleaner(modalBody);
    else if (toolId === 'case') TextTools.renderCase(modalBody);
    else if (toolId === 'hashtag') TextTools.renderHashtag(modalBody);
    else if (toolId === 'utm') TextTools.renderUTM(modalBody);
    else if (toolId === 'text-link') TextTools.renderLinks(modalBody);
    else if (toolId === 'text-punc') TextTools.renderPunc(modalBody);
    else if (toolId === 'text-dia') TextTools.renderTashkeel(modalBody);
  }
  else if (category === 'productivity') {
    if (toolId === 'qr') ProdTools.renderQR(modalBody);
    else if (toolId === 'unit') ProdTools.renderUnit(modalBody);
    else if (toolId === 'password') ProdTools.renderPass(modalBody);
    else if (toolId === 'speed') ProdTools.renderSpeed(modalBody);
    else if (toolId === 'prod-iban') ProdTools.renderIBAN(modalBody);
    else if (toolId === 'prod-inv') ProdTools.renderInvoice(modalBody);
  }
  else if (category === 'content') {
    if (toolId === 'social-sizes') ContentTools.renderSocial(modalBody);
    else if (toolId === 'caption') ContentTools.renderCaption(modalBody);
    else if (toolId === 'ideas') ContentTools.renderIdeas(modalBody);
    else if (toolId === 'proof') ContentTools.renderProof(modalBody);
  }
  else if (category === 'pdf') {
    if (toolId === 'pdf-merge') PDFTools.renderMerge(modalBody);
    else if (toolId === 'pdf-split') PDFTools.renderSplit(modalBody);
    else if (toolId === 'pdf-compress') PDFTools.renderCompress(modalBody);
    else if (toolId === 'pdf-to-img') PDFTools.renderToImages(modalBody);
    else if (toolId === 'img-to-pdf') PDFTools.renderToPDF(modalBody);
    else if (toolId === 'pdf-page-num') PDFTools.renderPageNum(modalBody);
    else if (toolId === 'pdf-rotate') PDFTools.renderRotate(modalBody);
    else if (toolId === 'pdf-watermark') PDFTools.renderWatermark(modalBody);
    else if (toolId === 'pdf-protect') PDFTools.renderProtect(modalBody);
    else if (toolId === 'pdf-unlock') PDFTools.renderUnlock(modalBody);
    else if (toolId === 'pdf-rem') PDFTools.renderRemPage(modalBody);
    else if (toolId === 'pdf-ord') PDFTools.renderOrder(modalBody);
    else if (toolId === 'pdf-crop') PDFTools.renderCrop(modalBody);
  }
  else if (category === 'image') {
    if (toolId === 'img-compress') ImageTools.renderCompress(modalBody);
    else if (toolId === 'img-resize') ImageTools.renderResize(modalBody);
    else if (toolId === 'img-webp') ImageTools.renderWebP(modalBody);
    else if (toolId === 'img-bg') ImageTools.renderRemoveBG(modalBody);
    else if (toolId === 'img-heic') ImageTools.renderHEIC(modalBody);
    else if (toolId === 'img-social') ImageTools.renderSocialImg(modalBody);
    else if (toolId === 'img-border') ImageTools.renderBorder(modalBody);
    else if (toolId === 'img-meta') ImageTools.renderMeta(modalBody);
  }
  else if (category === 'developer') {
    if (toolId === 'dev-json') DevTools.renderJson(modalBody);
    else if (toolId === 'dev-base64') DevTools.renderBase64(modalBody);
    else if (toolId === 'dev-hash') DevTools.renderHash(modalBody);
    else if (toolId === 'dev-url') DevTools.renderUrlEnc(modalBody);
    else if (toolId === 'dev-regex') DevTools.renderRegex(modalBody);
    else if (toolId === 'dev-diff') DevTools.renderDiff(modalBody);
  }
  else if (category === 'saudi') {
    if (toolId === 'saudi-eos') SaudiTools.renderEOS(modalBody);
    else if (toolId === 'saudi-leave') SaudiTools.renderLeave(modalBody);
  }

  else {
    // Fallback
    modalBody.innerHTML = `<div style="text-align:center; padding:40px; color:#aaa;">Feature coming soon: ${tool.title} module logic.</div>`;
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on outside click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// About Modal
window.openAbout = function () {
  modalTitle.innerText = "About Rayyan Portal";

  const isAr = document.documentElement.dir === 'rtl';
  const content = isAr ?
    `
    <div style="text-align:center; padding:20px;">
      <h2 style="margin-bottom:16px;">مرحباً بك في بوابة ريان</h2>
      <p style="color:var(--text-secondary); margin-bottom:24px;">
        منصة أدوات متميزة مصممة خصيصاً للمستخدمين في المملكة العربية السعودية.
        <br>مجانية بالكامل ومفتوحة المصدر.
      </p>
      <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px;">
        <strong>الإصدار 2.0</strong>
        <br><span style="font-size:12px; opacity:0.7;">تم التطوير باستخدام HTML/CSS/JS النقي</span>
      </div>
    </div>
    `
    :
    `
    <div style="text-align:center; padding:20px;">
      <h2 style="margin-bottom:16px;">Welcome to Rayyan Portal</h2>
      <p style="color:var(--text-secondary); margin-bottom:24px;">
        A premium suite of essential utilities designed for Saudi users.
        <br>Completely free and open source.
      </p>
      <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px;">
        <strong>Version 2.0</strong>
        <br><span style="font-size:12px; opacity:0.7;">Built with Vanilla HTML/CSS/JS</span>
      </div>
    </div>
    `;

  modalBody.innerHTML = content;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Expose filterTools if not already (it might be needed for onclicks in HTML)
window.filterTools = function (category) {
  if (category === 'all') {
    displayTools = [...tools];
  } else {
    displayTools = tools.filter(t => t.cat === category);
  }
  // Optional: Scroll to tools
  document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
  renderTools();
};
