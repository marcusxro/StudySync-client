import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

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
const logInButton = document.querySelector('.login-button')
const loginForm = document.querySelector('.login-form')
const email = document.getElementById('email')
const password = document.getElementById('password')
const ErrorSvg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                            height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
                            </path>
                        </svg>`


//provider
const provider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();

const errorModal = document.querySelector('.errorModal')
const icon = document.querySelector('.icon')
const text = document.querySelector('.text')
let isLoading = false

function editModal(message) {
  icon.innerHTML = ErrorSvg
  text.innerHTML = message
  errorModal.style.display = 'flex'
  setTimeout(() => {
    errorModal.style.display = 'none'
  }, 3000)
}


loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (isLoading) return
  isLoading = true

  console.log('clicked')

  logInButton.innerHTML = 'Loading...'
  const emailValue = email.value;
  const passwordValue = password.value;


  if (!email?.value || !password?.value) {
    editModal('Please fill all fields');
    logInButton.innerHTML = 'Sign in'
    isLoading = false
    return;
  }

  signInWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User signed in:', user);

      if (user.emailVerified) {
       window.location.href = 'account/dashboard.html';
      } else {
        editModal('Please verify your email first.');
        logInButton.innerHTML = 'Sign in'
        isLoading = false
        return;
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error signing in:', errorCode, errorMessage);

      if (error.code === 'auth/invalid-credential') {
        editModal('User not found. Please sign up first.');
        logInButton.innerHTML = 'Sign in'
        isLoading = false
      }

      if (error.code === 'auth/wrong-password') {
        editModal('Wrong password');
        logInButton.innerHTML = 'Sign in'
        isLoading = false
      }
      if (error.code === 'auth/too-many-requests') {
        editModal('Too many requests. Try again later.');
        logInButton.innerHTML = 'Sign in'
        isLoading = false
      }


    });
});



const googleButton = document.querySelector('.googleAuth')
const facebookAuth = document.querySelector('.facebookAuth')


googleButton.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log('User signed in:', user);
     window.location.href = 'account/dashboard.html';
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error('Error signing in:', errorCode, errorMessage);
      editModal('Error signing in. Please try again later.');
    });
})


facebookAuth?.addEventListener('click', () => {
  signInWithPopup(auth, fbProvider)
    .then((result) => {
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log('User signed in:', user);
     window.location.href = 'account/dashboard.html';
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = FacebookAuthProvider.credentialFromError(error);
      console.error('Error signing in:', errorCode, errorMessage);
      editModal('Error signing in. Please try again later.');
    });
})