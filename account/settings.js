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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



const openMenu = document.querySelector('.openMenu')
const closeMenu = document.querySelector('.closeMenu')

const menu = document.querySelector('.menu')

openMenu.addEventListener('click', () => {
    menu.style.left = '0'
    menu.style.transition = '0.5s'
})

closeMenu.addEventListener('click', () => {
    menu.style.left = '-100%'
    menu.style.transition = '0.5s'
    console.log('clicked')
})

const pfpFile = document.querySelector('.pfpFiles')
const imgHeaders = document.querySelector('.imgSrcs');
const saveBtrn = document.querySelector('.saveBtrn');

pfpFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        saveBtrn.style.display = 'block';
        const reader = new FileReader();
        reader.onload = (event) => {
            imgHeaders.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
});



onAuthStateChanged(getAuth(), (user) => {
    const sidebarUsername = document.querySelector('.sidebar-username')
    const sidebarEmail = document.querySelector('.sidebar-email')
    const username = document.querySelector('.username')
    const friends = document.querySelector('.friends')

    const emailValue = document.querySelector('.emailVal')
    const userValue = document.querySelector('.userVal')

    console.log(emailValue)
    let loading;

    saveBtrn.addEventListener('click', () => {
        if(loading) {
            return;
        }
        loading = true;
        saveBtrn.innerHTML = 'Uploading...';

        const formData = new FormData();
        formData.append('profilePicture', pfpFile.files[0]);
        formData.append('Uid', user.uid); // Ensure user.uid is available in your context
    
        axios
            .post('http://localhost:8080/updateProfilePic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                loading = false;
                saveBtrn.innerHTML = 'Save';
                if (res.status === 200) {
                    console.log('Profile picture uploaded successfully:', res.data.url);
    
                    window.location.reload();
                } else {
                    console.error('Unexpected response:', res);
                    loading = false;
                    saveBtrn.innerHTML = 'Save';
                    alert('An error occurred while uploading the file');
                }
            })
            .catch((error) => {
                console.error('Error uploading profile picture:', error);
                loading = false;
                saveBtrn.innerHTML = 'Save';
                alert('An error occurred while uploading the file');
            });
    });
    

    axios.post('http://localhost:8080/getAccountByUid', { Uid: user.uid })
        .then((res) => {
            const { data } = res
            sidebarUsername.innerHTML = data.Username
            sidebarEmail.innerHTML = data.Email
            username.innerHTML = data.Username
            friends.innerHTML = data.friends.length + " Friends";

            console.log(data.Username)
            userValue.value = data.Username
            emailValue.value = data.Email

        })
        .catch((error) => {
            console.error(error)
        })

    axios.get('http://localhost:8080/user/' + user.uid)
        .then((res) => {
            const { data } = res;
            console.log(data);
            const profilePicture = document.querySelector('.profile-picture');
            const imgHeader = document.querySelectorAll('.imgHeader');


            imgHeaders.src = data.imageUrl;



            imgHeader.forEach((img) => {
                img.src = data.imageUrl;
                img.alt = data.username;
            });

            profilePicture.src = data.imageUrl;
        })
        .catch((error) => {
            console.error(error);
        });

    if (user) {
        console.log('User is signed in')
    } else {
        console.log('No user is signed in')
    }
})