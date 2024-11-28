import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

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

const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const repeatPassword = document.getElementById('reppassword')
const errorModal = document.querySelector('.errorModal')
const successModal = document.querySelector('.successModal')
const signUpForm = document.querySelector('.signup-form')

const signUpbutton = document.getElementById('submit')

let isLoading = false

signUpForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailValue = email.value;
    const passwordValue = password.value;
    if (isLoading) return
    isLoading = true
    signUpbutton.innerHTML = 'Loading...'

    if(!email?.value || !username?.value  || !password?.value  || !repeatPassword?.value ) {
        errorModal.innerHTML = 'Please fill all fields'
        errorModal.style.display = 'block'
        setTimeout(() => {
            errorModal.style.display = 'none'
        }, 3000)
        isLoading = false
        signUpbutton.innerHTML = 'Sign up'
        return
    }

    if (passwordValue !== repeatPassword.value) {
        errorModal.innerHTML = 'Passwords do not match'
        errorModal.style.display = 'block'
        setTimeout(() => {
            errorModal.style.display = 'none'
        }, 3000)
        isLoading = false
        signUpbutton.innerHTML = 'Sign up'
        return
    }

    createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User signed up:', user);

            sendEmailVerification(user)
                .then(() => {

                    axios.post('http://localhost:8080/register', {
                        Username: username.value,
                        Email: email.value,
                        Password: password.value,
                        Uid: user?.uid
                    })
                        .then((response) => {
                            console.log('User created:', response.data);

                            if (response.status === 200) {

                                console.log('Email verification sent!');

                                username.value = ''
                                email.value = ''
                                password.value = ''
                                repeatPassword.value = ''


                                errorModal.style.display = 'none'
                                successModal.style.display = 'block'
                                successModal.innerHTML = 'Email verification sent!'
                                isLoading = false
                                signUpbutton.innerHTML = 'Sign up'
                                setTimeout(() => {
                                    successModal.style.display = 'none'
                                }, 3000)
                            }
                        })
                        .catch((error) => {
                            console.error('Error creating user:', error);
                            isLoading = false
                            signUpbutton.innerHTML = 'Sign up'
                        });



                })
                .catch((error) => {
                    console.error('Error sending email verification:', error);
                    isLoading = false
                    signUpbutton.innerHTML = 'Sign up'
                });
        })
        .catch((err) => {
            const errorCode = err.code;
            const errorMessage = err.message;
            console.error('Error signing up:', errorCode, errorMessage);
            isLoading = false
            signUpbutton.innerHTML = 'Sign up'
            if (err.code === 'auth/email-already-in-use') {
                errorModal.innerHTML = 'Email already in use'
                errorModal.style.display = 'block'

                setTimeout(() => {
                    errorModal.style.display = 'none'
                }, 3000)
            }

            if (err.code === 'auth/weak-password') {
                errorModal.innerHTML = 'Password is too weak'
                errorModal.style.display = 'block'

                setTimeout(() => {
                    errorModal.style.display = 'none'
                }, 3000)
            }

            if (err.code === 'auth/invalid-email') {
                errorModal.innerHTML = 'Invalid email'
                errorModal.style.display = 'block'

                setTimeout(() => {
                    errorModal.style.display = 'none'
                }, 3000)
            }
        });
});