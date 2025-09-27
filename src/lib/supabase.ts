import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://opqwpbnwjfmxtddfbbfb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcXdwYm53amZteHRkZGZiYmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTEyMjAsImV4cCI6MjA3NDI4NzIyMH0.Rq8xjiPd8EMswaIpUkWKmKrS1aRQy9b9xdDVTVwAKLc";

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);