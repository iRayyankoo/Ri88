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

async function renderBlogListing() {
    const grid = document.getElementById('bentoGrid'); // New ID
    if (!grid) return;

    // Show Loading Skeleton
    grid.innerHTML = '<div style="color:white; grid-column:1/-1; text-align:center; padding:50px;">Loading Magazine...</div>';

    try {
        const q = query(collection(db, "articles"), orderBy("date", "desc"), limit(12));
        const snap = await getDocs(q);

        if (snap.empty) {
            grid.innerHTML = '<p style="color:white; text-align:center;">No articles yet.</p>';
            return;
        }

        const articles = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Local Covers
        const covers = [
            'assets/covers/img_1.png', 'assets/covers/img_2.png', 'assets/covers/img_3.png',
            'assets/covers/img_4.png', 'assets/covers/img_5.png', 'assets/covers/img_6.png',
            'assets/covers/img_7.png', 'assets/covers/img_8.png', 'assets/covers/img_9.png',
            'assets/covers/img_10.png', 'assets/covers/img_11.png', 'assets/covers/img_12.png',
            'assets/covers/img_zakat.png'
        ];

        // RENDER LOGIC
        grid.innerHTML = articles.map((a, index) => {
            const imgUrl = (a.image && a.image.startsWith('http')) ? a.image : covers[index % covers.length];

            // Bento Pattern: 
            // 0: Large (2x2)
            // 1, 2: Standard
            // 3: Tall (1x2)
            // 4+: Standard matching grid flow

            let className = 'bento-standard';
            if (index === 0) className = 'bento-large';
            else if (index === 3) className = 'bento-tall';
            else if (index === 7) className = 'bento-large'; // Another large one later

            // Different Inner HTML based on type
            if (className === 'bento-large') {
                return `
                <a href="article.html?id=${a.id}" class="bento-item ${className}">
                    <img src="${imgUrl}" class="bento-img" loading="lazy">
                    <div class="bento-overlay">
                        <span style="background:var(--accent-pink); width:fit-content; color:white; padding:4px 10px; border-radius:10px; font-size:0.7em; margin-bottom:10px; font-weight:bold;">FEATURED</span>
                        <h3 class="bento-title">${a.title}</h3>
                        <div class="bento-meta">
                            <i data-lucide="user" style="width:14px;"></i> ${a.author}
                        </div>
                    </div>
                </a>`;
            }

            return `
            <a href="article.html?id=${a.id}" class="bento-item ${className}">
                <img src="${imgUrl}" class="bento-img" loading="lazy">
                <div class="bento-content">
                    <h3 class="bento-title">${a.title}</h3>
                    <div class="bento-meta">
                        <span>${new Date(a.date?.seconds * 1000).toLocaleDateString('ar-SA')}</span>
                    </div>
                </div>
            </a>`;
        }).join('');

        // Re-inject Lucide icons for new content
        if (window.lucide) window.lucide.createIcons();

    } catch (e) {
        console.error(e);
        grid.innerHTML = '<p style="color:salmon; text-align:center; grid-column:1/-1;">Error loading.</p>';
    }
}

async function renderSingleArticle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.body.innerHTML = '<h1 style="text-align:center; margin-top:50px;">404 - Article Not Found</h1>';
        return;
    }

    try {
        const docRef = doc(db, "articles", id);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
            document.body.innerHTML = '<h1 style="text-align:center; margin-top:50px;">404 - Article Not Found</h1>';
            return;
        }

        const a = snap.data();

        // Inject Content
        document.title = a.title + " | Ri88 Blog";
        document.querySelector('.article-title').innerText = a.title;
        document.querySelector('.meta-author span').innerText = a.author;
        // Date
        const dateStr = new Date(a.date.seconds * 1000).toLocaleDateString('ar-SA');
        document.querySelector('.article-meta').innerHTML = `
            <div class="meta-author">
                <img src="assets/logo.png">
                <span>${a.author}</span>
            </div>
            <span>•</span>
            <span>${dateStr}</span>
        `;

        document.querySelector('.article-body').innerHTML = a.content;

    } catch (e) {
        console.error(e);
    }
}

// Auto Init
document.addEventListener('DOMContentLoaded', initBlog);
