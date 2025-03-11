// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import LandingPage from "./pages/LandingPage";
import CustomerPage from "./pages/CustomerPage"; // Ensure CustomerPage component is imported
import NewCustomer from "./pages/NewCustomer";
import LifetimemembershipPage from "./pages/LifetimemembershipPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e72a9",
    },
    secondary: {
      main: "#e02276",
      contrastText: "#fff",
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input::placeholder": {
            color: "white", // Set placeholder color to white
            opacity: 1, // Ensure visibility
          },
        },
      },
    },
  },
});


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/CustomerPage" element={<CustomerPage />} />
          <Route path="/NewCustomer" element={<NewCustomer />} />
          <Route
            path="/LifetimemembershipPage"
            element={<LifetimemembershipPage />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
