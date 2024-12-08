
import * as ZegoSuperBoard from "https://unpkg.com/zego-superboard-web@2.15.3/index.js";
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


const socket = io('http://localhost:8080');

const rootDom = document.querySelector("#root");
const searchButton = document.querySelector(".searchButton");
const container = document.querySelector(".container-show");

searchButton.addEventListener("click", () => {
    container.style.display = "none";
})


// window.addEventListener("resize", () => {
//     location.reload();
// });



//custom UI
const addIcon = `<svg stroke="currentColor" fill="#888" stroke-width="0" viewBox="0 0 512 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M304 256c52.805 0 96-43.201 96-96s-43.195-96-96-96-96 43.201-96 96 43.195 96 96 96zm0 48c-63.598 0-192 32.402-192 96v48h384v-48c0-63.598-128.402-96-192-96zM112 224v-64H80v64H16v32h64v64h32v-64h64v-32h-64z"></path></svg>`;
const reportIcon = `<svg stroke="currentColor" fill="#888" stroke-width="0" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 4.25c0-.966.784-1.75 1.75-1.75h17.5c.966 0 1.75.784 1.75 1.75v12.5a1.75 1.75 0 0 1-1.75 1.75h-9.586a.25.25 0 0 0-.177.073l-3.5 3.5A1.458 1.458 0 0 1 5 21.043V18.5H3.25a1.75 1.75 0 0 1-1.75-1.75ZM3.25 4a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 .75.75v3.19l3.427-3.427A1.75 1.75 0 0 1 11.164 17h9.586a.25.25 0 0 0 .25-.25V4.25a.25.25 0 0 0-.25-.25ZM12 6a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 12 6Zm0 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>`;


// const openMenu = document.querySelector('.openMenu')
// const closeMenu = document.querySelector('.closeMenu')

// const menu = document.querySelector('.menu')

// openMenu.addEventListener('click', () => {
//     menu.style.left = '0'
//         menu.style.transition = '0.5s'
// })

// closeMenu.addEventListener('click', () => { 
//     menu.style.left = '-100%'
//     menu.style.transition = '0.5s'
//     console.log('clicked')
// })

