import { createClient } from '@supabase/supabase-js'

// Use environment variables for production.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required. Check your .env file or Netlify environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type WorkModel = 'on-site' | 'remote' | 'hybrid';

// Database types
export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  work_model?: WorkModel
  is_verified?: boolean;
  salary_min?: number
  salary_max?: number
  description: string
  requirements: string[]
  benefits: string[]
  created_at: string
  updated_at: string
  is_active: boolean
  employer_id: string
}

export interface User {
  id: string
  email: string
  full_name: string
  role: 'employer' | 'jobseeker' | 'admin'
  company?: string
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  user_id: string
  cover_letter: string
  resume_url?: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
} 