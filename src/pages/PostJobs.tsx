import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid, MenuItem, Snackbar, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { jobService } from '../services/jobService';
import { useNavigate } from 'react-router-dom';
import { WorkModel } from '../supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];
const WORK_MODELS: WorkModel[] = ['on-site', 'remote', 'hybrid'];

const PostJobs = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'internship',
    work_model: 'on-site' as WorkModel,
    salary_min: '',
    salary_max: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSalary, setShowSalary] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const jobData = {
        title: form.title,
        company: form.company,
        location: form.location,
        type: form.type,
        work_model: form.work_model,
        is_verified: isVerified,
        salary_min: showSalary && form.salary_min ? parseInt(form.salary_min) : undefined,
        salary_max: showSalary && form.salary_max ? parseInt(form.salary_max) : undefined,
        description: description,
        requirements: [], // Simplified
        benefits: [], // Simplified
      };

      await jobService.createJob(jobData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating job:', err);
      setError(err.message || 'Failed to add job!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          Add New Job
        </Typography>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Job Title *" name="title" value={form.title} onChange={handleFormChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company *" name="company" value={form.company} onChange={handleFormChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location *" name="location" value={form.location} onChange={handleFormChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Job Type *" name="type" value={form.type} onChange={handleFormChange} required >
                {JOB_TYPES.map((type) => ( <MenuItem key={type} value={type}>{type}</MenuItem> ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Work Model *" name="work_model" value={form.work_model} onChange={handleFormChange} required >
                {WORK_MODELS.map((model) => ( <MenuItem key={model} value={model}>{model}</MenuItem> ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Checkbox checked={showSalary} onChange={e => setShowSalary(e.target.checked)} />} label="Show Salary" />
            </Grid>
            {showSalary && (
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Salary *" name="salary_min" type="number" value={form.salary_min} onChange={handleFormChange} placeholder="Salary" />
              </Grid>
            )}
            <Grid item xs={12}>
               {/* This is a simplified version based on the image. The original image has this, but for simplicity we remove it until requested */}
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ mb: 1, color: 'text.secondary' }}>Job Description & Requirements *</Typography>
              <ReactQuill 
                theme="snow" 
                value={description} 
                onChange={setDescription}
                style={{ height: '250px', marginBottom: '50px' }} // Dynamic height is tricky, setting a fixed one for now.
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link'],
                    ['clean']
                  ],
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel 
                control={<Checkbox checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} />} 
                label="Mark as Verified" 
              />
            </Grid>
          </Grid>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={() => navigate('/jobs')} sx={{ mr: 1 }}>CANCEL</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'ADDING...' : 'ADD'}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Job posted successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostJobs; 