window.onload = function () {
    axios.get('http://localhost:8080/getHobbies')
        .then((response) => {
            console.log(response.data)
            let hobbies = response.data
            let hobbyList = document.querySelector('.hobbyList')
            hobbyList.innerHTML = ''
            hobbies.forEach(hobby => {
                let hobbyItem = document.createElement('option')
                hobbyItem.innerText = hobby.title
                hobbyList.appendChild(hobbyItem)
            })
            console.log(hobbies)

        })
        .catch((error) => {
            console.log(error)
        })


    const appID = 1634798824;
    const serverSecret = "f0d6175f39fa9eb4c0736f16008e46ef";

    onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) return; // Exit if no user is logged in

        // Create a custom div
        // const cu stomDiv = document.createElement("div");
        // customDiv.id = "customDiv";
        // customDiv.innerHTML = "Hello, World!";
        // document.body.appendChild(customDiv);

        // Add a button to join the room after selecting an interest

        const root = document.querySelector("#root");

        if (!root) return;

        const joinButton = document.querySelector('.searchButton')

        const observeDOM = (callback) => {
            const targetNode = document.querySelector("#root");
            const config = { childList: true, subtree: true };

            const observer = new MutationObserver(() => {
                callback();
            });

            observer.observe(targetNode, config);
            return observer;
        };


        function joinRoom() {
            const selectedInterest = document.querySelector(".hobbyList").value;
            root.style.height = "95%";

            setTimeout(() => {
                axios.get('http://localhost:8080/user/' + currentUser.uid)
                    .then((res) => {
                        const { data } = res;
                        console.log(data);
                        const userInfo = {
                            userId: currentUser.uid,
                            profilePicture: data?.imageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
                            displayName: currentUser.displayName || currentUser.email,
                        };
                        socket.emit("join_interest", { interest: selectedInterest, userInfo });
                    })
                    .catch((error) => {
                        console.error(error);

                        const userInfo = {
                            userId: currentUser.uid,
                            profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
                            displayName: currentUser.displayName || currentUser.email,
                        };
                        socket.emit("join_interest", { interest: selectedInterest, userInfo });
                    });
            }, 500);
        }

        joinButton.addEventListener("click", () => {
            joinRoom();

        });

        function createModal(message, onAccept, onDecline) {
            // Create the modal container
            const modalOverlay = document.createElement('div');
            modalOverlay.id = 'modal-overlay';
            modalOverlay.className = 'fixed z-[5000000000] inset-0 bg-black bg-opacity-50 flex items-center justify-center';

            // Add the modal content
            modalOverlay.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                    <p class="text-lg font-semibold mb-4">${message}</p>
                    <div class="flex justify-end gap-4">
                        <button id="accept" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
                        <button id="decline" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Decline</button>
                    </div>
                </div>
            `;

            // Append to the document body
            document.querySelector('body').appendChild(modalOverlay);

            // Button click handlers
            document.getElementById('accept').onclick = () => {
                onAccept();
                document.querySelector('body').removeChild(modalOverlay);
            };
            document.getElementById('decline').onclick = () => {
                onDecline();
                document.querySelector('body').removeChild(modalOverlay);
            };
        }

        // Handle room assignment from the server


        socket.on('friend_request', ({ requesterId, requesterName, targetId }) => {
            if (requesterId === currentUser.uid) return;

            createModal(`${requesterName} wants to add you as a friend.`,
                () => socket.emit('respond_friend_request', { requesterId, response: 'accept', targetId }),
                () => socket.emit('respond_friend_request', { requesterId, response: 'decline', targetId })
            );
        });


        // Listen for friend request responses
        socket.on('friend_request_accepted', ({ friendId }) => {
            console.log(`Friend request accepted by: ${friendId}`);
            // createModalRes(`User ${friendId} accepted your friend request!`);
        });

        socket.on('friend_request_declined', ({ targetId }) => {
            console.log(`Friend request declined by: ${targetId}`);
            // createModalRes(`User ${targetId} declined your friend request.`);
        });

        socket.on('friend_added', ({ friendId }) => {
            console.log(`Friend added: ${friendId}`);
            // createModalRes(`User ${friendId} added you as a friend!`);
        });


        // Test modal
        //     function createModalRes(message, onClose = () => { }) {
        //         const modalOverlay = document.createElement('div');
        //         modalOverlay.className = 'fixed z-[9999] inset-0 bg-black bg-opacity-50 flex items-center justify-center';
        //         modalOverlay.innerHTML = `
        //     <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        //         <p class="text-lg font-semibold mb-4">${message}</p>
        //         <div class="flex justify-end">
        //             <button id="ok-btn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">OK</button>
        //         </div>
        //     </div>
        // `;
        //         document.body.appendChild(modalOverlay);

        //         document.getElementById('ok-btn').onclick = () => {
        //             onClose();
        //             modalOverlay.remove();
        //         };
        //     }



        //fix later

        // socket.on('friend_request_accepted', ({ friendId }) => {   
        //     console.log(friendId, currentUser.uid);
        //     if (friendId === currentUser.uid) {
        //         alert(`Friend request accepted by ${friendId}`);
        //     }
        // });


        // socket.on('friend_request_declined', ({ targetId }) => {
        //     console.log(targetId, currentUser.uid);
        //     if (targetId === currentUser.uid) {
        //         alert(`Friend request declined by ${targetId}`);
        //     }
        // });

        function showUI(users, roomID) {
            const callHeader = document.querySelector(".callHeader");
            const otherBtn = document.querySelector(".otherBtn");

            if (users.length >= 1) {
                callHeader.style.display = "flex";  // Show call header if at least one user exists
                console.log("one");
            } else {
                callHeader.style.display = "none"; // Hide call header if no users
            }

            if (users.length === 2) {
                otherBtn.style.display = "block";  // Show the button if there are exactly two users
                console.log("two");

                // Define the behavior when the button is clicked
                const callModal = document.createElement("div");
                callModal.className = "fixed z-[500000000] p-5  top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center hidden";

                const selectReport = document.createElement("select");


                const callModalContent = document.createElement("div");
                callModalContent.className = "bg-[#ececec] pt-[4rem] relative p-5 rounded-md w-[400px] h-[auto] flex flex-col justify-center items-center gap-5";

                const addContainer = document.createElement("div");
                addContainer.className = "w-full relative";
                const otherUser = users.find((user) => user.userId && user.userId !== currentUser.uid);



                const addUserButton = document.createElement("button");
                addUserButton.innerHTML = `add ${otherUser.displayName}`;
                addUserButton.className = "bg-[#2c2f3e] text-white rounded-md p-2 w-full";
                addContainer.appendChild(addUserButton);

                selectReport.id = "report-select";
                selectReport.className = "block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent";
                selectReport.innerHTML = `
                    <option value="inappropriate">Inappropriate behavior</option>
                    <option value="spam">Spam</option>
                       <option value="bullying">Bullying</option>
                    <option value="other">Other</option>
                `;

                const closeButton = document.createElement("button");
                closeButton.className = "absolute top-3 right-3 text-sm bg-red-500 p-3 rounded-full text-white";
                closeButton.innerHTML = "X";

                const messageBox = document.createElement("textarea");
                messageBox.className = "resize-none w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent";
                messageBox.placeholder = "Enter your message here...";
                messageBox.rows = 5;


                const reportButton = document.createElement("button");
                reportButton.innerHTML = "Report user";
                reportButton.className = "bg-[#2c2f3e] rounded-md text-white p-2 w-full";
                reportButton.id = "report-button";




                function reportUser() {
                    const reportReason = selectReport.value;
                    const message = messageBox.value;

                    if (!message) {
                        alert("Please enter a message to report the user");
                        return;
                    }

                    if (!reportReason) {
                        alert("Please select a reason to report the user");
                        return;
                    }


                    axios.post('http://localhost:8080/reportUser', {
                        Uid: currentUser?.uid,
                        Type: reportReason,
                        Message: message,
                        UidToReport: otherUser.userId
                    })
                        .then((response) => {

                            alert("User reported!")

                            callModal.style.display = "none";
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }


                reportButton.onclick = () => {
                    reportUser()
                };


                console.log(otherUser);

                addUserButton.onclick = () => {
                    setTimeout(() => {
                        console.log(roomID, otherUser.userId, currentUser.uid);
                        if (otherUser) {
                            socket.emit('add_friend', { roomID, targetUserId: otherUser.userId, myUserId: currentUser.uid });
                            alert(`Friend request sent to ${otherUser.displayName}`);
                        } else {
                            alert('No user to add as a friend.');
                        }
                    }, 100)
                };



                closeButton.onclick = () => {
                    callModal.style.display = "none";
                };


                callModalContent.appendChild(closeButton);
                callModalContent.appendChild(addContainer);
                callModalContent.appendChild(selectReport);
                callModal.appendChild(callModalContent);
                callModalContent.appendChild(messageBox);
                callModalContent.appendChild(reportButton);

                document.querySelector('#root').appendChild(callModal);



                otherBtn.onclick = () => {
                    console.log("clicked");
                    callModal.style.display = "flex";
                };


            } else {
                otherBtn.style.display = "none"; // Hide the button if there are not exactly two users
            }
        }

        socket.on('room_updated', ({ roomID, users }) => {
            console.log('Room Updated:', roomID);
            console.log('Users in Room:', users);
            showUI(users, roomID);
        });

        socket.on("room_joined", ({ roomID, users }) => {

            console.log(`Joined room: ${roomID}, Users:`, users);

            setTimeout(() => {
                showUI(users, roomID);
            }, 1000);

            const roomUID = String(roomID).replace(" ", "_");

            let user;
            axios.post('http://localhost:8080/getAccountByUid/', { Uid: currentUser.uid })
                .then((response) => {
                    user = response.data

                    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                        appID,
                        serverSecret,
                        roomUID,
                        currentUser.uid,
                        user?.Username || currentUser.displayName || currentUser.email,
                    );



                    const zp = ZegoUIKitPrebuilt.create(kitToken);
                    zp.joinRoom({
                        container: document.querySelector("#root"),
                        sharedLinks: [
                            {
                                name: "StudySync link",
                                url:
                                    window.location.protocol +
                                    "//" +
                                    window.location.host +
                                    window.location.pathname +
                                    "?roomID=" +
                                    roomID,
                            },
                        ],
                        scenario: {
                            mode: ZegoUIKitPrebuilt.VideoConference,
                        },
                        turnOnMicrophoneWhenJoining: true,
                        turnOnCameraWhenJoining: true,
                        showMyCameraToggleButton: true,
                        showMyMicrophoneToggleButton: true,
                        showAudioVideoSettingsButton: true,
                        showScreenSharingButton: true,
                        showTextChat: true,
                        showUserList: true,
                        maxUsers: 2,

                        superBoard: true,
                        layout: "Auto",
                        darkMode: false,
                        showLayoutButton: true,
                        superBoardConfig: {
                            width: 800,
                            height: 600,
                            background: "#ffffff",
                            tool: {
                                pencil: true,
                                text: true,
                                eraser: true,
                                color: true,
                                shape: true,
                                clear: true,
                            },
                        },
                        onUserAvatarSetter: (userList) => {
                            userList.forEach((user) => {
                                const matchedUser = users.find((u) => u.userId === user.userID);
                                if (matchedUser) {
                                    user.setUserAvatar(matchedUser.profilePicture);
                                }
                            });

                        },
                        onJoinRoom: () => {
                            console.log("Joined room");

                            // socket.on("room_joined", ({ roomID, users }) => {
                            //     console.log(`Joined room: ${roomID}, Users:`, users);

                            //     showUI(users);
                            // });

                            // // Listen for any updates in the room (e.g., when a user leaves the room)
                            // socket.on('room_updated', ({ roomID, users }) => {
                            //     console.log('Room Updated:', roomID);
                            //     console.log('Users in Room:', users);

                            //     // Update the UI when the user list changes (someone leaves)
                            //     showUI(users);
                            // });
                        },

                        onLeaveRoom: () => {
                            // Emit to the server that the user is leaving the room
                            socket.emit('user_left_room', { roomID, userId: currentUser.uid });

                            // Custom logic when the user leaves
                            console.log("Left room");

                            // Optionally, you can also reload or navigate as needed:
                            const leaveRoom = document.querySelector(".mCx2N1NwuMWObjjTeG0q");
                            setTimeout(() => {
                                if (leaveRoom) {
                                    leaveRoom.onclick = () => {
                                        window.location.reload(); // Reload the page when the user leaves
                                    };
                                }
                            }, 50);
                        },
                        videoResolutionList: [
                            ZegoUIKitPrebuilt.VideoResolution_360P,
                            ZegoUIKitPrebuilt.VideoResolution_180P,
                            ZegoUIKitPrebuilt.VideoResolution_480P,
                            ZegoUIKitPrebuilt.VideoResolution_720P,
                        ],
                        videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_360P,
                    });

                    // zp.addPlugins({ ZegoSuperBoardManager });
                })
                .catch((error) => {
                    console.log(error)
                })
        });
    });
}



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
                const imgHeader = document.querySelectorAll('.imgHeader');

                imgHeader.forEach((img) => {
                    img.src = data.imageUrl;
                });

                profilePicture.src = data.imageUrl;
            })
            .catch((error) => {
                console.error(error);
            });
    }
})