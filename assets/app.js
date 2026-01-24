import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc, increment, setDoc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tool Data Definitions
// Status: 'existing' or 'added'
// Tool Data Definitions
import { defaultTools } from './tools-data.js';

let tools = [...defaultTools];

async function fetchTools() {
  try {
    const querySnapshot = await getDocs(collection(db, "tools"));
    if (!querySnapshot.empty) {
      const fetchedTools = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.hidden) {
          fetchedTools.push(data);
        }
      });
      tools = fetchedTools;
      displayTools = [...tools];
      renderTools();
      console.log("Tools fetched from Firebase:", tools.length);
    } else {
      console.log("No tools in Firebase, using defaults.");
    }
  } catch (e) {
    console.error("Error fetching tools:", e);
  }
}


// Translations
const translations = {
  en: {
    nav_tools: "Tools",
    nav_home: "Home",
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
    cat_education: "Education",
    cat_languages: "Languages",
    cat_sports: "Sports",
    cat_pdf: "PDF Tools",
    cat_image: "Image Tools",
    cat_health: "Health",
    cat_developer: "Developer",
    cat_saudi: "Saudi Utils",
    cat_favorites: "Favorites",
    filter_all: "All",
    filter_fav: "⭐ Favorites",
    all_tools: "All Tools",
    search_placeholder: "Search for tools...",
    about_title: "About Ri88 Portal",
    about_desc: "A premium suite of essential utilities designed for Saudi users.<br>We aim to provide fast, secure, and free tools for everyone.",
    about_mission_title: "Our Mission",
    about_mission_desc: "Ri88 was built to simplify everyday digital tasks. From calculating VAT and loans to converting files and editing images, we bring everything into one unified, beautiful interface.",
    about_version: "Version 2.0",
    about_tech: "Built with Vanilla HTML/CSS/JS",
    download_title: "Get the Android App",
    download_desc: "Download the official Ri88 Portal app for a faster, full-screen experience on your Android device.",
    download_note: "Direct APK Download",
    footer_copy: "© 2026 Ri88 Portal. Made for Saudi Users."
  },
  ar: {
    nav_tools: "الأدوات",
    nav_home: "الرئيسية",
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
    cat_education: "التعليم",
    cat_languages: "لغات",
    cat_sports: "رياضة",
    cat_pdf: "أدوات PDF",
    cat_image: "صور",
    cat_health: "صحة",
    cat_developer: "للمبرمجين",
    cat_saudi: "خدمات سعودية",
    cat_favorites: "المفضلة",
    filter_all: "الكل",
    filter_fav: "⭐ المفضلة",
    all_tools: "جميع الأدوات",
    search_placeholder: "ابحث عن أداة...",
    about_title: "عن بوابة ريان",
    about_desc: "مجموعة متميزة من الأدوات الأساسية المصممة للمستخدمين في السعودية.<br>نسعى لتوفير أدوات سريعة، آمنة، ومجانية للجميع.",
    about_mission_title: "رسالتنا",
    about_mission_desc: "تم بناء Ri88 لتبسيط المهام الرقمية اليومية. من حساب الضريبة والقروض إلى تحويل الملفات وتعديل الصور، نجمع كل شيء في واجهة موحدة وجميلة.",
    about_version: "الإصدار 2.0",
    about_tech: "تم البناء باستخدام HTML/CSS/JS المطور",
    download_title: "حمل تطبيق الأندرويد",
    download_desc: "حمل تطبيق بوابة ريان الرسمي لتجربة أسرع وشاشة كاملة على جهاز الأندرويد الخاص بك.",
    download_note: "تحميل مباشر لملف APK",
    footer_copy: "© 2026 بوابة ريان. صُنع بفخر للمستخدمين في السعودية."
  }
};

// State
let displayTools = [...tools];
let favorites = JSON.parse(localStorage.getItem('rayyan_favs')) || [];

