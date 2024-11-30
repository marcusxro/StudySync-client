class Icon extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24"
                            height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
                            </path>
                        </svg>`
    }
}


class userModal extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
         <div
            class="userModal hidden flex fixed top-0 left-0 h-[100vh] bg-red-500 w-screen flex items-center justify-center p-3">

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


class interestModal extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <div
            class="userInterest hidden  flex fixed top-0 left-0 h-[100vh] bg-red-500 w-screen flex items-center justify-center p-3">

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

customElements.define('app-icon', Icon)

customElements.define('user-modal', userModal)

customElements.define('interest-modal', interestModal)