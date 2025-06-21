import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, MenuItem, Checkbox, FormControlLabel, Tabs, Tab } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { jobService, CreateJobData, UpdateJobData } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { Job, Application, WorkModel } from '../supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const INTERNAL_PASSWORD = 'lovetime01';
const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];
const WORK_MODELS: WorkModel[] = ['on-site', 'remote', 'hybrid'];

// Helper to render job list item
const JobListItem = ({ job, onEdit, onDelete }: { job: Job, onEdit: (job: Job) => void, onDelete: (id: string) => void }) => (
  <ListItem divider>
    <ListItemText
      primary={job.title}
      secondary={`${job.company} - ${job.location} | ${job.is_active ? 'Active' : 'Inactive'}`}
    />
    <ListItemSecondaryAction>
      <IconButton edge="end" color="primary" onClick={() => onEdit(job)}>
        <EditIcon />
      </IconButton>
      <IconButton edge="end" color="error" onClick={() => onDelete(job.id)}>
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

// Helper to render application list item (simplified)
const ApplicationListItem = ({ app }: { app: any }) => (
  <ListItem divider>
    <ListItemText
      primary={app.users?.full_name || 'N/A'}
      secondary={`Applied for: ${app.jobs?.title || 'N/A'} on ${new Date(app.created_at).toLocaleDateString()}`}
    />
  </ListItem>
);

const ManageJobs = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; jobId: string | null }>({ open: false, jobId: null });
  const [editDialog, setEditDialog] = useState<{ open: boolean; job: Job | null }>({ open: false, job: null });
  
  const [form, setForm] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    work_model: 'on-site',
    salary_min: 0,
    salary_max: 0,
    description: '',
    requirements: [],
    benefits: [],
    is_active: true,
  });

  const [tab, setTab] = useState(0);

  const fetchJobsAndApps = async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 0) {
        const allJobs = await jobService.getAllJobs();
        setJobs(allJobs);
      } else {
        const allApps = await applicationService.getAllApplications();
        setApplications(allApps as any);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobsAndApps();
    }
  }, [isAuthenticated, tab]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === INTERNAL_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleOpenEdit = (job: Job | null) => {
    if (job) {
      // Combine description, requirements, and benefits for easier editing in one field
      let fullDescription = job.description || '';
      if (job.requirements && job.requirements.length > 0 && job.requirements.some(r => r)) {
        fullDescription += `\n\nRequirements:\n- ${job.requirements.join('\n- ')}`;
      }
      if (job.benefits && job.benefits.length > 0 && job.benefits.some(b => b)) {
        fullDescription += `\n\nBenefits:\n- ${job.benefits.join('\n- ')}`;
      }
      setForm({ ...job, description: fullDescription });
    } else {
      // Reset form for a new job
      setForm({
        title: '', company: '', location: '', type: 'full-time',
        work_model: 'on-site',
        salary_min: 0, salary_max: 0, description: '',
        requirements: [], benefits: [], is_active: true,
      });
    }
    setEditDialog({ open: true, job });
  };

  const handleCloseEdit = () => {
    setEditDialog({ open: false, job: null });
  };

  const handleSaveJob = async () => {
    try {
      const dataToSave = {
        title: form.title,
        company: form.company,
        location: form.location,
        type: form.type,
        work_model: form.work_model,
        salary_min: form.salary_min,
        salary_max: form.salary_max,
        description: form.description,
        requirements: [], // Keep this empty as it's now part of the description
        benefits: [], // Keep this empty as it's now part of the description
        is_active: form.is_active,
      };

      if (editDialog.job) {
        // Logic to either create or update
        if (editDialog.job.id === 'new') {
          // Create new job
          await jobService.createJob(dataToSave as CreateJobData);
        } else {
          // Update existing job
          await jobService.updateJob(editDialog.job.id, dataToSave);
        }
      }
      setSuccess(`Job ${editDialog.job ? 'updated' : 'created'} successfully!`);
      handleCloseEdit();
      fetchJobsAndApps(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to save job.');
    }
  };

  const handleDeleteJob = async () => {
    if (!confirmDialog.jobId) return;
    try {
      await jobService.deleteJob(confirmDialog.jobId);
      setSuccess('Job deleted successfully!');
      setConfirmDialog({ open: false, jobId: null });
      fetchJobsAndApps(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to delete job.');
    }
  };
  
  if (!isAuthenticated) {
    // Password form remains the same
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>Admin Access</Typography>
          <Box component="form" onSubmit={handlePasswordSubmit}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ my: 2 }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" fullWidth>Login</Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Manage Platform</Typography>
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">{error}</Alert>
      </Snackbar>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label={`Jobs (${jobs.length})`} />
        <Tab label={`Applications (${applications.length})`} />
      </Tabs>

      {loading && <Typography>Loading...</Typography>}

      {tab === 0 && (
        <Box>
          <Button variant="contained" onClick={() => handleOpenEdit(null)} sx={{ my: 2 }}>Add New Job</Button>
          <List>
            {jobs.map(job => (
              <JobListItem key={job.id} job={job} onEdit={handleOpenEdit} onDelete={(id) => setConfirmDialog({ open: true, jobId: id })} />
            ))}
          </List>
        </Box>
      )}

      {tab === 1 && (
        <List>
          {applications.map(app => (
            <ApplicationListItem key={app.id} app={app} />
          ))}
        </List>
      )}
      
      {/* Edit/Add Dialog */}
      <Dialog open={editDialog.open} onClose={handleCloseEdit} maxWidth="md" fullWidth>
        <DialogTitle>{editDialog.job ? 'Edit Job' : 'Add New Job'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField label="Job Title" fullWidth value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Company" fullWidth value={form.company || ''} onChange={e => setForm({...form, company: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Location" fullWidth value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Job Type" fullWidth value={form.type || 'full-time'} onChange={e => setForm({...form, type: e.target.value as any})}>
                {JOB_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Work Model" fullWidth value={form.work_model || 'on-site'} onChange={e => setForm({...form, work_model: e.target.value as any})}>
                {WORK_MODELS.map(model => <MenuItem key={model} value={model}>{model}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField type="number" label="Min Salary" fullWidth value={form.salary_min || 0} onChange={e => setForm({...form, salary_min: parseInt(e.target.value)})} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField type="number" label="Max Salary" fullWidth value={form.salary_max || 0} onChange={e => setForm({...form, salary_max: parseInt(e.target.value)})} />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ mb: 1, color: 'text.secondary' }}>Description, Requirements & Benefits</Typography>
              <ReactQuill
                theme="snow"
                value={form.description || ''}
                onChange={value => setForm({ ...form, description: value })}
                style={{ height: '300px', marginBottom: '50px' }}
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
              <FormControlLabel control={<Checkbox checked={form.is_verified || false} onChange={e => setForm({...form, is_verified: e.target.checked})} />} label="Is Verified" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={form.is_active || false} onChange={e => setForm({...form, is_active: e.target.checked})} />} label="Is Active" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveJob} variant="contained">Save Job</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, jobId: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this job? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, jobId: null })}>Cancel</Button>
          <Button onClick={handleDeleteJob} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageJobs; 