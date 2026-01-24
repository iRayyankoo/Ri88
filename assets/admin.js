
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc, updateDoc, setDoc, addDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";
import { defaultTools } from "./tools-data.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Data Cache
let tools = [];
let articles = [];
let categories = ['finance', 'productivity', 'text', 'time', 'content', 'image', 'pdf', 'health', 'saudi', 'developer', 'sports'];

// --- UTILS ---
window.logAction = async (action, details) => {
    try { await addDoc(collection(db, "audit_logs"), { action, details, timestamp: new Date(), user: "Admin" }); }
    catch (e) { console.error(e); }
};

// --- AUTH LOGIC ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button');
        const errBox = document.getElementById('loginError');

        console.log("Attempting login for:", email);
        if (btn) btn.innerText = "Verifying...";
        if (errBox) errBox.style.display = 'none';

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful!");
            // UI update handled by onAuthStateChanged
        } catch (error) {
            console.error("Login failed:", error);
            if (btn) btn.innerText = "Login";
            if (errBox) {
                errBox.innerText = "Error: " + error.message;
                errBox.style.display = 'block';
            }
            alert("Login Failed: " + error.code + "\n" + error.message);
        }
    });
}

window.logout = () => signOut(auth);

onAuthStateChanged(auth, user => {
    const loginSec = document.getElementById('loginSection');
    const dashSec = document.getElementById('dashboardSection');

    if (user) {
        if (loginSec) loginSec.style.display = 'none';
        if (dashSec) dashSec.style.display = 'block';
        loadDashboardData();
    } else {
        if (loginSec) loginSec.style.display = 'block';
        if (dashSec) dashSec.style.display = 'none';
    }
});

// --- DASHBOARD DATA ---
await Promise.all([fetchTools(), fetchStats(), loadUsers(), loadTickets(), loadAuditLogs(), loadArticles()]);
renderToolsList();
renderCategories();
}

// --- TOOLS MANAGER ---
async function fetchTools() {
    const snap = await getDocs(collection(db, "tools"));
    tools = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderToolsList();
    renderLeaderboard(tools);
}

function renderToolsList() {
    const list = document.getElementById('toolList');
    if (!list) return;
    list.innerHTML = tools.map(t => `
        <div class="tool-item">
            <div class="tool-info">
                <h4>${t.title}</h4>
                <p>${t.desc.substring(0, 50)}...</p>
            </div>
            <div>
                <button onclick="editTool('${t.id}')" class="btn-primary" style="padding:8px; width:auto;">Edit</button>
                <button onclick="deleteTool('${t.id}')" class="btn-danger" style="margin-left:5px;">Del</button>
            </div>
        </div>
    `).join('');
}

window.openModal = () => {
    document.getElementById('toolModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = "Add New Tool";
    document.getElementById('toolForm').reset();
    document.getElementById('toolDocId').value = "";
    document.getElementById('toolId').readOnly = false;
};

window.closeModal = () => {
    document.getElementById('toolModal').style.display = 'none';
};

window.editTool = (id) => {
    const tool = tools.find(t => t.id === id);
    if (!tool) return;
    openModal();
    document.getElementById('modalTitle').innerText = "Edit Tool";
    document.getElementById('toolDocId').value = id;
    document.getElementById('toolId').value = tool.id;
    document.getElementById('toolId').readOnly = true;
    document.getElementById('toolCat').value = tool.category;
    document.getElementById('toolTitle').value = tool.title;
    document.getElementById('toolTitleAr').value = tool.titleAr;
    document.getElementById('toolDesc').value = tool.desc;
    document.getElementById('toolDescAr').value = tool.descAr || "";
    document.getElementById('toolIcon').value = tool.icon || "";
};

window.deleteTool = async (id) => {
    if (confirm("Delete this tool?")) {
        await deleteDoc(doc(db, "tools", id));
        logAction("Delete Tool", id);
        fetchTools();
    }
};

document.getElementById('toolForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const docId = document.getElementById('toolDocId').value;
    const data = {
        id: document.getElementById('toolId').value,
        category: document.getElementById('toolCat').value,
        title: document.getElementById('toolTitle').value,
        titleAr: document.getElementById('toolTitleAr').value,
        desc: document.getElementById('toolDesc').value,
        descAr: document.getElementById('toolDescAr').value,
        icon: document.getElementById('toolIcon').value,
    };

    try {
        if (docId) {
            await updateDoc(doc(db, "tools", docId), data);
            logAction("Edit Tool", data.title);
        } else {
            await setDoc(doc(db, "tools", data.id), data);
            logAction("Create Tool", data.title);
        }
        closeModal();
        fetchTools();
    } catch (err) { alert(err.message); }
});

// --- STATS & CHARTS ---
async function fetchStats() {
    const snap = await getDoc(doc(db, "stats", "general"));
    if (snap.exists()) {
        const count = snap.data().visitors || 0;
        document.getElementById('visitorCount').innerText = count.toLocaleString();
        initChart(count);
    }
}

