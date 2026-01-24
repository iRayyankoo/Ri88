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
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    // Show Loading
    grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Jari Altahmil...</p>';

    try {
        const q = query(collection(db, "articles"), orderBy("date", "desc"));
        const snap = await getDocs(q);

        if (snap.empty) {
            grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No articles yet.</p>';
            return;
        }

        const articles = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Local Covers from user upload
        const covers = [
            'assets/covers/img_1.png', 'assets/covers/img_2.png', 'assets/covers/img_3.png',
            'assets/covers/img_4.png', 'assets/covers/img_5.png', 'assets/covers/img_6.png',
            'assets/covers/img_7.png', 'assets/covers/img_8.png', 'assets/covers/img_9.png',
            'assets/covers/img_10.png', 'assets/covers/img_11.png', 'assets/covers/img_12.png',
            'assets/covers/img_zakat.png'
        ];

        // Render
        grid.innerHTML = articles.map((a, index) => {
            // Use user image IF set, otherwise cycle through local covers
            const imgUrl = (a.image && a.image.startsWith('http')) ? a.image : covers[index % covers.length];

            return `
            <a href="article.html?id=${a.id}" class="article-card">
                <div class="card-img-wrapper">
                    <img src="${imgUrl}" class="card-img" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${a.title}</h3>
                    <p class="card-excerpt">${a.excerpt || a.content.substring(0, 100) + '...'}</p>
                    <div class="hero-meta" style="margin-top:5px;">
                        <span style="font-weight:bold; color:#d63031;">${a.author}</span>
                        <span style="font-size:0.8em; color:#aaa;"> بواسطة النشرة البريدية • </span>
                        <span style="font-size:0.8em; color:#aaa;">${new Date(a.date?.seconds * 1000).toLocaleDateString('ar-SA')}</span>
                    </div>
                </div>
            </a>
        `).join('');

        // Optional: Update Hero with latest
        // populateHero(articles[0]);

    } catch (e) {
        console.error(e);
        grid.innerHTML = '<p style="color:salmon; text-align:center; grid-column:1/-1;">Error loading articles.</p>';
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
