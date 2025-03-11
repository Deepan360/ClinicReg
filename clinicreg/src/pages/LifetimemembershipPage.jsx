// eslint-disable-next-line no-unused-vars
import React from "react";
import { Typography, Container,Box,Link } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const LifetimemembershipPage = () => {
  return (
    <>
      {" "}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <img
          src="/images/logo.jpeg"
          alt="Logo"
          style={{
            width: "300px", // Adjust logo size
            height: "auto",
            borderRadius: "8px",
          }}
        />
      </Box>
      <Container
        maxWidth="xs" // Use 'xs' for a smaller container on mobile
        sx={{
          paddingLeft: { xs: 2, sm: 3 },
          paddingRight: { xs: 2, sm: 3 },
          textAlign: "center", // Center text for smaller screens
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            color: "primary.main",
            boxShadow: 5,
            padding: "20px",
            borderRadius: 5,
            fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem" }, // Adjust font size to fit smaller screen
          }}
        >
          Welcome to Lifetime Digital Discount Card!
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            marginBottom: 3,
            color: "secondary.main",
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" }, // Smaller font size on mobile
          }}
        >
          You are a subscribed member.
        </Typography>
      </Container>
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

export default LifetimemembershipPage;
