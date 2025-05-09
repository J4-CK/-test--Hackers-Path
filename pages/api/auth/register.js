import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use createPagesServerClient instead of createServerSupabaseClient
  const supabase = createPagesServerClient({ req, res });

  const { email, password, username } = req.body;

  // Sign the user up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError || !signUpData?.user) {
    return res.status(400).json({ error: signUpError?.message || 'Signup failed' });
  }

  const userId = signUpData.user.id;

  // Insert the user into the `accounts` table
  const { error: insertError } = await supabase
    .from('accounts')
    .insert([
      {
        user_id: userId,
        name: username,
        region: 'default',
        completion: [0],
      }
    ]);


  return res.status(200).json({ 
    message: `Success! Your account has been created with username ${username}`,
    username: username
  });
}
