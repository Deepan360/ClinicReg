// eslint-disable-next-line no-unused-vars
import React from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../landing.css"

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#fff"
      padding={0}
      
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        style={{ padding: "2rem" }}
      >
        {/* Left Section: Portrait Image */}
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <img
              src="/images/labs (2).jpg" // Ensure the image path is correct
              alt="Portrait"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>

        {/* Right Section: Text Content */}
        <Grid item xs={12} md={6}>
          <Box textAlign="center">
            <Typography variant="h2" gutterBottom>
              Avini Labs
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/CustomerPage")}
                >
                  Customer Table
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/NewCustomer")}
                >
                  Add Customers
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LandingPage;
