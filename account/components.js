class Icon extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                            height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
                            </path>
                        </svg>`
  }
}




class userModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
         <div
style="background: rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.18);"
            class="userModal hidden flex fixed top-0 left-0 h-[100vh] w-screen flex items-center justify-center p-3 z-[50000]">

            <div class="bg-[#ECECEC] border-[1px] border-[#D4D5D7]  relative rounded-md w-full max-w-[500px]">

                <div
                    class="w-[70px]  cursor-pointer  h-[70px] bg-[#3490dc] rounded-full absolute left-[10px] top-[-40px]">
                    <img class="imgCon w-full h-full rounded-full object-cover" src="" alt="">
                    <input accept="image/*" class="pfpFile inset-0 w-full h-full opacity-0 cursor-pointer absolute"
                        type="file">

                    <div
                        class="p-2 border-[1px] border-[#D4D5D7] rounded-full bg-[#ECECEC] flex items-center justify-center w-[30px] absolute  top-[40px] right-[-5px]">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512"
                            height="15px" width="15px" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z">
                            </path>
                        </svg>
                    </div>
                </div>


                <div class="mt-10 flex flex-col gap-2  border-y-[1px] border-y-[#D4D5D7] py-5 px-3">
                    <div class="email font-bold">

                    </div>

                    <div class="w-full roundned-md overflow-hidden">
                        <input class="Username w-full p-2 rounded-md border-[1px] border-[#D4D5D7] focus:outline-none"
                            placeholder="Username" type="text">
                    </div>
                    <div>
                        <select
                            class="SelectVal w-full outline-none p-2 rounded-md border-[1px] border-[#D4D5D7] text-[#888]"
                            name="educationLevel" id="educationLevel">
                            <option value="">Education Level</option>
                            <option value="elementary">Elementary</option>
                            <option value="senior_high">Senior High</option>
                            <option value="college">College</option>
                            <option value="graduate_school">Graduate School</option>
                            <option value="no_education">No Education</option> <!-- Added option for no education -->
                            <option value="not_applicable">Not Applicable</option>
                            <!-- Option for people who prefer not to disclose -->
                        </select>
                    </div>

                    <div class="errorModal bg-red-500 items-center gap-2 p-2 rounded-md text-white hidden">
                        <div class="icon">

                        </div>

                        <div class="text">

                        </div>
                    </div>


                </div>
                <div class="p-3 flex items-center justify-end">
                    <div class="submitBtn px-5 py-1 rounded-md text-[#ECECEC] cursor-pointer bg-[#3490dc]">
                        Submit
                    </div>
                </div>
            </div>



        </div>`
  }
}


class interestModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div
        style="background: rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.18);"

            class="userInterest hidden  z-[9999999999999999999999999999999999] flex fixed top-0 left-0 h-[100vh] bg-red-500 w-screen flex items-center justify-center p-3">

            <div class="bg-[#ECECEC] border-[1px] border-[#D4D5D7]  relative rounded-md w-full max-w-[500px]">
                <div class="p-3 border-b-[#D4D5D7] border-b-[1px]">
                    <div>
                        Please select your interests
                    </div>
                </div>

                <div class="p-3">
                    <input class="p-2 searchVal rounded-md w-full  border-[1px] border-[#D4D5D7] outline-none"
                        placeholder="Search for interests" type="text">


                    <div class="listOfHobbies flex flex-wrap gap-3 max-h-[500px] overflow-auto py-5">
                    </div>

                    <div class="errorModal bg-red-500 items-center gap-2 p-2 rounded-md text-white hidden">
                        <div class="icon">

                        </div>

                        <div class="text">

                        </div>
                    </div>
                    <div class="pt-5">
                        <button class="saveInterest bg-[#3490dc] text-white p-2 rounded-md w-full">Save</button>
                    </div>
                </div>
            </div>
        </div>`
  }
}


class systemSidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        
    <div class="w-full h-full max-w-[300px] min-w-[300px] hidden lg:flex flex-col  bg-[#ececec] border-[1px] border-[#B8B7B7] rounded-xl py-3">

      <div class="flex items-start gap-2 p-2 border-b-[1px] border-b-[#B8B7B7] pb-5 px-3">

        <div class="profilePicture w-[50px] h-[50px] bg-blue-500 rounded-full overflow-hidden">
<img class="profile-picture w-full h-full object-cover"></img>
        </div>

        <div class="flex flex-col">
          <div class="text-[#565454] font-bold sidebar-username">Username</div>
          <div class="text-[#565454] text-sm  sidebar-email">Email</div>
        </div>
      </div>


      <div class="flex flex-col gap-5 mt-5  p-2 h-full justify-between dashboardPageClick px-[1rem]">
        <div class="flex flex-col gap-5 ">


         <a 
         class="dashboardPageItem"
         href="dashboardUI.html">

           <div class="flex gap-2 items-center cursor-pointer">
            <div>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="20px"
                width="20px" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
              </svg>
            </div>
            Dashboard
          </div>
    
       </a>
         
 <a 
  class="dashboardPageItem"
 href="findUser.html">
          <div class="flex gap-2 items-center cursor-pointer findPageClick">
            <div>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="20px"
                width="20px" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path
                  d="M4 18h16c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2zM4 5h16v11H4V5zM1 19h22v2H1z">
                </path>
                <path
                  d="M13.97 7.53c-1.37-1.37-3.58-1.37-4.95 0s-1.37 3.58 0 4.95c1.18 1.18 3 1.34 4.36.47l2.09 2.09 1.06-1.06-2.09-2.09c.87-1.36.72-3.18-.47-4.36zm-1.06 3.88c-.78.78-2.05.78-2.83 0-.78-.78-.78-2.05 0-2.83s2.05-.78 2.83 0c.78.79.78 2.05 0 2.83z">
                </path>
              </svg>
            </div>
            Find
          </div>
 </a>


 <a
  class="dashboardPageItem"
  href="Schedule.html">
          <div class="flex gap-2 items-center cursor-pointer">
            <div>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="20px"
                width="20px" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z">
                </path>
              </svg>
            </div>
            Schedule
          </div>
 </a>

        </div>


<a
 class="dashboardPageItem"
 href="settings.html">
        <div class="flex gap-2 items-center cursor-pointer">
          <div>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20px"
              width="20px" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M413.967 276.8c1.06-6.235 1.06-13.518 1.06-20.8s-1.06-13.518-1.06-20.8l44.667-34.318c4.26-3.118 5.319-8.317 2.13-13.518L418.215 115.6c-2.129-4.164-8.507-6.235-12.767-4.164l-53.186 20.801c-10.638-8.318-23.394-15.601-36.16-20.801l-7.448-55.117c-1.06-4.154-5.319-8.318-10.638-8.318h-85.098c-5.318 0-9.577 4.164-10.637 8.318l-8.508 55.117c-12.767 5.2-24.464 12.482-36.171 20.801l-53.186-20.801c-5.319-2.071-10.638 0-12.767 4.164L49.1 187.365c-2.119 4.153-1.061 10.399 2.129 13.518L96.97 235.2c0 7.282-1.06 13.518-1.06 20.8s1.06 13.518 1.06 20.8l-44.668 34.318c-4.26 3.118-5.318 8.317-2.13 13.518L92.721 396.4c2.13 4.164 8.508 6.235 12.767 4.164l53.187-20.801c10.637 8.318 23.394 15.601 36.16 20.801l8.508 55.117c1.069 5.2 5.318 8.318 10.637 8.318h85.098c5.319 0 9.578-4.164 10.638-8.318l8.518-55.117c12.757-5.2 24.464-12.482 36.16-20.801l53.187 20.801c5.318 2.071 10.637 0 12.767-4.164l42.549-71.765c2.129-4.153 1.06-10.399-2.13-13.518l-46.8-34.317zm-158.499 52c-41.489 0-74.46-32.235-74.46-72.8s32.971-72.8 74.46-72.8 74.461 32.235 74.461 72.8-32.972 72.8-74.461 72.8z">
              </path>
            </svg>
          </div>
          Settings
        </div>
</a>
      </div>

    </div>`
  }
}


