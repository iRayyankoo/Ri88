import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function seed() {
    console.log("Seeding articles...");

    const titles = [
        "لماذا مات محتوى الأصدقاء؟",
        "مستقبل الذكاء الاصطناعي في التعليم",
        "كيف تبني عادة القراءة؟",
        "تجربتي مع العمل عن بعد لمدة سنة",
        "أهمية الأمن السيبراني في 2026",
        "مراجعة لأحدث هواتف سامسونج",
        "هل الاستثمار في الذهب مجدي؟",
        "نصائح للمطورين المبتدئين",
        "قصة نجاح شركة سعودية ناشئة",
        "أفضل تطبيقات تنظيم الوقت",
        "عالم الميتافيرس: حقيقة أم خيال؟",
        "التصوير الفوتوغرافي بالجوال",
        "تعلم البرمجة من الصفر",
        "مستقبل السيارات الكهربائية",
        "أسرار التسويق الرقمي الناجح"
    ];

    const authors = ["ريان الحربي", "نواف العقيل", "سارة الأحمد", "خالد الزهراني", "إيمان أسعد"];

    try {
        let count = 0;
        for (const title of titles) {
            await addDoc(collection(db, "articles"), {
                title: title,
                author: authors[Math.floor(Math.random() * authors.length)],
                // Using placehold.co temporarily, frontend handles covers
                image: ``,
                excerpt: "مقال تجريبي لاختبار شكل المجلة الجديد والشبكة المتداخلة...",
                content: `<p>محتوى تجريبي للمقال رقم ${count + 1}...</p>`,
                date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random past date
            });
            console.log(`Added: ${title}`);
            count++;
        }

        document.body.innerHTML += '<h1 style="color:green; text-align:center; margin-top:50px;">✅ تم إضافة 15 مقال عشوائي بنجاح!</h1><p style="text-align:center;">ارجع لصفحة المقالات وحدث الصفحة.</p>';
    } catch (e) {
        document.body.innerHTML += `<h1 style="color:red;">Error: ${e.message}</h1>`;
        console.error(e);
    }
}

seed();
