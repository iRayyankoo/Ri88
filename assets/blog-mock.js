// Standalone Mock Renderer (No Dependencies)
(function () {
    console.log("🚀 Standalone Mock Renderer Initialized");

    const grid = document.getElementById('bentoGrid');
    if (!grid) {
        console.error("❌ Grid not found");
        return;
    }

    const mockTitles = [
        "لماذا مات محتوى الأصدقاء؟", "مستقبل الذكاء الاصطناعي", "كيف تبني عادة القراءة؟",
        "تجربتي مع العمل عن بعد", "أهمية الأمن السيبراني", "مراجعة هواتف 2026",
        "الاستثمار الذكي", "نصائح للمطورين", "قصة نجاح سعودية",
        "عالم الميتافيرس", "التصوير بالجوال", "السيارات الكهربائية"
    ];

    const authors = ["محرر التقنية", "فريق ريان", "ضيف مميز", "عاشق التقنية", "خبير رقمي"];
    const articles = mockTitles.map((t, i) => ({
        id: 'mock-' + i,
        title: t,
        author: authors[i % authors.length],
        image: `assets/covers/img_${(i % 12) + 1}.png`
    }));

    grid.innerHTML = articles.map((a, index) => {
        let className = 'bento-standard';
        if (index === 0) className = 'bento-large';
        else if (index === 3) className = 'bento-tall';
        else if (index === 7) className = 'bento-large';

        // Local images check
        const imgUrl = a.image;

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
                            <span class="meta-author">${a.author}</span> في <span class="meta-cat">التقنية</span> من <b>Ri88</b> • الأن
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
                        <span class="meta-author">${a.author}</span> في <span class="meta-cat">التقنية</span> من <b>Ri88</b> • الأن
                    </span>
                </div>
            </div>
        </a>`;
    }).join('');

    // Try to init icons if loaded, otherwise wait
    if (window.lucide) window.lucide.createIcons();
    else window.addEventListener('load', () => window.lucide && window.lucide.createIcons());

})();