window.toggleFavorite = function (e, toolId) {
  e.stopPropagation();
  if (favorites.includes(toolId)) {
    favorites = favorites.filter(id => id !== toolId);
  } else {
    favorites.push(toolId);
  }
  localStorage.setItem('rayyan_favs', JSON.stringify(favorites));
  renderTools();

  // Simple animation feedback
  const btn = e.currentTarget;
  if (btn) {
    btn.style.transform = "scale(1.2)";
    setTimeout(() => btn.style.transform = "scale(1)", 200);
  }
};


// DOM Elements
const grid = document.getElementById('toolsGrid');
const searchInput = document.getElementById('searchInput');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const langToggle = document.getElementById('langToggle');

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Check Maintenance Mode
  try {
    const maintSnap = await getDoc(doc(db, "config", "maintenance"));
    if (maintSnap.exists() && maintSnap.data().active) {
      document.body.innerHTML = `
              <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0f0f13; color:white; font-family:sans-serif; text-align:center;">
                  <h1 style="font-size:3em; margin-bottom:10px;">🚧</h1>
                  <h2>Under Maintenance</h2>
                  <p style="color:#aaa;">We are improving the site. Please come back later.</p>
              </div>
          `;
      return; // Stop execution
    }
  } catch (e) {
    console.warn("Maintenance check failed:", e);
  }
}

  // 2. Apply Dynamic Theme
  try {
  const themeSnap = await getDoc(doc(db, "config", "theme"));
  if (themeSnap.exists()) {
    const t = themeSnap.data();
    if (t.primary) document.documentElement.style.setProperty('--accent-purple', t.primary);
    if (t.secondary) document.documentElement.style.setProperty('--accent-pink', t.secondary);
  }
} catch (e) {
  console.warn("Theme load failed:", e);
}

// Only render tools if the grid exists (tools.html)
if (grid) {
  // Check for URL query params (e.g. ?cat=finance)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  // Render Initial View
  if (window.location.pathname.includes('admin')) {
    // Do not run main app logic on admin page
  } else {
    if (typeof displayTools !== 'undefined') { // Safety check
      if (catParam) {
        filterTools(catParam);
      } else {
        renderTools();
      }
      fetchTools();
      trackVisit();
    }
  }
}



// Search Listener
let searchDebounce;
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    displayTools = tools.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.desc.toLowerCase().includes(query)
    );
    renderTools();

    // Analytics: Log Failed Search
    clearTimeout(searchDebounce);
    if (displayTools.length === 0 && query.length > 3) {
      searchDebounce = setTimeout(() => {
        try {
          addDoc(collection(db, 'stats_search'), {
            term: query,
            timestamp: new Date()
          });
        } catch (e) {
          console.warn("Analytics error:", e);
        }
      }, 2000);
    }
  });
}

// Language Toggle
if (langToggle) {
  langToggle.addEventListener('click', () => toggleLanguage());
  // Init from local storage
  if (localStorage.getItem('rayyan_lang') === 'ar') {
    toggleLanguage(true);
  }
}

// Check for Announcements
checkForBanner();
});

// Announcement Logic
async function checkForBanner() {
  try {
    const docRef = doc(db, "config", "announcement");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.active && data.text) {
        const banner = document.createElement('div');
        banner.className = 'announcement-banner';
        banner.innerText = data.text;
        document.body.prepend(banner);
      }
    }
  } catch (e) {
    console.warn("Banner check failed:", e);
  }
}

