import { collection, getDocs, doc, updateDoc, increment, setDoc, getDoc, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { db, auth } from './firebase-config.js';
import { defaultTools } from './tools-data.js';

// --- STATE ---
let tools = [...defaultTools];
let displayTools = [...tools];
let favorites = JSON.parse(localStorage.getItem('rayyan_favs')) || [];
let currentCategory = 'all';

// --- TRANSLATIONS ---
const translations = {
  en: {
    nav_tools: "Tools", nav_home: "Home", nav_categories: "Categories", nav_about: "About",
    hero_title: "Smart tools for<br><span style='color:var(--accent-pink);'>everyday use</span>",
    hero_sub: "A premium collection of essential utilities for finance, productivity, and content creation. Free for everyone.",
    hero_cta: "Explore Tools", cat_title: "Explore by Category",
    cat_finance: "Finance", cat_time: "Time", cat_text: "Text", cat_prod: "Productivity", cat_content: "Content",
    cat_education: "Education", cat_languages: "Languages", cat_sports: "Sports", cat_pdf: "PDF Tools",
    cat_image: "Image Tools", cat_health: "Health", cat_developer: "Developer", cat_saudi: "Saudi Utils",
    cat_favorites: "Favorites", filter_all: "All", filter_fav: "⭐ Favorites", all_tools: "All Tools",
    search_placeholder: "Search for tools...", about_title: "About Ri88 Portal",
    about_desc: "A premium suite of essential utilities designed for Saudi users.<br>We aim to provide fast, secure, and free tools for everyone.",
    about_mission_title: "Our Mission", about_mission_desc: "Ri88 was built to simplify everyday digital tasks.",
    about_version: "Version 2.0", about_tech: "Built with Vanilla HTML/CSS/JS",
    download_title: "Get the Android App", download_desc: "Download the official Ri88 Portal app.",
    download_note: "Direct APK Download", footer_copy: "© 2026 Ri88 Portal. Version v12.1",
    install_app: "App", nav_blog: "Blog",
    footer_explore: "Explore", footer_legal: "Legal", footer_updated: "Stay Updated",
    footer_all_tools: "All Tools", footer_magazine: "Magazine", footer_sports: "Live Sports", footer_about: "About Us",
    footer_privacy: "Privacy Policy", footer_terms: "Terms of Service", footer_cookie: "Cookie Policy", footer_contact: "Contact Support",
    footer_desc: "Ri88 is the leading digital toolbox for the modern Saudi creator. Trusted by over 10,000 users daily.",
    footer_email_ph: "Enter your email", footer_rights: "© 2026 Ri88 Portal. Made with ❤️ in Riyadh.",
    sports_title: "Live Scores", sports_waiting: "Waiting for API Data...", sports_switch: "Switch to Google View",
    hero_badge: "✨ The Future of Utilities", hero_magazine: "Read Magazine",
    ticker_label: "🔴 LIVE UPDATES",
    ticker_content: "🚀 <strong>Ri88 V14.0</strong> Launched! • 🏆 Al-Hilal wins 3-0 • 🤖 New AI Tools Added • 💡 \"How to build a habit\" article trending • 📅 Zakat Calculator updated for 2026"
  },
  ar: {
    nav_tools: "الأدوات", nav_home: "الرئيسية", nav_categories: "الفئات", nav_about: "عن الموقع",
    hero_title: "أدوات ذكية<br><span style='color:var(--accent-pink);'>لاستخدامك اليومي</span>",
    hero_sub: "مجموعة متميزة من الأدوات الأساسية للمالية والإنتاجية وصناعة المحتوى. مجانية للجميع.",
    hero_cta: "تصفح الأدوات", cat_title: "تصفح حسب الفئة",
    cat_finance: "المالية", cat_time: "الوقت", cat_text: "نصوص", cat_prod: "الإنتاجية", cat_content: "محتوى",
    cat_education: "التعليم", cat_languages: "لغات", cat_sports: "رياضة", cat_pdf: "أدوات PDF",
    cat_image: "صور", cat_health: "صحة", cat_developer: "للمبرمجين", cat_saudi: "خدمات سعودية",
    cat_favorites: "المفضلة", filter_all: "الكل", filter_fav: "⭐ المفضلة", all_tools: "جميع الأدوات",
    search_placeholder: "ابحث عن أداة...", about_title: "عن بوابة ريان",
    about_desc: "مجموعة متميزة من الأدوات الأساسية المصممة للمستخدمين في السعودية.<br>نسعى لتوفير أدوات سريعة، آمنة، ومجانية للجميع.",
    about_mission_title: "رسالتنا", about_mission_desc: "تم بناء Ri88 لتبسيط المهام الرقمية اليومية.",
    about_version: "الإصدار 2.0", about_tech: "تم البناء باستخدام HTML/CSS/JS المطور",
    download_title: "حمل تطبيق الأندرويد", download_desc: "حمل تطبيق بوابة ريان الرسمي لتجربة أسرع.",
    download_note: "تحميل مباشر لملف APK", footer_copy: "© 2026 بوابة ريان. الإصدار v12.1",
    install_app: "تطبيق", nav_blog: "المدونة",
    footer_explore: "اكتشف", footer_legal: "قانوني", footer_updated: "ابق على اطلاع",
    footer_all_tools: "جميع الأدوات", footer_magazine: "المجلة", footer_sports: "مباريات مباشر", footer_about: "من نحن",
    footer_privacy: "سياسة الخصوصية", footer_terms: "شروط الخدمة", footer_cookie: "سياسة الكوكيز", footer_contact: "اتصل بنا",
    footer_desc: "بوابة ريان هي صندوق الأدوات الرقمي الرائد للمبدع السعودي الحديث. يثق بنا أكثر من 10,000 مستخدم يومياً.",
    footer_email_ph: "أدخل بريدك الإلكتروني", footer_rights: "© 2026 بوابة ريان. صنع بـ ❤️ في الرياض.",
    sports_title: "نتائج مباشرة", sports_waiting: "جاري جلب البيانات...", sports_switch: "التبديل لعرض جوجل",
    hero_badge: "✨ مستقبل الأدوات الرقمية", hero_magazine: "تصفح المجلة",
    ticker_label: "🔴 تحديثات مباشرة",
    ticker_content: "🚀 <strong>إطلاق Ri88 V14.0</strong>! • 🏆 الهلال يفوز 3-0 • 🤖 تمت إضافة أدوات ذكاء اصطناعي جديدة • 💡 مقال \"كيف تبني عادة\" يتصدر الترند • 📅 تحديث حاسبة الزكاة لعام ٢٠٢٦"
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {

  // 1. Maintenance Check
  try {
    const maintSnap = await getDoc(doc(db, "config", "maintenance"));
    if (maintSnap.exists() && maintSnap.data().active) {
      document.body.innerHTML = `
                <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0f0f13; color:white; font-family:sans-serif; text-align:center;">
                    <h1 style="font-size:3em; margin-bottom:10px;">🚧</h1>
                    <h2>Under Maintenance</h2>
                    <p style="color:#aaa;">We are improving the site. Please come back later.</p>
                </div>`;
      return;
    }
  } catch (e) { console.warn("Maintenance check failed:", e); }

  // 2. Dynamic Theme
  try {
    const themeSnap = await getDoc(doc(db, "config", "theme"));
    if (themeSnap.exists()) {
      const t = themeSnap.data();
      if (t.primary) document.documentElement.style.setProperty('--accent-purple', t.primary);
      if (t.secondary) document.documentElement.style.setProperty('--accent-pink', t.secondary);
      // Custom CSS Injection (V12)
      if (t.customCSS) {
        const style = document.createElement('style');
        style.innerHTML = t.customCSS;
        document.head.appendChild(style);
      }
    }
  } catch (e) { console.warn("Theme load failed:", e); }

  // 3. Routing & Render
  const grid = document.getElementById('toolsGrid');
  if (grid) {
    if (!window.location.pathname.includes('admin')) {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('cat');
      if (catParam) filterTools(catParam);
      else renderTools();

      fetchTools(); // Async fetch updates
      trackVisit();
    }
  }

  // 4. Setup Listeners
  setupSearch();
  setupLanguage();
  checkForBanner();
  renderCategories(); // For Index page

  // 5. Authentication Logic
  const provider = new GoogleAuthProvider();
  const loginBtn = document.getElementById('loginBtn');

  if (loginBtn) {
    // Auth State Listener
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        loginBtn.innerText = `Hi, ${user.displayName.split(' ')[0]}`;
        loginBtn.onclick = () => signOut(auth);

        // Sync Favorites from Cloud
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const cloudFavs = userDoc.data().favorites || [];
          favorites = [...new Set([...favorites, ...cloudFavs])];
          localStorage.setItem('rayyan_favs', JSON.stringify(favorites));
          renderTools();
        }
      } else {
        const isAr = document.documentElement.lang === 'ar';
        loginBtn.innerText = isAr ? 'دخول' : 'Sign In';
        loginBtn.onclick = () => {
          signInWithPopup(auth, provider).then(res => {
            // Create User Doc if new
            const u = res.user;
            setDoc(doc(db, "users", u.uid), {
              email: u.email,
              name: u.displayName,
              lastLogin: new Date()
            }, { merge: true });
          }).catch(e => console.error(e));
        };
      }
    });
  }
  // 6. Initialize Global Click Handler (Bulletproof Fallback)
  // 6. Initialize Global Click Handler (Bulletproof Fallback)
  window.openTool = (id) => {
    openModal(id);
  };

  // 7. Setup Event Delegation
  const gridEl = document.getElementById('toolsGrid');
  if (gridEl) {
    // Unified Tilt
    gridEl.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.animated-card');
      if (card) handleTilt(e, card);
    });

    gridEl.addEventListener('mouseleave', (e) => {
      const card = e.target.closest('.animated-card');
      if (card) resetTilt(card);
    }, true); // Capture phase to catch leaving children
  }
});

