import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { quizName, score, maxScore } = req.body;

    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;

    // Calculate points (10 points per correct answer)
    const pointsEarned = score * 10;

    // First, get the current user data including points
    const { data: userData, error: fetchError } = await supabase
      .from('accounts')
      .select('quiz_scores, total_points, monthly_points')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw fetchError;
    }

    // Initialize or update the quiz_scores object
    const quizScores = userData?.quiz_scores || {};
    quizScores[quizName] = quizScores[quizName] || [];
    quizScores[quizName].push({
      score,
      maxScore,
      pointsEarned,
      timestamp: new Date().toISOString()
    });

    // Calculate new points
    const newTotalPoints = (userData?.total_points || 0) + pointsEarned;
    const newMonthlyPoints = (userData?.monthly_points || 0) + pointsEarned;

    // Update the user's record with the new scores and points
    const { error: updateError } = await supabase
      .from('accounts')
      .update({
        quiz_scores: quizScores,
        total_points: newTotalPoints,
        monthly_points: newMonthlyPoints,
        last_points_update: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    // Log the activity
    const { error: activityError } = await supabase
      .from('user_activity')
      .insert([
        {
          user_id: userId,
          activity: `Completed ${quizName} with score ${score}/${maxScore} and earned ${pointsEarned} points`,
          created_at: new Date().toISOString()
        }
      ]);

    if (activityError) {
      console.error('Error logging activity:', activityError);
      // Don't return error here as the score and points were saved successfully
    }

    return res.status(200).json({
      success: true,
      message: 'Score and points saved successfully',
      quizScores,
      pointsEarned,
      newTotalPoints,
      newMonthlyPoints
    });

  } catch (error) {
    console.error('Error saving quiz score:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
