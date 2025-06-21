import { useState, useEffect, useCallback } from 'react'
import { jobService, CreateJobData, UpdateJobData } from '../services/jobService'
import { Job } from '../supabase'

export const useJobs = (filters?: {
  location?: string
  type?: string
  company?: string
  search?: string
  work_model?: string
}) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await jobService.getJobs(filters)
      setJobs(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createJob = async (jobData: CreateJobData) => {
    try {
      setError(null)
      const newJob = await jobService.createJob(jobData)
      setJobs(prev => [newJob, ...prev])
      return newJob
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateJob = async (id: string, updates: UpdateJobData) => {
    try {
      setError(null)
      const updatedJob = await jobService.updateJob(id, updates)
      setJobs(prev => prev.map(job => job.id === id ? updatedJob : job))
      return updatedJob
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteJob = async (id: string) => {
    try {
      setError(null)
      await jobService.deleteJob(id)
      setJobs(prev => prev.filter(job => job.id !== id))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const searchJobs = async (searchTerm: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await jobService.searchJobs(searchTerm)
      setJobs(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    searchJobs
  }
}

export const useJob = (id: string) => {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJob = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true)
      setError(null)
      const data = await jobService.getJobById(id)
      setJob(data)
    } catch (err: any) {
      if (err.message.includes('multiple (or no) rows returned')) {
        setError('Job not found or has been removed.');
        setJob(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchJob()
  }, [fetchJob])

  return {
    job,
    loading,
    error,
    fetchJob
  }
} 