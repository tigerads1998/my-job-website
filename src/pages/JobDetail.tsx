import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedIcon from '@mui/icons-material/Verified';
import { differenceInDays, format } from 'date-fns';
import { useJob } from '../hooks/useJobs';
import { applicationService } from '../services/applicationService';

function formatPostedDate(dateString: string) {
  if (!dateString) return '';
  const now = new Date();
  const posted = new Date(dateString);
  const diff = differenceInDays(now, posted);
  if (diff <= 0) return 'just now';
  if (diff === 1) return '1 day ago';
  if (diff <= 7) return `${diff} days ago`;
  return format(posted, 'MMM d, yyyy');
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { job, loading, error } = useJob(id || '');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    additional_content: '',
    linkedin_profile: '',
    resume: null as File | null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !id) return;
    
    setSubmitLoading(true);
    setSubmitError('');
    
    try {
      await applicationService.createApplication({
        job_id: id,
        name: formData.name,
        email: formData.email,
        cover_letter: formData.additional_content,
        linkedin_profile: formData.linkedin_profile,
        resume_url: formData.resume ? formData.resume.name : undefined,
      });
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', additional_content: '', linkedin_profile: '', resume: null });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit application');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading job details...</Typography>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Job not found.'}
        </Alert>
      </Container>
    );
  }

  const salaryText = job.salary_min && job.salary_max 
    ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
    : job.salary_min 
    ? `From $${job.salary_min.toLocaleString()}`
    : '';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Job Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {job.title}
              {job.is_verified && <VerifiedIcon color="primary" />}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {job.company} • {job.location}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip icon={<LocationOnIcon color="inherit" sx={{ color: '#e53935' }} />} label={job.location} sx={{ mr: 1 }} />
              <Chip icon={<WorkIcon color="inherit" sx={{ color: '#1976d2' }} />} label={job.type} sx={{ mr: 1 }} />
              {salaryText && (
                <Chip icon={<MonetizationOnIcon color="inherit" sx={{ color: '#43a047' }} />} label={salaryText} sx={{ mr: 1 }} />
              )}
              <Chip icon={<CalendarMonthIcon color="inherit" sx={{ color: '#e53935' }} />} label={formatPostedDate(job.created_at)} />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Job Details
            </Typography>
            <Box
              sx={{
                lineHeight: 1.7,
                '& h3': { fontSize: '1.2rem', fontWeight: '600', mt: 3, mb: 1.5 },
                '& p': { mb: 2 },
                '& ul': { pl: 3, mb: 2 },
                '& li': { mb: 1 }
              }}
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
            
            {job.requirements && job.requirements.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Requirements
                </Typography>
                <Box component="ul" sx={{ pl: 2.5 }}>
                  {job.requirements.map((req, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {req}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Benefits
                </Typography>
                <Box component="ul" sx={{ pl: 2.5 }}>
                  {job.benefits.map((benefit, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {benefit}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Application Form */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Apply for this position
            </Typography>
            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Application submitted successfully! We will contact you soon.
              </Alert>
            )}
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                placeholder="Enter your full name"
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                placeholder="your.email@example.com"
              />
              <TextField
                fullWidth
                label="Cover Letter (Optional)"
                name="additional_content"
                value={formData.additional_content}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{ mb: 2 }}
                placeholder="Tell us why you're interested in this position and why you'd be a great fit for our team..."
              />
              <TextField
                fullWidth
                label="LinkedIn Profile"
                name="linkedin_profile"
                value={formData.linkedin_profile}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                placeholder="https://linkedin.com/in/your-profile"
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
                disabled={submitLoading}
              >
                Upload Resume (Optional)
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.resume && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Selected: {formData.resume.name}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={submitLoading}
                startIcon={submitLoading ? <CircularProgress size={20} /> : null}
              >
                {submitLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobDetail; 