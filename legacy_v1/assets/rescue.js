// RESCUE SCRIPT - GUARANTEES INTERACTIVITY (AGGRESSIVE MODE)
// Runs independently of app.js module system

(function () {
    console.log("🚀 Rescue Script Loaded: Aggressive Mode");

    // 1. Definition of Safe Open Function
    window.openTool = function (id) {
        console.log("✅ Rescue Open: " + id);
        // FORCE ALERT FOR USER FEEDBACK
        alert("🎉 Click Received! Opening tool: " + id);

        // Populate Title
        if (window.ALL_TOOLS) {
            const tool = window.ALL_TOOLS.find(t => t.id === id);
            const isAr = document.documentElement.lang === 'ar';
            if (tool) {
                const title = (isAr && tool.titleAr) ? tool.titleAr : tool.title;
                const modalTitle = document.getElementById('modalTitle');
                if (modalTitle) modalTitle.innerText = title;
            }
        }

        // Show Modal
        const overlay = document.getElementById('modalOverlay');
        const bodyEl = document.getElementById('modalBody');

        if (overlay) {
            overlay.classList.add('active');
            overlay.style.display = 'flex'; // Force flex
            overlay.style.pointerEvents = 'auto'; // Force interaction
            document.body.style.overflow = 'hidden';

            // Fallback Content
            if (bodyEl && bodyEl.innerHTML.trim() === "") {
                bodyEl.innerHTML = `<div style="text-align:center; padding:40px;">
                    <h3>Loading Tool...</h3>
                    <p>If this persists, please refresh.</p>
                </div>`;
            }
        } else {
            alert("Error: Modal overlay not found in DOM.");
        }
    };

    // 2. Global Close
    window.closeModal = function () {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => { if (!overlay.classList.contains('active')) overlay.style.display = 'none'; }, 300);
            document.body.style.overflow = '';
        }
    };

    // 3. Rendering Rescue (If app.js fails)
    setTimeout(() => {
        const grid = document.getElementById('toolsGrid');
        if (grid && grid.children.length === 0 && window.ALL_TOOLS) {
            console.warn("⚠️ App.js failed to render tools. Engaging Rescue Renderer.");
            renderRescueIds(grid, window.ALL_TOOLS);
        }
    }, 1500); // Wait 1.5s for main app

    // 3. Rendering Rescue
    function renderRescueIds(grid, tools) {
        const isAr = document.documentElement.lang === 'ar';
        grid.innerHTML = tools.map(tool => {
            const title = (isAr && tool.titleAr) ? tool.titleAr : tool.title;
            const desc = (isAr && tool.descAr) ? tool.descAr : tool.desc;
            return `
            <div class="glass-panel tool-card animated-card" style="position:relative; min-height:200px; display:flex; flex-direction:column;">
                <!-- CLICK SHIELD: Covers everything -->
                <a href="javascript:void(0)" 
                   onclick="window.openTool('${tool.id}')"
                   style="position:absolute; inset:0; z-index:100; cursor:pointer;"
                   aria-label="Open ${title}"></a>

                <div class="card-content-wrapper" style="pointer-events:none;">
                    <div style="font-size:32px; margin-bottom:15px;">🚀</div>
                    <div class="tool-title" style="font-weight:bold; margin-bottom:5px;">${title}</div>
                    <div class="tool-desc" style="font-size:0.9em; opacity:0.8;">${desc}</div>
                </div>
            </div>`;
        }).join('');
    }

    setTimeout(() => {
        const grid = document.getElementById('toolsGrid');
        if (grid && grid.children.length === 0 && window.ALL_TOOLS) {
            console.warn("⚠️ App.js failed to render tools. Engaging Rescue Renderer.");
            renderRescueIds(grid, window.ALL_TOOLS);
        }
    }, 1500);

    // 4. Brute Force Click Shield Injector
    // If app.js renders clean cards, this retro-fits the shield onto them
    setInterval(() => {
        const cards = document.querySelectorAll('.tool-card');
        cards.forEach(card => {
            // Check if shield exists
            if (!card.querySelector('.click-shield')) {
                const id = card.getAttribute('data-id');
                if (id) {
                    // Create Shield
                    const shield = document.createElement('a');
                    shield.className = 'click-shield';
                    shield.href = 'javascript:void(0)';
                    shield.onclick = function (e) {
                        e.preventDefault();
                        window.openTool(id);
                    };
                    // Styling
                    shield.style.position = 'absolute';
                    shield.style.inset = '0';
                    shield.style.zIndex = '100'; // High enough to cover content, low enough for Favorites?
                    shield.style.cursor = 'pointer';

                    // Handle Favorite Button Interaction (Z-Index war)
                    const favBtn = card.querySelector('.fav-btn');
                    if (favBtn) favBtn.style.zIndex = '101'; // Pop fav button above shield

                    card.appendChild(shield);
                    card.style.position = 'relative'; // Ensure absolute child relates to this
                }
            }
        });
    }, 1000);

    /* 
    // 5. NUCLEAR OPTION: Unregister Service Worker to clear bad cache
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
                console.log('🔥 Rescue: Unregistering Service Worker to Force Update');
                registration.unregister();
            }
        });
    }

    // 6. Visual Confirmation (So User Knows It's Fixed)
    const badge = document.createElement('div');
    badge.innerHTML = "✅ Rescue Active";
    badge.style.position = 'fixed';
    badge.style.bottom = '10px';
    badge.style.left = '10px';
    badge.style.background = '#22c55e';
    badge.style.color = 'white';
    badge.style.padding = '5px 10px';
    badge.style.borderRadius = '20px';
    badge.style.fontSize = '12px';
    badge.style.zIndex = '9999';
    badge.style.fontFamily = 'sans-serif';
    document.body.appendChild(badge);
    */
})();
