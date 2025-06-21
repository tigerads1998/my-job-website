import { Application } from '../supabase'

// Mock application service for fallback
export const mockApplicationService = {
  async createApplication(applicationData: any): Promise<Application> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate successful application creation
    const mockApplication: Application = {
      id: `mock-app-${Date.now()}`,
      job_id: applicationData.job_id,
      user_id: applicationData.user_id || null,
      cover_letter: applicationData.cover_letter || '',
      resume_url: applicationData.resume_url,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('✅ Mock application created successfully:', mockApplication.id)
    return mockApplication
  },

  async getApplicationsByUser(userId: string): Promise<Application[]> {
    // Return empty array for mock
    return []
  },

  async getApplicationsByJob(jobId: string): Promise<Application[]> {
    // Return empty array for mock
    return []
  },

  async hasUserApplied(jobId: string, userId: string): Promise<boolean> {
    // Always return false for mock
    return false
  },

  async getApplicationStats() {
    return {
      total: 0,
      pending: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0
    }
  }
} 