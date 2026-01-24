import { auth, db } from './firebase-config.js';
import { defaultTools } from './tools-data.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, writeBatch, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("Admin module loaded.");

// DOM Elements
const loginForm = document.getElementById('loginForm');
const toolForm = document.getElementById('toolForm');
const modalElement = document.getElementById('toolModal'); // The actual modal div

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
        fetchStats(); // Load live counter
        loadAnalytics(); // Load iframe
    } else {
        if (loginSection) loginSection.style.display = 'block';
        if (dashboardSection) dashboardSection.style.display = 'none';
    }
});

window.logout = () => signOut(auth);

// Tool Management
const toolsCol = collection(db, 'tools');

async function loadTools() {
    const list = document.getElementById('toolList');
    const loading = document.getElementById('loading');
    const setupWarning = document.getElementById('setupWarning');

    if (!list) return;

    list.innerHTML = '';
    if (loading) loading.style.display = 'block';

    try {
        const querySnapshot = await getDocs(toolsCol);

        if (setupWarning) {
            if (querySnapshot.empty) {
                setupWarning.style.display = 'block';
            } else {
                setupWarning.style.display = 'none';
            }
        }

        querySnapshot.forEach((doc) => {
            const t = doc.data();
            const item = document.createElement('div');
            item.className = 'tool-item';
            item.innerHTML = `
                <div class="tool-info">
                    <h4>${t.title} / ${t.titleAr}</h4>
                    <p>${t.desc}</p>
                    <small style="color:var(--accent-purple);">${t.cat} | ${t.id}</small>
                </div>
                <div style="display:flex; gap:10px;">
                    <button onclick="editTool('${doc.id}')" class="btn-primary" style="padding:8px 16px; width:auto;">Edit</button>
                    <button onclick="removeTool('${doc.id}')" class="btn-danger">Delete</button>
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
