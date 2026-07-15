import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const ADMIN_EMAIL = "discountbuddyshubham@gmail.com"; 

const provider = new GoogleAuthProvider();
const mainForm = document.getElementById('main-form-container');
const adminDashboard = document.getElementById('admin-dashboard');
const loginBtn = document.getElementById('admin-login-btn');

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.email && user.email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase()) {
            if (mainForm) mainForm.classList.add('hidden-panel');
            if (adminDashboard) adminDashboard.classList.remove('hidden-panel');
            if (loginBtn) loginBtn.style.display = 'none';
            
            // Extract & Display Admin Logo and Name
            const adminImg = document.getElementById('admin-img');
            const adminName = document.getElementById('admin-display-name');
            if (adminImg) adminImg.src = user.photoURL || 'https://via.placeholder.com/35';
            if (adminName) adminName.innerText = user.displayName || 'Authorized Admin';

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