import { db } from './firebase-config.js';
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

let allResponses = [];

window.fetchResponses = () => {
    const responsesRef = ref(db, 'responses');
    document.getElementById('response-list').innerHTML = "<p>Loading...</p>";
    
    onValue(responsesRef, (snapshot) => {
        allResponses = [];
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(key => {
                allResponses.push({ id: key, ...data[key] });
            });
            // सबसे नया ऊपर दिखाने के लिए रिवर्स करें (Time based rough sort)
            allResponses.reverse(); 
        }
        renderResponses(allResponses);
    }, (error) => {
        console.error("Error fetching data:", error);
        document.getElementById('response-list').innerHTML = "<p>Error loading data. Check console.</p>";
    });
};

function renderResponses(dataArray) {
    const container = document.getElementById('response-list');
    document.getElementById('total-count').innerText = dataArray.length;
    container.innerHTML = "";

    if (dataArray.length === 0) {
        container.innerHTML = "<p>No responses found.</p>";
        return;
    }

    dataArray.forEach(item => {
        const dateObj = item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "Unknown Time";
        
        const card = document.createElement('div');
        card.className = 'response-card';
        card.innerHTML = `
            <p>Date: <strong>${dateObj}</strong></p>
            <p>Name: <strong>${item.name}</strong></p>
            <p>Email: <strong>${item.email}</strong></p>
            <p>Mobile: <strong>${item.mobile}</strong></p>
            <p>Class: <strong>${item.class}</strong></p>
            <button class="delete-btn" onclick="window.deleteResponse('${item.id}')">Delete</button>
        `;
        container.appendChild(card);
    });
}

window.searchResponses = () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allResponses.filter(item => 
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.email && item.email.toLowerCase().includes(query))
    );
    renderResponses(filtered);
};

window.deleteResponse = async (id) => {
    if(confirm("Are you sure you want to delete this response?")) {
        try {
            await remove(ref(db, `responses/${id}`));
            // onValue automatically updates the UI!
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete.");
        }
    }
};