// --- RESCUE LOGIC (Fallback for missing modules) ---
if (!window.FinanceTools) {
  console.warn("FinanceTools module missing. Loading fallback.");
  window.FinanceTools = {
    renderLoanCalc: (container) => {
      container.innerHTML = `
                <div class="tool-ui-group">
                    <div class="input-row">
                        <label>Loan Amount (SAR)</label>
                        <input type="number" id="loanAmount" class="glass-input" placeholder="e.g. 100000">
                    </div>
                    <div class="input-row">
                        <label>Annual Interest Rate (%)</label>
                        <input type="number" id="loanRate" class="glass-input" placeholder="e.g. 3.5">
                    </div>
                    <div class="input-row">
                        <label>Loan Term (Years)</label>
                        <input type="number" id="loanTerm" class="glass-input" placeholder="e.g. 5">
                    </div>
                    <button onclick="calculateLoanFallback()" class="btn-primary full-width">Calculate</button>
                    <div id="loanResult" class="result-box hidden">
                        <div class="res-item"><span>Monthly Payment:</span> <strong id="resMonthly">-</strong></div>
                        <div class="res-item"><span>Total Interest:</span> <strong id="resInterest">-</strong></div>
                        <div class="res-item"><span>Total Payment:</span> <strong id="resTotal">-</strong></div>
                    </div>
                </div>
            `;
      window.calculateLoanFallback = () => {
        const P = parseFloat(document.getElementById('loanAmount').value);
        const r = parseFloat(document.getElementById('loanRate').value) / 100 / 12;
        const n = parseFloat(document.getElementById('loanTerm').value) * 12;
        if (!P || !r || !n) return;
        const x = Math.pow(1 + r, n);
        const monthly = (P * x * r) / (x - 1);
        document.getElementById('resMonthly').innerText = monthly.toFixed(2) + " SAR";
        document.getElementById('resInterest').innerText = ((monthly * n) - P).toFixed(2) + " SAR";
        document.getElementById('resTotal').innerText = (monthly * n).toFixed(2) + " SAR";
        document.getElementById('loanResult').classList.remove('hidden');
      };
    },
    renderVAT: (container) => {
      container.innerHTML = `
                <div class="tool-ui-group">
                    <div class="input-row">
                        <label>Amount (SAR)</label>
                        <input type="number" id="vatAmount" class="glass-input" placeholder="e.g. 100">
                    </div>
                    <div class="input-row">
                        <label>VAT Rate (%)</label>
                        <input type="number" id="vatRate" class="glass-input" value="15">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <button onclick="calcVATFallback(false)" class="btn-primary">Add VAT</button>
                        <button onclick="calcVATFallback(true)" class="btn-secondary">Subtract VAT</button>
                    </div>
                     <div id="vatResult" class="result-box hidden">
                        <div class="res-item"><span>Original:</span> <strong id="resVatOrig">-</strong></div>
                        <div class="res-item"><span>VAT Amount:</span> <strong id="resVatVal">-</strong></div>
                        <div class="res-item"><span>Total:</span> <strong id="resVatTotal">-</strong></div>
                    </div>
                </div>
             `;
      window.calcVATFallback = (subtract) => {
        const amt = parseFloat(document.getElementById('vatAmount').value);
        const rate = parseFloat(document.getElementById('vatRate').value) / 100;
        if (!amt) return;
        let net, vat, total;
        if (subtract) {
          total = amt;
          net = total / (1 + rate);
          vat = total - net;
        } else {
          net = amt;
          vat = net * rate;
          total = net + vat;
        }
        document.getElementById('resVatOrig').innerText = net.toFixed(2);
        document.getElementById('resVatVal').innerText = vat.toFixed(2);
        document.getElementById('resVatTotal').innerText = total.toFixed(2);
        document.getElementById('vatResult').classList.remove('hidden');
      };
    },
    renderCurrency: (container) => {
      container.innerHTML = `<div style="padding:20px; text-align:center;">Currency Converter requires Internet/Proxy (Port 8085).</div>`;
    }
  };
}

