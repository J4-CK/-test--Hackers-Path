import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Fetch quiz attempts with user details
    const { data: quizHistory, error } = await supabase
      .from('quiz_attempts')
      .select(`
        *,
        user:user_id (
          name,
          email
        )
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Calculate additional statistics
    const stats = {
      totalQuizzes: quizHistory.length,
      totalPoints: quizHistory.reduce((sum, quiz) => sum + quiz.points_earned, 0),
      averageScore: quizHistory.length > 0 
        ? (quizHistory.reduce((sum, quiz) => sum + (quiz.score / quiz.total_questions), 0) / quizHistory.length * 100).toFixed(1)
        : 0,
      perfectScores: quizHistory.filter(quiz => quiz.score === quiz.total_questions).length
    };

    return res.status(200).json({
      success: true,
      quizHistory,
      stats
    });

  } catch (error) {
    console.error('Error fetching quiz history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
