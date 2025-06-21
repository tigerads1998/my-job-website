import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Alert, Grid, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Link } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptchaClick = () => {
    if (captchaChecked || captchaLoading || loginLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => {
      setCaptchaChecked(true);
      setCaptchaLoading(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (!captchaChecked) {
      setError('Please verify that you are not a robot.');
      return;
    }
    
    setLoginLoading(true);
    
    try {
      await signIn(form.email, form.password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before logging in.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          Login
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 4 }}>
          Welcome back! Please enter your credentials to sign in.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={loginLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                disabled={loginLoading}
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 0, mt: 0, display: 'flex', justifyContent: 'flex-start' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0, width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    bgcolor: '#f9f9fb',
                    border: '1.5px solid #d3d7de',
                    borderRadius: 2.5,
                    px: 0,
                    py: 2,
                    boxShadow: '0 2px 8px 0 rgba(60,60,60,0.07)',
                    minHeight: 80,
                    width: { xs: '100%', sm: 340 },
                    maxWidth: 400,
                    mx: 0,
                    cursor: captchaChecked ? 'default' : 'pointer',
                    userSelect: 'none',
                    transition: 'border 0.2s',
                    '&:hover': {
                      border: captchaChecked ? '1.5px solid #d3d7de' : '1.5px solid #b3b7be',
                    },
                    opacity: loginLoading ? 0.7 : 1,
                    position: 'relative',
                  }}
                  onClick={handleCaptchaClick}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1, justifyContent: 'center', height: 40 }}>
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32 }}>
                      {captchaChecked ? (
                        <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                      ) : captchaLoading ? (
                        <CircularProgress size={28} thickness={5} sx={{ color: '#1976d2' }} />
                      ) : (
                        <ShieldOutlinedIcon sx={{ color: '#b3b7be', fontSize: 32 }} />
                      )}
                    </Box>
                    <Typography fontSize={18} fontWeight={500} color="#222" sx={{ lineHeight: '32px', display: 'flex', alignItems: 'center' }}>
                      I'm not a robot
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', alignSelf: 'center', fontSize: 13, letterSpacing: 0.1, width: 'auto' }}>
                    reCAPTCHA • <Link href="/captcha-privacy" target="_blank" rel="noopener" color="primary.main" underline="hover" sx={{ fontSize: 13 }}>Privacy Policy</Link>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            {success && (
              <Grid item xs={12}>
                <Alert severity="success">{success}</Alert>
              </Grid>
            )}
            <Grid item xs={12} sx={{ mt: 0, mb: 0 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2, height: 56, borderRadius: 2.5, fontSize: '1.1rem', textTransform: 'none', boxShadow: 2, '&:hover': { boxShadow: 4 } }}
                disabled={loginLoading}
                startIcon={loginLoading ? <CircularProgress size={24} color="inherit" /> : null}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 