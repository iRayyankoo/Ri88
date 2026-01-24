import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function seed() {
    console.log("Seeding article...");
    try {
        await addDoc(collection(db, "articles"), {
            title: "كيف تبني عادة القراءة في 2026؟",
            author: "ريان الحربي",
            image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            excerpt: "خطوات عملية بسيطة لتحويل القراءة من واجب ثقيل إلى متعة يومية لا تستغني عنها.",
            content: `
                <p>كثير منا يضع "القراءة" ضمن أهدافه السنوية، ولكن القليل يستمر. المشكلة ليست في الوقت، بل في النهج.</p>
                <h2>1. ابدأ صغيراً جداً</h2>
                <p>لا تقرر قراءة كتاب في الأسبوع. قرر قراءة "صفحة واحدة" قبل النوم. السر في الاستمرارية وليس الكثافة.</p>
                
                <div class="pull-quote">
                    "العادة هي ما تفعله دون تفكير. اجعل حمل الكتاب أسهل من حمل الهاتف."
                </div>

                <h2>2. جهز البيئة</h2>
                <p>ضع الكتاب في مكان تراه دائماً. على الوسادة، أو بجانب ريموت التلفزيون. اجعل الوصول إليه أسهل من الوصول للمشتتات.</p>

                <h2>3. اقرأ ما تحب، حتى لو كان "تافهاً"</h2>
                <p>في البداية، الهدف هو بناء العادة. لا تجبر نفسك على قراءة كتب فلسفية معقدة إذا كنت لا تستمتع بها. اقرأ روايات، قصص مصورة، أي شيء يجعلك تقلب الصفحة.</p>
                
                <br>
                <p>تذكر، القراءة ليست سباقاً. هي رحلة ممتعة لاكتشاف عوالم جديدة.</p>
            `,
            date: new Date()
        });
        document.body.innerHTML += '<h1 style="color:green; position:fixed; top:0; left:0; background:white; padding:20px;">تم نشر المقال العشوائي بنجاح! ✅</h1>';
    } catch (e) {
        document.body.innerHTML += `<h1 style="color:red;">Error: ${e.message}</h1>`;
        console.error(e);
    }
}

seed();
