import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getAuth, onAuthStateChanged, GoogleAuthProvider, reauthenticateWithPopup , EmailAuthProvider, reauthenticateWithCredential } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';


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
    const saveUsername = document.querySelector('.saveUsername')
    const savePassword = document.querySelector('.savePassword')

    const oldPassword = document.querySelector('.oldPass')
    const newPassword = document.querySelector('.newPass')

    const education_level = document.querySelector('.education')

    const educLevel = document.querySelector('.educLevel')

    const showDelete = document.querySelector('.deleteBtn')
    const deleteModal = document.querySelector('.deleteAcc')

    const acceptDelete = document.querySelector('.acceptDelete')
    const cancelDelete = document.querySelector('.cancelDelete')

    const logOut = document.querySelector('.logOut')

    showDelete.addEventListener('click', () => {
        deleteModal.style.display = 'flex'
    })

    cancelDelete.addEventListener('click', () => {
        deleteModal.style.display = 'none'
    })

    logOut.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = '/client/signin.html'
        }).catch((error) => {
            console.error(error)
        })
    })



    acceptDelete.addEventListener("click", () => {
        if (user) {
          const providerData = user.providerData[0];
      
          if (providerData) {
            if (providerData.providerId === "google.com") {
              // Handle Google Provider reauthentication
              const provider = new GoogleAuthProvider();
      
              reauthenticateWithPopup(user, provider)
                .then(() => {
                  // Now delete the user
                  return user.delete();
                })
                .then(() => {
                  alert("Account deleted successfully!");
                  window.location.href = "../signin.html";
                })
                .catch((error) => {
                  console.error("Error during deletion:", error);
                  alert("Failed to delete account. Please try again.");
                });
            } else if (providerData.providerId === "password") {
              // Handle Email/Password reauthentication
              const email = user.email;
              const password = prompt("Please enter your password to confirm:");
      
              if (password) {
                const credential = EmailAuthProvider.credential(email, password);
      
                reauthenticateWithCredential(user, credential)
                  .then(() => {
                    // Now delete the user
                    return user.delete();
                  })
                  .then(() => {
                    alert("Account deleted successfully!");
                    window.location.href = "../signin.html";
                  })
                  .catch((error) => {
                    console.error("Error during deletion:", error);
                    alert("Failed to delete account. Please ensure your password is correct.");
                  });
              } else {
                alert("Password is required to delete the account.");
              }
            } else {
              alert("Unsupported provider. Please contact support.");
            }
          } else {
            alert("No provider information found. Please contact support.");
          }
        } else {
          alert("No user is signed in.");
        }
      });
      
    console.log(emailValue)
    let loading;

    saveBtrn.addEventListener('click', () => {
        if (loading) {
            return;
        }
        loading = true;
        saveBtrn.innerHTML = 'Uploading...';

        const formData = new FormData();
        formData.append('profilePicture', pfpFile.files[0]);
        formData.append('Uid', user.uid); // Ensure user.uid is available in your context

        axios
            .post('https://studysyncserver.onrender.com/updateProfilePic', formData, {
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


    axios.post('https://studysyncserver.onrender.com/getAccountByUid', { Uid: user.uid })
        .then((res) => {
            const { data } = res
            sidebarUsername.innerHTML = data.Username
            sidebarEmail.innerHTML = data.Email
            username.innerHTML = data.Username
            friends.innerHTML = data.friends.length + " Friends";

            console.log(data.Username

            )
            userValue.value = data.Username
            emailValue.value = data.Email

            const defaultUsername = data.Username

            education_level.innerHTML = data.education_level.toUpperCase()

            educLevel.value = data.education_level

            saveUsername.addEventListener('click', () => {
                if (userValue.value === defaultUsername && educLevel.value === data.education_level) {
                    alert('Data is the same as before')
                } else {
                    if (userValue.value === '' || educLevel.value === '') {
                        alert('Please fill in all fields')
                        return
                    }
                    axios.post('https://studysyncserver.onrender.com/changeUsername', { Uid: user.uid, Username: userValue.value, education_level: educLevel.value })
                        .then((res) => {
                            const { data } = res
                            console.log(data)
                            alert('Info changed successfully')
                            window.location.reload()
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                }
            })
            console.log(user)

            if (user.providerData.length > 0) {
                user.providerData.forEach((profile) => {
                    if (profile.providerId === 'google.com') {
                        console.log('Google user')
                        console.log(profile.photoURL)
                        oldPassword.value = 'Google user'
                        oldPassword.disabled = true
                        newPassword.value = 'Google user'
                        newPassword.disabled = true
                        savePassword.value = 'Google user'
                        savePassword.disabled = true
                    } else if (profile.providerId === 'facebook.com') {
                        console.log('Facebook user')
                        console.log(profile.photoURL)
                    } else if (profile.providerId === 'password') {
                        console.log('Password user')
                    } else {
                        console.log('Unknown provider')
                    }
                })
            }



            savePassword.addEventListener('click', () => {
                const user = auth.currentUser;

                if (user) {
                    // Create the credential using the old password
                    const credential = EmailAuthProvider.credential(user.email, oldPassword.value);

                    // Reauthenticate the user
                    reauthenticateWithCredential(user, credential)
                        .then(() => {
                            // Update the password after successful reauthentication
                            updatePassword(user, newPassword.value)
                                .then(() => {
                                    alert('Password changed successfully');
                                    window.location.reload();
                                })
                                .catch((error) => {
                                    console.error('Error updating password:', error);
                                    alert('An error occurred while updating the password');
                                });
                        })
                        .catch((error) => {
                            console.error('Error reauthenticating:', error);
                            alert('An error occurred while reauthenticating. Please ensure your old password is correct.');
                        });
                } else {
                    alert('No user is signed in. Please sign in and try again.');
                }
            });
        })
        .catch((error) => {
            console.error(error)
        })

    axios.get('https://studysyncserver.onrender.com/user/' + user.uid)
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