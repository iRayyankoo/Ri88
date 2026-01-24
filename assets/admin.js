import { auth, db } from './firebase-config.js';
import { defaultTools } from './tools-data.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, writeBatch, getDoc, updateDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("Admin module loaded.");

// DOM Elements
const loginForm = document.getElementById('loginForm');
const toolForm = document.getElementById('toolForm');
const modalElement = document.getElementById('toolModal');

// Announcement Logic
const bannerText = document.getElementById('bannerText');
const bannerActive = document.getElementById('bannerActive');
const saveBannerBtn = document.getElementById('saveBannerBtn');

// Maintenance Logic
const maintenanceActive = document.getElementById('maintenanceActive');
const maintenanceStatus = document.getElementById('maintenanceStatus');

// Theme Logic
const themePrimary = document.getElementById('themePrimary');
const themeSecondary = document.getElementById('themeSecondary');
const saveThemeBtn = document.getElementById('saveThemeBtn');

// Ad Logic
const adFooter = document.getElementById('adFooter');
const adsActive = document.getElementById('adsActive');
const saveAdsBtn = document.getElementById('saveAdsBtn');

// Load Configs
async function loadConfigs() {
    try {
        // Banner
        const bannerSnap = await getDoc(doc(db, "config", "announcement"));
        if (bannerSnap.exists()) {
            const data = bannerSnap.data();
            if (bannerText) bannerText.value = data.text || "";
            if (bannerActive) bannerActive.checked = data.active || false;
        }

        // Maintenance
        const maintSnap = await getDoc(doc(db, "config", "maintenance"));
        if (maintSnap.exists()) {
            const active = maintSnap.data().active || false;
            if (maintenanceActive) {
                maintenanceActive.checked = active;
                updateMaintUI(active);
            }
        }

        // Theme
        const themeSnap = await getDoc(doc(db, "config", "theme"));
        if (themeSnap.exists()) {
            const data = themeSnap.data();
            if (themePrimary) themePrimary.value = data.primary || "#6D4CFF";
            if (themeSecondary) themeSecondary.value = data.secondary || "#FF4C9F";
        }

        // Ads
        const adSnap = await getDoc(doc(db, "config", "ads"));
        if (adSnap.exists()) {
            const data = adSnap.data();
            if (adFooter) adFooter.value = data.footer_code || "";
            if (adsActive) adsActive.checked = data.active || false;
        }
    } catch (e) {
        console.error("Error loading configs:", e);
    }
}

// Save Ads
if (saveAdsBtn) {
    saveAdsBtn.addEventListener('click', async () => {
        try {
            await setDoc(doc(db, "config", "ads"), {
                footer_code: adFooter.value,
                active: adsActive.checked,
                updatedAt: new Date()
            });
            alert("Ad configuration saved!");
        } catch (e) {
            console.error(e);
            alert("Error saving ads.");
        }
    });
}

// Save Theme
if (saveThemeBtn) {
    saveThemeBtn.addEventListener('click', async () => {
        try {
            await setDoc(doc(db, "config", "theme"), {
                primary: themePrimary.value,
                secondary: themeSecondary.value,
                updatedAt: new Date()
            });
            alert("Theme updated! Refresh the main site to see changes.");
        } catch (e) {
            console.error(e);
            alert("Failed to save theme.");
        }
    });
}

window.resetTheme = async () => {
    if (confirm("Reset to default colors?")) {
        themePrimary.value = "#6D4CFF";
        themeSecondary.value = "#FF4C9F";
        saveThemeBtn.click();
    }
};

function updateMaintUI(active) {
    if (maintenanceStatus) {
        maintenanceStatus.innerText = active ? "ACTIVE (LOCKED)" : "OFF";
        maintenanceStatus.style.color = active ? "#ff4757" : "#2ed573";
    }
}

if (maintenanceActive) {
    maintenanceActive.addEventListener('change', async (e) => {
        const active = e.target.checked;
        updateMaintUI(active);
        try {
            await setDoc(doc(db, "config", "maintenance"), { active: active, updatedAt: new Date() });
        } catch (err) {
            alert("Failed to update maintenance mode.");
            e.target.checked = !active; // Revert
            updateMaintUI(!active);
        }
    });
}