// Dynamic Categories
async function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  try {
    const snap = await getDocs(collection(db, "categories"));
    if (snap.empty) {
      return;
    }

    const isAr = document.documentElement.getAttribute('lang') === 'ar';
    snap.forEach(doc => {
      const c = doc.data();
      const a = document.createElement('a');
      a.href = `tools.html?cat=${c.id}`;
      a.className = 'glass-panel cat-card';
      a.style.textDecoration = 'none';
      a.style.display = 'block';
      a.style.color = 'inherit';
      a.innerHTML = `
                <i data-lucide="${c.icon || 'box'}" class="cat-icon" style="color:var(--accent-purple)"></i>
                <span>${isAr ? c.nameAr : c.name}</span>
            `;
      grid.appendChild(a);
    });

    // Refresh icons
    setTimeout(() => {
      if (window.lucide) window.lucide.createIcons();
    }, 500);

  } catch (e) {
    console.warn("Category render error:", e);
  }
}

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
      // Use innerHTML for keys that might have HTML (like hero_title)
      if (key === 'hero_title' || key === 'about_desc') el.innerHTML = translations[lang][key];
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
  if (!grid) return; // Prevent crash on admin page

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
    const isFav = favorites.includes(tool.id);
    const heartStyle = isFav ? "fill:var(--accent-pink); color:var(--accent-pink);" : "color:rgba(255,255,255,0.3);";

    return `
      <div class="glass-panel tool-card animated-card" onclick="openModal('${tool.id}')" style="position:relative;">
        <div class="bg-blob"></div>
        <div class="card-content-wrapper">
            <button onclick="toggleFavorite(event, '${tool.id}')" 
                    style="position:absolute; top:15px; right:15px; background:none; border:none; cursor:pointer; z-index:5;">
                <i data-lucide="heart" style="width:20px; height:20px; ${heartStyle}"></i>
            </button>
            <div class="tool-icon animated-icon"><i data-lucide="${tool.icon}"></i></div>
            <div>
              <div class="tool-title">${title}</div>
              <div class="tool-desc">${desc}</div>
            </div>
            
            <div class="card-hover-reveal">
                <button class="tool-action btn-secondary" style="width:100%; margin-top:0; font-size:14px; padding:8px;">${actionText}</button>
            </div>
        </div>
      </div>
    `;
  }).join('');

  // Update Total Count
  updateTotalToolsCount(displayTools.length);

  // Initialize Icons
  if (window.lucide) {
    window.lucide.createIcons();
  } else if (window.Lucide) {
    window.Lucide.createIcons();
  } else {
    // Retry if script loaded late
    setTimeout(() => {
      if (window.lucide) window.lucide.createIcons();
      else if (window.Lucide) window.Lucide.createIcons();
    }, 500);
    setTimeout(() => {
      if (window.lucide) window.lucide.createIcons();
      else if (window.Lucide) window.Lucide.createIcons();
    }, 2000);
  }

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
  const toolsSection = document.getElementById('tools');
  if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth' });
  renderTools();
}

