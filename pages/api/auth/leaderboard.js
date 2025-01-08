import { supabase } from './login';

export async function fetchLeaderboard() {
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }

    return data;
}

