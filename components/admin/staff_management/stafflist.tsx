"use client";
import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Tooltip from "@mui/joy/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import { useRouter } from "next/navigation";

const sheetStyles = {
  p: 4,
  borderRadius: "16px",
  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
  backgroundColor: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#e0e0e0",
};

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  department: string;
  salary: number;
  role: string;
}

const dummyStaff: StaffMember[] = [
  {
    id: "1",
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice.johnson@example.com",
    phone_number: "555-1234",
    department: "HR",
    salary: 55000,
    role: "super_staff",
  },
  {
    id: "2",
    first_name: "Bob",
    last_name: "Smith",
    email: "bob.smith@example.com",
    phone_number: "555-5678",
    department: "Finance",
    salary: 60000,
    role: "regular_staff",
  },
  {
    id: "3",
    first_name: "Charlie",
    last_name: "Brown",
    email: "charlie.brown@example.com",
    phone_number: "555-8765",
    department: "IT",
    salary: 65000,
    role: "super_staff",
  },
];

export default function StaffTable(): React.JSX.Element {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = dummyStaff.filter((staffMember) => {
    const fullName = `${staffMember.first_name} ${staffMember.last_name}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Sheet variant="outlined" sx={sheetStyles}>
      <Typography
        level="h4"
        sx={{ mb: 3, color: "#fff", fontSize: "2rem", fontWeight: "bold" }}
      >
        Staff List
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Input
          size="lg"
          placeholder="Search staff..."
          startDecorator={<SearchIcon sx={{ color: "#888" }} />}
          sx={{
            flex: 1,
            maxWidth: 500,
            borderRadius: "12px",
            backgroundColor: "transparent",
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Table hoverRow>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "12px" }}>Avatar</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Staff</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Contact</th>
            <th style={{ textAlign: "center", padding: "12px" }}>Department</th>
            <th style={{ textAlign: "center", padding: "12px" }}>Salary</th>
            <th style={{ textAlign: "center", padding: "12px" }}>Role</th>
            <th style={{ textAlign: "center", padding: "12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staffMember) => (
            <tr key={staffMember.id}>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Avatar>{staffMember.first_name[0]}</Avatar>
              </td>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Typography sx={{ fontSize: "1.1rem", color: "#fff" }}>
                  {staffMember.first_name} {staffMember.last_name}
                </Typography>
              </td>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Typography sx={{ fontSize: "1.1rem", color: "#fff" }}>
                  {staffMember.email}
                </Typography>
                <Typography sx={{ fontSize: "1rem", color: "#bbb" }}>
                  {staffMember.phone_number}
                </Typography>
              </td>
              <td style={{ textAlign: "center", padding: "12px" , color: "#fff" }}>
                {staffMember.department}
              </td>
              <td style={{ textAlign: "center", padding: "12px", color: "#4caf50" }}>
                ₹{staffMember.salary}
              </td>
              <td style={{ textAlign: "center", padding: "12px" , color: "#fff" }}>
                {staffMember.role.toUpperCase()}
              </td>
              <td style={{ textAlign: "center", padding: "12px" }}>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Tooltip title="View">
                    <IconButton
                      variant="soft"
                      onClick={() => router.push(`/admin/staff/view/${staffMember.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      variant="soft"
                      onClick={() => router.push(`/admin/staff/edit/${staffMember.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Block">
                    <IconButton variant="soft">
                      <BlockIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
