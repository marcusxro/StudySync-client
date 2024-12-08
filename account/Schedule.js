

// const menuToggle = document.getElementById("menu-toggle");
// const sidebar = document.getElementById("sidebar");

// menuToggle.addEventListener("click", () => {
//   sidebar.classList.toggle("active");
//   menuToggle.classList.toggle("active");
// });


const findPageClick = document.querySelector('.findPageClick')
console.log(findPageClick)

findPageClick.addEventListener('click', () => {
  window.location.href = 'find.html'
})

const dashboardPageClick = document.querySelector('.dashboardPageClick')

dashboardPageClick.addEventListener('click', () => {
  window.location.href = 'dashboardUI.html'
})

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

const reqContainer = document.querySelector('.reqContainer');
const closeNotif = document.querySelector('.closeNotif');
const addNotif = document.querySelector('.addNotif');
const notifBtn = document.querySelector('.notifBtn');
const addModal = document.querySelector('.addModal');
const addBtn = document.querySelector('.addBtn');

closeNotif.addEventListener('click', () => {
  addNotif.style.display = 'none';
});

notifBtn.addEventListener('click', () => {
  addNotif.style.display = 'flex';
  console.log('clicked')
});

const addButton = document.querySelector('.closeModal');

console.log(addButton)

addButton.addEventListener('click', () => {
  console.log('clicked')
  addModal.style.display = 'none';
});

addBtn.addEventListener('click', () => {
  addModal.style.display = 'flex';
});

const InviteBtn = document.querySelector('.InviteBtn');
const addRequests = document.querySelector('.addRequests');
const closeRequests = document.querySelector('.closeReq');

InviteBtn.addEventListener('click', () => {
  addRequests.style.display = 'flex';
});

closeRequests.addEventListener('click', () => {
  addRequests.style.display = 'none';
});


//reusable function to return user
async function returnUser(userID) {
  try {
    const res = await axios.post('http://localhost:8080/getAccountByUid', { Uid: userID });
    console.log(res.data.Username);
    return res.data.Username;
  } catch (error) {
    console.error(error);
  }
}



