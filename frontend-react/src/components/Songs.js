import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import SongForm from './SongForm';
import SongItem from './SongItem';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  AppBar,
  Toolbar,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Fab
} from '@mui/material';
import { Search, Add, Logout } from '@mui/icons-material';
import API_BASE_URL from '../config';

const Songs = () => {
  const { isAuthenticated, token, loading, logout } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        loadSongs();
      }
    }
  }, [isAuthenticated, loading]);

  const loadSongs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/songs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setSongs(data.data);
      } else {
        setMessage(data.message || 'Failed to load songs');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleAddSong = async (songData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(songData),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setSongs([...songs, data.data]);
        setMessage('Song added successfully');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to add song');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleUpdateSong = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (data.success) {
        setSongs(
          songs.map((song) =>
            song._id === id ? { ...song, ...updatedData } : song
          )
        );
        setMessage('Song updated successfully');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to update song');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleDeleteSong = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setSongs(songs.filter((song) => song._id !== id));
        setMessage('Song deleted successfully');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to delete song');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Song Manager
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Hi, {localStorage.getItem('username')}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {message && (
          <Alert severity={messageType} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Add New Song
          </Typography>
          <SongForm onAddSong={handleAddSong} />
        </Box>

        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 2 }}>
          <TextField
            fullWidth
            placeholder="Search songs..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              sx: { borderRadius: 4 }
            }}
          />
        </Box>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Your Library
        </Typography>

        {filteredSongs.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              p: 4, 
              bgcolor: 'background.paper', 
              borderRadius: 4,
              boxShadow: 1
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No songs found
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredSongs.map((song) => (
              <Grid item key={song._id} xs={12} sm={6} md={4}>
                <SongItem
                  song={song}
                  onUpdateSong={handleUpdateSong}
                  onDeleteSong={handleDeleteSong}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Fab 
          color="primary" 
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd1 0%, #6a4299 100%)'
            }
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Add />
        </Fab>
      </Container>
    </Box>
  );
};

export default Songs;