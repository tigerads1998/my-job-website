import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  Stack,
  InputAdornment,
  useTheme,
  Drawer,
  IconButton,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WorkIcon from '@mui/icons-material/Work';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, format } from 'date-fns';
import Pagination from '@mui/material/Pagination';
import { useJobs } from '../hooks/useJobs';
import { Job, WorkModel } from '../supabase';
import { applicationService } from '../services/applicationService';

const workTypes = ['full-time', 'part-time', 'contract', 'internship'];
const workModels: WorkModel[] = ['on-site', 'remote', 'hybrid'];
const levels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

// Helper function to format work type display
const formatWorkType = (type: string) => {
  switch (type) {
    case 'full-time': return 'Full-time';
    case 'part-time': return 'Part-time';
    case 'contract': return 'Contract';
    case 'internship': return 'Internship';
    default: return type;
  }
};

// Helper function to format location display
const formatLocation = (location: string) => {
  return location.charAt(0).toUpperCase() + location.slice(1);
};

function formatPostedDate(dateString: string) {
  if (!dateString) return '';
  const now = new Date();
  const posted = new Date(dateString);
  const diff = differenceInDays(now, posted);
  if (diff <= 0) return 'Just now';
  if (diff === 1) return '1 day ago';
  if (diff <= 7) return `${diff} days ago`;
  return format(posted, 'MMM d, yyyy');
}

