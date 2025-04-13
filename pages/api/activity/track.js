import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { activity, userId } = req.body;

    if (!activity || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Insert the activity into the activities table
    const { data, error } = await supabase
      .from('activities')
      .insert([
        {
          user_id: userId,
          activity_type: activity,
          timestamp: new Date().toISOString()
        }
      ]);

    if (error) throw error;

    return res.status(200).json({ message: 'Activity tracked successfully', data });
  } catch (error) {
    console.error('Error tracking activity:', error);
    return res.status(500).json({ message: 'Error tracking activity', error: error.message });
  }
} 