// वर्तमान स्टेप को ट्रैक करने के लिए
let currentStepNumber = 1;

function nextStep(step) {
    // वर्तमान इनपुट की वैल्यू चेक करना (ताकि खाली सबमिट न हो)
    let currentInput;
    if(step === 1) currentInput = document.getElementById('name').value;
    if(step === 2) currentInput = document.getElementById('mobile').value;
    if(step === 3) currentInput = document.getElementById('email').value;

    if (currentInput.trim() === "") {
        alert("Please fill out this field before moving to the next step.");
        return;
    }

    // वर्तमान स्टेप को छुपाना
    document.getElementById(`step-${step}`).classList.remove('active');
    
    // अगले स्टेप को दिखाना
    let next = step + 1;
    document.getElementById(`step-${next}`).classList.add('active');

    // हेडर में स्टेप इंडिकेटर अपडेट करना
    document.getElementById('step-indicator').innerText = `Step ${next}/4`;
}

function submitForm() {
    const userClass = document.getElementById('class').value;
    
    if (userClass.trim() === "") {
        alert("Please fill out this field.");
        return;
    }

    // सभी वैल्यूज़ को इकट्ठा करना
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;

    // रिज़ल्ट स्क्रीन पर डेटा सेट करना
    document.getElementById('res-name').innerText = name;
    document.getElementById('res-mobile').innerText = mobile;
    document.getElementById('res-email').innerText = email;
    document.getElementById('res-class').innerText = userClass;

    // आखिरी स्टेप को छुपाकर रिज़ल्ट दिखाना
    document.getElementById('step-4').classList.remove('active');
    document.getElementById('step-result').classList.add('active');
    
    // हेडर टेक्स्ट अपडेट करना
    document.getElementById('step-indicator').innerText = "Complete";
}