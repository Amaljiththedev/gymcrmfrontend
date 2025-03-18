"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import BlockIcon from "@mui/icons-material/Block";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchMembers } from "@/src/features/members/memberSlice";

const sheetStyles = {
  p: 4,
  borderRadius: "16px",
  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
  backgroundColor: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#e0e0e0",
};

export default function MemberTable(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { members, loading, error } = useSelector((state: RootState) => state.members);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Sheet variant="outlined" sx={sheetStyles}>
      <Typography level="h4" sx={{ mb: 3, color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>
        Member List
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Input
          size="lg"
          placeholder="Search members..."
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
            <th style={{ textAlign: "center", padding: "12px" }}>Membership Status</th>
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
              <td style={{ textAlign: "center", padding: "12px", color: member.membership_status === "expired" ? "#ff9800" : "#4caf50" }}>
                {member.membership_status.toUpperCase()}
              </td>
              <td style={{ textAlign: "center", padding: "12px" }}>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Tooltip title="View">
                    <IconButton variant="soft" onClick={() => router.push(`/admin/membermanagement/view/${member.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton variant="soft" onClick={() => router.push(`/admin/membermanagement/edit/${member.id}`)}>
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