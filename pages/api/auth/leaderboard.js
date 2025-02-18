import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchLeaderboard() {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('total_points', { ascending: false })

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }

    return data;
}
