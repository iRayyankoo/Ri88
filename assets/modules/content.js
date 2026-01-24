
window.ContentTools = {

    // --- CAPTION TEMPLATES (Address Templates) ---
    renderCaption: (container) => {
        const isAr = document.documentElement.lang === 'ar';

        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${isAr ? 'الموضوع / الكلمة المفتاحية' : 'Topic / Keyword'}</label>
                    <input type="text" id="capTopic" class="glass-input" placeholder="${isAr ? 'مثال: القهوة، التسويق، الرياضة' : 'e.g. Coffee, Marketing, Fitness'}">
                </div>

                <div class="input-row">
                    <label>${isAr ? 'نوع المحتوى' : 'Content Type'}</label>
                    <select id="capType" class="glass-input">
                        <option value="all">${isAr ? 'الكل' : 'All Types'}</option>
                        <option value="list">${isAr ? 'قوائم (5 طرق لـ...)' : 'Listicle (5 Ways to...)'}</option>
                        <option value="question">${isAr ? 'سؤال ومشاركة' : 'Question / Engagement'}</option>
                        <option value="howto">${isAr ? 'كيف (شروحات)' : 'How-To / Educational'}</option>
                        <option value="promo">${isAr ? 'ترويجي / بيع' : 'Promotional / Sales'}</option>
                    </select>
                </div>

                <button onclick="ContentTools.generateCaptions()" class="btn-primary full-width">
                    ${isAr ? '✨ توليد العناوين' : '✨ Generate Captions'}
                </button>

                <div id="capResults" class="result-box hidden" style="margin-top:20px; max-height:300px; overflow-y:auto;">
                    <!-- Results injected here -->
                </div>
            </div>
        `;

        // Initialize Internal Logic
        ContentTools.generateCaptions = () => {
            const topic = document.getElementById('capTopic').value.trim();
            const type = document.getElementById('capType').value;
            const resBox = document.getElementById('capResults');

            if (!topic) {
                alert(isAr ? 'الرجاء إدخال موضوع!' : 'Please enter a topic!');
                return;
            }

            const templates = {
                en: {
                    list: [
                        "5 Reasons Why {t} is the Future",
                        "Top 10 Tips for {t} You Need to Know",
                        "3 Secrets About {t} No One Tells You",
                        "The {t} Checklist: Everything You Need",
                        "7 Ways {t} Can Change Your Life"
                    ],
                    question: [
                        "Have you ever tried {t}?",
                        "What's your biggest challenge with {t}?",
                        "Do you prefer {t} or [Alternative]?",
                        "Who else loves {t} as much as I do?",
                        "What is the first thing you think of when you hear {t}?"
                    ],
                    howto: [
                        "How to Master {t} in 3 Simple Steps",
                        "The Ultimate Guide to {t}",
                        "How I Improved My {t} in One Week",
                        "Beginner's Guide to {t}",
                        "Stop Doing {t} Wrong! Here is How."
                    ],
                    promo: [
                        "Don't miss out on our latest {t} offer!",
                        "Get the best {t} deals today.",
                        "Upgrade your life with {t}.",
                        "Limited time offer on all {t} products!",
                        "Why our {t} is the best in the market."
                    ]
                },
                ar: {
                    list: [
                        "٥ أسباب تجعل {t} هو المستقبل",
                        "أهم ١٠ نصائح حول {t} يجب أن تعرفها",
                        "٣ أسرار عن {t} لا يخبرك بها أحد",
                        "قائمة {t}: كل ما تحتاجه للبدء",
                        "٧ طرق يمكن لـ {t} أن يغير حياتك بها"
                    ],
                    question: [
                        "هل جربت {t} من قبل؟",
                        "ما هو أكبر تحدي يواجهك مع {t}؟",
                        "بصراحة.. تفضل {t} ولا البديل؟",
                        "مين هنا يعشق {t} مثلي؟",
                        "وش أول شي يجي ببالك لما تسمع طاري {t}؟"
                    ],
                    howto: [
                        "كيف تحترف {t} في ٣ خطوات بسيطة",
                        "الدليل الشامل لـ {t}",
                        "كيف طورت معرفتي بـ {t} في أسبوع واحد",
                        "دليل المبتدئين في عالم {t}",
                        "لا تغلط نفس الغلطة مع {t}! إليك الطريقة الصحيحة."
                    ],
                    promo: [
                        "لا تفوت عروضنا الجديدة على {t}!",
                        "احصل على أفضل صفقات {t} اليوم.",
                        "ارتقِ بحياتك مع {t}.",
                        "عرض لفترة محدودة على جميع منتجات {t}!",
                        "لماذا يعتبر {t} لدينا هو الأفضل في السوق؟"
                    ]
                }
            };

            const lang = isAr ? 'ar' : 'en';
            let selectedTemplates = [];

            if (type === 'all') {
                selectedTemplates = [
                    ...templates[lang].list,
                    ...templates[lang].question,
                    ...templates[lang].howto,
                    ...templates[lang].promo
                ];
            } else {
                selectedTemplates = templates[lang][type] || [];
            }

            // Shuffle
            selectedTemplates = selectedTemplates.sort(() => 0.5 - Math.random());

            let html = `<h4>${isAr ? 'النتائج المقترحة:' : 'Suggested Captions:'}</h4><ul style="list-style:none; padding:0;">`;

            selectedTemplates.forEach(tmpl => {
                const finalCaption = tmpl.replace('{t}', `<span style="color:var(--accent-pink); font-weight:bold;">${topic}</span>`);
                html += `
                    <li style="background:rgba(255,255,255,0.05); padding:10px; margin-bottom:8px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                        <span>${finalCaption}</span>
                        <button onclick="navigator.clipboard.writeText('${tmpl.replace('{t}', topic)}'); this.innerText='Done!'" class="btn-secondary" style="font-size:12px; padding:4px 8px;">
                            ${isAr ? 'نسخ' : 'Copy'}
                        </button>
                    </li>
                `;
            });
            html += '</ul>';

            resBox.innerHTML = html;
            resBox.classList.remove('hidden');
        };
    },

    // --- CONTENT IDEAS ---
    renderIdeas: function (container) {
        const isAr = document.documentElement.lang === 'ar';
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>${isAr ? 'المجال / النيش' : 'Niche / Industry'}</label>
                    <input type="text" id="ideaNiche" class="glass-input" placeholder="${isAr ? 'مثال: العناية بالبشرة، التقنية' : 'e.g. Skin Care, Tech'}">
                </div>
                <button onclick="ContentTools.genIdeas()" class="btn-primary full-width">
                    ${isAr ? '💡 اقترح أفكار' : '💡 Generate Ideas'}
                </button>
                <div id="ideaRes" class="result-box hidden" style="margin-top:20px;"></div>
            </div>
        `;

        ContentTools.genIdeas = () => {
            const niche = document.getElementById('ideaNiche').value.trim() || (isAr ? 'عام' : 'General');
            const ideas = isAr ? [
                `كيف تبدأ في ${niche} من الصفر`,
                `٥ أخطاء شائعة في ${niche} وكيف تتجنبها`,
                `قصة نجاحي مع ${niche} (دروس مستفادة)`,
                `الأدوات التي أستخدمها لـ ${niche}`,
                `مستقبل ${niche} في ٢٠٢٤`,
                `مقارنة: ${niche} الغالي vs الرخيص`
            ] : [
                `How to start ${niche} from scratch`,
                `5 Common mistakes in ${niche} to avoid`,
                `My success story with ${niche}`,
                `Top tools I use for ${niche}`,
                `The future of ${niche} in 2024`,
                `Comparison: Cheap vs Expensive ${niche}`
            ];

            document.getElementById('ideaRes').innerHTML = `
                <ul style="list-style:none; padding:0;">
                    ${ideas.map(i => `<li style="margin-bottom:10px; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px;">${i}</li>`).join('')}
                </ul>
             `;
            document.getElementById('ideaRes').classList.remove('hidden');
        };
    },

    // --- SOCIAL SIZES ---
    renderSocialSizes: function (container) {
        const isAr = document.documentElement.lang === 'ar';
        const sizes = {
            'Instagram': { 'Post': '1080 x 1080', 'Story': '1080 x 1920', 'Portrait': '1080 x 1350' },
            'Twitter (X)': { 'Post': '1600 x 900', 'Header': '1500 x 500' },
            'TikTok': { 'Video': '1080 x 1920' },
            'LinkedIn': { 'Post': '1200 x 1200', 'Cover': '1128 x 191' },
            'YouTube': { 'Thumbnail': '1280 x 720', 'Banner': '2560 x 1440' }
        };

        let html = `<div class="tool-ui-group"><div style="display:grid; gap:15px;">`;
        for (let platform in sizes) {
            html += `<div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px;">
                <strong style="color:var(--accent-cyan); display:block; margin-bottom:8px;">${platform}</strong>
                ${Object.entries(sizes[platform]).map(([k, v]) =>
                `<div style="display:flex; justify-content:space-between; font-size:0.9em; margin-bottom:4px;">
                        <span>${k}</span><span style="font-family:monospace;">${v}</span>
                    </div>`).join('')}
            </div>`;
        }
        html += `</div></div>`;
        container.innerHTML = html;
    },

    // --- PROOFREADING (Simulated) ---
    renderProof: function (container) {
        const isAr = document.documentElement.lang === 'ar';
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="proofTxt" class="glass-input" style="height:150px;" placeholder="${isAr ? 'ضع النص هنا للتدقيق...' : 'Paste text to check...'}"></textarea>
                <button onclick="ContentTools.runProof()" class="btn-primary full-width" style="margin-top:10px;">
                    ${isAr ? '🔍 فحص النص' : '🔍 Check Text'}
                </button>
                <div id="proofRes" class="result-box hidden" style="margin-top:10px;"></div>
            </div>
        `;

        ContentTools.runProof = () => {
            const txt = document.getElementById('proofTxt').value;
            // Simple regex checks for demonstration
            let issues = [];
            if (txt.includes('  ')) issues.push(isAr ? 'مسافات مزدوجة' : 'Double spaces found');
            if (txt.match(/[?!]{2,}/)) issues.push(isAr ? 'تكرار علامات الترقيم' : 'Repeated punctuation');
            if (isAr && txt.match(/ى /)) issues.push('استخدام "ى" بدلاً من "ي" (تحقق من السياق)');
            if (!isAr && txt.match(/ i /)) issues.push('Lowercase "i" found');

            const res = document.getElementById('proofRes');
            if (issues.length === 0) {
                res.innerHTML = `<span style="color:#2ecc71">✅ ${isAr ? 'يبدو النص جيداً' : 'Text looks good'}</span>`;
            } else {
                res.innerHTML = `<strong style="color:#e74c3c">${isAr ? 'ملاحظات:' : 'Issues:'}</strong><ul>${issues.map(i => `<li>${i}</li>`).join('')}</ul>`;
            }
            res.classList.remove('hidden');
        };
    }
};
