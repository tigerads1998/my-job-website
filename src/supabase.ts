import { createClient } from '@supabase/supabase-js'

// Use environment variables for production, fallback to local for development
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

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