// --- CORE FUNCTIONS ---

async function fetchTools() {
  try {
    const snap = await getDocs(collection(db, "tools"));
    if (!snap.empty) {
      tools = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(t => !t.hidden);

      // Re-apply filter
      if (currentCategory === 'all') displayTools = [...tools];
      else if (currentCategory === 'favorites') displayTools = tools.filter(t => favorites.includes(t.id));
      else displayTools = tools.filter(t => t.cat === currentCategory);

      renderTools(); // Re-render with live data
    }
  } catch (e) { console.error("Error fetching tools:", e); }
}

function renderTools() {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;

  if (displayTools.length === 0) {
    grid.innerHTML = '<p style="color:#aaa; text-align:center; grid-column:1/-1;">No tools found.</p>';
    updateTotalToolsCount(0);
    return;
  }

  const isAr = document.documentElement.lang === 'ar';
  grid.innerHTML = displayTools.map(tool => {
    const title = isAr && tool.titleAr ? tool.titleAr : tool.title;
    const desc = isAr && tool.descAr ? tool.descAr : tool.desc;
    const btnText = isAr ? 'فتح الأداة' : 'Open Tool';
    const isFav = favorites.includes(tool.id);
    const heartColor = isFav ? "var(--accent-pink)" : "rgba(255,255,255,0.3)";

    return `
            <div class="glass-panel tool-card animated-card" data-id="${tool.id}" onclick="window.openTool('${tool.id}')" style="position:relative; cursor:pointer;">
                <div class="bg-blob"></div>
                <div class="card-content-wrapper">
                    <button class="fav-btn" data-id="${tool.id}" onclick="event.stopPropagation(); window.toggleFavorite(event, '${tool.id}')"
                            style="position:absolute; top:15px; right:15px; background:none; border:none; cursor:pointer; z-index:5; pointer-events:auto;">
                        <i data-lucide="heart" style="width:20px; height:20px; color:${heartColor}; fill:${isFav ? heartColor : 'none'};"></i>
                    </button>
                    <div class="tool-icon animated-icon"><i data-lucide="${tool.icon || 'box'}"></i></div>
                    <div>
                        <div class="tool-title">${title}</div>
                        <div class="tool-desc">${desc}</div>
                    </div>
                    <div class="card-hover-reveal">
                        <button class="tool-action btn-secondary" style="width:100%; padding:8px;">${btnText}</button>
                    </div>
                </div>
            </div>
        `;
  }).join('');

  updateTotalToolsCount(displayTools.length);
  if (window.lucide) window.lucide.createIcons();

  updateTotalToolsCount(displayTools.length);
  if (window.lucide) window.lucide.createIcons();
}

