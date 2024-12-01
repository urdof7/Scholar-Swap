import React, { useState, useEffect } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { auth, db, storage } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

const UploadProductPage = () => {
  // State hooks for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(""); // Added price state
  const [imageFile, setImageFile] = useState(null);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State to manage authenticated user
  const [user, setUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is signed in:", currentUser);
        setUser(currentUser);
      } else {
        console.log("No user is signed in.");
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle Finish button click
  const handleFinish = async () => {
    console.log("Starting product upload...");

    // Validate that all fields are filled
    if (!title || !description || !category || !imageFile || !price) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate price is a positive number
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }

    if (!user) {
      alert("You must be logged in to upload a product.");
      return;
    }

    setUploading(true);

    try {
      // Upload image to Firebase Storage
      console.log("Uploading image...");
      const storageRef = ref(storage, `products/${imageFile.name}_${Date.now()}`);
      await uploadBytes(storageRef, imageFile);
      console.log("Image uploaded successfully.");

      const imageUrl = await getDownloadURL(storageRef);
      console.log("Image URL:", imageUrl);

      // Create product document in Firestore
      console.log("Adding product to Firestore...");
      await addDoc(collection(db, "products"), {
        seller_id: user.uid,
        buyer_id: null,
        title: title,
        description: description,
        image: imageUrl,
        category: category,
        price: priceValue, // Added price field
        status: "available",
        postedAt: Timestamp.now(),
        purchasedAt: null,
      });
      console.log("Product added to Firestore successfully.");

      setUploading(false);
      setOpenConfirmation(true);

      // Reset the form fields
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice(""); // Reset price field
      setImageFile(null);
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Error uploading product. Please try again.");
      setUploading(false);
    }
  };

  // Handle the confirmation dialog close
  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  // Updated category options
  const categories = [
    "Textbooks",
    "Lab Materials",
    "Clothes",
    "Dorm Supplies",
    "Other",
  ];

  return (
    <Box sx={{ backgroundColor: "#0D0D0D", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header Bar */}
        <Box
          sx={{
            backgroundColor: "#1C1C1C",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "#FFD700", fontFamily: "Quicksand, Helvetica" }}
          >
            Scholar Swap
          </Typography>
        </Box>

        <Typography
          variant="h2"
          sx={{
            color: "#FFD700",
            textAlign: "center",
            mt: 6,
            fontFamily: "Poppins, Helvetica",
          }}
        >
          Upload Your Materials
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{ color: "#FFD700", fontFamily: "Poppins, Helvetica" }}
            >
              Product Title
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Text here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                mt: 2,
                backgroundColor: "#333",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": { color: "#CCCCCC" },
                "& .MuiInputBase-input::placeholder": { color: "#CCCCCC" },
              }}
              InputProps={{
                style: { color: "#CCCCCC" },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{ color: "#FFD700", fontFamily: "Poppins, Helvetica" }}
            >
              Product Category
            </Typography>
            <FormControl
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#333",
                borderRadius: "10px",
                "& .MuiInputBase-root": {
                  color: "#CCCCCC",
                },
                "& .MuiInputLabel-root": {
                  color: "#CCCCCC",
                },
                "& .MuiSvgIcon-root": {
                  color: "#CCCCCC",
                },
              }}
            >
              <InputLabel id="category-label" sx={{ color: "#CCCCCC" }}>
                Select one
              </InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Select one"
                sx={{
                  "& fieldset": {
                    border: "none",
                  },
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{ color: "#FFD700", fontFamily: "Poppins, Helvetica" }}
            >
              Price
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={{
                mt: 2,
                backgroundColor: "#333",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": { color: "#CCCCCC" },
                "& .MuiInputBase-input::placeholder": { color: "#CCCCCC" },
              }}
              InputProps={{
                style: { color: "#CCCCCC" },
                inputProps: { min: 0, step: "0.01" }, // To allow decimal values
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{ color: "#FFD700", fontFamily: "Poppins, Helvetica" }}
            >
              Upload Photos
            </Typography>
            <Paper
              elevation={3}
              sx={{
                mt: 2,ß
                p: 4,
                backgroundColor: "#333",
                borderRadius: "10px",
                textAlign: "center",
                position: "relative",
              }}
            >
              <input
                accept="image/*"
                type="file"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
              {imageFile ? (
                <Typography sx={{ color: "#CCCCCC" }}>
                  {imageFile.name}
                </Typography>
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 70, color: "#CCCCCC" }} />
                  <Typography sx={{ color: "#CCCCCC" }}>
                    Click to upload
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              sx={{ color: "#FFD700", fontFamily: "Poppins, Helvetica" }}
            >
              Product Description
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="50 words maximum"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mt: 2,
                backgroundColor: "#333",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": { color: "#CCCCCC" },
                "& .MuiInputBase-input::placeholder": { color: "#CCCCCC" },
              }}
              InputProps={{
                style: { color: "#CCCCCC" },
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleFinish}
            disabled={uploading}
            sx={{
              backgroundColor: "#FFD700",
              color: "#000",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#FFC700",
              },
            }}
          >
            {uploading ? <CircularProgress size={24} /> : "Finish"}
          </Button>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
          <DialogTitle>Product Uploaded</DialogTitle>
          <DialogContent>
            <Typography>Your product has been uploaded successfully.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmation} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UploadProductPage;
