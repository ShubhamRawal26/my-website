import { db } from './firebase-config.js';
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

let allResponses = [];

window.fetchResponses = () => {
    const responsesRef = ref(db, 'responses');
    const container = document.getElementById('response-list');
    if (container) container.innerHTML = "<p>Loading...</p>";
    
    onValue(responsesRef, (snapshot) => {
        allResponses = [];
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(key => {
                allResponses.push({ id: key, ...data[key] });
            });
            allResponses.reverse(); 
        }
        renderResponses(allResponses);
    }, (error) => {
        console.error("Error fetching data:", error);
        if (container) container.innerHTML = "<p>Error loading data. Check console.</p>";
    });
};

function renderResponses(dataArray) {
    const container = document.getElementById('response-list');
    const totalCountSpan = document.getElementById('total-count');
    
    if (totalCountSpan) totalCountSpan.innerText = dataArray.length;
    if (!container) return;
    
    container.innerHTML = "";

    if (dataArray.length === 0) {
        container.innerHTML = "<p>No responses found.</p>";
        return;
    }

    dataArray.forEach(item => {
        const card = document.createElement('div');
        card.className = 'response-card';
        // Whole card click opens full response view
        card.setAttribute('onclick', `window.viewFullResponse('${item.id}')`);
        card.innerHTML = `
            <p>Name: <strong>${item.name || ''}</strong></p>
            <p>Email: <strong>${item.email || ''}</strong></p>
            <p>Mobile: <strong>${item.mobile || ''}</strong></p>
            <p style="border:none; font-size:10px; opacity:0.6; text-align:right;">Click to view full</p>
        `;
        container.appendChild(card);
    });
}

// Full Response View Modal Logic
window.viewFullResponse = (id) => {
    const item = allResponses.find(r => r.id === id);
    if (!item) return;
    const dateObj = item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "Unknown Time";
    const modalBody = document.getElementById('modal-body-content');
    
    if (modalBody) {
        modalBody.innerHTML = `
            <p>Submission Date: <strong>${dateObj}</strong></p>
            <p>Full Name: <strong>${item.name || 'N/A'}</strong></p>
            <p>Mobile Number: <strong>${item.mobile || 'N/A'}</strong></p>
            <p>Email Address: <strong>${item.email || 'N/A'}</strong></p>
            <p>Class: <strong>${item.class || 'N/A'}</strong></p>
            <p style="font-size:11px; opacity:0.5; border:none;">ID: ${item.id}</p>
            <button class="delete-btn" onclick="window.deleteResponseFromModal('${item.id}')">Delete Response</button>
        `;
    }
    const modal = document.getElementById('full-response-modal');
    if (modal) modal.classList.remove('hidden-panel');
};

window.closeModal = () => {
    const modal = document.getElementById('full-response-modal');
    if (modal) modal.classList.add('hidden-panel');
};

window.deleteResponseFromModal = async (id) => {
    if(confirm("Are you sure you want to delete this response permanently?")) {
        try {
            window.closeModal();
            await remove(ref(db, `responses/${id}`));
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete.");
        }
    }
};

window.searchResponses = () => {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase();
    const filtered = allResponses.filter(item => 
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.email && item.email.toLowerCase().includes(query))
    );
    renderResponses(filtered);
};