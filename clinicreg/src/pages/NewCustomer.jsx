// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Autocomplete,
  Snackbar,
  Alert,
  CircularProgress,
  Link,
  Container,
  useMediaQuery,
  Modal,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { grey } from "@mui/material/colors";
import "../NewCustomer.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../NewCustomer.css"

const NewCustomer = () => {
  const [formData, setFormData] = useState({
    customername: "",
    mobileno: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
  });
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false); // State to track checkbox
  const [openModal, setOpenModal] = useState(false); // State for modal
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is small
  const navigate = useNavigate();

useEffect(() => {
  setIsLoading(true);
  fetch("http://136.185.14.8:8776/auth/company/getcity")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data && Array.isArray(data.data)) {
        // Sort cities alphabetically before setting state
        const sortedCities = data.data.sort((a, b) =>
          a.city.localeCompare(b.city)
        );
        setCities(sortedCities);
        setErrorMessage("");
      } else {
        setErrorMessage("Error fetching city data. Please try again later.");
      }
    })
    .catch(() => {
      setErrorMessage("Failed to load cities. Please try again later.");
    })
    .finally(() => setIsLoading(false));
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (event, value) => {
    const selectedCity = cities.find((city) => city.city === value);
    setFormData((prev) => ({
      ...prev,
      city: value || "",
      state: selectedCity ? selectedCity.state : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check for customer name and mobile number
    if (
      !formData.customername ||
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
        "http://136.185.14.8:8776/auth/addCustomeravini",
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

        // Construct a personalized WhatsApp message
        const message = `Hello ${formData.customername},\n\nWelcome to our lifetime discount program! \n\n🎉Your registration is successful.\n\nEnjoy 15% discount on all our General Services across Sri Clinic.`;

        // Send WhatsApp message via Axios
        await axios.post("https://wav5.algotechnosoft.com/api/send", {
          number: `91${formData.mobileno}`, // Mobile number with country code
          type: "media", // Set to "media" for sending image with the message
          message: message, // Personalized text message
          instance_id: "6765547575AA1", // WhatsApp instance ID
          access_token: "675fece35d27f", // Access token for authentication
          media_url:
            "https://www.akilamtechnology.com/assets/img/AviniLabsdisc.JPG", // Direct image URL
        });
   
        // Clear form data
        setFormData({
          customername: "",
          mobileno: "",
          dob: "",
          gender: "",
          address: "",
          city: "",
          state: "",
        });

        navigate("/LifetimemembershipPage"); // Navigate to the desired page
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
    <>
      <Container
        sx={{
          padding: isMobile ? 1 : 5,
          boxShadow: 3,
          borderRadius: 5,
          borderColor: grey,
          backgroundColor: theme.palette.primary.light, // Use the lighter shade
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <img
              src="/images/logo.jpeg"
              alt="Logo"
              style={{
                width: isMobile ? "200px" : "400px",
                height: "auto",
              }}
            />
          </Box>
          <Typography variant={isMobile ? "h6" : "h5"} color="white" mb={2}>
            Register For Life Time Discount
          </Typography>

          {errorMessage && (
            <Typography variant="body1" color="error" mb={2}>
              {errorMessage}
            </Typography>
          )}

          <Grid container spacing={isMobile ? 1 : 2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="customername"
                label="Customer Name *"
                placeholder="Customer Name"
                value={formData.customername}
                onChange={handleChange}
                fullWidth
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Whatsapp Mobile Number"
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
              <Autocomplete
                options={cities.map((city) => city.city) || []}
                value={formData.city}
                onChange={handleCityChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City Name"
                    required
                    fullWidth
                    disabled={isLoading}
                    sx={inputStyles}
                  />
                )}
                loading={isLoading}
                noOptionsText={isLoading ? "Loading..." : "No cities found"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="State Name"
                name="state"
                value={formData.state}
                disabled
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

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fill: "white", // Set checkbox fill to white
                      "&:hover": {
                        fill: "white", // Ensure hover state is also white
                      },
                    },
                  }}
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
              }
              label={
                <Typography
                  variant="body2"
                  color="white"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setOpenModal(true)}
                >
                  I accept the{" "}
                  <span style={{ color: "black", fontWeight: "500" }}>
                    Terms and Conditions
                  </span>
                </Typography>
              }
            />
          </Box>

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
                !formData.customername ||
                !formData.mobileno ||
                !formData.city ||
                formData.mobileno.length !== 10 ||
                !acceptTerms || // Check if terms are accepted
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

      {/* Modal for Terms and Conditions */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="terms-modal-title"
        aria-describedby="terms-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            width: "100%",
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          <Typography
            id="terms-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Terms and Conditions
          </Typography>

          <Typography
            id="terms-modal-description"
            variant="body2"
            sx={{ mb: 2 }}
          >
            By providing your personal information, you agree that we may use
            your data for the following purposes:
          </Typography>

          <Typography component="ul" variant="body2" sx={{ pl: 2, mb: 2 }}>
            <li>
              To process and fulfill orders, transactions, and requests made
              through our services.
            </li>
            <li>
              To improve our products and services based on feedback and usage
              patterns.
            </li>
            <li>
              To send you promotional communications or updates about our
              services, where permitted by law.
            </li>
            <li>To comply with legal and regulatory requirements.</li>
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            We will only use your data for these purposes and will not disclose
            it to third parties except as outlined in this agreement.
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Additional Terms:
          </Typography>

          <Typography component="ol" variant="body2" sx={{ pl: 2 }}>
            <li>
              This digital discount card is not applicable for packages and
              festival offers.
            </li>
            <li>
              This digital discount card is valid for the cardholder only.
            </li>
            <li>Home sample collection charges are applicable.</li>
          </Typography>

          <Box sx={{ textAlign: "right", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

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
    </>
  );
};

export default NewCustomer;
