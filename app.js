let url =
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";

async function getRandomQuestions() {
  try {
    const response = await axios.get(url);
    const quizArr = response.data.results;
    return quizArr;
  } catch (e) {
    console.log("Error - ", e);
    return [];
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// DOM elements
const questionElement = document.querySelector("#question");
const answerButton = document.querySelector(".answer-buttons");
const nextButton = document.querySelector("#next-btn");

// Quiz state variables
let currIdx = 0; // Current question index
let score = 0; // User's score

getRandomQuestions()
  .then((quizArr) => {

    function showQuestion() {
      resetPrevious();
      let ans = [
        { text: quizArr[currIdx].correct_answer, correct: true },
        { text: quizArr[currIdx].incorrect_answers[0], correct: false },
        { text: quizArr[currIdx].incorrect_answers[1], correct: false },
        { text: quizArr[currIdx].incorrect_answers[2], correct: false },
      ];
      let currQuestion = {
        question: quizArr[currIdx].question,
        answers: shuffleArray(ans),
      };
      let QNo = currIdx + 1;
      questionElement.innerHTML = QNo + ". " + currQuestion.question;

      // Create buttons for each answer choice and set up event listeners
      for (let answer of currQuestion.answers) {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        if (answer.correct) {
          button.dataset.correct = answer.correct; // Mark correct answer
        }
        button.addEventListener("click", selectAnswer);
      }
    }

    // Function to start the quiz, reset variables, and show the first question
    function startQuiz() {
      currIdx = 0;
      score = 0;
      nextButton.innerHTML = "Next";
      showQuestion();
    }

    // Function to reset the previous question's UI
    function resetPrevious() {
      nextButton.style.display = "none";
      while (answerButton.firstChild) {
        answerButton.removeChild(answerButton.firstChild);
      }
    }

    // Function to handle the user's answer selection
    function selectAnswer(e) {
      const selectBtn = e.target;
      const isCorrect = selectBtn.dataset.correct === "true";

      // Update UI based on correct/incorrect answer
      if (isCorrect) {
        selectBtn.classList.add("correct");
        score++;
      } else {
        selectBtn.classList.add("incorrect");
      }

      // Disable all answer buttons and highlight the correct one
      for (let button of answerButton.children) {
        if (button.dataset.correct === "true") {
          button.classList.add("correct");
        }
        button.disabled = true;
      }

      // Display the next button
      nextButton.style.display = "block";
    }

    // Function to show the final score after completing all questions
    function showScore() {
      resetPrevious();
      questionElement.innerHTML = `You scored ${score} out of 10!`;
      nextButton.innerHTML = "Play Again";
      nextButton.style.display = "block";
    }

    // Function to handle the click event on the next button
    function handleNextButton() {
      currIdx++;
      if (currIdx < 10) {
        showQuestion();
      } else {
        showScore();
      }
    }

    async function resetQuiz() {
      try {
        quizArr = await getRandomQuestions();
        startQuiz();
      } catch (e) {
        console.log("Error - ", e);
      }
    }

    // Event listener for the next button
    nextButton.addEventListener("click", () => {
      if (currIdx < 10) {
        handleNextButton();
      } else {
        resetQuiz(); // Restart the quiz when all questions are answered
      }
    });

    // Start the quiz when the page loads
    startQuiz();
  })
  .catch((e) => {
    console.log("Error - ", e);
  });
