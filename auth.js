import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Exact Admin Email Configuration
const ADMIN_EMAIL = "discountbuddyshubham@gmail.com"; 

const provider = new GoogleAuthProvider();
const mainForm = document.getElementById('main-form-container');
const adminDashboard = document.getElementById('admin-dashboard');
const loginBtn = document.getElementById('admin-login-btn');

// Global Window Binding for Admin Actions
window.adminLogin = function() {
    signInWithPopup(auth, provider)
    .then((result) => {
        console.log("Logged in user:", result.user.email);
    })
    .catch((error) => {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
    });
};

window.adminLogout = function() {
    signOut(auth).then(() => {
        alert("Logged out successfully.");
    }).catch((error) => {
        console.error("Logout failed:", error);
    });
};

// Authentication Observer Logic
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Safe check using trim and lower case to prevent unauth mismatch
        if (user.email && user.email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase()) {
            if (mainForm) mainForm.classList.add('hidden-panel');
            if (adminDashboard) adminDashboard.classList.remove('hidden-panel');
            if (loginBtn) loginBtn.style.display = 'none';
            if (window.fetchResponses) window.fetchResponses();
        } else {
            alert("Unauthorized Account! You do not have admin access.");
            signOut(auth);
        }
    } else {
        if (mainForm) mainForm.classList.remove('hidden-panel');
        if (adminDashboard) adminDashboard.classList.add('hidden-panel');
        if (loginBtn) loginBtn.style.display = 'block';
    }
});