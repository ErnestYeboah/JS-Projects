const questions  = [
    {
        question : "What is the largest planet in the solar system",
        answers : [
            {text : "Mars" , correct : false},
            {text : "Jupiter" , correct : true},
            {text : "Earth", correct : false},
            {text : "Saturn" , correct : false},
        ]
    },
    {
        question : "Who left her a slipper in the palace in disney land",
        answers : [
            {text : "Cinderella" , correct : true},
            {text : "Cindy" , correct : false},
            {text : "Rampazell", correct : false},
            {text : "Edith" , correct : false},
        ]
    },
    {
        question : "What is the closest planet to the sun",
        answers : [
            {text : "Mars" , correct : false},
            {text : "Jupiter" , correct : false},
            {text : "Mercury", correct : true},
            {text : "Saturn" , correct : false},
        ]
    },
]

const questionEl = document.querySelector(".question") as HTMLHeadingElement
const displayUsername = document.querySelector(".displayUsername") as HTMLHeadingElement
const answersCol = document.querySelector(".answers-col") as HTMLDivElement
const nextBtn = document.querySelector(".next") as HTMLButtonElement
const timeEl = document.querySelector(".time") as HTMLHeadingElement
const userNameEl = document.getElementById("username") as HTMLInputElement
const firstPage = document.querySelector(".first-page") as HTMLDivElement
const players = document.querySelector(".names") as HTMLUListElement
const highScores = document.querySelector(".scores") as HTMLUListElement

let currentIndex = 0
let scores = 0
let time = 30
let timer : any;

let User : any[]= []

const saved = JSON.parse(localStorage.getItem("Scores")!)
if(saved){
    User = saved
    renderScores()
}

function renderScores(){
    let listNames = ''
    let listScores = ''
    for(let i = 0; i < User.length; i++){
        listNames += `<li>${User[i].name}</li>`
        listScores += `<li>${User[i].scores}</li>`

        players.innerHTML = listNames
        highScores.innerHTML = listScores
    }
}



function start(){
    const username = userNameEl.value
    validateUsername(username)
    startQuiz()
    setTimeout(() => {
        displayUsername.textContent = "Best Brain quiz"
    },2000)

   
}



function validateUsername(username : string | null){
    if(username){
        firstPage.classList.add("active")
        displayUsername.textContent = `Welcome ${username.charAt(0).toUpperCase()}` + username.slice(1)
    }
    else {
        const promptEl = document.querySelector(".prompt") as HTMLHeadingElement
        promptEl.textContent = "Please type your name"
        promptEl.style.color = "salmon" 
    }

}

function startQuiz(){
    currentIndex = 0
    scores = 0
    time = 30
    timer = setInterval(countDown , 800)
    nextBtn.textContent = "Next"
    nextBtn.style.display = "none"
    displayQuiz()
    
}

function countDown(){
    time--
    timeEl.textContent = "Time : " + time.toString()

    if(time <= 0){
        clearInterval(timer)
        showScores()
        timeEl.style.color = "salmon"

    }
}



function displayQuiz(){
    reset()
    let currentQuestion = questions[currentIndex]
    let questionNo = currentIndex + 1
    questionEl.textContent = questionNo + "." + currentQuestion.question + "?"

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button")
        button.classList.add("btn")
        button.textContent = answer.text
        answersCol.append(button)
        if(answer.correct){
            button.dataset.correct = String(answer.correct)
        }

        button.addEventListener("click", selectAnswer)
    })
}

function selectAnswer(e : any){
    const selectedBtn = e.target
    const isCorrect = selectedBtn.dataset.correct === "true"

    if(isCorrect){
        scores++
        selectedBtn.classList.add("correct")
    }else {
        time -= 5
        selectedBtn.classList.add("incorrect")
    }

    Array.from(answersCol.children).forEach( (button : any) =>  {
        if(button.dataset.correct === "true"){
            button.classList.add("correct")
        }
        button.disabled = true
    })

    nextBtn.style.display = "block"
}

nextBtn.addEventListener("click", e => {
    if(currentIndex >= questions.length){
        startQuiz()
    }else {
        displayQuestion()
    }
})


function displayQuestion(){
    currentIndex++
    if(currentIndex < questions.length){
        displayQuiz()
    }
    else {
        showScores()
    }
}

function showScores(){
    reset()
    questionEl.textContent = `Tou had had ${scores} out of ${questions.length}`
    nextBtn.style.display = "block"
    nextBtn.textContent = "Play Again"
    clearInterval(timer)
    saveScores()
}

function saveScores(){
       
        // renderScores()
    const user = {
        name : userNameEl.value,
        scores : scores
    }
    User.push(user)
   localStorage.setItem("Scores", JSON.stringify(User))
}

function reset(){
    nextBtn.style.display = "none"
    while(answersCol.firstChild){
        answersCol.removeChild(answersCol.firstChild)
    }
}