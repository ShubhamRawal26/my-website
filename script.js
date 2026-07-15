import { db } from './firebase-config.js';
import { ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.goToNext = (currentStepNum, inputId) => {
    const inputVal = document.getElementById(inputId).value;
    if (inputVal.trim() === "") {
        alert("Please enter your details before clicking next.");
        return;
    }
    document.getElementById('step-' + currentStepNum).classList.remove('active');
    let nextStepNum = currentStepNum + 1;
    document.getElementById('step-' + nextStepNum).classList.add('active');
};

window.submitData = async () => {
    const classVal = document.getElementById('userClass').value;
    if (classVal.trim() === "") {
        alert("Please enter your class.");
        return;
    }

    const name = document.getElementById('userName').value;
    const mobile = document.getElementById('userMobile').value;
    const email = document.getElementById('userEmail').value;
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.innerText = "Saving...";
    submitBtn.disabled = true;

    try {
        const responsesRef = ref(db, 'responses');
        const newResponseRef = push(responsesRef);
        
        await set(newResponseRef, {
            name: name,
            mobile: mobile,
            email: email,
            class: classVal,
            submittedAt: serverTimestamp()
        });

        document.getElementById('res-name').innerText = name;
        document.getElementById('res-mobile').innerText = mobile;
        document.getElementById('res-email').innerText = email;
        document.getElementById('res-class').innerText = classVal;

        document.getElementById('step-4').classList.remove('active');
        document.getElementById('step-result').classList.add('active');
        document.getElementById('step-count').innerText = "Done!";
    } catch (error) {
        console.error("Error saving data:", error);
        alert("An error occurred while submitting. Please try again.");
        submitBtn.innerText = "Submit ✔";
        submitBtn.disabled = false;
    }
};