onAuthStateChanged(auth, (user) => {
  if (user) {
    const sidebarUsername = document.querySelector('.sidebar-username')
    const sidebarEmail = document.querySelector('.sidebar-email')


    axios.post('http://localhost:8080/getScheduleByInvite', { Uid: user.uid })
      .then(async (res) => {
        const { data } = res;
        console.log(data);

        const inviteContainer = document.querySelector('.inviteContainer');


        for (const schedule of data.reverse()) {
          const reqItem = document.createElement('div');
          reqItem.className = 'mt-3 reqItem bg-[#888] text-white rounded-md p-3 cursor-pointer';
          reqItem.innerHTML = `
        <p>You have been invited by ${await returnUser(schedule.Uid)} to ${schedule.EventName} </p>
          <button class="bg-green-500 px-5 text-white rounded-md p-1 mt-2">Accept</button>
         `;
          inviteContainer.appendChild(reqItem);
        }
      })
      .catch((error) => {
        console.error(error);
      });


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

        for (const schedule of data.reverse()) {
          const reqItem = document.createElement('div');
          reqItem.className = 'mt-3 reqItem bg-[#888] text-white rounded-md p-3 cursor-pointer';
          reqItem.innerHTML = `
            <p class="font-semibold">${schedule.EventName}</p>
            <p class="req-username mb-3 text-sm">${schedule?.Description}</p>
            <p class="text-sm">${await returnUser(schedule.SelectedUser)}</p>
            <p class="text-sm">${schedule.Date}</p>
            <p class="text-sm">${schedule.Time}</p>
            <p class="text-sm">status: ${schedule.isAgreed ? "Accepted" : "Pending"}</p>
          `;
          reqContainer.appendChild(reqItem);
        }

        const calendarBody = document.getElementById("calendar-body");
        const currentMonthElem = document.getElementById("current-month");
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
            calendarBody.innerHTML += `<div class="day"></div>`;
          }

          for (let day = 1; day <= daysInMonth; day++) {
            const dayElem = document.createElement('div');
            dayElem.className = 'day';
            dayElem.textContent = day;

            const daySchedules = data.filter(schedule => {
              const scheduleDate = new Date(schedule.Date);
              return scheduleDate.getDate() === day && scheduleDate.getMonth() === month && scheduleDate.getFullYear() === year && schedule.isAgreed;
            });

            daySchedules.forEach(async schedule => {
              const eventElem = document.createElement('div');
              eventElem.className = 'event bg-[#f0f0f0] rounded-md p-1 mt-1 border-[1px] border-[#888] text-sm';
           
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

        monthButton.addEventListener("click", () => {
          monthDropdown.classList.toggle("hidden");
        });

        monthDropdown.addEventListener("click", (e) => {
          if (e.target.tagName === "LI") {
            currentMonth = parseInt(e.target.dataset.month, 10);
            updateCalendar(currentMonth, currentYear);
            monthDropdown.classList.add("hidden"); // Hide dropdown after selection
          }
        });

        document.addEventListener("click", (e) => {
          if (!monthButton.contains(e.target) && !monthDropdown.contains(e.target)) {
            monthDropdown.classList.add("hidden");
          }
        });

        prevMonthButton.addEventListener("click", () => changeMonth(-1));
        nextMonthButton.addEventListener("click", () => changeMonth(1));

        updateCalendar(currentMonth, currentYear);
      })
      .catch((error) => {
        console.error(error);
      });
    // Add hover effect to show full details





    axios.post('http://localhost:8080/getAccountByUid', { Uid: user.uid })
      .then((res) => {
        const { data } = res
        sidebarUsername.innerHTML = data.Username
        sidebarEmail.innerHTML = data.Email

        let loading
        const addData = document.querySelector('.addData');

        const SelectedUser = document.getElementById('SelectedUser')

        console.log(data.friends)

        data.friends.forEach(async friend => {
          const option = document.createElement('option');
          option.value = friend;
    
          option.textContent = await returnUser(friend);
          SelectedUser.appendChild(option);
        });

        function addSchedule() {

          if (loading) {
            return;
          }

          loading = true;
          addData.innerHTML = 'Loading...';



          const EventName = document.getElementById('EventName').value;
          const SelectedUser = document.getElementById('SelectedUser').value;
          const DateVal = document.getElementById('Date').value;
          const Time = document.getElementById('Time').value;
          const Description = document.getElementById('Description').value;


          // if (new Date(DateVal).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
          //   alert('Date cannot be in the past');
          //   loading = false;
          //   addData.innerHTML = 'Add ';
          //   return;
          // }

          if (!EventName || !SelectedUser || !DateVal || !Time || !Description) {
            alert('Please fill all fields');
            loading = false;
            addData.innerHTML = 'Add '
            return;
          }


          axios.post('http://localhost:8080/postSchedule', {
            EventName,
            SelectedUser,
            Uid: user.uid,
            Date: DateVal,
            Time,
            Description,
          })
            .then((res) => {
              console.log(res);
              axios.post('http://localhost:8080/postActivity',
                {
                  Uid: SelectedUser,
                  Message: `You have a new schedule with ${data.Username}, kindly confirm the schedule`,
                  Date: Date.now()
                })
                .then((res) => {
                  addModal.style.display = 'none';
                  loading = false;
                  addData.innerHTML = 'Add '

                  EventName.value = '';
                  SelectedUser.value = '';
                  Date.value = '';
                  Time.value = '';
                  Description.value = '';

                })
                .catch((error) => {
                  console.error(error);
                  loading = false;
                  addData.innerHTML = 'Add '
                });

            })
            .catch((error) => {
              console.error(error);
              loading = false;
              addData.innerHTML = 'Add '
            });
        }



        addData.addEventListener('click', addSchedule);




      })
      .catch((error) => {
        console.error(error)
      })

    axios.get('http://localhost:8080/user/' + user.uid)
      .then((res) => {
        const { data } = res;
        console.log(data);
        const profilePicture = document.querySelector('.profile-picture');
        profilePicture.src = data.imageUrl;
      })
      .catch((error) => {
        console.error(error);
      });

    console.log(user)
  } else {
    // No user is signed in.
  }
});
