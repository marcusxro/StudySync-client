

const form = document.querySelector('.contact-form')
const contactButton = document.querySelector('.contact-button')


let loading;
const Interests = document.getElementById('interests')

const Message = document.querySelector('.Message').value


console.log(Interests)

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if(loading) return
    loading = true
    contactButton.innerHTML = 'Sending...'


    const Firstname = document.querySelector('.Firstname').value
    const Lastname =  document.querySelector('.Lastname').value
    const Email = document.querySelector('.Email').value
    const InterestsVal = Interests.options[Interests.selectedIndex].value

    console.log

    axios.post('http://localhost:8080/contact', {
        Firstname: Firstname,
        Lastname: Lastname,
        Email: Email,
        Interests: InterestsVal,
        Message: Message
    })
        .then((res) => {
            console.log(res)
            alert('Message Sent Successfully')
            loading = false
            contactButton.innerHTML = 'Send Message'
            form.reset()
        })
        .catch((e) => {
            console.error(e)
            alert('Error Sending Message')
            loading = false
            contactButton.innerHTML = 'Send Message'
        })
})


const Faqs = [
    {
      "question": "What is StudySync?",
      "answer": "StudySync is an educational platform designed to connect students and educators worldwide. It matches users based on shared academic interests, such as physics, math, or history, to enable collaborative learning and knowledge exchange."
    },
    {
      "question": "How does the matching process work?",
      "answer": "When you sign up, you’ll select your educational interests (e.g., physics, biology, literature). StudySync uses this information to pair you with other users who share similar interests for meaningful academic discussions."
    },
    {
      "question": "Is StudySync free to use?",
      "answer": "Yes, StudySync is completely free to use. Simply create an account, choose your interests, and start connecting with like-minded learners."
    },
    {
      "question": "What topics can I choose as interests?",
      "answer": "StudySync covers a wide range of academic subjects, including: Physics, Chemistry, Mathematics, History, Literature, Computer Science, and more! You can update your interests anytime from your profile settings."
    },
    {
      "question": "Do I need to create an account to use StudySync?",
      "answer": "Yes, an account is required to ensure a safe and personalized experience. Your account lets you choose your interests and access matched users."
    },
    {
      "question": "Can I change my interests later?",
      "answer": "Absolutely! You can update your interests anytime in your account settings to find new matches based on your evolving academic needs."
    },
    {
      "question": "Is StudySync safe to use?",
      "answer": "We prioritize user safety and data privacy. StudySync includes moderation tools to ensure a respectful environment and prohibits inappropriate behavior."
    },
    {
      "question": "Can I report a user for inappropriate behavior?",
      "answer": "Yes, you can report any user who violates the platform's guidelines. Our team will review the report and take appropriate action."
    },
    {
      "question": "Can I connect with users outside my selected interest?",
      "answer": "Currently, StudySync matches users based solely on their selected interests to maintain an academic focus. However, you can adjust your interests anytime for broader connections."
    },
    {
      "question": "How can StudySync help me with my studies?",
      "answer": "StudySync connects you with people who share your academic goals, making it easier to: Exchange ideas and solutions, Collaborate on projects, Get help with challenging topics, Learn from different perspectives and study techniques."
    },
    {
      "question": "Are there group study options?",
      "answer": "Not yet, but we’re working on introducing group study features where multiple users can collaborate on shared topics."
    },
    {
      "question": "What happens if I can’t find a match right away?",
      "answer": "If no immediate matches are available, StudySync will notify you when someone with similar interests logs on. You can continue browsing or exploring educational resources while waiting."
    },
    {
      "question": "How do I ensure a productive session with my match?",
      "answer": "Be clear about your goals (e.g., homework help, topic discussion). Use respectful language. Keep the conversation focused on your shared interest."
    },
    {
      "question": "Can I share files or documents?",
      "answer": "Currently, file sharing is not available directly through StudySync, but you can discuss topics in detail. We’re exploring ways to make collaboration even easier."
    },
    {
      "question": "Who can use StudySync?",
      "answer": "StudySync is open to anyone interested in learning, whether you're a student, teacher, or lifelong learner."
    }
  ]

  const faqContainer = document.getElementById("faq-container");
  Faqs.forEach((faq, index) => {
    // Create the question and answer elements
    const faqItem = document.createElement("div");
    faqItem.className = "faq-item";
  
    const faqQuestion = document.createElement("div");
    faqQuestion.className = "faq-question";
    faqQuestion.textContent = faq.question;
  
    const faqAnswer = document.createElement("div");
    faqAnswer.className = "faq-answer";
    faqAnswer.textContent = faq.answer;
  
    // Add toggle functionality
    faqQuestion.addEventListener("click", () => {
      faqAnswer.classList.toggle("active");
    });
  
    // Append question and answer to the item, then to the container
    faqItem.appendChild(faqQuestion);
    faqItem.appendChild(faqAnswer);
    faqContainer.appendChild(faqItem);
  });