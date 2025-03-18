import { useState, useEffect } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CIATriadQuiz() {
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3_1: "", q3_2: "", q3_3: "" });
  const [correctAnswers, setCorrectAnswers] = useState(null);
  const [score, setScore] = useState(null);
  const [progress, setProgress] = useState(0);
  const [answerOptions, setAnswerOptions] = useState({ q3_1: [], q3_2: [], q3_3: [] });
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [pointsAdded, setPointsAdded] = useState(false);
  const router = useRouter();
  
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    // Get the current user as soon as the component mounts
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        return;
      }
      
      if (data && data.user) {
        setUser(data.user);
        console.log("User authenticated:", data.user.id);
      } else {
        console.log("No authenticated user found");
      }
    };

    // Fetch correct answers
    async function fetchCorrectAnswers() {      
      const { data, error } = await supabase
        .from("answers")
        .select("answers")
        .eq("lesson_name", "CIA Triad")
        .single();

      if (error) {
        console.error("Error fetching answers:", error);
      } else {
        setCorrectAnswers({
          q1: data.answers[0],
          q2: data.answers[1],
          q3_1: data.answers[2],
          q3_2: data.answers[3],
          q3_3: data.answers[4],
        });
      }
    }

    // Execute both functions
    getCurrentUser();
    fetchCorrectAnswers();
    
    // Set up answer options
    setAnswerOptions({
      q3_1: shuffleArray(["Protecting Sensitive Data from Unauthorized Access", "Hiding Data from Everybody", "Making and Keeping Agreements"]),
      q3_2: shuffleArray(["Keeping People Honest", "Data Remains Accurate and the Same", "Keeping Data Whole and Undivided"]),
      q3_3: shuffleArray(["Systems and Data are Accessible to Everybody at All Times", "The Freedom to Do Any Action", "System and Data are Accessible When Needed by Authorized People"])
    });
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        console.log("User signed in:", session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        console.log("User signed out");
      }
    });
    
    // Clean up the auth listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  // Function to update leaderboard points
  const updateLeaderboardPoints = async (pointsToAdd) => {
    // Reset message and points added flag
    setUpdateMessage("");
    setPointsAdded(false);
    
    if (!user) {
      setUpdateMessage("You need to be logged in to update your points.");
      return false;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Updating points for user:", user.id);
      
      // First, get the current leaderboard entry for the user
      const { data: existingEntry, error: fetchError } = await supabase
        .from("leaderboard")
        .select("total_points, monthly_points, streak")
        .eq("user_id", user.id)
        .single();

      console.log("Fetch result:", existingEntry, fetchError);

      if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is "no rows returned"
        console.error("Error fetching leaderboard entry:", fetchError);
        setUpdateMessage("Error updating points. Please try again.");
        setIsSubmitting(false);
        return false;
      }

      // If user exists, update their points, otherwise create a new entry
      if (existingEntry) {
        // Update points
        const newTotalPoints = existingEntry.total_points + pointsToAdd;
        const newMonthlyPoints = existingEntry.monthly_points + pointsToAdd;
        
        // Update streak (increment by 1 if they completed the quiz successfully)
        const newStreak = pointsToAdd > 0 ? existingEntry.streak + 1 : existingEntry.streak;
        
        console.log("Updating existing entry with new points:", newTotalPoints);
        
        const { error: updateError } = await supabase
          .from("leaderboard")
          .update({ 
            total_points: newTotalPoints,
            monthly_points: newMonthlyPoints,
            streak: newStreak
          })
          .eq("user_id", user.id);

        if (updateError) {
          console.error("Error updating points:", updateError);
          setUpdateMessage("Error updating points. Please try again.");
          setIsSubmitting(false);
          return false;
        }
        
        console.log("Points updated successfully");
      } else {
        // For new users, create an entry with initial values
        console.log("Creating new leaderboard entry");
        
        const { error: insertError } = await supabase
          .from("leaderboard")
          .insert([{ 
            user_id: user.id, 
            total_points: pointsToAdd,
            monthly_points: pointsToAdd,
            streak: pointsToAdd > 0 ? 1 : 0,
            region: "Unknown" // Default value
          }]);

        if (insertError) {
          console.error("Error creating leaderboard entry:", insertError);
          setUpdateMessage("Error updating points. Please try again.");
          setIsSubmitting(false);
          return false;
        }
        
        console.log("New leaderboard entry created successfully");
      }

      setUpdateMessage(`Successfully added ${pointsToAdd} points to your leaderboard!`);
      setPointsAdded(true);
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error("Unexpected error:", error);
      setUpdateMessage("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!correctAnswers) return;

    let newScore = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    Object.entries(answers).forEach(([key, value]) => {
      if (correctAnswers[key]?.toLowerCase() === value.trim().toLowerCase()) {
        newScore++;
      }
    });

    setScore(newScore);
    setProgress((newScore / totalQuestions) * 100);

    // Calculate points to add (score * 10)
    const pointsToAdd = newScore * 10;
    
    // Only show "Added points" message if update was successful
    const success = await updateLeaderboardPoints(pointsToAdd);
    if (!success) {
      setPointsAdded(false);
    }
  };

  const handleViewLeaderboard = () => {
    router.push("/leaderboard");
  };

  const handleLogin = () => {
    router.push("/login"); // Adjust this path based on your login page URL
  };

  return (
    <div>
      <Head>
        <title>CIA Triad Quiz</title>
        <link rel="stylesheet" href="/styles/homepagestyle.css" />
      </Head>

      <header>
        <h1><a href="/">Hacker's Path</a></h1>
      </header>

      {/* Roadmap Navigation */}
      <div className="roadmap">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/htmllessons/lessons.html">Lessons</a>
        <a href="/htmlquiz/quizzes.html">Quizzes</a>
        <a href="/profile">Profile</a>
      </div>
    
      <div className="quiz-container">
        <h2>Test your knowledge of the CIA Triad</h2>
        
        {!user && (
          <div className="login-prompt">
            <p>Please log in to save your quiz results to the leaderboard.</p>
            <button onClick={handleLogin} className="login-btn">Log In</button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="question">
            <p><b>1. What are the three components of the CIA Triad?</b></p>
            <label className="radio-option">
              <input type="radio" name="q1" value="Confidentiality, Integrity, Availability" onChange={handleChange} /> Confidentiality, Integrity, Availability
            </label>
            <label className="radio-option">
              <input type="radio" name="q1" value="Confidentiality, Integrity, Accuracy" onChange={handleChange} /> Confidentiality, Integrity, Accuracy
            </label>
            <label className="radio-option">
              <input type="radio" name="q1" value="Comfortability, Integrity, Availability" onChange={handleChange} /> Comfortability, Integrity, Availability
            </label>
          </div>

          <div className="question">
            <p><b>2. What is an attack against availability called?</b></p>
            <input type="text" name="q2" value={answers.q2} onChange={handleChange} className="text-input" />
          </div>

          <div className="question">
            <p><b>3. Match each aspect of the CIA triad to its definition:</b></p>
            <ul className="match-list">
              <li>
                1. Confidentiality
                <select name="q3_1" onChange={handleChange} className="dropdown">
                  <option value="">Select</option>
                  {answerOptions.q3_1.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </li>
              <li>
                2. Integrity
                <select name="q3_2" onChange={handleChange} className="dropdown">
                  <option value="">Select</option>
                  {answerOptions.q3_2.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </li>
              <li>
                3. Availability
                <select name="q3_3" onChange={handleChange} className="dropdown">
                  <option value="">Select</option>
                  {answerOptions.q3_3.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </li>
            </ul>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {score !== null && (
          <div className="feedback">
            <p><b>You scored {score} out of {Object.keys(correctAnswers).length}.</b></p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            
            {updateMessage && <p className="update-message">{updateMessage}</p>}
            
            {pointsAdded && score > 0 && (
              <p>Added {score * 10} points to your leaderboard total!</p>
            )}
            
            {!user && score > 0 && (
              <div className="login-prompt">
                <p>Log in to save these points to your leaderboard!</p>
                <button onClick={handleLogin} className="login-btn">Log In</button>
              </div>
            )}
            
            <button onClick={handleViewLeaderboard} className="view-leaderboard-btn">
              View Leaderboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
