import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper,
  InputAdornment,
  IconButton,
  Avatar,
  Tooltip,
  Stack
} from '@mui/material';
import { MusicNote, Person, Schedule, Image, HelpOutline } from '@mui/icons-material';

const SongForm = ({ onAddSong }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    length: '',
    cover: ''
  });
  const [coverPreview, setCoverPreview] = useState('');

  const isValidImageUrl = (url) => {
    return /^(https?:\/\/).*\.(jpe?g|png|gif|bmp|webp)$/i.test(url);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'cover') {
      if (isValidImageUrl(value)) {
        setCoverPreview(value);
      } else {
        setCoverPreview('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) return;
    
    onAddSong({
      title: formData.title,
      author: formData.author,
      length: Number(formData.length) || 0,
      cover: formData.cover
    });

    setFormData({
      title: '',
      author: '',
      length: '',
      cover: ''
    });
    setCoverPreview('');
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Add New Song
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            sx={{ flex: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MusicNote color="primary" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Artist"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            sx={{ flex: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Length (s)"
            type="number"
            name="length"
            value={formData.length}
            onChange={handleChange}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Schedule color="primary" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Cover URL"
            name="cover"
            value={formData.cover}
            onChange={handleChange}
            sx={{ flex: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Image color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <Tooltip title="Paste image URL">
                  <IconButton edge="end">
                    <HelpOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              )
            }}
          />
        </Stack>

        {coverPreview && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar
              src={coverPreview}
              variant="rounded"
              sx={{ 
                width: 150, 
                height: 150,
                border: '1px solid #ddd'
              }}
            />
          </Box>
        )}
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ 
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd1 0%, #6a4299 100%)'
            }
          }}
        >
          Add Song
        </Button>
      </Box>
    </Paper>
  );
};

export default SongForm;