// Save Banner Config
if (saveBannerBtn) {
    saveBannerBtn.addEventListener('click', async () => {
        try {
            const docRef = doc(db, "config", "announcement");
            await setDoc(docRef, {
                text: bannerText.value,
                active: bannerActive.checked,
                updatedAt: new Date()
            });
            alert("Banner updated successfully!");
        } catch (e) {
            console.error("Error saving banner:", e);
            alert("Failed to save banner.");
        }
    });
}


// Login Logic
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            document.getElementById('loginError').innerText = error.message;
            document.getElementById('loginError').style.display = 'block';
        }
    });
}

// Analytics Logic
// Delegation: Listen on document to ensure we catch the click even if timing is off
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'embedUrlBtn') {
        const url = prompt('Enter your Looker Studio Embed URL (must start with https://lookerstudio.google.com/embed/):');
        if (!url) return;

        if (url.startsWith('https://lookerstudio.google.com/embed/')) {
            localStorage.setItem('rayyan_analytics_url', url);
            loadAnalytics();
        } else {
            alert('Invalid URL! Must be a valid Looker Studio embed link.');
        }
    }
});

function loadAnalytics() {
    const url = localStorage.getItem('rayyan_analytics_url');
    const container = document.getElementById('embedContainer');
    if (url && container) {
        container.innerHTML = `<iframe width='100%' height='100%' src='${url}' frameborder='0' style='border:0' allowfullscreen></iframe>`;
    }
}

async function fetchStats() {
    try {
        const docRef = doc(db, "stats", "general");
        const docSnap = await getDoc(docRef);
        const countEl = document.getElementById('visitorCount');
        if (countEl) {
            if (docSnap.exists()) {
                countEl.innerText = docSnap.data().visitors || 0;
            } else {
                countEl.innerText = 0;
            }
        }
    } catch (e) {
        console.error("Stats error:", e);
        const countEl = document.getElementById('visitorCount');
        if (countEl) countEl.innerText = "-";
    }
}

// Auth State
onAuthStateChanged(auth, (user) => {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');

    if (user) {
        if (loginSection) loginSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'block';
        loadTools();
        fetchStats();
        loadAnalytics();
        fetchStats();
        loadAnalytics();
        loadConfigs(); // Load banner & maintenance
        loadSearchStats(); // Load failed searches
        loadMessages(); // Load inbox
        loadCategories(); // Load categories
        renderChart(); // Load visual analytics
        loadTranslations(); // Load translations
        loadArticles(); // Load blog posts
    } else {
        if (loginSection) loginSection.style.display = 'block';
        if (dashboardSection) dashboardSection.style.display = 'none';
    }
});

window.logout = () => signOut(auth);

// Sort Logic
const sortBtn = document.getElementById('sortBtn');
if (sortBtn) {
    sortBtn.addEventListener('click', () => {
        currentSort = currentSort === 'default' ? 'views' : 'default';
        sortBtn.innerText = currentSort === 'views' ? '🔥 Views' : '📊 Sort';
        loadTools();
    });
}

// Tool Management
const toolsCol = collection(db, 'tools');
let currentSort = 'default';

