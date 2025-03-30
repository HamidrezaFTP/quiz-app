const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startQuizBtn");
const quizScreen = document.getElementById("questionScreen");
const currentQuestionElement = document.getElementById("currentQuestion");
const totalQuestionsElement = document.getElementById("totalQuestions");
const progressBar = document.getElementById("progressBar");
const timerElement = document.getElementById("timer");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const restartButton = document.getElementById("restartQuizBtn");

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: 2,
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: 2,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Fe", "Pb"],
    answer: 0,
  },
];

const loadQuestion = (questionIndex) => {
  const currentQuestion = questions[questionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("optionButton");
    button.addEventListener("click", () => checkAnswer(index, questionIndex));
    optionsContainer.appendChild(button);
  });

  currentQuestionElement.textContent = questionIndex + 1;
  totalQuestionsElement.textContent = questions.length;
  progressBar.style.width = `${(questionIndex / questions.length) * 100}%`;
};

const startQuiz = () => {
  startScreen.classList.add("hide");
  quizScreen.classList.remove("hide");
  loadQuestion(0);
};

startButton.addEventListener("click", startQuiz);
