"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";

import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Tooltip from "@mui/joy/Tooltip";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import { fetchExpiringMembers, Member as ReduxMember } from "@/src/features/members/memberSlice";

export default function ExpiringMembersTable(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const reduxMembers = useSelector((state: RootState) => state.members.expiringMembers) as ReduxMember[];

  const members = reduxMembers.map((member) => ({
    id: member.id,
    name: `${member.first_name} ${member.last_name}`,
    email: member.email,
    phone: member.phone || "-",
    status: member.membership_status,
    membership: member.membership_plan?.name || "N/A",
    amount_paid: `₹${member.amount_paid}`,
    membership_end: new Date(member.membership_end).toLocaleDateString("en-GB"),
  }));

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  React.useEffect(() => {
    dispatch(fetchExpiringMembers());
  }, [dispatch]);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Box sx={{ mb: 3 }}>
        <Typography level="h4" sx={{ color: "#fff", fontSize: "1.75rem", fontWeight: "bold" }}>
          Expiring Members
        </Typography>
      </Box>

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
            <th style={{ textAlign: "center", padding: "12px" }}>Expiring Date</th>
            <th style={{ textAlign: "center", padding: "12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member) => (
            <tr key={member.id}>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Avatar>{member.name[0]}</Avatar>
              </td>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Typography sx={{ fontSize: "1.1rem", color: "#fff" }}>{member.name}</Typography>
                <Chip size="sm" variant="soft" sx={{ fontSize: "0.9rem" }}>
                  {member.membership}
                </Chip>
              </td>
              <td style={{ textAlign: "left", padding: "12px" }}>
                <Typography sx={{ fontSize: "1.1rem", color: "#fff" }}>{member.email}</Typography>
                <Typography sx={{ fontSize: "1rem", color: "#bbb" }}>{member.phone}</Typography>
              </td>
              <td style={{ textAlign: "center", padding: "12px", color: "#4caf50" }}>
                {member.amount_paid}
              </td>
              <td style={{ textAlign: "center", padding: "12px", color: "#ff9800" }}>
                {member.membership_end}
              </td>
              <td style={{ textAlign: "center", padding: "12px" }}>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Tooltip title="View">
                    <IconButton variant="soft">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton variant="soft">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Send Reminder">
                    <IconButton variant="soft" color="warning">
                      <NotificationsActiveIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </td>
            </tr>
          ))}
          {filteredMembers.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "24px", fontSize: "1.2rem" }}>
                No members found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Sheet>
  );
}
