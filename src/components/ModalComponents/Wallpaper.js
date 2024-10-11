import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../utils/endpoints";

const Wallpaper = ({ currentEmployee }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    // Validate file type and size (e.g., max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5MB");
      return;
    }
    if (file && !file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file");
      return;
    }

    setErrorMessage(""); // Clear any previous error messages
    const filereader = new FileReader();
    filereader.onload = () => {
      setImagePreview(filereader.result);
      setImage(file);
    };
    filereader.readAsDataURL(file);
  };

  const handleCancelImage = () => {
    setImage(null);
    setImagePreview(null);
    setErrorMessage("");
  };

  const handleUploadToServer = async () => {
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `/wallpaper/upload/${currentEmployee?.employeeId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Image uploaded successfully:", response.data);
      setImagePreview(response.data.url); // Optionally, update preview with uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Button variant="contained" component="label" color="primary">
        Upload Wallpaper
        <input
          type="file"
          accept="image/*"
          name="image"
          hidden
          onChange={handleImageUpload}
        />
      </Button>

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      <Box
        sx={{
          maxHeight: "400px",
          maxWidth: "100%",
          overflow: "hidden",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "10px",
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          "&:hover .close-button": {
            display: "block",
          },
        }}
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="wallpaper"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "100%",
                objectFit: "cover",
              }}
            />
            <IconButton
              className="close-button"
              onClick={handleCancelImage}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                display: "none",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
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

      {uploading ? (
        <CircularProgress />
      ) : (
        image && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadToServer}
          >
            Save
          </Button>
        )
      )}
    </div>
  );
};

export default Wallpaper;
