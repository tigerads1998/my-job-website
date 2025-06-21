import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import FAQ from './pages/FAQ';
import AboutUs from './pages/AboutUs';
import PostJobs from './pages/PostJobs';
import ManageJobs from './pages/ManageJobs';
import { Button } from '@mui/material';
import { Box, Typography, Stack, Container, Grid, Divider } from '@mui/material';
import MuiLink from '@mui/material/Link';
import Register from './pages/Register';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Login from './pages/Login';
import CaptchaPrivacy from './pages/CaptchaPrivacy';
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#111111',
    },
    secondary: {
      main: '#444444',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    text: {
      primary: '#111',
      secondary: '#444',
    },
  },
});

function Footer() {
  return (
    <Box sx={{ bgcolor: '#fafbfc', py: 3, borderTop: '1px solid #eee', width: '100%' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We connect talented digital marketers with top companies worldwide.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: <MuiLink href="mailto:support@jobenginehq.com" color="primary.main" underline="hover">support@jobenginehq.com</MuiLink>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              For employers: If you want to post a job, please contact us at <MuiLink href="mailto:support@jobenginehq.com" color="primary.main" underline="hover">support@jobenginehq.com</MuiLink>
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
          <Typography color="text.secondary" fontSize={13}>
            © 2024 JobEngineHQ. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <MuiLink href="/privacy-policy" color="text.secondary" underline="hover" fontSize={13}>
              Privacy Policy
            </MuiLink>
            <MuiLink href="/terms-of-service" color="text.secondary" underline="hover" fontSize={13}>
              Terms of Service
            </MuiLink>
            <MuiLink href="/cookie-policy" color="text.secondary" underline="hover" fontSize={13}>
              Cookie Policy
            </MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Router>
            <Navbar />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/job/:id" element={<JobDetail />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/post-jobs" element={<PostJobs />} />
                <Route path="/admin" element={<ManageJobs />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/login" element={<Login />} />
                <Route path="/captcha-privacy" element={<CaptchaPrivacy />} />
              </Routes>
            </Box>
            <Footer />
          </Router>
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 