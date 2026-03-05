import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// IMPORTANT: set these values to your Supabase project URL and anon/public key.
// For production you should not commit secret keys. The anon key is intended
// for public client usage; keep service_role keys on the server side.
const SUPABASE_URL = "https://ididxhgszvdvfyfzwfgm.supabase.co"; // e.g. 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaWR4aGdzenZkdmZ5Znp3ZmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Mzc5MzgsImV4cCI6MjA4MjMxMzkzOH0.ZVOS2nxT8KbCB7U5xL0DKy9DGj3KrjJU7AJkR0_b33g"; // e.g. 'eyJ...'

function makeMissingClient() {
  const err = new Error(
    'Supabase URL or anon key not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in supabase-client.js or provide them via a secure runtime.'
  );

  const thrower = () => {
    throw err;
  };

  return {
    auth: {
      getSession: thrower,
      getUser: thrower,
      onAuthStateChange: thrower,
      signOut: thrower,
      signInWithPassword: thrower
    },
    from: thrower
  };
}

let supabase;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Export a dummy client that throws helpful errors when used
  supabase = makeMissingClient();
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { supabase };

export async function getSession() {
  if (!supabase || !supabase.auth || typeof supabase.auth.getSession !== 'function') {
    throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in supabase-client.js');
  }
  const { data } = await supabase.auth.getSession();
  return data;
}

export async function getUser() {
  if (!supabase || !supabase.auth || typeof supabase.auth.getUser !== 'function') {
    throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in supabase-client.js');
  }
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(cb) {
  if (!supabase || !supabase.auth || typeof supabase.auth.onAuthStateChange !== 'function') {
    throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in supabase-client.js');
  }
  return supabase.auth.onAuthStateChange(cb);
}

// perform a lightweight connection test and return detailed info
export async function testConnection() {
  try {
    // if not configured, getSession/getUser will throw a helpful message
    const sessionRes = await supabase.auth.getSession();
    const userRes = await supabase.auth.getUser();
    return { ok: true, session: sessionRes, user: userRes };
  } catch (err) {
    return { ok: false, error: err };
  }
}
