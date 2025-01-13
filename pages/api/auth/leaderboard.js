import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchLeaderboard() {
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*, accounts ( name )')
        .order('total_points', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }

    return data.map((entry) => ({
        name: entry.users.name,
        total_points: entry.total_points,
    }));
}
