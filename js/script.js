"use strict";

// Selecting elements from the DOM
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startQuizBtn");
const quizScreen = document.getElementById("questionScreen");
const currentQuestionElement = document.getElementById("currentQuestion");
const totalQuestionsElement = document.getElementById("totalQuestions");
const progressBar = document.getElementById("progressBar");
const timerElement = document.getElementById("timer");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const endScreen = document.getElementById("endScreen");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restartQuizBtn");

// Question data
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

// Variables to keep track of the quiz state
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerId;

const endQuiz = () => {
  clearInterval(timerId); // Stop the timer
  quizScreen.classList.add("hide");
  endScreen.classList.remove("hide");
  scoreElement.textContent = `Your score is ${score} out of ${questions.length}`;
  progressBar.style.width = "0%"; // Reset progress bar
  timerElement.textContent = ""; // Reset timer display
};

const checkAnswer = (selectedOption) => {
  const isCorrect = selectedOption === questions[currentQuestionIndex].answer;
  const optionButtons = document.querySelectorAll(".optionButton");

  optionButtons.forEach((button, index) => {
    if (index === selectedOption) {
      button.classList.add(isCorrect ? "correct" : "wrong");
    }
    if (index === questions[currentQuestionIndex].answer && !isCorrect) {
      button.classList.add("correct");
    }
  });

  if (isCorrect) score++;

  setTimeout(() => {
    currentQuestionIndex++;
    currentQuestionIndex < questions.length ? loadQuestion() : endQuiz();
  }, 1000);
};

const loadQuestion = () => {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("optionButton");
    button.addEventListener("click", () => checkAnswer(index));
    optionsContainer.appendChild(button);
  });

  currentQuestionElement.textContent = currentQuestionIndex + 1;
  totalQuestionsElement.textContent = questions.length;
  progressBar.style.width = `${
    (currentQuestionIndex / questions.length) * 100
  }%`;
};

const startTimer = () => {
  timerId = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      endQuiz();
    }
  }, 1000);
};

const startQuiz = () => {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 30; // Reset timer
  timerElement.textContent = timeLeft; // Reset timer display
  progressBar.style.width = "0%"; // Reset progress bar
  startScreen.classList.add("hide");
  quizScreen.classList.remove("hide");
  endScreen.classList.add("hide");
  loadQuestion();
  startTimer();
};

// Start the quiz
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", startQuiz);
