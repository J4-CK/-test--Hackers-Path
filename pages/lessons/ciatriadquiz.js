// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Reference elements
  const form = document.getElementById("quiz-form");
  const feedback = document.getElementById("feedback");
  const progressBar = document.getElementById("progress-bar");

  // Define the correct answers
  const correctAnswers = {
    q1: "correct", // Multiple choice
    q2: "const", // Short answer
    q3_1: "correct", // Matching: Confidentiality
    q3_2: "correct", // Matching: Integrity
    q3_3: "correct", //Matching: Availability
  };

  // Function to check answers
  function checkAnswers(event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(form); // Collect form data
    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;

    // Check answers
    for (let [key, value] of formData.entries()) {
      // For short answer, compare trimmed and case-insensitive values
      if (correctAnswers[key]?.toLowerCase() === value.trim().toLowerCase()) {
        score++;
      }
    }

    // Update feedback
    feedback.textContent = `You scored ${score} out of ${totalQuestions}.`;
    feedback.className = "feedback";
    feedback.classList.add(score === totalQuestions ? "correct" : "incorrect");

    // Update progress bar
    const progressPercentage = (score / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  }

  // Attach event listener to the form
  form.addEventListener("submit", checkAnswers);
});
