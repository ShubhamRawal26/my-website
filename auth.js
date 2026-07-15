import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const ADMIN_EMAIL = "discountbuddyshubham@gmail.com"; 

const provider = new GoogleAuthProvider();
const mainForm = document.getElementById('main-form-container');
const adminDashboard = document.getElementById('admin-dashboard');
const loginBtn = document.getElementById('admin-login-btn');

window.adminLogin = () => {
    signInWithPopup(auth, provider).catch((error) => {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
    });
};

window.adminLogout = () => {
    signOut(auth).then(() => {
        alert("Logged out successfully.");
    }).catch((error) => {
        console.error("Logout failed:", error);
    });
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase()) {
            mainForm.classList.add('hidden-panel');
            adminDashboard.classList.remove('hidden-panel');
            if (loginBtn) loginBtn.style.display = 'none';
            if (window.fetchResponses) window.fetchResponses();
        } else {
            alert("Unauthorized Account! You do not have admin access.");
            signOut(auth);
        }
    } else {
        mainForm.classList.remove('hidden-panel');
        adminDashboard.classList.add('hidden-panel');
        if (loginBtn) loginBtn.style.display = 'block';
    }
});