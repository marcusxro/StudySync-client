import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getAuth, sendPasswordResetEmail  } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyCTXicg-uyzAQyd62hwMfh0RHtRgd-bCBQ",
    authDomain: "studysync-a430c.firebaseapp.com",
    projectId: "studysync-a430c",
    storageBucket: "studysync-a430c.firebasestorage.app",
    messagingSenderId: "787702087721",
    appId: "1:787702087721:web:f0b5704f7e4213b4f61c38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const resetForm = document.querySelector('.reset-form')
const errorModal = document.querySelector('.errorModal')
const successModal = document.querySelector('.successModal')
const resetButton = document.getElementById('submit')
let Loading = false

resetForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (Loading) return
    Loading = true
    resetButton.innerHTML = 'Loading...'



    const email = document.getElementById('email')
    const emailValue = email.value;

    if(!email?.value) {
        errorModal.innerHTML = 'Please fill all fields'
        errorModal.style.display = 'block'
        setTimeout(() => {
            errorModal.style.display = 'none'
        }, 3000)
        Loading = false
        resetButton.innerHTML = 'Reset password'
        return
    }

    sendPasswordResetEmail(auth, emailValue)
    .then(() => {
        successModal.innerHTML = 'Password reset email sent'
        successModal.style.display = 'block'
        email.value = ''
                Loading = false
        resetButton.innerHTML = 'Reset password'
        setTimeout(() => {
            successModal.style.display = 'none'
        }, 3000)
    })
    .catch((error) => {
        errorModal.innerHTML = error.message
        errorModal.style.display = 'block'
                Loading = false
        resetButton.innerHTML = 'Reset password'
        setTimeout(() => {
            errorModal.style.display = 'none'
        }, 3000)
    })
})