const Jobs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Actual search query used for API
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [workType, setWorkType] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [company, setCompany] = useState('');
  const [workModel, setWorkModel] = useState('');
  
  // Application modal states
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
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

  const { jobs, loading, error, searchJobs } = useJobs({
    location: location || undefined,
    type: workType || undefined,
    company: company || undefined,
    work_model: workModel || undefined,
    search: searchQuery || undefined,
  });

  const jobsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const realTotalPages = Math.ceil(jobs.length / jobsPerPage);
  const totalPages = 168; // Fake total pages to 168

  // Calculate the page to display using modulo to loop content
  const pageToShow = realTotalPages > 0 ? ((currentPage - 1) % realTotalPages) + 1 : 1;
  
  const paginatedJobs = jobs.slice((pageToShow - 1) * jobsPerPage, pageToShow * jobsPerPage);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 3 || search.length === 0) {
        setSearchQuery(search);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, workType, location, company, workModel]);

  useEffect(() => {
    if (jobs.length > 0) {
      const uniqueLocations = Array.from(new Set(jobs.map((job) => job.location))).sort();
      setLocations(uniqueLocations);
      if (!selectedJob) {
        setSelectedJob(jobs[0]);
      }
    }
  }, [jobs, selectedJob]);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleSearch = () => {
    setSearchQuery(search.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchQuery('');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const getSalaryText = (job: Job) => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `From $${job.salary_min.toLocaleString()}`;
    }
    return '';
  };

  const handleApplyClick = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setApplyingJob(job);
    setApplyModalOpen(true);
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleCloseModal = () => {
    setApplyModalOpen(false);
    setApplyingJob(null);
    setFormData({
      name: '',
      email: '',
      additional_content: '',
      linkedin_profile: '',
      resume: null,
    });
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    
    setSubmitLoading(true);
    setSubmitError('');
    
    try {
      await applicationService.createApplication({
        job_id: applyingJob.id,
        name: formData.name,
        email: formData.email,
        cover_letter: formData.additional_content,
        linkedin_profile: formData.linkedin_profile,
        resume_url: formData.resume ? formData.resume.name : undefined,
      });
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        additional_content: '',
        linkedin_profile: '',
        resume: null,
      });
      
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit application');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading jobs...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          {error}
          <br />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please check your internet connection or try refreshing the page.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header with Search and Filters */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Search by job title, company, or location... (min 3 characters)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{ 
              bgcolor: 'white', 
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={handleClearSearch}
                    sx={{ color: 'action.active' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleSearch}
            disabled={search.length < 3 && search.length > 0}
            sx={{
              minWidth: 80,
              borderRadius: 2,
              textTransform: 'none',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Search
          </Button>
        </Box>
        
        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Work Type</InputLabel>
            <Select
              value={workType}
              label="Work Type"
              onChange={(e) => setWorkType(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {workTypes.map((type) => (
                <MenuItem key={type} value={type}>{formatWorkType(type)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Level</InputLabel>
            <Select
              value={level}
              label="Level"
              onChange={(e) => setLevel(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {levels.map((lvl) => (
                <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={location}
              label="Location"
              onChange={(e) => setLocation(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {formatLocation(loc)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        
        {/* Search Status */}
        {searchQuery && (
          <Box sx={{ mt: 1, mb: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Searching for: "{searchQuery}" • {jobs.length} results found
            </Typography>
          </Box>
        )}
      </Paper>

      <Grid container spacing={2}>
        {/* Job List - Full width on mobile, 1/3 on desktop */}
        <Grid item xs={12} md={4}>
          <Box sx={{ maxHeight: '80vh', overflowY: 'auto', pr: 1 }}>
            {paginatedJobs.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                No jobs found
              </Typography>
            ) : (
              paginatedJobs.map((job) => (
                <Card
                  key={job.id}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    cursor: 'pointer',
                    border: selectedJob?.id === job.id ? 2 : 1,
                    borderColor: selectedJob?.id === job.id ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => handleJobSelect(job)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {job.title}
                      </Typography>
                      {job.is_verified && <VerifiedIcon sx={{ color: '#1976d2' }} fontSize="small" />}
                    </Box>
                    <Button 
                      variant="contained"
                      size="small"
                      sx={{ 
                        borderRadius: 20,
                        textTransform: 'none',
                        fontWeight: 500,
                        backgroundColor: '#000',
                        color: '#fff',
                        fontSize: '0.75rem',
                        px: 2,
                        py: 0.5,
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: '#333'
                        }
                      }}
                      onClick={(e) => handleApplyClick(job, e)}
                    >
                      Easy Apply
                    </Button>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.85rem' }}>
                    {job.company}
                  </Typography>

                  {/* Job description preview */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1.5,
                      fontSize: '0.8rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4
                    }}
                  >
                    {job.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip
                      icon={<LocationOnIcon sx={{ fontSize: 16, color: '#e53935 !important' }} />}
                      label={formatLocation(job.location)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                    <Chip
                      icon={<WorkIcon sx={{ fontSize: 16 }} />}
                      label={formatWorkType(job.type)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                    {/* Salary hidden in job list - only shown in details */}
                  </Stack>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatPostedDate(job.created_at)}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        px: 2,
                        py: 0.5,
                        minWidth: 'auto',
                        borderColor: '#ccc',
                        color: '#666',
                        '&:hover': {
                          borderColor: '#999',
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/job/${job.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              ))
            )}
          </Box>

          {/* Pagination */}
          {realTotalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Box>
          )}
        </Grid>

        {/* Job Details - Hidden on mobile */}
        <Grid item xs={12} md={8} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
          {selectedJob ? (
            <Paper sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.8rem' }}>
                      {selectedJob.title}
                    </Typography>
                    {selectedJob.is_verified && <VerifiedIcon sx={{ color: '#1976d2', fontSize: 28 }} />}
                  </Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1.5, fontSize: '1rem' }}>
                    {selectedJob.company}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  size="medium"
                  sx={{ 
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                  onClick={(e) => handleApplyClick(selectedJob, e)}
                >
                  Easy Apply
                </Button>
              </Box>
              
              <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<LocationOnIcon sx={{ color: '#e53935 !important' }} />}
                  label={formatLocation(selectedJob.location)}
                  variant="filled"
                  color="default"
                />
                <Chip
                  icon={<WorkIcon />}
                  label={formatWorkType(selectedJob.type)}
                  variant="filled"
                  color="primary"
                />
                {/* Salary hidden in job preview - only shown in JobDetail page */}
                <Chip
                  icon={<CalendarMonthIcon sx={{ color: '#e53935 !important' }} />}
                  label={formatPostedDate(selectedJob.created_at)}
                  variant="outlined"
                />
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                {/* Full job description with HTML rendering */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1.2rem' }}>
                    Job Description
                  </Typography>
                  <Box
                    sx={{
                      lineHeight: 1.6,
                      fontSize: '0.95rem',
                      color: 'text.secondary',
                      '& h3': { fontSize: '1.1rem', fontWeight: '600', mt: 2.5, mb: 1 },
                      '& p': { mb: 1.5 },
                      '& ul': { pl: 2.5, mb: 1.5 },
                      '& li': { mb: 0.5 }
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                  />
                </Box>

                {/* Show all requirements */}
                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1.2rem' }}>
                      Requirements
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                      {selectedJob.requirements.map((req, index) => (
                        <Typography component="li" key={index} sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.9rem' }}>
                          {req}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Show all benefits */}
                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1.2rem' }}>
                      Benefits
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                      {selectedJob.benefits.map((benefit, index) => (
                        <Typography component="li" key={index} sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.9rem' }}>
                          {benefit}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Mobile/Tablet: Show "View Details" button */}
              <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' }, textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(`/job/${selectedJob.id}`)}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      borderColor: '#1565c0',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  View Full Details
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary" variant="h6">
                Select a job to see the details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Application Modal */}
      <Dialog 
        open={applyModalOpen} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Apply for {applyingJob?.title}
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {applyingJob?.company}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
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
          
          <form onSubmit={handleSubmitApplication}>
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
          </form>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseModal} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitApplication}
            variant="contained"
            disabled={submitLoading || !formData.name || !formData.email}
            startIcon={submitLoading ? <CircularProgress size={20} /> : null}
          >
            {submitLoading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Jobs; 