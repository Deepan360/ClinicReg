// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  MenuItem,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Search, CheckCircle, Cancel } from "@mui/icons-material";
import axios from "axios";

const RegMembers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customer data
const fetchCustomers = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/auth/getRegCustomers"
    );
    setCustomers(response.data.data); // Fix: Use response.data.data
    setFilteredCustomers(response.data.data);
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
};

  // Handle delete
  const handleDelete = async (regid) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:5000/auth/deleteRegCustomers/${regid}`);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  // Open Edit Modal
  const handleEditOpen = (customer) => {
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  // Close Edit Modal
  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedCustomer(null);
  };

  // Save Edited Customer
  const handleEditSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/auth/updateRegCustomer/${selectedCustomer.regid}`,
        selectedCustomer
      );
      fetchCustomers();
      handleEditClose();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.mobileno.includes(query) ||
          customer.city.toLowerCase().includes(query) ||
          customer.state.toLowerCase().includes(query)
      );
      setFilteredCustomers(filtered);
    }
  };

  // Table Columns
  const columns = [
    { field: "regid", headerName: "Reg ID", width: 100 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "mobileno", headerName: "Mobile No", width: 140 },
    { field: "address", headerName: "Address", width: 220 },
    { field: "city", headerName: "City", width: 120 },
    { field: "state", headerName: "State", width: 120 },
    { field: "country", headerName: "Country", width: 120 },
    { field: "pincode", headerName: "Pincode", width: 100 },
    { field: "age", headerName: "Age", width: 80 },
    { field: "dob", headerName: "DOB", width: 130 },
    { field: "lastvisited", headerName: "Last Visited", width: 170 },
    {
      field: "IsActive",
      headerName: "Status",
      width: 110,
      renderCell: (params) =>
        params.value ? (
          <Chip icon={<CheckCircle />} label="Active" color="success" />
        ) : (
          <Chip icon={<Cancel />} label="Inactive" color="error" />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEditOpen(params.row)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.regid)}
            color="error"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m={4}>
    
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        Registered Members
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by Name, Mobile, City or State..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* DataGrid with Custom Styling */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ height: 500, width: "100%",overflowX: "auto" }}>
          <DataGrid
            rows={filteredCustomers}
            columns={columns}
            getRowId={(row) => row.regid}
            pageSize={10}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1976d2",
                color: "primary.main",
                fontWeight: "bold",
                fontSize: 16,
              },
              "& .MuiDataGrid-cell": {
                fontSize: 14,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={selectedCustomer?.name || ""}
            onChange={(e) =>
              setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Mobile No"
            value={selectedCustomer?.mobileno || ""}
            onChange={(e) =>
              setSelectedCustomer({
                ...selectedCustomer,
                mobileno: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            select
            margin="dense"
            label="Gender"
            value={selectedCustomer?.gender || ""}
            onChange={(e) =>
              setSelectedCustomer({
                ...selectedCustomer,
                gender: e.target.value,
              })
            }
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegMembers;
