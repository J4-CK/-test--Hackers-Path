// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Reference elements
  const form = document.getElementById("quiz-form");
  const feedback = document.getElementById("feedback");
  const progressBar = document.getElementById("progress-bar");

  // Ensure elements exist before continuing
  if (!form || !feedback || !progressBar) {
    console.error("Error: Missing required elements (form, feedback, progress bar).");
    return;
  }

  // Define correct answers
  const correctAnswers = {
    q1: "correct", // Multiple choice
    q2: "denial of service", // Short answer
    q3_1: "correct", // Matching: Confidentiality
    q3_2: "correct", // Matching: Integrity
    q3_3: "correct", // Matching: Availability
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

    // Ensure feedback element is visible
    feedback.style.display = "block"; 
    feedback.textContent = `You scored ${score} out of ${totalQuestions}.`;
    feedback.className = "feedback";
    feedback.classList.remove("correct", "incorrect");
    feedback.classList.add(score === totalQuestions ? "correct" : "incorrect");

    // Ensure progress bar is visible and updates
    const progressPercentage = (score / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.style.display = "block";
  }

  // Attach event listener to the form
  form.addEventListener("submit", checkAnswers);
});