// --- EVENT DELEGATION (Robust) ---
// The unified click handler is now handled by the onclick attribute on the card itself.
// Tilt handlers are moved to the DOMContentLoaded event listener.

function handleTilt(e, card) {
  // Disable transition for instant follow
  card.style.transition = 'none';

  const content = card.querySelector('.card-content-wrapper');
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const xPct = x / rect.width;
  const yPct = y / rect.height;

  // Rotation
  const xRot = (yPct - 0.5) * 20;
  const yRot = (xPct - 0.5) * -20;

  if (content) {
    content.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) translateZ(20px)`;
  }

  const blob = card.querySelector('.bg-blob');
  if (blob) {
    blob.style.opacity = '1';
    blob.style.transform = `translate(${x}px, ${y}px)`;
  }
}

function resetTilt(card) {
  // Re-enable transition for smooth return
  card.style.transition = 'transform 0.5s ease';

  const content = card.querySelector('.card-content-wrapper');
  if (content) {
    content.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateZ(0)`;
  }

  const blob = card.querySelector('.bg-blob');
  if (blob) blob.style.opacity = '0';
}

// --- HELPERS ---

function setupSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  let debounce;
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    displayTools = tools.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.desc && t.desc.toLowerCase().includes(q))
    );
    renderTools();

    // Analytics
    clearTimeout(debounce);
    if (displayTools.length === 0 && q.length > 3) {
      debounce = setTimeout(() => {
        addDoc(collection(db, 'stats_search'), { term: q, timestamp: new Date() });
      }, 2000);
    }
  });
}

