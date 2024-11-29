import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

const ErrorSvg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                            height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
                            </path>
                        </svg>`


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

const email = document.querySelector('.email')
const userModal = document.querySelector('.userModal')
const outerDiv = document.querySelector('.outerDiv')
const pfpFile = document.querySelector('.pfpFile')
const imgCon = document.querySelector('.imgCon')
const submitBtn = document.querySelector('.submitBtn')
const Username = document.querySelector('.Username')
const SelectValue = document.querySelector('.SelectVal')
const errorModal = document.querySelector('.errorModal')
const icon = document.querySelector('.icon')
const text = document.querySelector('.text')

let userDetails;

const editModal = (message) => {
    icon.innerHTML = ErrorSvg
    text.innerHTML = message
    errorModal.style.display = 'flex'
    setTimeout(() => {
        errorModal.style.display = 'none'
    }, 3000)
}

if(SelectValue.value === 'Select'){
    SelectValue.style.color = 'gray'
}


Username.addEventListener('input', () => {
    if (Username.value.length > 0) {
        Username.style.border = '1px solid #D4D5D7'
    } else {
        Username.style.border = '1px solid red'
    }
})   
    
SelectValue.addEventListener('change', () => {  
    console.log(SelectValue.value)
})


const saveProfile = async () => {
    const formData = new FormData();
    formData.append('Uid', auth.currentUser.uid);
    formData.append('profilePicture', pfpFile.files[0]);

    try {
        const response = await axios.post('http://localhost:8080/uploadProfilePicture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Profile saved:', response.data);
    } catch (error) {
        console.error('Error saving profile:', error.response.data.message);
        editModal('Error saving profile: ' + error.response.data.message);
    }
};






pfpFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgCon.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});



let isRender = false;


console.log("user", userDetails)

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('user logged in')
        console.log(user)







        submitBtn.addEventListener('click', () => {
            if (Username.value.length === 0) {
                Username.style.border = '1px solid red'
                editModal('Username is required')
                return
            } else {
                if(Username.value.length < 3){
                    Username.style.border = '1px solid red'
                    editModal('Username must be at least 3 characters')
                    return
                }
            }
        
            if(SelectValue.value === ''){
                SelectValue.style.border = '1px solid red'
                editModal('Select a value')
                return
            }
        
            if (pfpFile.files.length === 0) {
                editModal('Profile picture is required')
                return
            }
        
            const formData = new FormData();
            formData.append('Username', Username.value);
            formData.append('Email', user?.email);
            formData.append('Education_level', SelectValue.value);
            formData.append('isBanned', false);
            formData.append('Password', "Provider");
            formData.append('interests',[]);
            formData.append('friends',[]);
            formData.append('Uid', user?.uid);
            formData.append('isDone', true);
            formData.append('profilePicture', pfpFile.files[0]);  // Corrected field name
        
            axios.post('http://localhost:8080/createAndUploadUser', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                console.log('Account created and profile picture uploaded:', response.data);
        
                if(response.status === 200){
                    console.log('Account created')
                }
            })
            .catch((error) => {
                console.error('Error creating account and uploading profile picture:', error.response.data.message);
                editModal('Error creating account: ' + error.response.data.message);
            });
        });
        









        outerDiv.style.display = 'block'
        email.innerHTML = user?.email

        if (user.emailVerified) {
            console.log('Email verified')
        } else {
            window.location.href = '../signin.html'
        }

        axios.post('http://localhost:8080/getAccountByUid', {
            Uid: user?.uid// Replace with the actual Uid
        })
            .then((response) => {
                console.log('Account details:', response.data); // Handle the account data

                console.log(response.data)



                if (response.data.isDone === false) {
                    isRender = true;
                    userModal.style.display = 'flex'
                }

            })
            .catch((error) => {

                if (error.response.status === 404 && error.response.data.message === 'Account not found') {
                    console.log('Account not found')
                    isRender = true;


                    if (isRender) {
                        userModal.style.display = 'flex'
                    }
                }

                if (error.response.status === 500) {
                    console.error('Server error', error.response.data.error);
                }
            });


    } else {
        console.log('user logged out')
        window.location.href = '../signin.html'
    }
})



