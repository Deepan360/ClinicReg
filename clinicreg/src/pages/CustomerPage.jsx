// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Typography,
  Box,
  Button,
  Card,
  Avatar,
  Grid,
  Divider,
  Link,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import "../CustomerPage.css";

const CustomerPage = () => {
   const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [customerDetails, setCustomerDetails] = useState([]);

  useEffect(() => {
    if (/^\d{10}$/.test(mobileNumber)) {
      checkMobileNumber(mobileNumber);
    } else if (mobileNumber) {
      setMessage("Please enter a valid 10-digit mobile number.");
      setError(true);
      setCustomerDetails([]);
    }
  }, [mobileNumber]);

  const checkMobileNumber = async (mobile) => {
    try {
      const response = await axios.get(
        `http://136.185.14.8:8077/auth/checkMobileNumberClinic`,
        { params: { mobileno: mobile } }
      );

      if (response.data && response.data.data) {
        const customerArray = response.data.data;

        if (customerArray.length > 0) {
          setCustomerDetails(customerArray);
          setMessage("");
          setError(false);
        } else {
          setCustomerDetails([]);
          setMessage(
            "No registered subscription found for this mobile number."
          );
          setError(true);
        }
      } else {
        setMessage("Invalid response format.");
        setError(true);
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessage("Error checking mobile number. Please try again later.");
      setError(true);
      setCustomerDetails([]);
    }
  };

const formatDOB = (dob) => {
  if (!dob) return "N/A";

  // Check if the dob contains time or is in UTC format
  const dateObj = new Date(dob);

  if (isNaN(dateObj.getTime())) return "Invalid Date"; // Handle invalid cases

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};


  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <Container sx={{ display: "block", height: "100vh", width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <img
          src="/images/sripharmacy.jpg"
          alt="Logo"
          style={{ width: "80px", height: "auto" }}
        />
      </Box>
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          marginTop: 4,
          padding: 3,
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          width: "90%",
          maxWidth: "600px",
          marginX: "auto",
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
          <Avatar sx={{ bgcolor: "primary.main", width: 50, height: 50 }}>
            <PersonIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Member Lookup
          </Typography>
        </Box>

        <TextField
          label="Enter Mobile Number"
          variant="outlined"
          value={mobileNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              setMobileNumber(value);
            }
          }}
          error={error}
          helperText={error ? message : ""}
          sx={{ width: "100%", maxWidth: 400 }}
        />

        {error && message && (
          <Typography
            variant="subtitle1"
            color="error.main"
            sx={{ mt: 2, display: "flex", alignItems: "center" }}
          >
            <CancelIcon sx={{ fontSize: 20, marginRight: 1 }} color="error" />
            {message}
          </Typography>
        )}

        {customerDetails.length > 0
          ? customerDetails.map((customer, index) => (
              <Card
                key={index}
                sx={{ width: "100%", marginTop: 3, padding: 3 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <CheckCircleIcon
                    sx={{ fontSize: 20, color: "primary.main", marginRight: 1 }}
                  />
                  <Typography
                    variant="body1"
                    color="primary.main"
                    fontWeight="500px"
                  >
                    Registered Member {index + 1}
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
                  {customer.name}
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Mobile:</strong> {customer.mobileno}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>DOB:</strong> {formatDOB(customer.dob)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Age:</strong> {calculateAge(customer.dob)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Gender:</strong> {customer.gender || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Address:</strong> {customer.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>City:</strong> {customer.city}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>State:</strong> {customer.state}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            ))
          : !error && (
              <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                No customer details found. Please check the mobile number again.
              </Typography>
            )}
      </Box>

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
          sx={{ textDecoration: "none", color: "primary.main", ml: 0.5 }}
        >
          Akilam Technology
        </Link>
        <FavoriteIcon sx={{ color: "primary.main", ml: 0.5 }} />
      </Typography>
    </Container>
  );
};

export default CustomerPage;
