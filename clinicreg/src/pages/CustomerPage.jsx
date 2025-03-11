// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Typography,
  Box,
  Card,
  Avatar,
  Grid,
  Divider,
  Link
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Success icon (tick)
import CancelIcon from "@mui/icons-material/Cancel"; // Error icon (X)
import "../CustomerPage.css";

const CustomerPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    customername: "",
    mobileno: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (/^\d{10}$/.test(mobileNumber)) {
      checkMobileNumber(mobileNumber);
    } else if (mobileNumber) {
      setMessage("Please enter a valid 10-digit mobile number.");
      setError(true);
      setCustomerDetails({
        customername: "",
        mobileno: "",
        dob: "",
        gender: "",
        address: "",
        city: "",
        state: "",
      });
    }
  }, [mobileNumber]);

  const checkMobileNumber = async (mobile) => {
    try {
      const response = await axios.get(
        `http://136.185.14.8:8776/auth/checkMobileNumberavini`,
        { params: { mobileno: mobile } }
      );

      if (response.data && response.data.data) {
        const customerArray = response.data.data;

        if (customerArray.length > 0) {
          const customer = customerArray[0];
          setCustomerDetails(customer);
          setMessage(""); // Clear any previous messages
          setError(false);
        } else {
          setCustomerDetails({
            customername: "",
            mobileno: "",
            dob: "",
            gender: "",
            address: "",
            city: "",
            state: "",
          });
          setMessage(
            "No registered subscription found for this mobile number."
          );
          setError(true); // Set error to true since no customer is found
        }
      } else {
        setMessage("Invalid response format.");
        setError(true);
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessage("Error checking mobile number. Please try again later.");
      setError(true);
      setCustomerDetails({
        customername: "",
        mobileno: "",
        dob: "",
        gender: "",
        address: "",
        city: "",
        state: "",
      });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <img
          src="/images/logo.jpeg"
          alt="Logo"
          style={{
            width: "400px",
            height: "auto",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          marginTop: 6,
          padding: 4,
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64 }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            Customer Lookup
          </Typography>
        </Box>

        {/* Mobile Number Input */}
        <TextField
          label="Enter Mobile Number"
          variant="outlined"
          value={mobileNumber}
          onChange={(e) => {
            const value = e.target.value;
            // Allow only numeric input and restrict to 10 digits
            if (/^\d{0,10}$/.test(value)) {
              setMobileNumber(value); // Update state only if the value is valid
            }
          }}
          error={error}
          helperText={error ? message : ""}
          sx={{ width: "100%", maxWidth: 400 }}
        />

        {/* Message */}
        {message && !error && (
          <Typography
            variant="subtitle1"
            color="success.main"
            sx={{ marginTop: 2 }}
          >
            {message}
            <CheckCircleIcon
              sx={{ fontSize: 20, marginLeft: 1 }}
              color="success"
            />
          </Typography>
        )}

        {/* Error message with icon */}
        {error && message && (
          <Typography
            variant="subtitle1"
            color="error.main"
            sx={{ marginTop: 2, display: "flex", alignItems: "center" }}
          >
            <CancelIcon sx={{ fontSize: 20, marginRight: 1 }} color="error" />
            {message}
          </Typography>
        )}

        {/* Customer Card */}
        {customerDetails.customername && (
          <Card sx={{ width: "100%", maxWidth: 600, marginTop: 4, padding: 3 }}>
            {/* Subscribed Member Icon with Text */}
            <Box
              sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
            >
              <CheckCircleIcon
                sx={{ fontSize: 20, color: "primary.main", marginRight: 1 }}
              />
              <Typography
                variant="body1"
                color="primary.main"
                fontWeight="500px"
              >
                Subscribed Member
              </Typography>
            </Box>

            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              sx={{
                textTransform: "capitalize",
                marginBottom: 2,
                color: "primary.main",
              }}
            >
              {customerDetails.customername}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Mobile:</strong> {customerDetails.mobileno}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>DOB:</strong> {customerDetails.dob}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Gender:</strong> {customerDetails.gender}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Address:</strong> {customerDetails.address}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>City:</strong> {customerDetails.city}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>State:</strong> {customerDetails.state}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* No customer found message */}
        {!customerDetails.customername && !error && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            No customer details found. Please check the mobile number again.
          </Typography>
        )}
      </Box>
      <Typography
        sx={{
          display: "flex",
          justifyContent:  "center",
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

export default CustomerPage;
