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

//modals
const userModal = document.querySelector('.userModal')
const interestModal = document.querySelector('.userInterest')

const outerDiv = document.querySelector('.outerDiv')
const pfpFile = document.querySelector('.pfpFile')
const imgCon = document.querySelector('.imgCon')
const submitBtn = document.querySelector('.submitBtn')
const Username = document.querySelector('.Username')
const SelectValue = document.querySelector('.SelectVal')
const errorModal = document.querySelector('.errorModal')
const icon = document.querySelector('.icon')
const text = document.querySelector('.text')

let Loading = false;



//socket io configs
let userDetails;

const editModal = (message) => {
    icon.innerHTML = ErrorSvg
    text.innerHTML = message
    errorModal.style.display = 'flex'
    setTimeout(() => {
        errorModal.style.display = 'none'
    }, 3000)
}

if (SelectValue.value === 'Select') {
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


const socket = io('http://localhost:8080'); // Match the backend URL

// Handle 'connect' event
socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});



socket.on('newAccount', (data) => {
    console.log('Real-time update from server:', data);
    userModal.style.display = 'none';
    outerDiv.style.display = 'block';
    interestModal.style.display = 'flex';
    // Update the DOM to show the new account
    console.log("data", data);
    window.location.reload();
});

socket.on('updatedAccount', (data) => {
    console.log('Real-time update from server:', data);
    console.log("data", data)

    interestModal.style.display = 'none'
});

let user;

onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
        console.log('user logged in');
        console.log(currentUser);
        user = currentUser;

        submitBtn.addEventListener('click', () => {
            if (Username.value.length === 0) {
                Username.style.border = '1px solid red';
                editModal('Username is required');
                return;
            } else {
                if (Username.value.length < 3) {
                    Username.style.border = '1px solid red';
                    editModal('Username must be at least 3 characters');
                    return;
                }
            }

            if (SelectValue.value === '') {
                SelectValue.style.border = '1px solid red';
                editModal('Select a value');
                return;
            }

            if (pfpFile.files.length === 0) {
                editModal('Profile picture is required');
                return;
            }

            if (Loading) return;

            Loading = true;

            submitBtn.innerHTML = 'Loading...';

            const formData = new FormData();
            formData.append('Username', Username.value);
            formData.append('Email', user?.email);
            formData.append('education_level', SelectValue.value);
            formData.append('isBanned', false);
            formData.append('Password', "Provider");
            formData.append('interests', []);
            formData.append('friends', []);
            formData.append('Uid', user?.uid);
            formData.append('isDone', true);
            formData.append('profilePicture', pfpFile.files[0]);  // Corrected field name

            // First check if the user exists by UID
            axios.post('http://localhost:8080/getAccountByUid', { Uid: user?.uid })
                .then((response) => {
                    // User exists, proceed to update the account and upload profile picture if needed
                    handleAccountCreationOrUpdate(response, formData);
                })
                .catch((error) => {
                    console.log('Error checking user existence:', error);
                    // If the user does not exist, create the account and upload profile picture
                    handleAccountCreationOrUpdate(null, formData);
                });

            // Function to handle account creation or update
            const handleAccountCreationOrUpdate = (response, formData) => {

                
                const submitBtn = document.querySelector('.submitBtn'); 
                const listOfHobbies = document.getElementById('listOfHobbies');
                const interestModal = document.getElementById('interestModal'); 
                const searchVal = document.getElementById('searchVal');
                const chosenInterests = [];
            
                // Determine if user exists based on response
                const userExists = response ? true : false;
            
                // Update button text based on action
                submitBtn.innerHTML = userExists ? 'Updating...' : 'Creating...';
            
                // API call for both creating or updating user
                
                if(userExists) {

                    axios.put('http://localhost:8080/updateAccount', {
                        Uid: user?.uid,
                        Username: Username.value,
                        education_level: SelectValue.value,
                        isDone: true,
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            window.location.reload();
                            // Fetch hobbies and show modal only on successful update or create
                            axios.get('http://localhost:8080/getHobbies')
                                .then((hobbiesResponse) => {
                                    renderHobbies(hobbiesResponse.data, listOfHobbies, searchVal, chosenInterests);
                                    interestModal.style.display = 'flex';
          
                                })
                                .catch((error) => {
                                    console.error('Error fetching hobbies:', error.response?.data?.message || error.message);
                                });
                        }
                        submitBtn.innerHTML = 'Submit'; // Reset button text
                    })

                } else {
                    axios.post('http://localhost:8080/createAndUploadUser', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            // Fetch hobbies and show modal only on successful update or create
                            axios.get('http://localhost:8080/getHobbies')
                                .then((hobbiesResponse) => {
                                    renderHobbies(hobbiesResponse.data, listOfHobbies, searchVal, chosenInterests);
                                    interestModal.style.display = 'flex';
                                })
                                .catch((error) => {
                                    console.error('Error fetching hobbies:', error.response?.data?.message || error.message);
                                });
                        }
                        submitBtn.innerHTML = 'Submit'; 
                    })
                    .catch((error) => {
                        console.error('Error during account operation:', error.response?.data?.message || error.message);
                        editModal('Error: ' + error.response?.data?.message || error.message);
                        submitBtn.innerHTML = 'Submit'; 
                    });
                }
            };


            // Function to render hobbies in the list
            const renderHobbies = (hobbies, listOfHobbies, searchVal, chosenInterests) => {
                const renderHobbyItems = (filteredHobbies) => {
                    listOfHobbies.innerHTML = ''; // Clear the list before rendering
                    filteredHobbies.forEach((hobby) => {
                        const hobbyElement = document.createElement('div');
                        hobbyElement.className = "hobbyItem cursor-pointer hover:bg-[#D4D5D7] w-auto border-[1px] border-[#D4D5D7] rounded-md p-2 bg-[#fff] w-[calc(50%-1rem)] h-[40px]";
                        hobbyElement.innerHTML = hobby.title;
                        listOfHobbies.appendChild(hobbyElement);
                    });

                    for (let i = listOfHobbies.children.length; i >= 0; i--) {
                        listOfHobbies.appendChild(listOfHobbies.children[Math.random() * i | 0]);
                    }

                    listOfHobbies.addEventListener('click', (event) => {
                        if (event.target.classList.contains('hobbyItem')) {
                            const hobby = event.target.innerHTML;
                            if (chosenInterests.includes(hobby)) {
                                chosenInterests.splice(chosenInterests.indexOf(hobby), 1);
                                event.target.style.backgroundColor = '#fff';
                            } else {
                                chosenInterests.push(hobby);
                                event.target.style.backgroundColor = '#D4D5D7';
                            }
                            console.log('Chosen interests:', chosenInterests);
                        }
                    });
                };

                // Filter hobbies based on search input
                searchVal.addEventListener('input', () => {
                    const filteredHobbies = hobbies.filter(hobby => hobby.title.toLowerCase().includes(searchVal.value.toLowerCase()));
                    if (filteredHobbies.length === 0) {
                        listOfHobbies.innerHTML = '<div class="p-2 text-[#888]">No hobbies found</div>';
                    } else {
                        renderHobbyItems(filteredHobbies);
                    }
                });

                renderHobbyItems(hobbies); // Initial render of hobbies
            };

        });

        outerDiv.style.display = 'block';
        email.innerHTML = user?.email;
        if (user.emailVerified) {
            console.log('Email verified');
        } else {
            window.location.href = '../signin.html';
        }


        const listOfHobbies = document.querySelector('.listOfHobbies');
        const searchVal = document.querySelector('.searchVal');
        const saveInterest = document.querySelector('.saveInterest');
        const chosenInterests = [];


        axios.post('http://localhost:8080/getAccountByUid', {
            Uid: user?.uid // Replace with the actual Uid
        })
            .then((response) => {
                console.log(response.data);

                if (response.data.isDone === false) {
                    isRender = true;

                    userModal.style.display = 'flex';

                    Username.value = "" || response.data.Username;
                    SelectValue.value = '';

                    console.log("response", response.data.education_level)
                }

                if (response.data.interests.length === 0 && response.data.isDone === true) {
                    interestModal.style.display = 'flex';
                    axios.get('http://localhost:8080/getHobbies')
                        .then((response) => {
                            // Render hobbies
                            const renderHobbies = (hobbies) => {
                                listOfHobbies.innerHTML = ''; // Clear the list before rendering
                                hobbies.forEach((hobby) => {
                                    const hobbyElement = document.createElement('div');
                                    hobbyElement.className = "hobbyItem cursor-pointer hover:bg-[#D4D5D7] w-auto border-[1px] border-[#D4D5D7] rounded-md p-2 bg-[#fff] w-[calc(50%-1rem)] h-[40px]";

                                    // Check if hobby is in chosenInterests, apply selected style
                                    if (chosenInterests.includes(hobby.title)) {
                                        hobbyElement.style.backgroundColor = '#D4D5D7'; // Highlight as selected
                                    }

                                    hobbyElement.innerHTML = hobby.title;
                                    listOfHobbies.appendChild(hobbyElement);
                                });

                                // Randomize the order of hobbies
                                for (let i = listOfHobbies.children.length; i >= 0; i--) {
                                    listOfHobbies.appendChild(listOfHobbies.children[Math.random() * i | 0]);
                                }
                            };

                            renderHobbies(response.data);

                            // Event delegation: attach listener to the parent container
                            listOfHobbies.addEventListener('click', (event) => {
                                // Check if the clicked target is a hobby item


                                if (event.target.classList.contains('hobbyItem')) {
                                    const hobby = event.target.innerHTML;
                                    if (chosenInterests === hobby) {
                                        chosenInterests.splice(chosenInterests.indexOf(hobby), 1);
                                        event.target.style.backgroundColor = '#fff'; // Remove selection
                                    } else {
                                        chosenInterests.push(hobby);
                                        event.target.style.backgroundColor = '#D4D5D7'; // Apply selection
                                    }
                                    console.log('Chosen interests:', chosenInterests);
                                }
                            });

                            // Search functionality
                            searchVal.addEventListener('input', () => {
                                const filteredHobbies = response.data.filter(hobby => hobby.title.toLowerCase().includes(searchVal.value.toLowerCase()));
                                if (filteredHobbies.length === 0) {
                                    listOfHobbies.innerHTML = '<div class="p-2 text-[#888]">No hobbies found</div>';
                                    return;
                                }
                                renderHobbies(filteredHobbies); // Re-render after filtering
                            });
                        })
                        .catch((error) => {
                            console.error('Error fetching hobbies:', error.response.data.message);
                        });


                } else {
                    interestModal.style.display = 'none';
                }
            })
            .catch((error) => {
                if (error.response.data.message === 'Account not found') {
                    console.log('Account not found');
                    isRender = true;

                    if (isRender) {
                        userModal.style.display = 'flex';
                    }
                }

                if (error.response.status === 500) {
                    console.error('Server error', error.response.data.error);
                }
            });






        saveInterest?.addEventListener('click', () => {
            if (chosenInterests.length === 0) {
                editModal('Select at least one interest');
                return;
            }
            if (Loading) return;
            Loading = true;
            saveInterest.innerHTML = 'Loading...';
            axios.put('http://localhost:8080/updateAccount', {
                Uid: user?.uid,
                interests: chosenInterests
            })
                .then((response) => {
                    saveInterest.innerHTML = 'Save';
                    Loading = false;
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error saving interests:', error.response.data.message);
                    editModal('Error saving interests: ' + error.response.data.message);
                    saveInterest.innerHTML = 'Save';
                    Loading = false;
                });
        });


    } else {
        console.log('user logged out');
        window.location.href = '../signin.html';
    }
});