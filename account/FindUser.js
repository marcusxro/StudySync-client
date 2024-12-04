
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

window.onload = function () {

    function getUrlParams(url) {
        let urlStr = url.split('?')[1];
        const urlSearchParams = new URLSearchParams(urlStr);
        const result = Object.fromEntries(urlSearchParams.entries());
        return result;
    }

    const selectElement = document.createElement("select");
    selectElement.className = "hobbyList";

    document.body.insertBefore(selectElement, document.querySelector("#root"));

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


        })
        .catch((error) => {
            console.log(error)
        })


    const appID = 1634798824;
    const serverSecret = "f0d6175f39fa9eb4c0736f16008e46ef";
    onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) return; // Exit if no user is logged in

        // Create a custom div
        const customDiv = document.createElement("div");
        customDiv.id = "customDiv";
        customDiv.innerHTML = "Hello, World!";
        document.body.appendChild(customDiv);

        // Add a button to join the room after selecting an interest
        const joinButton = document.createElement("button");
        joinButton.textContent = "Join Room";
        document.body.insertBefore(joinButton, document.querySelector("#root"));

        // Event listener for joining the room
        joinButton.addEventListener("click", () => {
            const selectedInterest = document.querySelector(".hobbyList").value;




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

        });

        // Handle room assignment from the server
        socket.on("room_joined", ({ roomID, users }) => {
            console.log(`Joined room: ${roomID}, Users:`, users);

            const roomUID = String(roomID).replace(" ", "_");

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomUID,
                currentUser.uid,
                currentUser.displayName || currentUser.email
            );

            // Initialize and join the room
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
                            console.log("Setting avatar for user:", matchedUser);
                            user.setUserAvatar(matchedUser.profilePicture);
                        }
                    });
                },
                videoResolutionList: [
                    ZegoUIKitPrebuilt.VideoResolution_360P,
                    ZegoUIKitPrebuilt.VideoResolution_180P,
                    ZegoUIKitPrebuilt.VideoResolution_480P,
                    ZegoUIKitPrebuilt.VideoResolution_720P,
                ],
                videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_360P,
            });
        });
    });



}