import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const ADMIN_EMAIL = "discountbuddyshubham@gmail.com"; // इसे अपने एडमिन ईमेल से बदलें

const provider = new GoogleAuthProvider();
const mainForm = document.getElementById('main-form-container');
const adminDashboard = document.getElementById('admin-dashboard');

window.adminLogin = () => {
    signInWithPopup(auth, provider).catch((error) => {
        console.error("Login failed:", error);
    });
};

window.adminLogout = () => {
    signOut(auth).then(() => {
        alert("Logged out successfully.");
    });
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.email === ADMIN_EMAIL) {
            // Authorized Admin
            mainForm.classList.add('hidden-panel');
            adminDashboard.classList.remove('hidden-panel');
            document.querySelector('.admin-login-btn').style.display = 'none';
            
            // डैशबोर्ड लोड होने पर डेटा लाएं
            if(window.fetchResponses) window.fetchResponses();
        } else {
            // Unauthorized Account
            alert("Unauthorized Account! You do not have admin access.");
            signOut(auth);
        }
    } else {
        // Logged out / Normal User View
        mainForm.classList.remove('hidden-panel');
        adminDashboard.classList.add('hidden-panel');
        document.querySelector('.admin-login-btn').style.display = 'block';
    }
});