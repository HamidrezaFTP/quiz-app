"use strict";

// DOM Elements
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
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 120; // 2 minutes
let timerId;

// Questions Data
let questions = [];

// API Configuration
const API_URL = "https://opentdb.com/api.php";
const params = {
  amount: 10,
  category: 18, // Computers category
  difficulty: "medium",
  type: "multiple",
};

// Helper Functions
const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const showLoading = (isLoading) => {
  loadingElement.classList.toggle("hide", !isLoading);
};

const showError = (message) => {
  errorElement.textContent = `Error: ${message}`;
  errorElement.classList.remove("hide");
};

// Fetch Questions
const fetchQuestions = async () => {
  try {
    showLoading(true);
    const response = await fetch(`${API_URL}?${new URLSearchParams(params)}`);
    const data = await response.json();
    if (data.response_code !== 0) {
      throw new Error("Failed to fetch questions. Please try again.");
    }

    questions = data.results.map((item) => {
      const options = shuffleArray([
        ...item.incorrect_answers.map((answer) => decodeHtml(answer)),
        decodeHtml(item.correct_answer),
      ]);
      return {
        question: decodeHtml(item.question),
        options,
        answer: options.indexOf(decodeHtml(item.correct_answer)), // Correct answer index
      };
    });
  } catch (error) {
    showError(error.message);
    return [];
  } finally {
    showLoading(false);
  }
};

// Load Question
const loadQuestion = () => {
  const { question, options } = questions[currentQuestionIndex];
  questionElement.textContent = question;
  optionsContainer.innerHTML = "";

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option.trim();
    button.classList.add("optionButton");
    button.addEventListener("click", () => checkAnswer(index));
    optionsContainer.appendChild(button);
  });

  currentQuestionElement.textContent = currentQuestionIndex + 1;
  totalQuestionsElement.textContent = questions.length;
  progressBar.style.width = `${
    (currentQuestionIndex / (questions.length - 1)) * 100
  }%`;
};

// Check Answer
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

// Start Timer
const startTimer = () => {
  clearInterval(timerId); // Clear any existing timer
  timeLeft = 120;
  timerElement.textContent = timeLeft;

  timerId = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      endQuiz();
    }
  }, 1000);
};

// Start Quiz
const startQuiz = () => {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 120;
  timerElement.textContent = timeLeft;
  progressBar.style.width = "0%";
  startScreen.classList.add("hide");
  quizScreen.classList.remove("hide");
  endScreen.classList.add("hide");
  loadQuestion();
  startTimer();
};

// End Quiz
const endQuiz = () => {
  clearInterval(timerId);
  quizScreen.classList.add("hide");
  endScreen.classList.remove("hide");
  scoreElement.textContent = `${score} out of ${questions.length}`;
  progressBar.style.width = "0%";
  timerElement.textContent = "";
};

// Event Listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", startQuiz);

// Fetch questions on page load
fetchQuestions();