function initChart(visitors) {
    const ctx = document.getElementById('trafficChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Weekly Traffic',
                data: [visitors - 50, visitors - 40, visitors - 20, visitors - 10, visitors - 5, visitors],
                borderColor: '#6D4CFF',
                tension: 0.4
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

// --- FEATURES V10, V11, V12 ---

// 1. Leaderboard
window.renderLeaderboard = (list) => {
    const el = document.getElementById('topToolsTable');
    if (el) el.innerHTML = [...list].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((t, i) => `<tr><td style="padding:5px;">#${i + 1}</td><td>${t.title}</td><td>${t.views || 0}</td></tr>`).join('');
};

// 2. Notepad
const noteEl = document.getElementById('adminNote');
if (noteEl) {
    getDoc(doc(db, "config", "notes")).then(s => { if (s.exists()) noteEl.value = s.data().text || ""; });
    noteEl.addEventListener('input', () => { // Simple debounce
        setTimeout(() => setDoc(doc(db, "config", "notes"), { text: noteEl.value }), 1000);
        document.getElementById('noteStatus').innerText = "Saving...";
    });
}

// 3. Media
window.scanMedia = async () => {
    const grid = document.getElementById('mediaGrid');
    if (!grid) return;
    grid.innerHTML = "Scanning...";
    const urls = new Set();
    tools.forEach(t => { if (t.icon && t.icon.startsWith('http')) urls.add(t.icon); });
    // Add logic to scan articles too...
    grid.innerHTML = Array.from(urls).map(u => `<div style="background:url('${u}') center/cover; height:80px; border-radius:4px; cursor:pointer;" onclick="navigator.clipboard.writeText('${u}');alert('Copied');"></div>`).join('');
};

// 4. SEO
document.getElementById('saveSeoBtn')?.addEventListener('click', async () => {
    await setDoc(doc(db, "config", "seo"), {
        title: document.getElementById('seoTitle').value,
        desc: document.getElementById('seoDesc').value
    });
    alert("Saved");
});

// 5. Users & Ban
window.loadUsers = async () => {
    const el = document.getElementById('usersList');
    if (!el) return;
    const snap = await getDocs(collection(db, "users"));
    el.innerHTML = snap.docs.map(d => {
        const u = d.data();
        return `<div style="padding:10px; border-bottom:1px solid #333; display:flex; justify-content:space-between;">
            <span style="${u.banned ? 'text-decoration:line-through; color:salmon;' : ''}">${u.email}</span>
            <button onclick="toggleBan('${d.id}', ${u.banned || false})" style="background:${u.banned ? 'green' : 'red'}; border:none; color:white; padding:2px 8px; border-radius:4px; cursor:pointer;">${u.banned ? 'Unban' : 'Ban'}</button>
        </div>`;
    }).join('');
};

window.toggleBan = async (uid, state) => {
    await updateDoc(doc(db, "users", uid), { banned: !state });
    logAction("Ban", `User ${uid} to ${!state}`);
    loadUsers();
};

// 6. Tickets
window.loadTickets = async () => {
    const el = document.getElementById('ticketsList');
    if (!el) return;
    const snap = await getDocs(collection(db, "feedback"));
    el.innerHTML = snap.docs.map(d => {
        const t = d.data();
        return `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:4px;">
            <strong>${t.email}</strong>: ${t.message}
            <div style="margin-top:5px;"><button onclick="location.href='mailto:${t.email}'" style="font-size:0.8em; cursor:pointer;">Reply</button> <button onclick="deleteDoc(doc(db,'feedback','${d.id}'));loadTickets();" style="color:salmon; font-size:0.8em; border:none; background:none; cursor:pointer;">Close</button></div>
        </div>`;
    }).join('');
};

// 7. Security (Firewall)
document.getElementById('saveIpBtn')?.addEventListener('click', async () => {
    const list = document.getElementById('denyList').value.split('\n');
    await setDoc(doc(db, "config", "security"), { blockedIPs: list }, { merge: true });
    alert("Firewall Updated");
});

// 8. Newsletter
document.getElementById('sendNewsBtn')?.addEventListener('click', () => {
    alert("Newsletter sent to all users (Simulated)");
    logAction("Newsletter", "Sent mass email");
});

// 9. API Keys
window.generateApiKey = async () => {
    const k = 'sk_' + Math.random().toString(36).substr(2);
    await addDoc(collection(db, "api_keys"), { key: k });
    document.getElementById('apiList').innerHTML += `<div>${k}</div>`;
};

// 10. Health
window.checkHealth = () => {
    let issues = 0;
    tools.forEach(t => { if (!t.url) issues++; });
    document.getElementById('healthReport').innerText = issues === 0 ? "System Healthy." : `${issues} tools missing URLs.`;
};

// 11. CSS
document.getElementById('saveCssBtn')?.addEventListener('click', async () => {
    await updateDoc(doc(db, "config", "theme"), { customCSS: document.getElementById('customCss').value });
    alert("CSS Injected");
});

// 12. Backup
document.getElementById('backupBtn')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ tools, articles }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'backup.json';
    a.click();
});

// --- TAB SWITCHER (Unified) ---
window.switchTab = (tabName) => {
    document.querySelectorAll('.crm-view').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`view-${tabName}`).style.display = 'block';
    document.getElementById(`btn-${tabName}`).classList.add('active');

    // Refresh Logic on switch
    if (tabName === 'users') { loadUsers(); loadTickets(); }
    if (tabName === 'dashboard') loadDashboardData();
    if (tabName === 'settings') loadAuditLogs();
};
