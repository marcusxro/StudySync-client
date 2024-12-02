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
    calendarBody.innerHTML += `
      <div class="day" data-tooltip="You have scheduled a meeting with User1!">${day}</div>`;
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

const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  menuToggle.classList.toggle("active");
});




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
