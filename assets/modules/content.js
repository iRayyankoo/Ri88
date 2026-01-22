/**
 * Content Creation Tools Module
 * Logic for Social Media Sizes, Caption Helper
 */

const ContentTools = {
    _t: function (en, ar) {
        return document.documentElement.lang === 'ar' ? ar : en;
    },

    // 1. Social Media Sizes
    // ----------------------------------------------------------------
    renderSocial: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Platform', 'المنصة')}</label>
                    <select id="smPlatform" class="glass-input" onchange="ContentTools.updateSizes()">
                        <option value="ig">${t('Instagram', 'انستغرام')}</option>
                        <option value="tw">${t('X (Twitter)', 'اكس (تويتر)')}</option>
                        <option value="li">${t('LinkedIn', 'لينكد إن')}</option>
                        <option value="yt">${t('YouTube', 'يوتيوب')}</option>
                        <option value="tk">${t('TikTok', 'تيك توك')}</option>
                    </select>
                </div>
                
                <div id="smResult" class="result-box" style="margin-top:16px;">
                    <ul id="sizeList" style="list-style:none; padding:0; margin:0;"></ul>
                </div>
            </div>
        `;
        this.updateSizes(); // Init
    },

    updateSizes: function () {
        const p = document.getElementById('smPlatform').value;
        const list = document.getElementById('sizeList');
        let data = [];
        const t = this._t;

        // Helper for concise translation
        const w = (en, ar) => t(en, ar);

        if (p === 'ig') {
            data = [
                { name: w('Profile Photo', 'صورة الملف الشخصي'), size: '320 x 320 px' },
                { name: w('Square Post', 'منشور مربع'), size: '1080 x 1080 px' },
                { name: w('Portrait Post', 'منشور طولي'), size: '1080 x 1350 px' },
                { name: w('Stories / Reels', 'قصص / ريلز'), size: '1080 x 1920 px' }
            ];
        } else if (p === 'tw') {
            data = [
                { name: w('Profile Photo', 'صورة الملف الشخصي'), size: '400 x 400 px' },
                { name: w('Header Photo', 'صورة الغلاف'), size: '1500 x 500 px' },
                { name: w('In-Stream Image', 'صورة داخل التغريدة'), size: '1600 x 900 px' }
            ];
        } else if (p === 'li') {
            data = [
                { name: w('Profile Photo', 'صورة الملف الشخصي'), size: '400 x 400 px' },
                { name: w('Cover Photo', 'صورة الغلاف'), size: '1128 x 191 px' },
                { name: w('Shared Image', 'صورة مشاركة'), size: '1200 x 627 px' }
            ];
        } else if (p === 'yt') {
            data = [
                { name: w('Channel Icon', 'أيقونة القناة'), size: '800 x 800 px' },
                { name: w('Channel Art', 'صورة القناة'), size: '2560 x 1440 px' },
                { name: w('Thumbnail', 'صورة مصغرة'), size: '1280 x 720 px' }
            ];
        } else if (p === 'tk') {
            data = [
                { name: w('Profile Photo', 'صورة الملف الشخصي'), size: '200 x 200 px' },
                { name: w('Video', 'فيديو'), size: '1080 x 1920 px' }
            ];
        }

        list.innerHTML = data.map(i => `
            <li style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.1);">
                <span style="opacity:0.9;">${i.name}</span>
                <strong style="color:var(--accent-cyan);">${i.size}</strong>
            </li>
        `).join('');
    },

    // 2. Caption Templates
    // ----------------------------------------------------------------
    renderCaption: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Category', 'الفئة')}</label>
                    <select id="capCat" class="glass-input">
                        <option value="promo">${t('Promotional / Sales', 'دعاية / مبيعات')}</option>
                        <option value="engage">${t('Engagement / Question', 'تفاعل / أسئلة')}</option>
                        <option value="quote">${t('Inspirational Quote', 'اقتباسات ملهمة')}</option>
                        <option value="new">${t('New Launch', 'إطلاق جديد')}</option>
                    </select>
                </div>
                <button onclick="ContentTools.genCaption()" class="btn-primary full-width">${t('Generate Template', 'توليد القالب')}</button>
                
                <div id="capResult" class="result-box hidden">
                    <textarea id="capOutput" class="glass-input" rows="4" readonly></textarea>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('capOutput').value)" class="tool-action" style="margin-top:8px;">${t('Copy', 'نسخ')}</button>
                </div>
            </div>
        `;
    },

    genCaption: function () {
        const cat = document.getElementById('capCat').value;
        const isAr = document.documentElement.lang === 'ar';
        let templates = [];

        if (cat === 'promo') {
            templates = isAr ? [
                "🔥 عرض لفترة محدودة! احصل على خصم 20% على [المنتج] اليوم. لا تفوت الفرصة! الرابط في البايو. #خصم #عرض",
                "جاهز لترقية [حياتك/عملك]؟ احصل على [المنتج] الآن ووفر الكثير. 🛍️ تسوق الآن:",
                "تنبيه تخفيضات! 🚨 أسعار محطمة على [الفئة] لمدة 24 ساعة فقط."
            ] : [
                "🔥 Limited Time Offer! Get 20% off on [Product] today. Don't miss out! Link in bio. #Sale #Deal",
                "Ready to upgrade your [Game/Life]? Grab [Product] now and save big. 🛍️ Shop now:",
                "Flash Sale Alert! 🚨 Prices slashed on [Category] for 24 hours only."
            ];
        } else if (cat === 'engage') {
            templates = isAr ? [
                "سؤال اليوم: ما هو أفضل [موضوع] بالنسبة لك؟ شاركنا في التعليقات! 👇",
                "اضغط لايك مرتين إذا كنت توافق! ❤️ ما هو الشيء الذي لا يمكنك العيش بدونه؟",
                "هذا أم ذاك؟ علق بـ 'أ' لـ [الخيار 1] أو 'ب' لـ [الخيار 2]! 🤜🤛"
            ] : [
                "Question of the day: What's your favorite [Topic]? Let us know below! 👇",
                "Double tap if you agree! ❤️ What's one thing you can't live without?",
                "This or That? Comment 'A' for [Option 1] or 'B' for [Option 2]! 🤜🤛"
            ];
        } else if (cat === 'quote') {
            templates = isAr ? [
                "\"الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.\" - ستيف جوبز ✨ #تحفيز",
                "استمر في المضي قدماً. كل ما تحتاجه سيأتي إليك في الوقت المناسب. 🌟",
                "احلم كبيراً. ابدأ صغيراً. تحرك الآن. 💪 #إلهام"
            ] : [
                "\"The only way to do great work is to love what you do.\" - Steve Jobs ✨ #Motivation",
                "Keep going. Everything you need will come to you at the perfect time. 🌟",
                "Dream big. Start small. Act now. 💪 #Inspiration"
            ];
        } else if (cat === 'new') {
            templates = isAr ? [
                "✨ وأخيراً وصل! نقدم لكم [اسم المنتج] - الحل الذي كنت تنتظره.",
                "أخبار كبيرة! 📣 أطلقنا للتو [الميزة/المنتج]. الدخول من الرابط في البايو!",
                "وصول جديد! 📦 كن أول من يحصل على أحدث تشكيلة لدينا."
            ] : [
                "✨ It's finally here! Introducing [Product Name] - the solution you've been waiting for.",
                "Big news! 📣 We just launched [Feature/Product]. Check it out now at the link in bio!",
                "New Arrival! 📦 Be the first to get your hands on our latest collection."
            ];
        }

        const rand = templates[Math.floor(Math.random() * templates.length)];
        document.getElementById('capOutput').value = rand;
        document.getElementById('capResult').classList.remove('hidden');
    },

    // 3. Content Ideas
    // ----------------------------------------------------------------
    renderIdeas: function (container) {
        const t = this._t;
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${t('Industry / Niche', 'المجال / التخصص')}</label>
                    <select id="ideaNiche" class="glass-input">
                        <option value="tech">${t('Technology / SaaS', 'تقنية / برمجيات')}</option>
                        <option value="fashion">${t('Fashion / Beauty', 'موضة / تجميل')}</option>
                        <option value="fitness">${t('Health & Fitness', 'صحة / لياقة')}</option>
                        <option value="food">${t('Food & Beverage', 'مطاعم / أغذية')}</option>
                        <option value="biz">${t('Business / Consultant', 'أعمال / استشارات')}</option>
                    </select>
                </div>
                <button onclick="ContentTools.genIdeas()" class="btn-primary full-width">${t('Get Weekly Plan', 'خطة أسبوعية')}</button>
                
                <div id="ideaResult" class="result-box hidden">
                    <ul id="ideaList" style="list-style:none; padding:0; line-height:1.8;"></ul>
                </div>
            </div>
        `;
    },

    genIdeas: function () {
        const niche = document.getElementById('ideaNiche').value;
        const list = document.getElementById('ideaList');
        const isAr = document.documentElement.lang === 'ar';
        let ideas = [];

        if (niche === 'tech') {
            ideas = isAr ? [
                "الاثنين: شارك نصيحة إنتاجية سريعة",
                "الأربعاء: خلف الكواليس لإعداداتك أو الكود",
                "الجمعة: قصة نجاح عميل أو شهادة"
            ] : [
                "Mon: Share a quick productivity tip/hack", "Wed: Behind the scenes of your setup/code", "Fri: Client success story or testimonial"
            ];
        } else if (niche === 'fashion') {
            ideas = isAr ? [
                "الاثنين: تفاصيل إطلالة اليوم (OOTD)",
                "الأربعاء: كيف تنسق [إكسسوار] بـ 3 طرق",
                "الجمعة: عرض خاص أو كتالوج عطلة نهاية الأسبوع"
            ] : [
                "Mon: Outfit of the Day (OOTD) breakdown", "Wed: How to style [Accessory] 3 ways", "Fri: Flash sale or weekend lookbook"
            ];
        } else if (niche === 'fitness') {
            ideas = isAr ? [
                "الاثنين: جرعة تحفيز للأسبوع",
                "الأربعاء: نصيحة لتمرين صحيح (فيديو)",
                "الجمعة: وصفة وجبة صحية خفيفة"
            ] : [
                "Mon: Monday Motivation logic/quote", "Wed: Workout technique tip (Video)", "Fri: Healthy snack recipe"
            ];
        } else if (niche === 'food') {
            ideas = isAr ? [
                "الاثنين: تسليط الضوء على مكون (فوائد)",
                "الأربعاء: وصفة سريعة في 15 دقيقة",
                "الجمعة: مراجعة مطعم أو وجبة مفتوحة"
            ] : [
                "Mon: Ingredient spotlight (Benefits)", "Wed: Quick 15-min recipe", "Fri: Restaurant review or cheat meal"
            ];
        } else if (niche === 'biz') {
            ideas = isAr ? [
                "الاثنين: تحليل لاتجاهات السوق",
                "الأربعاء: توصية بأداة/تطبيق مفيد",
                "الجمعة: إنجازات الأسبوع/دروس مستفادة"
            ] : [
                "Mon: Market trend analysis", "Wed: Tool/App recommendation", "Fri: Weekly wins/lessons learned"
            ];
        }

        list.innerHTML = ideas.map(i => `<li>✅ ${i}</li>`).join('');
        document.getElementById('ideaResult').classList.remove('hidden');
    },

    // 4. Basic Proofreading
    // ----------------------------------------------------------------
    renderProof: function (container) {
        const t = this._t;
        // Logic check: Capitalization only relevant for English mostly.
        const capOption = document.documentElement.lang === 'ar' ? '' : `
            <label style="font-size:12px; color:#aaa;"><input type="checkbox" id="proofCaps" checked> Fix Capitalization (Start of sentence)</label>
        `;

        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="proofInput" class="glass-input" rows="5" placeholder="${t('Paste your text here...', 'الصق النص هنا...')}"></textarea>
                <div class="input-row" style="margin-top:10px;">
                    <label style="font-size:12px; color:#aaa;"><input type="checkbox" id="proofSpace" checked> ${t('Fix Double Spaces', 'إصلاح المسافات المكررة')}</label>
                    ${capOption}
                </div>
                <button onclick="ContentTools.runProof()" class="btn-primary full-width" style="margin-top:10px;">${t('Check & Fix', 'فحص وإصلاح')}</button>
                
                <div id="proofResult" class="result-box hidden">
                    <textarea id="proofOutput" class="glass-input" rows="5" readonly></textarea>
                </div>
            </div>
        `;
    },

    runProof: function () {
        let text = document.getElementById('proofInput').value;
        if (!text) return;

        if (document.getElementById('proofSpace').checked) {
            text = text.replace(/[ ]{2,}/g, ' ');
        }

        const caps = document.getElementById('proofCaps');
        if (caps && caps.checked) {
            // Capitalize first letter
            text = text.charAt(0).toUpperCase() + text.slice(1);
            // Capitalize after . ! ?
            text = text.replace(/([.!?]\s+)([a-z])/g, (match, sep, char) => sep + char.toUpperCase());
        }

        document.getElementById('proofOutput').value = text;
        document.getElementById('proofResult').classList.remove('hidden');
    }
};

window.ContentTools = ContentTools;
