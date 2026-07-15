import { db } from './firebase-config.js';
import { ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// --- DYNAMIC LIQUID REPULSION LOGIC FOR LETTERS ---
document.addEventListener('DOMContentLoaded', () => {
    const headings = document.querySelectorAll('.main-heading');
    headings.forEach(heading => {
        const lines = heading.innerHTML.split('<br>');
        const wrappedHTML = lines.map(line => {
            return line.split('').map(char => {
                if (char === ' ') return '&nbsp;';
                return `<span class="scatter-letter">${char}</span>`;
            }).join('');
        }).join('<br>');
        heading.innerHTML = wrappedHTML;

        heading.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            heading.querySelectorAll('.scatter-letter').forEach(span => {
                const rect = span.getBoundingClientRect();
                const spanX = rect.left + rect.width / 2;
                const spanY = rect.top + rect.height / 2;
                
                const distX = spanX - mouseX;
                const distY = spanY - mouseY;
                const distance = Math.sqrt(distX * distX + distY * distY);
                
                const radius = 90; 
                if (distance < radius) {
                    const force = (radius - distance) / radius;
                    const pushX = (distX / distance) * force * 35; 
                    const pushY = (distY / distance) * force * 15; 
                    
                    span.style.transform = `translate3d(${pushX}px, ${pushY}px, 0) scale(1.08)`;
                    span.style.color = '#e3001b'; 
                } else {
                    span.style.transform = 'translate3d(0, 0, 0) scale(1)';
                    span.style.color = '#ffffff';
                }
            });
        });

        heading.addEventListener('mouseleave', () => {
            heading.querySelectorAll('.scatter-letter').forEach(span => {
                span.style.transform = 'translate3d(0, 0, 0) scale(1)';
                span.style.color = '#ffffff';
            });
        });
    });

    const firstInput = document.getElementById('userName');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 500);
    }
});

// --- GLOBAL BINDING FOR 3D CARD FLIP FLOW ---
window.goToNext = function(currentStepNum, inputId) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;
    
    const inputVal = inputElement.value;
    if (inputVal.trim() === "") {
        alert("Please enter your details before clicking next.");
        return;
    }
    
    const currentStep = document.getElementById('step-' + currentStepNum);
    let nextStepNum = currentStepNum + 1;
    const nextStep = document.getElementById('step-' + nextStepNum);
    
    if (nextStep) {
        const container = document.getElementById('main-form-container');
        
        // हर स्टेप पर कार्ड को 180 डिग्री आगे घुमाना (0deg -> 180deg -> 360deg -> 540deg)
        const nextAngle = (nextStepNum - 1) * 180;
        container.style.transform = `rotateY(${nextAngle}deg)`;
        
        // अगर इवन (Even) स्टेप है तो टेक्स्ट को सीधा रखने के लिए क्लास टॉगल करना
        if (nextStepNum % 2 === 0) {
            container.classList.add('even-flip');
        } else {
            container.classList.remove('even-flip');
        }
        
        // स्टेप काउंट अपडेट करना
        const stepCountSpan = document.getElementById('step-count');
        if (stepCountSpan) {
            stepCountSpan.innerText = `Step ${nextStepNum}/4`;
        }

        // दोनों स्टेप्स को 3D स्पेस में एक्टिव करना ताकि फ्लिप के दौरान वे दिखें
        currentStep.classList.remove('active');
        nextStep.classList.add('active');
        
        const nextInput = nextStep.querySelector('input');
        if (nextInput) {
            // फ्लिप एनीमेशन पूरा होने के बाद ऑटोमैटिक फ़ोकस करना
            setTimeout(() => {
                nextInput.focus();
            }, 600);
        }
    }
};

window.submitData = async function() {
    const classInput = document.getElementById('userClass');
    if (!classInput) return;
    
    const classVal = classInput.value;
    if (classVal.trim() === "") {
        alert("Please enter your class.");
        return;
    }

    const name = document.getElementById('userName').value;
    const mobile = document.getElementById('userMobile').value;
    const email = document.getElementById('userEmail').value;
    const submitBtn = document.getElementById('submitBtn');

    if (submitBtn) {
        submitBtn.innerText = "Saving...";
        submitBtn.disabled = true;
    }

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

        // फाइनल सक्सेस स्क्रीन के लिए कार्ड को 720 डिग्री पर फ्लिप करना
        const container = document.getElementById('main-form-container');
        container.style.transform = `rotateY(720deg)`;
        container.classList.remove('even-flip');

        document.getElementById('step-4').classList.remove('active');
        document.getElementById('step-result').classList.add('active');
        document.getElementById('step-count').innerText = "Done!";
    } catch (error) {
        console.error("Error saving data:", error);
        alert("An error occurred while submitting. Please try again.");
        if (submitBtn) {
            submitBtn.innerText = "Submit ✔";
            submitBtn.disabled = false;
        }
    }
};