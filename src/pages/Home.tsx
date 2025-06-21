import React, { useRef, useState } from 'react';
import { Container, Typography, Button, Grid, Box, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Collapse, List, ListItem, ListItemText, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';

const Home = () => {
  const navigate = useNavigate();
  const companiesRef = useRef<HTMLDivElement>(null);
  const [applyDialog, setApplyDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', resume: null as File | null });
  const [showCompanies, setShowCompanies] = useState(false);
  const [companyList, setCompanyList] = useState<{ name: string }[]>([]);

  const famousCompanies = [
    { name: 'WPP', detail: "World's Largest Marketing & Communications Group" },
    { name: 'Dentsu', detail: 'Global Leader in Digital Marketing & Advertising' },
    { name: 'Publicis Groupe', detail: 'Innovative Digital Solutions & Media Agency' },
  ];

  const handleScrollToCompanies = () => {
    companiesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShowCompanies = () => {
    if (!showCompanies) {
      setCompanyList(famousCompanies);
    }
    setShowCompanies((prev) => !prev);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          color: 'primary.main',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Phiên Bản Cloud - Test Xác Nhận
          </Typography>
          <Typography variant="h5" paragraph>
            Search through thousands of job listings
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/jobs')}
            sx={{ mt: 2, borderRadius: 99, fontWeight: 700, px: 4, py: 1.5, textTransform: 'none', fontSize: 18 }}
            startIcon={<SearchIcon />}
          >
            Search Jobs
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Search Jobs
                </Typography>
                <Typography color="text.secondary">
                  Find the perfect job that matches your skills and experience
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2, borderRadius: 99, fontWeight: 600, px: 3 }}
                  onClick={() => navigate('/jobs')}
                  fullWidth
                >
                  Go to Jobs
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Top Companies
                </Typography>
                <Typography color="text.secondary">
                  Work with leading digital marketing agencies
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2, borderRadius: 99, fontWeight: 600, px: 3 }}
                  onClick={handleShowCompanies}
                  fullWidth
                >
                  VIEW COMPANIES
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Top Companies Section */}
      <Box ref={companiesRef} sx={{ bgcolor: '#fafafa', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            Top Companies
          </Typography>
          <Collapse in={showCompanies}>
            <List sx={{ mt: 2, mb: 2, bgcolor: '#fafbfc', borderRadius: 2, boxShadow: 1 }}>
              {famousCompanies.map((c, idx) => (
                <ListItem key={idx} alignItems="flex-start">
                  <ListItemText
                    primary={<Typography fontWeight={600}>{c.name}</Typography>}
                    secondary={<Typography color="text.secondary" fontSize={14}>{c.detail}</Typography>}
                  />
                </ListItem>
              ))}
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Button
                  variant="text"
                  sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none', fontSize: 16, '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/jobs')}
                >
                  See more companies...
                </Button>
              </Box>
            </List>
          </Collapse>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 