// Modal Logic
window.openModal = function (toolId) {
  const tool = tools.find(t => t.id === toolId);
  if (!tool) return;

  // Analytics: Increment View
  try {
    updateDoc(doc(db, 'tools', toolId), {
      views: increment(1)
    });
  } catch (e) {
    console.warn("Analytics error:", e);
  }

  const isAr = document.documentElement.getAttribute('lang') === 'ar';
  if (modalTitle) modalTitle.textContent = isAr && tool.titleAr ? tool.titleAr : tool.title;
  // Routing to specific modules based on ID prefix or cat
  const category = tool.cat; // Get category from the found tool
  if (toolId.startsWith('loan') || toolId.startsWith('vat') || toolId.startsWith('net') || toolId.startsWith('curr') || toolId.startsWith('sav') || toolId === 'zakat' || toolId.startsWith('fin-')) {
    if (toolId === 'loan-calc') FinanceTools.renderLoanCalc(modalBody);
    else if (toolId === 'vat-calc') FinanceTools.renderVAT(modalBody);
    else if (toolId === 'net-salary') FinanceTools.renderSalary(modalBody);
    else if (toolId === 'currency') FinanceTools.renderCurrency(modalBody);
    else if (toolId === 'savings') FinanceTools.renderSavings(modalBody);
    else if (toolId === 'zakat') FinanceTools.renderZakat(modalBody);
    else if (toolId === 'fin-discount') FinanceTools.renderDiscount(modalBody);
  }
  else if (category === 'time') {
    if (toolId === 'hijri') TimeTools.renderHijri(modalBody);
    else if (toolId === 'diff') TimeTools.renderDiff(modalBody);
    else if (toolId === 'timer') TimeTools.renderTimer(modalBody);
    else if (toolId === 'timezone') TimeTools.renderZone(modalBody);
    else if (toolId === 'time-add') TimeTools.renderDateAdd(modalBody);
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
    else if (toolId === 'text-lorem') TextTools.renderLorem(modalBody);
  }
  else if (category === 'productivity') {
    if (toolId === 'qr') ProdTools.renderQR(modalBody);
    else if (toolId === 'unit') ProdTools.renderUnit(modalBody);
    else if (toolId === 'password') ProdTools.renderPass(modalBody);
    else if (toolId === 'speed') ProdTools.renderSpeed(modalBody);
    else if (toolId === 'prod-iban') ProdTools.renderIBAN(modalBody);
    else if (toolId === 'prod-inv') ProdTools.renderInvoice(modalBody);
    else if (toolId === 'prod-pomodoro') ProdTools.renderPomodoro(modalBody);
    else if (toolId === 'life-bill') LifeTools.renderBill(modalBody);
    else if (toolId === 'life-decision') LifeTools.renderDecision(modalBody);
    else if (toolId === 'life-tip') LifeTools.renderTip(modalBody);
    else if (toolId === 'life-reaction') LifeTools.renderReaction(modalBody);
  }
  else if (category === 'content') {
    if (toolId === 'social-sizes') ContentTools.renderSocial(modalBody);
    else if (toolId === 'caption') ContentTools.renderCaption(modalBody);
    else if (toolId === 'ideas') ContentTools.renderIdeas(modalBody);
    else if (toolId === 'proof') ContentTools.renderProof(modalBody);
    else if (toolId === 'media-rec') MediaTools.renderRecorder(modalBody);
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
    else if (toolId === 'pdf-extract-text') PDFTools.renderExt(modalBody);
    else if (toolId === 'pdf-extract-imgs') PDFTools.renderExt(modalBody);
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
    else if (toolId === 'image-palette') ImageTools.renderPalette(modalBody);
    else if (toolId === 'img-meme') ImageTools.renderMeme(modalBody);
    else if (toolId === 'img-crop') ImageTools.renderCropper(modalBody);
    else if (toolId === 'img-filter') ImageTools.renderFilters(modalBody);
  }
  else if (category === 'developer') {
    if (toolId === 'dev-json') DevTools.renderJson(modalBody);
    else if (toolId === 'dev-base64') DevTools.renderBase64(modalBody);
    else if (toolId === 'dev-hash') DevTools.renderHash(modalBody);
    else if (toolId === 'dev-url') DevTools.renderUrlEnc(modalBody);
    else if (toolId === 'dev-regex') DevTools.renderRegex(modalBody);
    else if (toolId === 'dev-diff') DevTools.renderDiff(modalBody);
    else if (toolId === 'dev-screen') DevTools.renderScreenInfo(modalBody);
    else if (toolId === 'dev-jwt') DevTools.renderJWT(modalBody);
    else if (toolId === 'dev-sql') DevTools.renderSQL(modalBody);
    else if (toolId === 'dev-chmod') DevTools.renderChmod(modalBody);
    else if (toolId === 'dev-cron') DevTools.renderCron(modalBody);
    else if (toolId === 'dev-curl') DevTools.renderCurl(modalBody);
    else if (toolId === 'dev-ua') DevTools.renderUA(modalBody);
    else if (toolId === 'dev-meta') DevTools.renderMeta(modalBody);
    else if (toolId === 'dev-fav') DevTools.renderFavicon(modalBody);
    else if (toolId === 'dev-svg') DevTools.renderSVG(modalBody);
    else if (toolId === 'dev-md') DevTools.renderMarkdown(modalBody);

    // Design Tools routed here
    else if (toolId === 'des-grad') DesignTools.renderGradient(modalBody);
    else if (toolId === 'des-shadow') DesignTools.renderShadow(modalBody);
    else if (toolId === 'des-contrast') DesignTools.renderContrast(modalBody);
  }
  else if (category === 'saudi') {
    if (toolId === 'saudi-eos') SaudiTools.renderEOS(modalBody);
    else if (toolId === 'saudi-leave') SaudiTools.renderLeave(modalBody);
    else if (toolId === 'text-tafqeet') SaudiTools.renderTafqeet(modalBody);
    else if (toolId === 'saudi-events') SaudiTools.renderEvents(modalBody);
    else if (toolId === 'saudi-holiday') SaudiTools.renderHijri(modalBody);
    else if (toolId === 'saudi-vacation') SaudiTools.renderVacationSal(modalBody);
  }
  else if (category === 'media') {
    if (toolId === 'media-rec') MediaTools.renderRecorder(modalBody);
    else if (toolId === 'media-gif') MediaTools.renderGif(modalBody);
    else if (toolId === 'media-mp3') MediaTools.renderVid2Mp3(modalBody);
  }
  else if (category === 'health') {
    if (toolId === 'health-bmi') HealthTools.renderBMI(modalBody);
    else if (toolId === 'health-bmr') HealthTools.renderBMR(modalBody);
    else if (toolId === 'health-water') HealthTools.renderWater(modalBody);
  }
  else if (category === 'education') {
    if (toolId === 'edu-gpa') EducationTools.renderGPA(modalBody);
    else if (toolId === 'edu-grade') EducationTools.renderGrade(modalBody);
  }
  else if (category === 'languages') {
    if (toolId === 'lang-trans') LangTools.renderTranslator(modalBody);
    else if (toolId === 'lang-ar-corr') LangTools.renderCorrector(modalBody);
    else if (toolId === 'lang-en-corr') LangTools.renderEnCorrector(modalBody);
    else if (toolId === 'lang-editor') LangTools.renderEditor(modalBody);
  }
  else if (category === 'sports') {
    if (toolId === 'sport-football') SportsTools.renderFootball(modalBody);
    else if (toolId === 'sport-basket') SportsTools.renderBasketball(modalBody);
    else if (toolId === 'sport-motor') SportsTools.renderMotorsport(modalBody);
    else if (toolId === 'sport-combat') SportsTools.renderCombat(modalBody);
    else if (toolId === 'sport-world') SportsTools.renderWorld(modalBody);
  }

  else {
    // Fallback
    modalBody.innerHTML = `<div style="text-align:center; padding:40px; color:#aaa;">Feature coming soon: ${tool.title} module logic.</div>`;
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scroll
}

if (modalOverlay) {
  window.closeModal = function () {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close on outside click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

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

// Expose filterTools 
window.filterTools = function (category) {
  // If we are on index.html (no tools grid), clicking a category should redirect to tools.html
  if (!grid) {
    window.location.href = `tools.html?cat=${category}`;
    return;
  }

  if (category === 'all') {
    displayTools = [...tools];
  } else if (category === 'favorites') {
    displayTools = tools.filter(t => favorites.includes(t.id));
  } else {
    displayTools = tools.filter(t => t.cat === category);
  }

  const toolsSection = document.getElementById('tools');
  if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth' });
  renderTools();
};

// Mobile Menu Logic
window.toggleMobileMenu = function () {
  const nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.toggle('active');
    if (nav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
};

// PWA Install Logic
let deferredPrompt;
const installBtn = document.getElementById('installAppBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  if (installBtn) {
    installBtn.classList.remove('hidden');

    installBtn.addEventListener('click', () => {
      // Hide our user interface that shows our A2HS button
      installBtn.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
    });
  }
});

// Add translation for install button
translations.en.install_app = "App";
translations.ar.install_app = "تطبيق";


// Analytics Tracking
async function trackVisit() {
  // Check if tracked in this session
  if (sessionStorage.getItem('visited_session')) return;

  try {
    const statsRef = doc(db, 'stats', 'general');
    const docSnap = await getDoc(statsRef);

    if (docSnap.exists()) {
      await updateDoc(statsRef, {
        visitors: increment(1)
      });
    } else {
      // First time setup
      await setDoc(statsRef, { visitors: 1 });
    }

    sessionStorage.setItem('visited_session', 'true');
    console.log('Visit tracked!');
  } catch (e) {
    console.warn('Tracking error (ignore if offline):', e);
  }
}


export { tools as defaultTools };