function setupLanguage() {
  const btn = document.getElementById('langToggle');
  // Default to Arabic if not set
  if (!localStorage.getItem('rayyan_lang') || localStorage.getItem('rayyan_lang') === 'ar') {
    toggleLanguage(true);
  }
  if (btn) btn.addEventListener('click', () => toggleLanguage());
}

function toggleLanguage(forceAr = false) {
  const html = document.documentElement;
  const isAr = forceAr || html.getAttribute('lang') !== 'ar';

  html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  html.setAttribute('lang', isAr ? 'ar' : 'en');
  localStorage.setItem('rayyan_lang', isAr ? 'ar' : 'en');

  const btn = document.getElementById('langToggle');
  if (btn) btn.innerText = isAr ? 'EN' : 'عربي';

  updateTextContent(isAr ? 'ar' : 'en');
}

function updateTextContent(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      if (key.includes('hero') || key.includes('desc')) el.innerHTML = translations[lang][key];
      else el.innerText = translations[lang][key];
    }
  });
  const search = document.getElementById('searchInput');
  if (search) search.placeholder = translations[lang]['search_placeholder'];
  renderTools();
}

window.toggleFavorite = (e, id) => {
  e.stopPropagation();
  if (favorites.includes(id)) favorites = favorites.filter(f => f !== id);
  else favorites.push(id);
  localStorage.setItem('rayyan_favs', JSON.stringify(favorites));
  renderTools();
};

window.filterTools = (cat) => {
  if (!document.getElementById('toolsGrid')) { window.location.href = `tools.html?cat=${cat}`; return; }

  currentCategory = cat;

  if (cat === 'all') displayTools = [...tools];
  else if (cat === 'favorites') displayTools = tools.filter(t => favorites.includes(t.id));
  else displayTools = tools.filter(t => t.cat === cat);

  renderTools();
  document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
};

// --- FEATURES ---

async function checkForBanner() {
  try {
    const snap = await getDoc(doc(db, "config", "announcement"));
    if (snap.exists() && snap.data().active) {
      const b = document.createElement('div');
      b.className = 'announcement-banner';
      b.innerText = snap.data().text;
      document.body.prepend(b);
    }
  } catch (e) { }
}

async function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  try {
    const snap = await getDocs(collection(db, "categories"));
    if (snap.empty) return;
    const isAr = document.documentElement.lang === 'ar';

    grid.innerHTML = snap.docs.map(d => {
      const c = d.data();
      return `
                <a href="tools.html?cat=${c.id}" class="glass-panel cat-card" style="text-decoration:none; display:block; color:inherit;">
                    <i data-lucide="${c.icon || 'box'}" class="cat-icon" style="color:var(--accent-purple)"></i>
                    <span>${isAr ? c.nameAr : c.name}</span>
                </a>
            `;
    }).join('');
    if (window.lucide) window.lucide.createIcons();
  } catch (e) { }
}

