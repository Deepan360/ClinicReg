// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect,useCallback } from "react";
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
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import "../CustomerPage.css"; 
import {  AppRegistrationTwoTone } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

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
          console.log("Customer Data:", response.data.data);
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

const [reason, setReason] = useState("");
const [selectedDoctor, setSelectedDoctor] = useState("");

const [openDialog, setOpenDialog] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState(null);

const handleIconClick = (customer) => {
  console.log("Selected Customer:", customer);
  setSelectedCustomer(customer);
  setOpenDialog(true);
};


const handleCloseDialog = () => {
  setOpenDialog(false);
  setSelectedCustomer(null);
  setReason("");
  setSelectedDoctor("");
};

const handleConfirmRegistration = async () => {
  if (!selectedCustomer || !reason || !selectedDoctor) {
    setMessage("Please fill in all fields.");
    setError(true);
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:5000/auth/visitEntry`,
      {
        customerId: selectedCustomer.id,
        reason,
        doctorName: selectedDoctor,
      }
    );
    if (response.data && response.data.success) {
      setMessage("Customer registered successfully.");
      setError(false);
      setReason("");
      setSelectedDoctor("");
      setMobileNumber("");
      setCustomerDetails([]);
      setError(false);
    } else {
      setMessage("Failed to register customer.");
      setError(true);
    }
  } catch (error) {
    console.error("API Error:", error);
    setMessage("Error registering customer. Please try again later.");
    setError(true);
  } finally {
    handleCloseDialog();
  }
};
  const handleCheckMembers = async () => {
    if (/^\d{10}$/.test(mobileNumber)) {
      await checkMobileNumber(mobileNumber);
    } else {
      setMessage("Please enter a valid 10-digit mobile number.");
      setError(true);
      setCustomerDetails([]);
    }
  };

  const isMobile = window.innerWidth <= 768;

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
        onClick={handleCheckMembers}
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
          fullWidth
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
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 3,
          mt: 3,
          justifyContent: isMobile ? "center" : "start",
          flexWrap: isMobile ? "nowrap" : "wrap",
        }}
      >
        {customerDetails.length > 0
          ? customerDetails.map((customer, index) => (
              <Card
                key={index}
                sx={{ width:isMobile ? "350px" : "500px", marginTop: 3, padding: 3 }}
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
                  <IconButton
                    sx={{
                      marginLeft: "auto",
                      zIndex: 1,
                      boxShadow: "0px 4px 15px 0px rgba(0,0,0,0.3)",
                    }}
                    onClick={() => handleIconClick(customer)}
                  >
                    <AppRegistrationTwoTone color="success" />
                  </IconButton>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} zIndex={1500}>
        <DialogTitle>Confirm Registration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to register this Patient Entry?
          </DialogContentText>
          {/* Reason for Visit Input */}
          <TextField
            fullWidth
            label="Reason for Visit"
            variant="outlined"
            margin="dense"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              label="Select Doctor"
            >
              <MenuItem value="Dr. Keshava Balaji">Dr. Keshava Balaji</MenuItem>
              <MenuItem value="Dr. Remughi">Dr. Remughi</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRegistration} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerPage;
