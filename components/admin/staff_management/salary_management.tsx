"use client";
import * as React from "react";
import { useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  Input,
  Option,
  Select,
  Table,
  Sheet,
  Typography,
  Tooltip,
} from "@mui/joy";
import { Search, CheckCircle, Visibility, CalendarToday } from "@mui/icons-material";
import { motion } from "framer-motion";

// Dummy Data for Staff Salaries
const staffData = [
  { id: 1, name: "John Doe", department: "IT", salary: 50000, salary_due: 5000, is_paid: false, due_date: "2025-03-20" },
  { id: 2, name: "Jane Smith", department: "HR", salary: 45000, salary_due: 0, is_paid: true, due_date: "2025-03-05" },
  { id: 3, name: "Alice Johnson", department: "Finance", salary: 60000, salary_due: 6000, is_paid: false, due_date: "2025-03-15" },
];

export default function SalaryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "paid" && staff.is_paid) ||
      (filterStatus === "pending" && !staff.is_paid);

    return matchesSearch && matchesStatus;
  });

  const markSalaryPaid = (id: number) => {
    alert(`Salary for Staff ID ${id} marked as paid! (Update backend logic later)`);
  };

  return (
    <Sheet
      sx={{
        p: 4,
        borderRadius: "16px",
        background: "transparent",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Typography level="h2" sx={{ mb: 3, fontWeight: "bold", color: "white" }}>
        Salary Management
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Input
          size="lg"
          placeholder="Search staff..."
          startDecorator={<Search sx={{ color: "#aaa" }} />}
          sx={{
            flex: 1,
            maxWidth: 400,
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            "& input": { color: "white" },
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          size="lg"
          placeholder="Filter by Salary Status"
          value={filterStatus}
          onChange={(e, value) => setFilterStatus(value || "all")}
          sx={{
            borderRadius: "12px",
            minWidth: 200,
            
            color: "black",
            "& .MuiSelect-select": { color: "black" },
          }}
        >
          <Option value="all">All</Option>
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
        </Select>
      </Box>

      {/* Salary Table */}
      <Table hoverRow>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "12px", backgroundColor: "white", color: "black" }}>Staff</th>
            <th style={{ textAlign: "center", padding: "12px", backgroundColor: "white", color: "black" }}>Department</th>
            <th style={{ textAlign: "center", padding: "12px", backgroundColor: "white", color: "black" }}>Salary</th>
            <th style={{ textAlign: "center", padding: "12px", backgroundColor: "white", color: "black" }}>Due</th>
            <th style={{ textAlign: "center", padding: "12px", backgroundColor: "white", color: "black" }}>Due Date</th>
            <th style={{ textAlign: "center", padding: "12px", backgroundColor: "white", color: "black" }}>Status</th>
            <th style={{ textAlign: "center", padding: "12px", backgroundColor: "white", color: "black" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff) => (
            <tr key={staff.id}>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Typography sx={{ fontSize: "1.1rem", color: "white" }}>
                  {staff.name}
                </Typography>
              </td>
              <td style={{ textAlign: "center", padding: "12px", color: "white" }}>{staff.department}</td>
              <td style={{ textAlign: "center", padding: "12px", color: "#4caf50" }}>
                ₹{staff.salary}
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "12px",
                  color: staff.salary_due > 0 ? "#ff9800" : "#4caf50",
                }}
              >
                ₹{staff.salary_due}
              </td>
              <td style={{ textAlign: "center", padding: "12px", color: "white" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <CalendarToday fontSize="small" sx={{ color: "#aaa" }} />
                  {staff.due_date}
                </Box>
              </td>
              <td style={{ textAlign: "center", padding: "12px", backgroundColor: "white" }}>
                <Chip
                  variant="soft"
                  color={staff.is_paid ? "success" : "warning"}
                  sx={{ fontSize: "1rem", color: "black" }}
                >
                  {staff.is_paid ? "Paid" : "Pending"}
                </Chip>
              </td>
              <td style={{ textAlign: "center", padding: "12px", backgroundColor: "white" }}>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Tooltip title="View Details">
                    <IconButton variant="soft" sx={{ color: "black", backgroundColor: "white" }}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  {!staff.is_paid && (
                    <Tooltip title="Mark as Paid">
                      <IconButton variant="soft" onClick={() => markSalaryPaid(staff.id)} sx={{ color: "black", backgroundColor: "white" }}>
                        <CheckCircle color="success" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
