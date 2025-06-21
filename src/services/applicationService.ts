import { supabaseLocal as supabase } from '../supabase-local'
import { Application } from '../supabase-local'
import { createClient } from '@supabase/supabase-js'
import { mockApplicationService } from './mockApplicationService'

// Create admin client to bypass RLS for guest applications (Local)
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

export interface CreateApplicationData {
  job_id: string
  name: string
  email: string
  cover_letter?: string
  linkedin_profile?: string
  resume_url?: string
}

export interface UpdateApplicationData {
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  cover_letter?: string
  resume_url?: string
}

export const applicationService = {
  // Get applications by user
  async getApplicationsByUser(userId: string): Promise<Application[]> {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock application service due to connection issues')
        return await mockApplicationService.getApplicationsByUser(userId)
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            id,
            title,
            company,
            location,
            type
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Supabase query failed, using mock data:', error)
        return await mockApplicationService.getApplicationsByUser(userId)
      }
      
      return data
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return await mockApplicationService.getApplicationsByUser(userId)
    }
  },

  // Get applications for a job (employer view)
  async getApplicationsByJob(jobId: string): Promise<Application[]> {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock application service due to connection issues')
        return await mockApplicationService.getApplicationsByJob(jobId)
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          users (
            id,
            full_name,
            email
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Supabase query failed, using mock data:', error)
        return await mockApplicationService.getApplicationsByJob(jobId)
      }
      
      return data
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return await mockApplicationService.getApplicationsByJob(jobId)
    }
  },

  // Create new application
  async createApplication(applicationData: CreateApplicationData): Promise<Application> {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock application service due to connection issues')
        return await mockApplicationService.createApplication(applicationData)
      }

      // Allow applications without authentication
      const { data: { user } } = await supabase.auth.getUser()
      
      // Debug: Log the job_id being used
      console.log('🔍 Creating application with job_id:', applicationData.job_id);
      
      // Verify job exists before creating application
      const { data: jobExists, error: jobError } = await supabase
        .from('jobs')
        .select('id, title, company')
        .eq('id', applicationData.job_id)
        .eq('is_active', true)
        .single();
      
      if (jobError || !jobExists) {
        console.error('❌ Job not found or inactive:', applicationData.job_id);
        throw new Error(`Job not found or inactive: ${applicationData.job_id}`);
      }
      
      console.log('✅ Job found:', jobExists.title, 'at', jobExists.company);
      
      // Use admin client to bypass RLS for guest applications
      const client = user ? supabase : adminSupabase;
      
      const insertData = {
        job_id: applicationData.job_id,
        name: applicationData.name,
        email: applicationData.email,
        cover_letter: applicationData.cover_letter || '',
        linkedin_profile: applicationData.linkedin_profile,
        resume_url: applicationData.resume_url,
        user_id: user?.id || null // Allow null user_id for guest applications
      };
      
      console.log('📝 Insert data:', insertData);
      
      const { data, error } = await client
        .from('applications')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('❌ Application creation failed:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        
        // Handle specific error cases
        if (error.code === '23505') {
          throw new Error('You have already applied to this job.');
        } else if (error.message.includes('foreign key')) {
          throw new Error('Job not found or has been removed.');
        } else {
          throw new Error(error.message || 'Failed to submit application. Please try again.');
        }
      }
      
      console.log('✅ Application created successfully:', data.id);
      return data
    } catch (error: any) {
      // If it's a connection error, use mock
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        console.warn('Network error, using mock application service:', error)
        return await mockApplicationService.createApplication(applicationData)
      }
      
      // Re-throw other errors (like validation errors)
      throw error
    }
  },

  // Update application
  async updateApplication(id: string, updates: UpdateApplicationData): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get application by ID
  async getApplicationById(id: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          type,
          description
        ),
        users (
          id,
          full_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Check if user has already applied to a job
  async hasUserApplied(jobId: string, userId: string): Promise<boolean> {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock application service due to connection issues')
        return await mockApplicationService.hasUserApplied(jobId, userId)
      }

      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase query failed, using mock data:', error)
        return await mockApplicationService.hasUserApplied(jobId, userId)
      }
      
      return !!data
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return await mockApplicationService.hasUserApplied(jobId, userId)
    }
  },

  // Get application statistics
  async getApplicationStats() {
    try {
      const isConnected = await testConnection()
      
      if (!isConnected) {
        console.log('Using mock application service due to connection issues')
        return await mockApplicationService.getApplicationStats()
      }

      const { data, error } = await supabase
        .from('applications')
        .select('status')

      if (error) {
        console.warn('Supabase query failed, using mock data:', error)
        return await mockApplicationService.getApplicationStats()
      }

      const stats = {
        total: data.length,
        pending: data.filter(app => app.status === 'pending').length,
        reviewed: data.filter(app => app.status === 'reviewed').length,
        accepted: data.filter(app => app.status === 'accepted').length,
        rejected: data.filter(app => app.status === 'rejected').length
      }

      return stats
    } catch (error) {
      console.warn('Supabase error, using mock data:', error)
      return await mockApplicationService.getApplicationStats()
    }
  },

  // Get applications by status
  async getApplicationsByStatus(status: 'pending' | 'reviewed' | 'accepted' | 'rejected'): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          type
        ),
        users (
          id,
          full_name,
          email
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get all applications for admin
  async getAllApplications(): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (id, title, company),
        users (id, full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 