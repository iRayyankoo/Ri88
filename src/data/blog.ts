
export interface BlogPost {
    id: string;
    title: string;
    author: string;
    category: string;
    image: string;
    featured?: boolean;
    date: string;
    content?: string; // HTML or Markdown content
}

// Porting data from blog-mock.js and article.html
export const blogPosts: BlogPost[] = [
    // Featured Hero Article (from blog.html static content)
    {
        id: 'hero-article',
        title: 'القادسية يقلب الطاولة ويحقق الفوز السادس توالياً',
        author: 'محرر رياضي',
        category: 'الرياضة',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        featured: true,
        date: 'الآن',
        content: `
            <p>تحليل تكتيكي شامل: كيف استطاع كونسيساو إعادة هيكلة الفريق في الشوط الثاني وخطف النقاط الثلاث من أمام الشباب؟</p>
            <p>شهدت المباراة تحولات دراماتيكية...</p>
        `
    },
    // Article from article.html
    {
        id: 'oscar-movie',
        title: '«اللي باقي منك»: يستحق الترشيح للأوسكار 🏆',
        author: 'ناقد سينمائي',
        category: 'سينما',
        image: '/assets/covers/img_1.png', // Placeholder
        date: '22 يناير 2026',
        content: `
            <p>ظهر الثنائي مات ديمون وبن أفليك في لقاء مع جو روقان للترويج لفيلمهما الجديد. وخلال حديثهما عن تجربتهما مع نتفلكس، أشارا إلى نقطة لافتة:</p>
            <p>تفرض نتفلكس على الكُتّاب قواعد محدّدة، من بينها إعادة توضيح الحبكة الرئيسة داخل الحوارات، لأن المنصة تفترض أن جزءًا كبيرًا من المشاهدين يكون منشغلًا بهاتفه في أثناء المشاهدة.</p>
            <div class="pull-quote" style="border-right: 4px solid var(--accent-brand); padding-right: 20px; font-size: 1.4em; font-style: italic; margin: 40px 0; background: rgba(214, 48, 49, 0.05); padding: 20px; border-radius: 8px;">
                "في الحقيقة، يعكس هذا المعيار واقع عصرنا الحالي. ففي السينما، عندما ألاحظ عددًا من الحضور منشغلًا بجوّاله، أعدّ ذلك مؤشرًا واضحًا على أن الفيلم مملّ أو غير مشوّق."
            </div>
            <p>لم يكن هذا التحدي قائمًا في الماضي؛ الأفلام سابقًا لم تكن مضطرةً إلى التنافس مع شاشة أخرى في يد المشاهد.</p>
        `
    },
    // Mock Data from blog-mock.js
    { id: 'mock-0', title: "لماذا مات محتوى الأصدقاء؟", author: "محرر التقنية", category: "التقنية", image: "/assets/covers/img_1.png", date: "الأن" },
    { id: 'mock-1', title: "مستقبل الذكاء الاصطناعي", author: "فريق ريان", category: "AI", image: "/assets/covers/img_2.png", date: "الأن" },
    { id: 'mock-2', title: "كيف تبني عادة القراءة؟", author: "ضيف مميز", category: "تطوير ذات", image: "/assets/covers/img_3.png", date: "الأن" },
    { id: 'mock-3', title: "تجربتي مع العمل عن بعد", author: "عاشق التقنية", category: "عمل", image: "/assets/covers/img_4.png", date: "الأن" },
    { id: 'mock-4', title: "أهمية الأمن السيبراني", author: "خبير رقمي", category: "أمن", image: "/assets/covers/img_5.png", date: "الأن" },
    { id: 'mock-5', title: "مراجعة هواتف 2026", author: "محرر التقنية", category: "تقنية", image: "/assets/covers/img_6.png", date: "الأن" },
    { id: 'mock-6', title: "الاستثمار الذكي", author: "خبير مالي", category: "مال", image: "/assets/covers/img_7.png", date: "الأن" },
    { id: 'mock-7', title: "نصائح للمطورين", author: "فريق ريان", category: "برمجة", image: "/assets/covers/img_8.png", date: "الأن" },
];
