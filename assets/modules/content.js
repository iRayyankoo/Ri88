/**
 * Content Creation Tools Module
 * Logic for Social Media Sizes, Caption Helper
 */

const ContentTools = {
    // 1. Social Media Sizes
    // ----------------------------------------------------------------
    renderSocial: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Platform</label>
                    <select id="smPlatform" class="glass-input" onchange="ContentTools.updateSizes()">
                        <option value="ig">Instagram</option>
                        <option value="tw">X (Twitter)</option>
                        <option value="li">LinkedIn</option>
                        <option value="yt">YouTube</option>
                        <option value="tk">TikTok</option>
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

        if (p === 'ig') {
            data = [
                { name: 'Profile Photo', size: '320 x 320 px' },
                { name: 'Square Post', size: '1080 x 1080 px' },
                { name: 'Portrait Post', size: '1080 x 1350 px' },
                { name: 'Stories / Reels', size: '1080 x 1920 px' }
            ];
        } else if (p === 'tw') {
            data = [
                { name: 'Profile Photo', size: '400 x 400 px' },
                { name: 'Header Photo', size: '1500 x 500 px' },
                { name: 'In-Stream Image', size: '1600 x 900 px' }
            ];
        } else if (p === 'li') {
            data = [
                { name: 'Profile Photo', size: '400 x 400 px' },
                { name: 'Cover Photo', size: '1128 x 191 px' },
                { name: 'Shared Image', size: '1200 x 627 px' }
            ];
        } else if (p === 'yt') {
            data = [
                { name: 'Channel Icon', size: '800 x 800 px' },
                { name: 'Channel Art', size: '2560 x 1440 px' },
                { name: 'Thumbnail', size: '1280 x 720 px' }
            ];
        } else if (p === 'tk') {
            data = [
                { name: 'Profile Photo', size: '200 x 200 px' },
                { name: 'Video', size: '1080 x 1920 px' }
            ];
        }

        list.innerHTML = data.map(i => `
            <li style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.1);">
                <span style="opacity:0.9;">${i.name}</span>
                <strong style="color:var(--accent-cyan);">${i.size}</strong>
            </li>
        `).join('');
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
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Category</label>
                    <select id="capCat" class="glass-input">
                        <option value="promo">Promotional / Sales</option>
                        <option value="engage">Engagement / Question</option>
                        <option value="quote">Inspirational Quote</option>
                        <option value="new">New Launch</option>
                    </select>
                </div>
                <button onclick="ContentTools.genCaption()" class="btn-primary full-width">Generate Template</button>
                
                <div id="capResult" class="result-box hidden">
                    <textarea id="capOutput" class="glass-input" rows="4" readonly></textarea>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('capOutput').value)" class="tool-action" style="margin-top:8px;">Copy</button>
                </div>
            </div>
        `;
    },

    genCaption: function () {
        const cat = document.getElementById('capCat').value;
        let templates = [];

        if (cat === 'promo') {
            templates = [
                "🔥 Limited Time Offer! Get 20% off on [Product] today. Don't miss out! Link in bio. #Sale #Deal",
                "Ready to upgrade your [Game/Life]? Grab [Product] now and save big. 🛍️ Shop now:",
                "Flash Sale Alert! 🚨 Prices slashed on [Category] for 24 hours only."
            ];
        } else if (cat === 'engage') {
            templates = [
                "Question of the day: What's your favorite [Topic]? Let us know below! 👇",
                "Double tap if you agree! ❤️ What's one thing you can't live without?",
                "This or That? Comment 'A' for [Option 1] or 'B' for [Option 2]! 🤜🤛"
            ];
        } else if (cat === 'quote') {
            templates = [
                "\"The only way to do great work is to love what you do.\" - Steve Jobs ✨ #Motivation",
                "Keep going. Everything you need will come to you at the perfect time. 🌟",
                "Dream big. Start small. Act now. 💪 #Inspiration"
            ];
        } else if (cat === 'new') {
            templates = [
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
        container.innerHTML = `
            <div class="tool-ui-group">
                <div class="input-row">
                    <label>Industry / Niche</label>
                    <select id="ideaNiche" class="glass-input">
                        <option value="tech">Technology / SaaS</option>
                        <option value="fashion">Fashion / Beauty</option>
                        <option value="fitness">Health & Fitness</option>
                        <option value="food">Food & Beverage</option>
                        <option value="biz">Business / Consultant</option>
                    </select>
                </div>
                <button onclick="ContentTools.genIdeas()" class="btn-primary full-width">Get Weekly Plan</button>
                
                <div id="ideaResult" class="result-box hidden">
                    <ul id="ideaList" style="list-style:none; padding:0; line-height:1.8;"></ul>
                </div>
            </div>
        `;
    },

    genIdeas: function () {
        const niche = document.getElementById('ideaNiche').value;
        const list = document.getElementById('ideaList');
        let ideas = [];

        if (niche === 'tech') {
            ideas = ["Mon: Share a quick productivity tip/hack", "Wed: Behind the scenes of your setup/code", "Fri: Client success story or testimonial"];
        } else if (niche === 'fashion') {
            ideas = ["Mon: Outfit of the Day (OOTD) breakdown", "Wed: How to style [Accessory] 3 ways", "Fri: Flash sale or weekend lookbook"];
        } else if (niche === 'fitness') {
            ideas = ["Mon: Monday Motivation logic/quote", "Wed: Workout technique tip (Video)", "Fri: Healthy snack recipe"];
        } else if (niche === 'food') {
            ideas = ["Mon: Ingredient spotlight (Benefits)", "Wed: Quick 15-min recipe", "Fri: Restaurant review or cheat meal"];
        } else if (niche === 'biz') {
            ideas = ["Mon: Market trend analysis", "Wed: Tool/App recommendation", "Fri: Weekly wins/lessons learned"];
        }

        list.innerHTML = ideas.map(i => `<li>✅ ${i}</li>`).join('');
        document.getElementById('ideaResult').classList.remove('hidden');
    },

    // 4. Basic Proofreading
    // ----------------------------------------------------------------
    renderProof: function (container) {
        container.innerHTML = `
            <div class="tool-ui-group">
                <textarea id="proofInput" class="glass-input" rows="5" placeholder="Paste your text here..."></textarea>
                <div class="input-row" style="margin-top:10px;">
                    <label style="font-size:12px; color:#aaa;"><input type="checkbox" id="proofSpace" checked> Fix Double Spaces</label>
                    <label style="font-size:12px; color:#aaa;"><input type="checkbox" id="proofCaps" checked> Fix Capitalization (Start of sentence)</label>
                </div>
                <button onclick="ContentTools.runProof()" class="btn-primary full-width" style="margin-top:10px;">Check & Fix</button>
                
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
        if (document.getElementById('proofCaps').checked) {
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
