import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Chip
} from '@mui/material';
import { Edit, Delete, PlayArrow, Pause, MusicNote } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SongItem = ({ song, onUpdateSong, onDeleteSong }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...song });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSave = () => {
    if (!editData.title.trim() || !editData.author.trim()) return;
    onUpdateSong(song._id, {
      title: editData.title,
      author: editData.author,
      length: Number(editData.length),
      cover: editData.cover
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: 3,
        '&:hover': {
          boxShadow: 6
        }
      }}>
        {song.cover ? (
          <CardMedia
            component="img"
            height="160"
            image={song.cover}
            alt={song.title}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ 
            height: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
          }}>
            <MusicNote sx={{ fontSize: 60, color: 'text.disabled' }} />
          </Box>
        )}
        
        <CardContent>
          {!isEditing ? (
            <>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {song.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {song.author}
              </Typography>
              <Chip label={`${song.length}s`} size="small" sx={{ mt: 1 }} />
            </>
          ) : (
            <Box component="form">
              <TextField
                fullWidth
                label="Title"
                value={editData.title}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                margin="dense"
                required
              />
              <TextField
                fullWidth
                label="Author"
                value={editData.author}
                onChange={(e) => setEditData({...editData, author: e.target.value})}
                margin="dense"
                required
              />
              <TextField
                fullWidth
                label="Length (seconds)"
                type="number"
                value={editData.length}
                onChange={(e) => setEditData({...editData, length: e.target.value})}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Cover URL"
                value={editData.cover}
                onChange={(e) => setEditData({...editData, cover: e.target.value})}
                margin="dense"
              />
            </Box>
          )}
        </CardContent>
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton 
            onClick={() => setIsPlaying(!isPlaying)}
            color="primary"
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          
          {!isEditing ? (
            <Box>
              <IconButton onClick={() => setIsEditing(true)}>
                <Edit />
              </IconButton>
              <IconButton 
                onClick={() => setOpenDeleteDialog(true)}
                color="error"
              >
                <Delete />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setIsEditing(false);
                  setEditData({ ...song });
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>
      </Card>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Song</DialogTitle>
        <DialogContent>
          <Typography>Delete "{song.title}" by {song.author}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              onDeleteSong(song._id);
              setOpenDeleteDialog(false);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default SongItem; 