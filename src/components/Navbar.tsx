import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/image.png';

const Navbar = () => {
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexGrow: 1 }}>
          <img src={logo} alt="Logo" style={{ height: 40, marginRight: 12 }} />
          <Typography variant="h6" sx={{ textDecoration: 'none', color: '#111', fontWeight: 700 }}>
            JobEngineHQ
          </Typography>
        </RouterLink>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Navigation buttons - Hidden on mobile and tablet */}
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Button color="inherit" component={RouterLink} to="/jobs">
              Jobs
            </Button>
            <Button color="inherit" component={RouterLink} to="/faq">
              FAQ
            </Button>
            <Button color="inherit" component={RouterLink} to="/about">
              About Us
            </Button>
          </Box>
          
          {/* Login/Register buttons - Always visible */}
          <Button 
            color="primary" 
            variant="text" 
            component={RouterLink} 
            to="/login" 
            sx={{ 
              ml: { xs: 1, md: 2 }, 
              borderRadius: 99, 
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              px: { xs: 1.5, md: 2 }
            }}
          >
            Login
          </Button>
          <Button 
            color="primary" 
            variant="outlined" 
            component={RouterLink} 
            to="/register" 
            sx={{ 
              ml: { xs: 1, md: 2 }, 
              borderRadius: 99, 
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              px: { xs: 1.5, md: 2 }
            }}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 