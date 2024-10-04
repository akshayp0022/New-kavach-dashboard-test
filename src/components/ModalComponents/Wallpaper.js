import React, { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Wallpaper = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const filereader = new FileReader();
      filereader.onload = () => {
        setImagePreview(filereader.result);
        setImage(file);
      };
      filereader.readAsDataURL(file);
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        component="label"
        color="primary"
      >
        Upload Wallpaper
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </Button>

      <Box
        sx={{
          maxHeight: '400px',
          maxWidth: '100%',
          overflow: 'hidden',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          '&:hover .close-button': {
            display: 'block', 
          },
        }}
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="wallpaper"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '100%',
                objectFit: 'cover',
              }}
            />
            <IconButton
              className="close-button"
              onClick={handleCancelImage}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                display: 'none', // Initially hidden
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <Typography>No wallpaper selected.</Typography>
        )}
      </Box>
    </div>
  );
};

export default Wallpaper;