async function loadTools() {
    const list = document.getElementById('toolList');
    const loading = document.getElementById('loading');
    const setupWarning = document.getElementById('setupWarning');

    if (!list) return;

    list.innerHTML = '';
    if (loading) loading.style.display = 'block';

    try {
        const querySnapshot = await getDocs(toolsCol);
        let docs = [];
        querySnapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));

        if (currentSort === 'views') {
            docs.sort((a, b) => (b.views || 0) - (a.views || 0));
        }

        if (setupWarning) {
            if (docs.length === 0) {
                setupWarning.style.display = 'block';
            } else {
                setupWarning.style.display = 'none';
            }
        }

        docs.forEach((t) => {
            const item = document.createElement('div');
            item.className = 'tool-item';
            // Dim if hidden
            if (t.hidden) item.style.opacity = '0.5';

            item.innerHTML = `
                <div class="tool-info">
                    <h4>${t.title} / ${t.titleAr} 
                        ${t.hidden ? '<span style="color:red; font-size:0.8em;">(Hidden)</span>' : ''}
                        <span style="font-size:0.8em; color:#ffd700; margin-left:5px;">★ ${t.views || 0}</span>
                    </h4>
                    <p>${t.desc}</p>
                    <small style="color:var(--accent-purple);">${t.cat} | ${t.id}</small>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <button onclick="toggleVisibility('${t.id}', ${t.hidden || false})" class="btn-success" style="padding:8px 12px; font-size:1.2em;" title="Toggle Visibility">
                        ${t.hidden ? '👁️‍🗨️' : '👁️'}
                    </button>
                    <button onclick="editTool('${t.id}')" class="btn-primary" style="padding:8px 16px; width:auto;">Edit</button>
                    <button onclick="removeTool('${t.id}')" class="btn-danger">Delete</button>
                </div>
            `;
            list.appendChild(item);
        });
    } catch (e) {
        console.error("Error loading tools:", e);
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

// Import Old Tools (Seeding)
window.importOldTools = async () => {
    if (!confirm("This will add " + defaultTools.length + " tools to your database. Continue?")) return;

    const loading = document.getElementById('loading');
    if (loading) {
        loading.innerText = "Importing tools... please wait.";
        loading.style.display = 'block';
    }

    // Batch writes (limit 500 per batch)
    const batch = writeBatch(db);

    defaultTools.forEach(tool => {
        // Use tool.id as doc ID for easier referencing
        const docRef = doc(db, "tools", tool.id);
        batch.set(docRef, tool);
    });

    try {
        await batch.commit();
        alert("Success! Tools imported.");
        window.location.reload();
    } catch (e) {
        alert("Error importing: " + e.message);
        console.error(e);
    }
};

// Form Handling
if (toolForm) {
    toolForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('toolDocId').value;
        const data = {
            id: document.getElementById('toolId').value,
            cat: document.getElementById('toolCat').value,
            title: document.getElementById('toolTitle').value,
            titleAr: document.getElementById('toolTitleAr').value,
            desc: document.getElementById('toolDesc').value,
            descAr: document.getElementById('toolDescAr').value,
            icon: document.getElementById('toolIcon').value || 'box'
        };

        if (id) {
            await setDoc(doc(db, 'tools', id), data);
        } else {
            await addDoc(toolsCol, data);
        }
        closeModal();
        loadTools();
    });
}

window.removeTool = async (id) => {
    if (confirm('Are you sure?')) {
        await deleteDoc(doc(db, 'tools', id));
        loadTools();
    }
};

// Modal Logic
window.openModal = () => {
    if (modalElement) modalElement.style.display = 'flex';
};

window.closeModal = () => {
    if (modalElement) {
        modalElement.style.display = 'none';
        if (toolForm) toolForm.reset();
        document.getElementById('toolDocId').value = '';
    }
};

// Close on outside click
if (modalElement) {
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) closeModal();
    });
}

// Expose edit for onclick
window.editTool = async (docId) => {
    // Ideally we fetch the doc data and populate the form
    // For now, simpler implementation:
    const docRef = doc(db, "tools", docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('toolId').value = data.id;
        document.getElementById('toolCat').value = data.cat;
        document.getElementById('toolTitle').value = data.title;
        document.getElementById('toolTitleAr').value = data.titleAr;
        document.getElementById('toolDesc').value = data.desc;
        document.getElementById('toolDescAr').value = data.descAr;
        document.getElementById('toolIcon').value = data.icon;
        document.getElementById('toolDocId').value = docId;

        openModal();
        document.getElementById('modalTitle').innerText = "Edit Tool";
    }
};

window.toggleVisibility = async (id, currentHiddenState) => {
    try {
        await updateDoc(doc(db, 'tools', id), {
            hidden: !currentHiddenState
        });
        loadTools();
    } catch (e) {
        alert("Error updating visibility: " + e.message);
    }
};

// Search Stats Logic
async function loadSearchStats() {
    const list = document.getElementById('missedSearchList');
    if (!list) return;

    try {
        const q = query(collection(db, "stats_search"), orderBy("timestamp", "desc"), limit(10));
        const querySnapshot = await getDocs(q);

        list.innerHTML = '';
        if (querySnapshot.empty) {
            list.innerHTML = '<li style="padding:10px; color:#aaa;">No data yet.</li>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : 'Just now';
            const item = document.createElement('li');
            item.style.padding = '10px';
            item.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
            item.innerHTML = `
                <span style="color:var(--accent-pink); font-weight:bold;">"${data.term}"</span>
                <span style="float:right; font-size:0.8em; color:#aaa;">${date}</span>
            `;
            list.appendChild(item);
        });
    } catch (e) {
        console.error("Error loading search stats:", e);
        list.innerHTML = '<li style="color:salmon;">Error loading stats. Check console.</li>';
    }
}
