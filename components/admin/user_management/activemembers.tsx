"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/src/store/store";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Tooltip from "@mui/joy/Tooltip";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { fetchActiveMembers } from "@/src/features/members/memberSlice";
import {useRouter} from "next/navigation";

export default function ActiveMembersTable(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { activeMembers, loading, error } = useSelector(
    (state: RootState) => state.members
  );

  const [searchTerm, setSearchTerm] = React.useState<string>("");

  React.useEffect(() => {
    dispatch(fetchActiveMembers());
  }, [dispatch]);

  const filteredMembers = activeMembers.filter((member) =>
    member.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const router = useRouter();
  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 4,
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        backgroundColor: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#e0e0e0",
      }}
    >
      <Typography level="h4" sx={{ mb: 3, color: "#fff", fontSize: "1.75rem", fontWeight: "bold" }}>
        Active Members
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Input
          size="lg"
          placeholder="Search active members..."
          startDecorator={<SearchIcon sx={{ color: "#888" }} />}
          sx={{ flex: 1, maxWidth: 500, borderRadius: "12px", backgroundColor: "transparent" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Table hoverRow>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "12px" }}>Avatar</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Member</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Contact</th>
            <th style={{ textAlign: "center", padding: "12px" }}>Amount Paid</th>
            <th style={{ textAlign: "center", padding: "12px" }}>Expiry Date</th>
            <th style={{ textAlign: "center", padding: "12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member) => (
            <tr key={member.id}>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Avatar>{member.first_name[0]}</Avatar>
              </td>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Typography sx={{ fontSize: "1.1rem", color: "#fff" }}>{member.first_name} {member.last_name}</Typography>
              </td>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Typography sx={{ fontSize: "1.1rem", color: "#fff" }}>{member.email}</Typography>
                <Typography sx={{ fontSize: "1rem", color: "#bbb" }}>{member.phone}</Typography>
              </td>
              <td style={{ textAlign: "center", padding: "12px", color: "#4caf50" }}>
                ₹{member.amount_paid}
              </td>
              <td style={{ textAlign: "center", padding: "12px", color: "#ff9800" }}>
                {new Date(member.membership_end).toLocaleDateString()}
              </td>
              <td style={{ textAlign: "center", padding: "12px" }}>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Tooltip title="View">
                    <IconButton variant="soft" onClick={() => router.push(`/admin/membermanagement/view/${member.id}`)}><VisibilityIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                  <IconButton variant="soft" onClick={() => router.push(`/admin/membermanagement/edit/${member.id}`)}><EditIcon /></IconButton>
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
