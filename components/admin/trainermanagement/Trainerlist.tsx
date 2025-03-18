import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Typography,
  Box,
  Stack,
  TextField,
} from "@mui/material";

// Dummy Data for Trainers
interface Trainer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  department: string;
  salary: number;
  dueDate: string; // Salary due date (e.g., "2024-07-10")
  profilePic: string;
}

const dummyTrainers: Trainer[] = [
  {
    id: "1",
    first_name: "Alice",
    last_name: "Williams",
    email: "alice.williams@example.com",
    phone_number: "555-1234",
    department: "Fitness",
    salary: 35000,
    dueDate: "2024-07-10",
    profilePic: "https://via.placeholder.com/50",
  },
  {
    id: "2",
    first_name: "Bob",
    last_name: "Miller",
    email: "bob.miller@example.com",
    phone_number: "555-5678",
    department: "Strength",
    salary: 40000,
    dueDate: "2024-07-05",
    profilePic: "https://via.placeholder.com/50",
  },
  {
    id: "3",
    first_name: "Charlie",
    last_name: "Brown",
    email: "charlie.brown@example.com",
    phone_number: "555-8765",
    department: "Cardio",
    salary: 32000,
    dueDate: "2024-07-20",
    profilePic: "https://via.placeholder.com/50",
  },
];

const TrainerTable: React.FC = () => {
  // State for the search term
  const [searchTerm, setSearchTerm] = useState("");

  // Filter trainers based on search term (by name or email)
  const filteredTrainers = useMemo(() => {
    return dummyTrainers.filter((trainer) => {
      const fullName = `${trainer.first_name} ${trainer.last_name}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#000000",
        p: 3,
        borderRadius: 2,
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Header with Search Bar */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: "#fff",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        Trainer List
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search trainers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 2,
            bgcolor: "#222222",
            "& .MuiOutlinedInput-input": { color: "#FFFFFF" },
            "& .MuiInputLabel-root": { color: "#BBBBBB" },
          }}
        />
      </Box>

      {/* Trainer Table */}
      <TableContainer
        component={Paper}
        sx={{
          bgcolor: "#000000",
          boxShadow: "none",
          "& .MuiTableCell-root": {
            borderBottom: "1px solid #444444",
          },
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#222222" }}>
            <TableRow>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", py: 2 }}>Avatar</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", py: 2 }}>Trainer</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", py: 2 }}>Email</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", py: 2 }}>Phone</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", py: 2, textAlign: "center" }}>Department</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", py: 2, textAlign: "center" }}>Salary</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", py: 2, textAlign: "center" }}>Due Date</TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold", py: 2, textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrainers.map((trainer) => (
              <TableRow
                key={trainer.id}
                sx={{
                  "&:hover": {
                    bgcolor: "#222222",
                    transition: "background-color 0.2s ease",
                  },
                }}
              >
                <TableCell sx={{ textAlign: "left", padding: "12px" }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={trainer.profilePic}
                      sx={{
                        width: 40,
                        height: 40,
                        border: "2px solid #444444",
                      }}
                    >
                      {trainer.first_name[0]}
                    </Avatar>
                  </Stack>
                </TableCell>
                <TableCell sx={{ textAlign: "left", padding: "12px" }}>
                  <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
                    {trainer.first_name} {trainer.last_name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "left", padding: "12px", color: "#BBBBBB" }}>
                  {trainer.email}
                </TableCell>
                <TableCell sx={{ textAlign: "left", padding: "12px", color: "#BBBBBB" }}>
                  {trainer.phone_number}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "12px", color: "#FFFFFF" }}>
                  {trainer.department}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "12px" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                    ₹{trainer.salary}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "12px" }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                    {trainer.dueDate}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "12px" }}>
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        mr: 1,
                        bgcolor: "#222222",
                        "&:hover": { bgcolor: "#444444" },
                        textTransform: "none",
                      }}
                      onClick={() => {
                        // Replace with your view trainer function/route
                        console.log("View trainer", trainer.id);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "#444444",
                        color: "#FFFFFF",
                        "&:hover": { borderColor: "#FFFFFF" },
                        textTransform: "none",
                      }}
                      onClick={() => {
                        // Replace with your salary/pay function/route
                        console.log("Pay salary for trainer", trainer.id);
                      }}
                    >
                      Pay
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TrainerTable;
