
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


const socket = io('https://studysyncserver.onrender.com');

let user;

onAuthStateChanged(auth, (currentUser) => {
    const roomUID = new URLSearchParams(window.location.search).get("roomID");

    const appID = 1634798824;
    const serverSecret = "f0d6175f39fa9eb4c0736f16008e46ef";
    axios.post('https://studysyncserver.onrender.com/getAccountByUid/', { Uid: currentUser.uid })
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
                        roomUID,
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
            // onUserAvatarSetter: (userList) => {
            //     userList.forEach((user) => {
            //         const matchedUser = users.find((u) => u.userId === user.userID);
            //         if (matchedUser) {
            //             user.setUserAvatar(matchedUser.profilePicture);
            //         }
            //     });
            // },
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

        zp.addPlugins({ ZegoSuperBoardManager });
    })
    .catch((error) => {
        console.log(error)
    })
})