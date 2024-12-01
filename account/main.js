const socket = io('http://localhost:8080');



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

const APP_ID = "b452e0b5524748eb8d992de388fd4ebe"
const TOKEN = "007eJxTYGi0b45Yuv18776CAA0N6/QTYV8zDh4T4Qt7+/1AVPOBV9cVGJJMTI1SDZJMTY1MzE0sUpMsUiwtjVJSjS0s0lJMUpNSA3d4pzcEMjLIbvrByMgAgSA+B4NbZl5KQGJ6KgMDAEwRIrU="
const CHANNEL = "FindPage"
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`;
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

    localTracks[1].play(`user-${UID}`);

    await client.publish([localTracks[0], localTracks[1]]);
};

let joinStream = async () => {
    const hobbyList = document.querySelector('.hobbyList');
    const hobby = hobbyList.options[hobbyList.selectedIndex]?.text;

    if (!hobby) {
        alert('Please select a hobby before joining.');
        return;
    }

    // Emit the selected hobby to the server
    socket.emit('set-interest', hobby, (response) => {
        if (response.success) {
            if (response.roomUID) {
                alert('Joined stream successfully! Waiting for another user.');
                document.getElementById('join-btn').style.display = 'none';
                document.getElementById('stream-controls').style.display = 'flex';

                // Initialize the local stream
                joinAndDisplayLocalStream(response.roomUID);
            } else {
                alert('No available room. You are starting a new one.');
            }
        } else {
            alert(response.message || 'Failed to join stream.');
        }
    });

    // Listen for updates about the room
    socket.on('room-uid', ({ roomUID }) => {
        console.log(`Assigned to room: ${roomUID}`);
    });
};

let handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
        let player = document.getElementById(`user-container-${user.uid}`);
        if (player != null) {
            player.remove();
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div>
                  </div>`;
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

        user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
};


let handleUserLeft = async (user) => {

    socket.emit('user-left', user)

    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for (let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'block'
    document.getElementById('stream-controls').style.display = 'none'
    document.getElementById('video-streams').innerHTML = ''
}

let toggleMic = async (e) => {
    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false)
        e.target.innerText = 'Mic on'
        e.target.style.backgroundColor = 'cadetblue'
    } else {
        await localTracks[0].setMuted(true)
        e.target.innerText = 'Mic off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

let toggleCamera = async (e) => {
    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false)
        e.target.innerText = 'Camera on'
        e.target.style.backgroundColor = 'cadetblue'
    } else {
        await localTracks[1].setMuted(true)
        e.target.innerText = 'Camera off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)


socket.on('user-joined', (data) => {
    console.log('User joined:', data)
})

socket.on('user-left', (data) => {
    console.log('User left:', data)
})

socket.on('receive-message', (data) => {
    console.log('Message:', data)
})

socket.on('disconnect', () => {
    console.log('Disconnected from server')
})

