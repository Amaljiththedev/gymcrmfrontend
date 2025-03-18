"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { Badge } from "@/components/ui/badge";

const trainerData = [
  { id: 101, name: "John Doe", clients: 15, sessions: 120, salary: "₹50,000", rating: 4, commission: "₹5,000" },
  { id: 102, name: "Jane Smith", clients: 10, sessions: 90, salary: "₹40,000", rating: 3, commission: "₹4,000" },
  { id: 103, name: "Mark Wilson", clients: 20, sessions: 150, salary: "₹55,000", rating: 5, commission: "₹5,500" },
  { id: 104, name: "Emily Davis", clients: 18, sessions: 140, salary: "₹52,000", rating: 4, commission: "₹5,200" },
];

// Create a styled TableContainer that forwards the "component" prop
const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== "component",
})({
  backgroundColor: "transparent",
  boxShadow: "none",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  borderRadius: "8px",
});

// Styled TableCell for header
const StyledHeaderCell = styled(TableCell)({
  color: "white",
  fontSize: "1.125rem", // text-lg
  fontWeight: 600,
  padding: "12px 16px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.6)",
});

// Styled TableCell for body rows
const StyledTableCell = styled(TableCell)({
  color: "white",
  fontSize: "1.125rem", // text-lg
  padding: "12px 16px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.6)",
});

// Styled TableRow for body rows
const StyledTableRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: "background-color 0.2s ease",
  },
  borderBottom: "1px solid rgba(255, 255, 255, 0.6)",
});

export function TrainerTable() {
  return (
    <StyledTableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledHeaderCell>Trainer</StyledHeaderCell>
            <StyledHeaderCell>Clients</StyledHeaderCell>
            <StyledHeaderCell>Sessions</StyledHeaderCell>
            <StyledHeaderCell>Salary</StyledHeaderCell>
            <StyledHeaderCell>Rating</StyledHeaderCell>
            <StyledHeaderCell>Commission</StyledHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trainerData.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.clients}</StyledTableCell>
              <StyledTableCell>{row.sessions}</StyledTableCell>
              <StyledTableCell>{row.salary}</StyledTableCell>
              <StyledTableCell>{"⭐".repeat(row.rating)}</StyledTableCell>
              <StyledTableCell>{row.commission}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
