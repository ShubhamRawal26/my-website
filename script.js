document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('user-form');
    const formCard = document.getElementById('form-card');
    const resultCard = document.getElementById('result-card');
    const resetBtn = document.getElementById('reset-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // पेज को रीफ्रेश होने से रोकता है

        // फॉर्म से डेटा लेना
        const name = document.getElementById('name').value;
        const mobile = document.getElementById('mobile').value;
        const email = document.getElementById('email').value;
        const userClass = document.getElementById('class').value;

        // रिज़ल्ट कार्ड में डेटा सेट करना
        document.getElementById('res-name').innerText = name;
        document.getElementById('res-mobile').innerText = mobile;
        document.getElementById('res-email').innerText = email;
        document.getElementById('res-class').innerText = userClass;

        // फॉर्म छुपाना और प्रीमियम कार्ड दिखाना
        formCard.classList.add('hidden');
        resultCard.classList.remove('hidden');
    });

    // वापस जाने का बटन
    resetBtn.addEventListener('click', () => {
        form.reset(); // फॉर्म क्लियर करना
        resultCard.classList.add('hidden');
        formCard.classList.remove('hidden');
    });
});