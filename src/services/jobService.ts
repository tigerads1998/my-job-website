import { supabase } from '../supabase'
import { Job, WorkModel } from '../supabase'
import { mockJobService } from './mockJobService'

// Connection test function
async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('jobs').select('id').limit(1)
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

  // Create new job (allows guest posting)
  async createJob(jobData: CreateJobData): Promise<Job> {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock job service due to connection issues')
        return await mockJobService.createJob(jobData)
      }

      // Get current user (optional)
      const { data: { user } } = await supabase.auth.getUser()
      
      const insertData = {
        ...jobData,
        employer_id: user?.id || null, // Allow null for guest job posting
        is_active: true,
        is_verified: false
      };
      
      console.log('📝 Creating job with data:', insertData);
      
      const { data, error } = await supabase
        .from('jobs')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('❌ Job creation failed:', error);
        throw new Error(error.message || 'Failed to create job. Please try again.');
      }
      
      console.log('✅ Job created successfully:', data.id);
      return data
    } catch (error: any) {
      // If it's a connection error, use mock
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        console.warn('Network error, using mock job service:', error)
        return await mockJobService.createJob(jobData)
      }
      
      // Re-throw other errors (like validation errors)
      throw error
    }
  },

  // Update job
  async updateJob(id: string, updates: UpdateJobData): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete job
  async deleteJob(id: string) {
    const { error } = await supabase.from('jobs').delete().eq('id', id)

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