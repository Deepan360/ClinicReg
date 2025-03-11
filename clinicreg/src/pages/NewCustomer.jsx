// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Link,
  Container,
  useMediaQuery,

} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { grey } from "@mui/material/colors";
import "../NewCustomer.css";
import { useNavigate } from "react-router-dom";

import "../NewCustomer.css"

const NewCustomer = () => {
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  name: "",
  mobileno: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  age: "",
 
});

 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is small



const fetchLocationByPincode = async (pincode) => {
  setIsLoading(true);
  setErrorMessage(""); // Reset error message before fetching

  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await response.json();

    if (data && data[0].Status === "Success") {
      const { PostOffice } = data[0];
      if (PostOffice && PostOffice.length > 0) {
        setFormData((prev) => ({
          ...prev,
          city: PostOffice[0].District,
          state: PostOffice[0].State,
          address: `${PostOffice[0].Name}, ${PostOffice[0].District}, ${PostOffice[0].State}`, // Corrected address format
          country: PostOffice[0].Country,
        }));
      }
    } else {
      setErrorMessage("Invalid pincode. Please enter a valid pincode.");
    }
  } catch (error) {
    setErrorMessage("Failed to fetch location details. Please try again.");
    console.error("Error fetching location details:", error);
  } finally {
    setIsLoading(false);
  }
};



const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  if (name === "pincode" && value.length === 6) {
    fetchLocationByPincode(value);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check for customer name and mobile number
    if (
      !formData.name ||
      !formData.mobileno ||
      formData.mobileno.length !== 10
    ) {
      setSnackbarMessage(
        "Please provide a valid name and 10-digit mobile number."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "http://136.185.14.8:8077/auth/addCustomerClinic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (response.ok) {
        setSnackbarMessage(result.message);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);


        setFormData({
          name: "",
          mobileno: "",
          dob: "",
          gender: "",
          address: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          age: "",
          
        });

        
      } else {
        setSnackbarMessage(result.error || "Failed to add customer.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to add customer. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = {
    "& .MuiInputBase-root": {
      backgroundColor: "white", // Input background
      color: "black", // Text color
      marginBottom: isMobile ? 1 : 0,
    },
    "& .MuiInputLabel-root": {
      color: "black", // Label color
    },
    "& .MuiInputLabel-shrink": {
      backgroundColor: "white", // Label background when shrunk
      padding: "0 4px", // Adds padding to avoid overlapping with border
    },
  };

  return (
    <Container sx={{ display: "block", height: "100vh",padding:1 ,marginTop:"isMobile ? 5 : 0"}}>
      <Container
        sx={{
          padding: isMobile ? 1 : 5,
          boxShadow: 3,
          borderRadius: 5,
          borderColor: grey,
          backgroundColor: "#f1f2f3", // Use the lighter shade
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/CustomerPage")}
          sx={{ margin: 2 }}
        >
          Check Members
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ margin: 2 }}
        >
          Home
        </Button>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <img
              src="/images/sripharmacy.jpg"
              alt="Logo"
              style={{
                width: isMobile ? "100px" : "100px",
                height: "100px",
              }}
            />
          </Box>
          <Typography variant={isMobile ? "h6" : "h5"} color="primary" mb={2}>
            Registration Form
          </Typography>

          {errorMessage && (
            <Typography variant="body1" color="error" mb={2}>
              {errorMessage}
            </Typography>
          )}

          <Grid container spacing={isMobile ? 1 : 2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Customer Name *"
                placeholder="Customer Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                name="mobileno"
                type="tel"
                value={formData.mobileno}
                onChange={handleChange}
                inputProps={{ maxLength: 10 }}
                required
                fullWidth
                sx={inputStyles}
                onInput={(e) => {
                  // Allow only numeric input
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                error={formData.mobileno && formData.mobileno.length !== 10}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                fullWidth
                sx={inputStyles}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pincode"
                name="pincode"
                type="number"
                value={formData.pincode}
                onChange={handleChange}
                fullWidth
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.city}
                label="City Name"
                name="city"
                required
                fullWidth
                disabled={isLoading}
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="State Name"
                name="state"
                value={formData.state}
                required
                fullWidth
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                fullWidth
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
                required
                fullWidth
                sx={inputStyles}
              />
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 2, color: "white" }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{
                color: "white", // Set text color to white
                fontWeight: "500px", // Make text bold
              }}
              disabled={
                !formData.name ||
                !formData.mobileno ||
                !formData.city ||
                formData.mobileno.length !== 10 ||
                isSubmitting
              }
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
              onClose={() => setOpenSnackbar(false)}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>

      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
          color: "grey",
        }}
      >
        Powered by{" "}
        <Link
          href="https://akilamtechnology.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            textDecoration: "none",
            color: "primary.main",
            ml: 0.5,
            "&:hover": { color: "primary.main" },
          }}
        >
          Akilam Technology
        </Link>
        <FavoriteIcon
          sx={{
            color: "primary.main",
            ml: 0.5,
          }}
        />
      </Typography>
    </Container>
  );
};

export default NewCustomer;
