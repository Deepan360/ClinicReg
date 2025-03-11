// pages/RestrictedPage.js
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Box, Typography } from "@mui/material";

const RestrictedPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1">
        You do not have permission to view this page.
      </Typography>
    </Box>
  );
};

export default RestrictedPage;
