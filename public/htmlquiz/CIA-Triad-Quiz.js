document.addEventListener("DOMContentLoaded", () => {
  console.log("CIA-Triad-Quiz.js loaded successfully.");

  const form = document.getElementById("quiz-form");
  const feedback = document.getElementById("feedback");
  const progressBar = document.getElementById("progress-bar");

  if (!form || !feedback || !progressBar) {
    console.error("Error: Missing required elements. Check HTML IDs.");
    return;
  }

  const correctAnswers = {
    q1: "correct",
    q2: "denial of service",
    q3_1: "correct",
    q3_2: "correct",
    q3_3: "correct",
  };

  function checkAnswers(event) {
    event.preventDefault();
    console.log("Form submitted. Checking answers...");

    const formData = new FormData(form);
    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;

    for (let [key, value] of formData.entries()) {
      if (correctAnswers[key]?.toLowerCase() === value.trim().toLowerCase()) {
        score++;
      }
    }

    feedback.style.display = "block";
    feedback.textContent = `You scored ${score} out of ${totalQuestions}.`;
    feedback.classList.toggle("correct", score === totalQuestions);
    feedback.classList.toggle("incorrect", score !== totalQuestions);

    const progressPercentage = (score / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.style.display = "block";
  }

  form.addEventListener("submit", checkAnswers);
});
