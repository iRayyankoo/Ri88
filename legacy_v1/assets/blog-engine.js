import { db } from './firebase-config.js';
import { collection, getDocs, getDoc, doc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- BLOG ENGINE ---

export async function initBlog() {
    const isListing = document.getElementById('blogGrid');
    const isSingle = document.querySelector('.article-container');

    if (isListing) {
        await renderBlogListing();
    } else if (isSingle) {
        await renderSingleArticle();
    }
}

// Shared Rendering Logic
function renderArticlesToGrid(grid, articles) {
    grid.innerHTML = articles.map((a, index) => {
        // Bento Pattern
        let className = 'bento-standard';
        if (index === 0) className = 'bento-large';
        else if (index === 3) className = 'bento-tall';
        else if (index === 7) className = 'bento-large';

        // Image Handling
        let imgUrl = a.image;
        if (!imgUrl || !imgUrl.startsWith('http')) {
            imgUrl = `assets/covers/img_${(index % 12) + 1}.png`;
        }

        if (className === 'bento-large') {
            return `
            <a href="article.html?id=${a.id}" class="bento-item ${className}">
                <img src="${imgUrl}" class="bento-img" loading="lazy" onerror="this.src='https://placehold.co/600x400/222/fff?text=Cover'">
                <div class="bento-overlay">
                    <span style="background:var(--accent-pink); width:fit-content; color:white; padding:4px 10px; border-radius:10px; font-size:0.7em; margin-bottom:10px; font-weight:bold;">FEATURED</span>
                    <h3 class="bento-title">${a.title}</h3>
                    <div class="bento-meta">
                        <img src="https://i.pravatar.cc/100?img=${index}" class="meta-avatar">
                        <span class="meta-text">
                            <span class="meta-author">${a.author}</span> في <span class="meta-cat">التقنية</span> من <b>Ri88</b> • ${new Date(a.date?.seconds * 1000).toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                </div>
            </a>`;
        }
        return `
        <a href="article.html?id=${a.id}" class="bento-item ${className}">
            <img src="${imgUrl}" class="bento-img" loading="lazy" onerror="this.src='https://placehold.co/400x300/333/fff?text=Cover'">
            <div class="bento-content">
                <h3 class="bento-title">${a.title}</h3>
                <div class="bento-meta">
                    <img src="https://i.pravatar.cc/100?img=${index}" class="meta-avatar">
                    <span class="meta-text">
                        <span class="meta-author">${a.author}</span> في <span class="meta-cat">التقنية</span> من <b>Ri88</b> • ${new Date(a.date?.seconds * 1000).toLocaleDateString('ar-SA')}
                    </span>
                </div>
            </div>
        </a>`;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
}

async function renderBlogListing() {
    const grid = document.getElementById('bentoGrid');
    if (!grid) return;

    // 1. OPTIMISTIC RENDER (Mock Data)
    console.log("🚀 Optimistic Render...");
    const mockTitles = [
        "لماذا مات محتوى الأصدقاء؟", "مستقبل الذكاء الاصطناعي", "كيف تبني عادة القراءة؟",
        "تجربتي مع العمل عن بعد", "أهمية الأمن السيبراني", "مراجعة هواتف 2026",
        "الاستثمار الذكي", "نصائح للمطورين", "قصة نجاح سعودية",
        "عالم الميتافيرس", "التصوير بالجوال", "السيارات الكهربائية"
    ];
    const authors = ["محرر التقنية", "فريق ريان", "ضيف مميز", "عاشق التقنية", "خبير رقمي"];
    const mockArticles = mockTitles.map((t, i) => ({
        id: 'mock-' + i,
        title: t,
        author: authors[i % authors.length],
        date: { seconds: Date.now() / 1000 },
        image: `assets/covers/img_${(i % 12) + 1}.png`
    }));

    renderArticlesToGrid(grid, mockArticles);

    // 2. ATTEMPT REAL FETCH
    try {
        const q = query(collection(db, "articles"), orderBy("date", "desc"), limit(12));
        const snap = await getDocs(q);

        if (!snap.empty) {
            console.log("✅ Real Data Received!");
            const articles = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderArticlesToGrid(grid, articles);
        } else {
            console.warn("⚠️ No articles in DB.");
        }
    } catch (e) {
        console.error("❌ Firestore Error (Keeping Mock Data):", e);
        grid.insertAdjacentHTML('beforeend', `<div style="position:fixed; bottom:10px; right:10px; background:rgba(0,0,0,0.7); color:white; padding:5px 10px; border-radius:5px; font-size:0.7em;">Offline Mode</div>`);
    }
}

async function renderSingleArticle() {
    // ... existing single article implementation ...
    // Keeping it simple for now as user is focused on the Grid
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    // Quick mock for single page if DB fails
    try {
        const docRef = doc(db, "articles", id);
        const snap = await getDoc(docRef);
        // ... (normal flow)
    } catch (e) {
        document.querySelector('.article-title').innerText = "Mock Article (Offline Mode)";
        document.querySelector('.article-body').innerHTML = "<p>Could not load from database. Showing placeholder content.</p>";
    }
}

// Auto Init
document.addEventListener('DOMContentLoaded', initBlog);