class headerHome extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <header class="w-full">

    <div class="w-full max-w-[1200px] flex justify-between items-center mx-auto">


      <div class="logo flex items-center justify-center">

        <div class="w-[40px] h-[40px] overflow-hidden">
          <img
          class="w-full h-full object-cover"
           src="./assets/logo.png" alt="Logo">
        </div>

        <div class="h-full font-bold">
          StudySync
        </div>
      </div>


      <nav class="hidden lg:flex">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="About.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>

      <div class="flex gap-2 items-center">
        <div class="navigator bg-[#565252] cursor-pointer p-2 rounded-[1.3rem] text-white px-5 hover:bg-[#888]">Sign in</div>
      </div>

    </div>
  </header>
    `
  }
}

class footerHome extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
     <footer class="relative z-[5000]">
    <div class="footer-container gap-5 flex flex-col lg:flex-row">
      <div class="footer-left items-start">

        <div class="logo flex items-center justify-start ">

          <div class="w-[40px] h-[40px] overflow-hidden">
            <img
            class="w-full h-full object-cover"
             src="./assets/logo.png" alt="Logo">
          </div>
  
          <div class="h-full font-bold">
            StudySync
          </div>
        </div>


        <div class="social-icons">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/1200px-2021_Facebook_icon.svg.png"
            alt="Facebook">
          <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub">
          <img src="https://i.pinimg.com/474x/e7/fc/c8/e7fcc89530a488a65f0035df69fd6a14.jpg" alt="Instagram">
        </div>
        <div class="learn-text">
          <p>Learn smoothly with StudySync<br>Save countless hours finding your perfect study buddy!</p>
        </div>
      </div>


      <div class="footer-right flex flex-col lg:flex-row">
        <div class="footer-column">
          <h4>System</h4>
          <a href="./account/dashboardUI.html">Dashboard</a>
          <a href="#calendar">Calendar</a>
          <a href="#schedule">Schedule</a>
          <a href="#settings">Settings</a>
        </div>
        <div class="footer-column">
          <h4>Authentication</h4>
          <a href="signin.html">Sign in</a>
          <a href="signup.html">Sign up</a>
          <a href="recover.html">Forgot Password</a>
        </div>
        <div class="footer-column">
          <h4>Resources</h4>
          <a href="index.html">Home</a>
          <a href="About.html">About</a>
          <a href="#contact">Contact</a>
        </div>

      </div>


    </div>


    <div class="footer-bottom">
      <p>© 2024 StudySync. All rights reserved.</p>
    </div>
  </footer>
    `
  }
}



class userHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    
      <header class="flex xl:hidden w-full items-center justify-between gap-5  border-b-[1px] border-b-[#ECECEC] pb-5">
        <div>
          <div class="w-[50px] h-[50px] rounded-full overflow-hidden">
            <img class="imgHeader"></img>
          </div>
        </div>

        <div class="openMenu">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" height="30px"
            width="30px" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </div>


        <div
          class="fixed menu z-[5000] overflow-y-auto w-full h-full bg-[#ececec] top-[0%] left-[-100%] p-5 flex  items-center justify-center flex-col text-[3rem]">

          <div class="flex items-center justify-between gap-5  border-b-[1px] border-b-[#ECECEC] pb-5 w-full">
            <div>
              <div class="w-[50px] h-[50px] bg-red-500 rounded-full overflow-hidden">
       <img class="imgHeader"></img>
              </div>
            </div>

            <div class="closeMenu">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="30px"
                width="30px" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z">
                </path>
              </svg>
            </div>
          </div>


          <div z-[999999999999999999999] class="h-full w-full p-5 flex lg:hidden  items-center justify-center flex-col text-[3rem]">

            <a href="DashboardUI.html">
              Dashboard
            </a>
            <a href="FindUser.html">
              Find User
            </a>
            <a href="Schedule.html">
              Schedule
            </a>
            <a href="settings.html">
              Settings
            </a>
          </div>
        </div>

      </header>`
  }
}
customElements.define('app-icon', Icon)
customElements.define('user-modal', userModal)
customElements.define('interest-modal', interestModal)
customElements.define('system-sidebar', systemSidebar)
customElements.define('footer-home', footerHome)

customElements.define('header-home', headerHome)

customElements.define('user-header', userHeader)


