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


        async function returnUser(userID) {
            try {
              const res = await axios.post('http://localhost:8080/getAccountByUid', { Uid: userID });
              console.log(res.data.Username);
              return res.data.Username;
            } catch (error) {
              console.error(error);
            }
          }

        function formatTime(time) {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours, 10);
            const suffix = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${suffix}`;
        }

        axios.post('http://localhost:8080/getSchedule', { Uid: user.uid })
        .then(async (res) => {
          const { data } = res;
          console.log(data);
  
  
          const calendarBody = document.getElementById("calendar-body");
          const currentMonthElem = document.querySelector(".currMonth");
          const monthDropdown = document.getElementById("month-dropdown");
          const monthButton = document.getElementById("month-button");
          const prevMonthButton = document.getElementById("prev-month");
          const nextMonthButton = document.getElementById("next-month");
  
          let currentDate = new Date();
          let currentMonth = currentDate.getMonth();
          let currentYear = currentDate.getFullYear();
  
          function updateCalendar(month, year) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();



            calendarBody.innerHTML = ""; // Clear previous days
  
            for (let i = 0; i < firstDay; i++) {
              calendarBody.innerHTML += `<div class="day w-full h-full"></div>`;
            }
  
            for (let day = 1; day <= daysInMonth; day++) {
              const dayElem = document.createElement('div');
              dayElem.className = 'day w-full h-full';
              dayElem.textContent = day;
  
              const daySchedules = data.filter(schedule => {
                const scheduleDate = new Date(schedule.Date);
                return scheduleDate.getDate() === day && scheduleDate.getMonth() === month && scheduleDate.getFullYear() === year && schedule.isAgreed;
              });
  
              daySchedules.forEach(async schedule => {
                const eventElem = document.createElement('div');
                eventElem.className = 'event bg-[#f0f0f0] w-full rounded-md p-1 mt-1 border-[1px] border-[#888] text-[10px]';
  
                eventElem.textContent = `${schedule.EventName} (${formatTime(schedule.Time)})`;
                eventElem.title = `Event: ${schedule.EventName}\nTime: ${formatTime(schedule.Time)}\nDescription: ${schedule.Description}\nWith: ${await returnUser(schedule.SelectedUser)}`;
                dayElem.appendChild(eventElem);
              });
  
  
  
              if (daySchedules.length > 0) {
                dayElem.classList.add('clickable');
  
                dayElem.addEventListener('click', async () => {
                  const existingModal = document.querySelector('.modal');
                  if (existingModal) {
                    document.body.removeChild(existingModal);
                  }
  
                  const modal = document.createElement('div');
                  modal.className = 'modal p-3 fixed z-[5000000000] inset-0 bg-black bg-opacity-50 flex items-center justify-center';
                  modal.innerHTML = `
                  <div class="modal-content bg-[#fff] p-3 rounded-md">
                    <span class="close-button">&times;</span>
                    <h2>Event on ${day}/${month + 1}/${year}</h2>
                    <div class="event-details"></div>
                  </div>
                  `;
                  document.body.appendChild(modal);
  
                  const eventDetails = modal.querySelector('.event-details');
                  eventDetails.className = 'flex flex-col gap-3';
  
  
                  daySchedules.forEach(async schedule => {
                    const eventElem = document.createElement('div');
                    eventElem.className = 'event-detail';
                    eventElem.innerHTML = `
                      <p><strong>Event:</strong> ${schedule.EventName}</p>
                      <p><strong>Time:</strong> ${formatTime(schedule.Time)}</p>
                      <p><strong>Description:</strong> ${schedule.Description}</p>
                      <p><strong>With:</strong> ${await returnUser(schedule.SelectedUser)}</p>
                      <button class="join-button bg-[#565454] w-full text-white rounded-md p-3 cursor-pointer hidden">Join</button>
                    `;
  
                    eventDetails.appendChild(eventElem);
  
                    const isValid = new Date(`${schedule.Date}T${schedule.Time}`) - Date.now() <= 3 * 60 * 60 * 1000 && new Date(`${schedule.Date}T${schedule.Time}`) - Date.now() >= 0;
  
                    if (isValid) {
                      const joinButton = eventElem.querySelector('.join-button');
                      joinButton.style.display = 'block';
  
                      //add redicrection afterwards
                      joinButton.addEventListener('click', async () => {
                        console.log(schedule._id)
                      });
                    }
  
                  });
  
                  const closeButton = modal.querySelector('.close-button');
                  closeButton.addEventListener('click', () => {
                    document.body.removeChild(modal);
                  });
                });
              }
  
  
  
              calendarBody.appendChild(dayElem);
  
            }
  
            const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
            currentMonthElem.textContent = `${monthName} ${year}`;
          }
  
          function changeMonth(offset) {
            currentMonth += offset;
            if (currentMonth < 0) {
              currentMonth = 11;
              currentYear--;
            } else if (currentMonth > 11) {
              currentMonth = 0;
              currentYear++;
            }
            updateCalendar(currentMonth, currentYear);
          }
  
        //   monthButton.addEventListener("click", () => {
        //     monthDropdown.classList.toggle("hidden");
        //   });
  
          monthDropdown.addEventListener("click", (e) => {
            if (e.target.tagName === "LI") {
              currentMonth = parseInt(e.target.dataset.month, 10);
              updateCalendar(currentMonth, currentYear);
              monthDropdown.classList.add("hidden"); // Hide dropdown after selection
            }
          });
  
        //   document.addEventListener("click", (e) => {
        //     if (!monthButton.contains(e.target) && !monthDropdown.contains(e.target)) {
        //       monthDropdown.classList.add("hidden");
        //     }
        //   });
  
          prevMonthButton.addEventListener("click", () => changeMonth(-1));
          nextMonthButton.addEventListener("click", () => changeMonth(1));
  
          updateCalendar(currentMonth, currentYear);
        })
        .catch((error) => {
          console.error(error);
        })



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

