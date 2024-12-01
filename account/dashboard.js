import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

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




onAuthStateChanged(auth, (user) => {
    if (user) {
        const sidebarUsername = document.querySelector('.sidebar-username')
        const sidebarEmail = document.querySelector('.sidebar-email')


        const greetText = document.querySelector('.greet-text')

        axios.post('http://localhost:8080/getAccountByUid', { Uid: user.uid })
            .then((res) => {
                const { data } = res
                sidebarUsername.innerHTML = data.Username
                sidebarEmail.innerHTML = data.Email
                greetText.innerHTML = `Welcome back,  ${data.Username} 🎉`
            })
            .catch((error) => {
                console.error(error)
            })

            axios.get('http://localhost:8080/user/' + user.uid)
            .then((res) => {
              const { data } = res;
              console.log(data);
              const profilePicture = document.querySelector('.profile-picture');
              profilePicture.src = data.imageUrl;
            })
            .catch((error) => {
              console.error(error);
            });

        console.log(user)
    } else {
        // No user is signed in.
    }
});