function updateTotalToolsCount(count) {
  const el = document.getElementById('totalToolsCount');
  if (el) {
    const isAr = document.documentElement.lang === 'ar';
    el.innerText = isAr ? `(${count})` : `(${count})`;
  }
}

async function trackVisit() {
  if (sessionStorage.getItem('visited')) return;
  await setDoc(doc(db, 'stats', 'general'), { visitors: increment(1) }, { merge: true });
  sessionStorage.setItem('visited', 'true');
}

// --- MODALS ---
// (Simplified for brevity, routing to modules)
window.openModal = (id) => {
  console.log("Opening Modal for:", id);
  const tool = tools.find(t => t.id === id);
  if (!tool) {
    console.error("Tool not found in memory:", id);
    alert("Error: Tool not found! ID: " + id);
    return;
  }

  // Show Modal IMMEDIATELY
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Analytics
  updateDoc(doc(db, 'tools', id), { views: increment(1) }).catch(console.error);

  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');
  const isAr = document.documentElement.lang === 'ar';

  if (titleEl) titleEl.textContent = isAr && tool.titleAr ? tool.titleAr : tool.title;

  // Module Routing
  try {
    // 1. Finance
    if (window.FinanceTools) {
      if (id === 'loan-calc') return FinanceTools.renderLoanCalc(bodyEl);
      if (id === 'vat-calc') return FinanceTools.renderVAT(bodyEl);
      if (id === 'net-salary') return FinanceTools.renderSalary(bodyEl);
      if (id === 'currency') return FinanceTools.renderCurrency(bodyEl);
      if (id === 'savings') return FinanceTools.renderSavings(bodyEl);
      if (id === 'zakat') return FinanceTools.renderZakat(bodyEl);
      if (id === 'fin-discount') return FinanceTools.renderDiscount(bodyEl);
      if (id === 'fin-crypto') return FinanceTools.renderCrypto(bodyEl);
    }

    // 2. Text
    if (window.TextTools) {
      if (id === 'adobe-fix') return TextTools.renderAdobe(bodyEl);
      if (id === 'cleaner') return TextTools.renderCleaner(bodyEl);
      if (id === 'case') return TextTools.renderCase(bodyEl);
      if (id === 'hashtag') return TextTools.renderHashtag(bodyEl);
      if (id === 'utm') return TextTools.renderUTM(bodyEl);
      if (id === 'text-link') return TextTools.renderLinks(bodyEl);
      if (id === 'text-punc') return TextTools.renderPunc(bodyEl);
      if (id === 'text-dia') return TextTools.renderTashkeel(bodyEl);
      if (id === 'text-lorem') return TextTools.renderLorem(bodyEl);
    }

    // 3. Time
    if (window.TimeTools) {
      if (id === 'hijri') return TimeTools.renderHijri(bodyEl);
      if (id === 'diff') return TimeTools.renderDiff(bodyEl);
      if (id === 'timer') return TimeTools.renderTimer(bodyEl);
      if (id === 'timezone') return TimeTools.renderZone(bodyEl);
      if (id === 'time-add') return TimeTools.renderDateAdd(bodyEl);
    }

    // 4. Health
    if (window.HealthTools) {
      if (id === 'health-bmi' || id === 'bmi-calc') return HealthTools.renderBMI(bodyEl);
      if (id === 'health-bmr' || id === 'cal-calc') return HealthTools.renderBMR(bodyEl);
      if (id === 'health-water' || id === 'water-calc') return HealthTools.renderWater(bodyEl);
      if (id === 'health-sleep') return HealthTools.renderSleep(bodyEl);
      if (id === 'health-breath') return HealthTools.renderBreath(bodyEl);
    }

    // 5. PDF
    if (window.PDFTools) {
      if (id === 'pdf-merge') return PDFTools.renderMerge(bodyEl);
      if (id === 'pdf-split') return PDFTools.renderSplit(bodyEl);
      if (id === 'pdf-compress') return PDFTools.renderCompress(bodyEl);
      if (id === 'pdf-to-img') return PDFTools.renderToImages(bodyEl);
      if (id === 'img-to-pdf') return PDFTools.renderToPDF(bodyEl);
      if (id === 'pdf-page-num') return PDFTools.renderPageNum(bodyEl);
      if (id === 'pdf-rotate') return PDFTools.renderRotate(bodyEl);
      if (id === 'pdf-watermark') return PDFTools.renderWatermark(bodyEl);
      if (id === 'pdf-protect') return PDFTools.renderProtect(bodyEl);
      if (id === 'pdf-unlock') return PDFTools.renderUnlock(bodyEl);
      if (id === 'pdf-rem') return PDFTools.renderRemPage(bodyEl);
      if (id === 'pdf-ord') return PDFTools.renderOrder(bodyEl);
      if (id === 'pdf-crop') return PDFTools.renderCrop(bodyEl);
      if (id === 'pdf-extract-text') return PDFTools.renderExt(bodyEl);
      if (id === 'pdf-extract-imgs') return PDFTools.renderExtImg(bodyEl);
    }

    // 6. Image
    if (window.ImageTools) {
      if (id === 'img-compress') return ImageTools.renderCompress(bodyEl);
      if (id === 'img-resize') return ImageTools.renderResize(bodyEl);
      if (id === 'img-webp') return ImageTools.renderWebP(bodyEl);
      if (id === 'img-bg') return ImageTools.renderRemoveBG(bodyEl);
      if (id === 'img-heic') return ImageTools.renderHEIC(bodyEl);
      if (id === 'img-social') return ImageTools.renderSocialImg(bodyEl);
      if (id === 'img-border') return ImageTools.renderBorder(bodyEl);
      if (id === 'img-meta') return ImageTools.renderMeta(bodyEl);
      if (id === 'image-palette') return ImageTools.renderPalette(bodyEl);
      if (id === 'img-meme') return ImageTools.renderMeme(bodyEl);
      if (id === 'img-crop') return ImageTools.renderCropper(bodyEl);
      if (id === 'img-filter') return ImageTools.renderFilters(bodyEl);
    }

    // 7. Developer
    if (window.DevTools) {
      if (id === 'dev-json') return DevTools.renderJson(bodyEl);
      if (id === 'dev-base64') return DevTools.renderBase64(bodyEl);
      if (id === 'dev-hash') return DevTools.renderHash(bodyEl);
      if (id === 'dev-url') return DevTools.renderUrlEnc(bodyEl);
      if (id === 'dev-regex') return DevTools.renderRegex(bodyEl);
      if (id === 'dev-diff') return DevTools.renderDiff(bodyEl);
      if (id === 'dev-screen') return DevTools.renderScreenInfo(bodyEl);
      if (id === 'dev-jwt') return DevTools.renderJWT(bodyEl);
      if (id === 'dev-sql') return DevTools.renderSQL(bodyEl);
      if (id === 'dev-chmod') return DevTools.renderChmod(bodyEl);
      if (id === 'dev-cron') return DevTools.renderCron(bodyEl);
      if (id === 'dev-curl') return DevTools.renderCurl(bodyEl);
      if (id === 'dev-ua') return DevTools.renderUA(bodyEl);
      if (id === 'dev-meta') return DevTools.renderMeta(bodyEl);
      if (id === 'dev-fav') return DevTools.renderFavicon(bodyEl);
      if (id === 'dev-svg') return DevTools.renderSVG(bodyEl);
      if (id === 'dev-md') return DevTools.renderMarkdown(bodyEl);
    }

    // 7.5 Productivity (Was missing)
    if (window.ProdTools) {
      if (id === 'qr') return ProdTools.renderQR(bodyEl);
      if (id === 'unit') return ProdTools.renderUnit(bodyEl);
      if (id === 'password') return ProdTools.renderPass(bodyEl);
      if (id === 'speed') return ProdTools.renderSpeed(bodyEl);
      if (id === 'prod-iban') return ProdTools.renderIBAN(bodyEl);
      if (id === 'prod-inv') return ProdTools.renderInvoice(bodyEl);
      if (id === 'prod-pomodoro') return ProdTools.renderPomodoro(bodyEl);
    }

    // 8. Content (NEW)
    if (window.ContentTools) {
      if (id === 'caption') return ContentTools.renderCaption(bodyEl);
      if (id === 'social-sizes') return ContentTools.renderSocialSizes(bodyEl);
      if (id === 'ideas') return ContentTools.renderIdeas(bodyEl);
      if (id === 'proof') return ContentTools.renderProof(bodyEl);
      if (id === 'media-rec') return MediaTools.renderRecorder(bodyEl);
    }

    // 9. Saudi Tools
    if (window.SaudiTools) {
      if (id === 'saudi-eos') return SaudiTools.renderEOS(bodyEl);
      if (id === 'saudi-leave') return SaudiTools.renderLeave(bodyEl);
      if (id === 'text-tafqeet') return SaudiTools.renderTafqeet(bodyEl);
      if (id === 'saudi-vacation') return SaudiTools.renderVacationSal(bodyEl);
      if (id === 'saudi-holiday') return SaudiTools.renderHijri(bodyEl); // Reuse Hijri
      if (id === 'saudi-events') return SaudiTools.renderEvents(bodyEl);
    }

    // 10. Education
    if (window.EducationTools) {
      if (id === 'edu-gpa') return EducationTools.renderGPA(bodyEl);
      if (id === 'edu-grade') return EducationTools.renderGrade(bodyEl);
    }

    // 11. Languages
    if (window.LangTools) {
      if (id === 'lang-trans') return LangTools.renderTranslator(bodyEl);
      if (id === 'lang-ar-corr') return LangTools.renderCorrector(bodyEl);
      if (id === 'lang-en-corr') return LangTools.renderEnCorrector(bodyEl);
      if (id === 'lang-editor') return LangTools.renderEditor(bodyEl);
    }

    // 12. Sports
    if (window.SportsTools) {
      if (id === 'sport-football') return SportsTools.renderFootball(bodyEl);
      if (id === 'sport-basket') return SportsTools.renderBasketball(bodyEl);
      if (id === 'sport-motor') return SportsTools.renderMotorsport(bodyEl);
      if (id === 'sport-combat') return SportsTools.renderCombat(bodyEl);
      if (id === 'sport-world') return SportsTools.renderWorld(bodyEl);
    }

    // 13. Life
    if (window.LifeTools) {
      if (id === 'life-bill') return LifeTools.renderBill(bodyEl);
      if (id === 'life-decision') return LifeTools.renderDecision(bodyEl);
      if (id === 'life-tip') return LifeTools.renderTip(bodyEl);
      if (id === 'life-reaction') return LifeTools.renderReaction(bodyEl);
    }

    // 14. Design
    if (window.DesignTools) {
      if (id === 'des-grad') return DesignTools.renderGradient(bodyEl);
      if (id === 'des-shadow') return DesignTools.renderShadow(bodyEl);
      if (id === 'des-contrast') return DesignTools.renderContrast(bodyEl);
    }

    // 15. Media
    if (window.MediaTools) {
      if (id === 'media-gif') return MediaTools.renderGif(bodyEl);
      if (id === 'media-mp3') return MediaTools.renderMp3(bodyEl);
    }

  } catch (e) {
    console.error("Tool Render Error:", e);
    bodyEl.innerHTML = `<div style="text-align:center; color:red; padding:20px;">Error loading tool: ${e.message}</div>`;
    return;
  }

  // 8. Fallback
  bodyEl.innerHTML = `<div style="text-align:center; padding:40px;">
    <h3>${isAr ? 'قريباً...' : 'Coming Soon...'}</h3>
    <p>${isAr ? 'جاري العمل على هذه الأداة' : 'We are working on this tool.'}</p>
    <small style="color:#aaa;">ID: ${id}</small>
  </div>`;
};

window.closeModal = () => {
  // Cleanup Intervals
  if (window.TimeTools && window.TimeTools.stopTimer) window.TimeTools.stopTimer();
  if (window.TimeTools && window.TimeTools.zoneInterval) clearInterval(window.TimeTools.zoneInterval);

  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'modalOverlay') closeModal();
});

// PWA
window.addEventListener('beforeinstallprompt', (e) => {
  const btn = document.getElementById('installAppBtn');
  if (btn) {
    e.preventDefault();
    btn.classList.remove('hidden');
    btn.onclick = () => {
      e.prompt();
      btn.style.display = 'none';
    };
  }
});
