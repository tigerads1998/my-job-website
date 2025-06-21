import { supabaseLocal as supabase, WorkModel } from '../supabase-local'
import { Job } from '../supabase-local'
import { createClient } from '@supabase/supabase-js'
import { mockJobService } from './mockJobService'

// Admin client with service_role key for operations that need to bypass RLS (Local)
const adminSupabase = createClient(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
)

// Connection test function
async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id')
      .limit(1)
    
    return !error && data !== null
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return false
  }
}

export interface CreateJobData {
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  work_model?: WorkModel
  salary_min?: number
  salary_max?: number
  description: string
  requirements: string[]
  benefits: string[]
}

export interface UpdateJobData extends Partial<CreateJobData> {
  is_active?: boolean
}

export const jobService = {
  // Get all active jobs
  async getJobs(filters?: {
    location?: string
    type?: string
    company?: string
    search?: string
    work_model?: string
  }) {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock data due to connection issues')
        return await mockJobService.getJobs(filters)
      }

      let query = supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }

      if (filters?.company) {
        query = query.ilike('company', `%${filters.company}%`)
      }

      if (filters?.work_model) {
        query = query.eq('work_model', filters.work_model)
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) {
        console.warn('Supabase query failed, using mock data:', error)
        return await mockJobService.getJobs(filters)
      }
      
      return data
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return await mockJobService.getJobs(filters)
    }
  },

  // Get all jobs for admin (including inactive ones)
  async getAllJobs() {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock data due to connection issues')
        return await mockJobService.getJobs()
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Supabase query failed, using mock data:', error)
        return await mockJobService.getJobs()
      }
      
      return data
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return await mockJobService.getJobs()
    }
  },

  // Get job by ID
  async getJobById(id: string): Promise<Job | null> {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock data due to connection issues')
        return await mockJobService.getJobById(id)
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.warn('Supabase query failed, using mock data:', error)
        return await mockJobService.getJobById(id)
      }
      
      return data
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return await mockJobService.getJobById(id)
    }
  },

  // Create new job (requires authentication)
  async createJob(jobData: CreateJobData): Promise<Job> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        ...jobData,
        employer_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Create new job without authentication (for internal use)
  async createJobWithoutAuth(jobData: CreateJobData): Promise<Job> {
    const { data, error } = await adminSupabase
      .from('jobs')
      .insert({
        ...jobData,
        is_active: true  // Ensure job is active
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data
  },

  // Update job
  async updateJob(id: string, updates: UpdateJobData): Promise<Job> {
    const { data, error } = await adminSupabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete job - Use admin client to bypass RLS
  async deleteJob(id: string) {
    const { error } = await adminSupabase
      .from('jobs')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get jobs by employer
  async getJobsByEmployer(employerId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Search jobs
  async searchJobs(searchTerm: string): Promise<Job[]> {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock data due to connection issues')
        return await mockJobService.searchJobs(searchTerm)
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Supabase query failed, using mock data:', error)
        return await mockJobService.searchJobs(searchTerm)
      }
      
      return data
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return await mockJobService.searchJobs(searchTerm)
    }
  },

  // Get job statistics
  async getJobStats() {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock data due to connection issues')
        const mockJobs = await mockJobService.getJobs()
        return {
          totalJobs: mockJobs.length,
          activeJobs: mockJobs.filter(job => job.is_active).length
        }
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('id, is_active')
        .eq('is_active', true)

      if (error) {
        console.warn('Supabase query failed, using mock data:', error)
        const mockJobs = await mockJobService.getJobs()
        return {
          totalJobs: mockJobs.length,
          activeJobs: mockJobs.filter(job => job.is_active).length
        }
      }

      return {
        totalJobs: data.length,
        activeJobs: data.filter(job => job.is_active).length
      }
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      const mockJobs = await mockJobService.getJobs()
      return {
        totalJobs: mockJobs.length,
        activeJobs: mockJobs.filter(job => job.is_active).length
      }
    }
  }
} 