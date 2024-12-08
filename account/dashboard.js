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

        console.log(user)


        axios.post('http://localhost:8080/getActivity', { Uid: user.uid })
            .then((res) => {
                const { data } = res
                console.log(data.userActivity)

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const lastWeek = new Date(today);
                lastWeek.setDate(lastWeek.getDate() - 7);
                const lastMonth = new Date(today);
                lastMonth.setMonth(lastMonth.getMonth() - 1);

                const groupedByPeriod = {
                    today: [],
                    yesterday: [],
                    lastWeek: [],
                    lastMonth: [],
                    older: []
                };

                data.userActivity.forEach(activity => {
                    const activityDate = new Date(parseInt(activity.Date));
                    if (activityDate.toDateString() === today.toDateString()) {
                        groupedByPeriod.today.push(activity);
                    } else if (activityDate.toDateString() === yesterday.toDateString()) {
                        groupedByPeriod.yesterday.push(activity);
                    } else if (activityDate >= lastWeek) {
                        groupedByPeriod.lastWeek.push(activity);
                    } else if (activityDate >= lastMonth) {
                        groupedByPeriod.lastMonth.push(activity);
                    } else {
                        groupedByPeriod.older.push(activity);
                    }
                });

                console.log(groupedByPeriod);

                const actCon = document.querySelector('.actCon');

                actCon.innerHTML = '';

                for (const period in groupedByPeriod) {
                    if (groupedByPeriod[period].length === 0) {
                        continue;
                    }
                    const container = document.createElement('div');

                    const periodHeader = document.createElement('h3');
                    periodHeader.innerHTML = period.charAt(0).toUpperCase() + period.slice(1);
                    container.appendChild(periodHeader);

                    const periodList = document.createElement('ul');
                    periodList.className = 'flex flex-col gap-2';
                    groupedByPeriod[period].forEach(activity => {
                        const activityItem = document.createElement('li');
                        activityItem.innerHTML = activity.Message;
                        activityItem.className = 'bg-gray-200 p-2 rounded-md border border-gray-300';
                        
                        if (period === 'today') {
                            activityItem.style.borderLeft = '4px solid green';
                        } else if (period === 'yesterday') {
                            activityItem.style.borderLeft = '4px solid blue';
                        } else if (period === 'lastWeek') {
                            activityItem.style.borderLeft = '4px solid gray';
                        }

                        periodList.appendChild(activityItem);
                    });
                    container.appendChild(periodList);
                    container.className = 'flex flex-col gap-4';

                    actCon.appendChild(container);
                }

                console.log(data.message)
            })
            .catch((error) => {
                console.error(error)
            })

    } else {
        // No user is signed in.
    }
});


const findPageClick = document.querySelector('.findPageClick')


findPageClick.addEventListener('click', () => {
    window.location.href = 'find.html'
})

const dashboardPageClick = document.querySelector('.dashboardPageClick')

dashboardPageClick.addEventListener('click', () => {
    window.location.href = 'dashboardUI.html'
})

