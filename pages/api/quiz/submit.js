import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, quizId, score, totalQuestions, quizType } = req.body;

    if (!userId || !quizId || score === undefined || !totalQuestions || !quizType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // First, get the user's current points
    const { data: userData, error: userError } = await supabase
      .from('accounts')
      .select('total_points, monthly_points')
      .eq('user_id', userId)
      .single();

    if (userError) {
      throw userError;
    }

    // Calculate points (10 points per correct answer)
    const pointsEarned = score * 10;
    const newTotalPoints = (userData.total_points || 0) + pointsEarned;
    const newMonthlyPoints = (userData.monthly_points || 0) + pointsEarned;

    // Start a transaction to update both tables
    const { error: updateError } = await supabase
      .from('accounts')
      .update({
        total_points: newTotalPoints,
        monthly_points: newMonthlyPoints,
        last_points_update: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    // Save quiz attempt
    const { error: quizError } = await supabase
      .from('quiz_attempts')
      .insert([{
        user_id: userId,
        quiz_id: quizId,
        score: score,
        total_questions: totalQuestions,
        points_earned: pointsEarned,
        quiz_type: quizType,
        completed_at: new Date().toISOString()
      }]);

    if (quizError) {
      throw quizError;
    }

    return res.status(200).json({
      success: true,
      pointsEarned,
      newTotalPoints,
      newMonthlyPoints,
      score,
      totalQuestions
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
