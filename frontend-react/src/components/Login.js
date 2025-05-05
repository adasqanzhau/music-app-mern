import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Alert,
  Fade,
  styled 
} from '@mui/material';
import API_BASE_URL from '../config';

const GradientBox = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px'
});

const AnimatedPaper = styled(Paper)({
  padding: '40px',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '450px',
  transform: 'translateY(0)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  }
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.token, username);
        navigate('/songs');
      } else {
        setMessage(data.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <GradientBox>
      <Fade in timeout={500}>
        <AnimatedPaper elevation={6}>
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>
          
          {message && (
            <Alert severity={messageType} sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px'
                }
              }}
            />
            
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px'
                }
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ 
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd1 30%, #6a4299 90%)'
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </AnimatedPaper>
      </Fade>
    </GradientBox>
  );
};

export default Login;