"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemDecorator,
  LinearProgress,
  Sheet,
  Stack,
  AspectRatio,
} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import axios from "axios";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PaidIcon from "@mui/icons-material/Paid";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HeightIcon from "@mui/icons-material/Height";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import HomeIcon from "@mui/icons-material/Home";
import BlockIcon from "@mui/icons-material/Block";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AdjustIcon from "@mui/icons-material/Adjust";
import { styled } from "@mui/joy/styles";

// ---------------------------
// Custom Styled Components
// ---------------------------
const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(45deg, #7C3AED 0%, #3B82F6 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "bold",
}));

const GlowCard = styled(Card)(({ theme }) => ({
  background:
    "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 70%)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.1)",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    padding: "1px",
    background:
      "linear-gradient(45deg, rgba(124, 58, 237, 0.4), rgba(59, 130, 246, 0.2))",
    WebkitMask:
      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
  },
}));

// New styled components for white highlighted text
const WhiteText = styled(Typography)(({ theme }) => ({
  color: "#fff",
  textShadow: "0 0 5px rgba(255,255,255,0.5)",
}));

const HighlightedText = styled(Typography)(({ theme }) => ({
  color: "#fff",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  padding: "0.2em 0.4em",
  borderRadius: "4px",
  textShadow: "0 0 5px rgba(255,255,255,0.5)",
}));

// ---------------------------
// Type Definitions
// ---------------------------
interface MembershipPlan {
  id: number;
  name: string;
  duration_days: number;
  price: number;
  is_locked: boolean;
}

interface Member {
  membership_status: ReactNode;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  height?: number;
  weight?: number;
  dob?: string;
  membership_start: string;
  membership_plan: MembershipPlan;
  is_blocked: boolean;
  amount_paid: string;
  membership_end: string;
  is_fully_paid: boolean;
  days_present: number;
  photo?: string;
}

// ---------------------------
// Component
// ---------------------------
export default function MemberView() {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get<Member>(
          `http://localhost:8000/api/members/${memberId}/`,
          { withCredentials: true }
        );
        setMember(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch member details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  const calculateProgress = () => {
    if (!member?.membership_start || !member?.membership_end) return 0;
    const start = new Date(member.membership_start).getTime();
    const end = new Date(member.membership_end).getTime();
    const now = new Date().getTime();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const calculateAttendanceRate = () => {
    if (!member) return 0;
    const start = new Date(member.membership_start).getTime();
    const now = new Date().getTime();
    const daysPassed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    if (daysPassed <= 0) return 0;
    return Math.min(100, Math.round((member.days_present / daysPassed) * 100));
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#000",
        }}
      >
        <CircularProgress size="lg" />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4, bgcolor: "#000", minHeight: "100vh" }}>
        <HighlightedText level="h3" sx={{ fontSize: "1.5rem" }}>
          {error}
        </HighlightedText>
      </Box>
    );

  if (!member)
    return (
      <Box sx={{ p: 4, bgcolor: "#000", minHeight: "100vh" }}>
        <HighlightedText level="h3" sx={{ fontSize: "1.5rem" }}>
          Member not found
        </HighlightedText>
      </Box>
    );

  const fullName = `${member.first_name} ${member.last_name}`;
  const membershipProgress = calculateProgress();
  const attendanceRate = calculateAttendanceRate();

  return (
    <Box sx={{ p: 4, bgcolor: "#000", minHeight: "100vh" }}>
      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid xs={12} md={3}>
          <GlowCard
            sx={{
              height: "100%",
              textAlign: "center",
              borderRadius: "20px",
              p: 3,
            }}
          >
            <AspectRatio
              ratio={1}
              sx={{
                width: { xs: 120, md: 150 },
                mx: "auto",
                mb: 2,
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(45deg, #7C3AED, #3B82F6)",
                  animation: "pulse 2s infinite",
                },
                "@keyframes pulse": {
                  "0%": { opacity: 0.6 },
                  "50%": { opacity: 0.3 },
                  "100%": { opacity: 0.6 },
                },
              }}
            >
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={fullName}
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.1)",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: "50%",
                  }}
                >
                  <PersonIcon sx={{ fontSize: 64, color: "#7C3AED" }} />
                </Box>
              )}
            </AspectRatio>

            <GradientText level="h3" sx={{ mb: 1, fontSize: "1.8rem" }}>
              {fullName}
            </GradientText>

            <HighlightedText level="body-sm" sx={{ mb: 2, fontSize: "1.1rem" }}>
              ID: #{member.id}
            </HighlightedText>

            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
              <Chip
                variant="soft"
                size="lg"
                sx={{
                  px: 2,
                  fontSize: "1.1rem",
                  backdropFilter: "blur(4px)",
                  color: "#fff",

                  // Conditional styling for membership status:
                  bgcolor:
                    member.membership_status === "blocked"
                      ? "rgba(239,68,68,0.15)"
                      : member.membership_status === "expired"
                      ? "rgba(255,152,0,0.15)"
                      : "rgba(34,197,94,0.15)",
                }}
              >
                {member.membership_status}
              </Chip>
            </Stack>

            <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />

            {/* Stats Section */}
            <Box sx={{ textAlign: "left" }}>
              <HighlightedText
                level="title-sm"
                sx={{
                  mb: 2,
                  fontSize: "1.2rem",
                  letterSpacing: "0.5px",
                }}
              >
                MEMBERSHIP OVERVIEW
              </HighlightedText>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <HighlightedText sx={{ fontSize: "1rem" }}>
                    Progress
                  </HighlightedText>
                  <WhiteText sx={{ fontSize: "1rem", fontWeight: 600 }}>
                    {membershipProgress}%
                  </WhiteText>
                </Box>
                <LinearProgress
                  determinate
                  value={membershipProgress}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)",
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <HighlightedText sx={{ fontSize: "1rem" }}>
                    Attendance
                  </HighlightedText>
                  <WhiteText sx={{ fontSize: "1rem", fontWeight: 600 }}>
                    {attendanceRate}%
                  </WhiteText>
                </Box>
                <LinearProgress
                  determinate
                  value={attendanceRate}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #3B82F6 0%, #10B981 100%)",
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <HighlightedText sx={{ fontSize: "1rem" }}>
                    Payments
                  </HighlightedText>
                  <WhiteText sx={{ fontSize: "1rem", fontWeight: 600 }}>
                    ₹{member.amount_paid} / ₹{member.membership_plan.price}
                  </WhiteText>
                </Box>
                <LinearProgress
                  determinate
                  value={(Number(member.amount_paid) / member.membership_plan.price) * 100}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #F59E0B 0%, #FCD34D 100%)",
                    },
                  }}
                />
              </Box>
            </Box>
          </GlowCard>
        </Grid>

        {/* Main Content */}
        <Grid xs={12} md={9}>
          {/* Navigation Tabs */}
          <Sheet
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              mb: 3,
              p: 0.5,
              display: "flex",
              gap: 0.5,
              backdropFilter: "blur(8px)",
            }}
          >
            {["personal", "membership", "fitness"].map((tab) => (
              <IconButton
                key={tab}
                variant={activeTab === tab ? "soft" : "plain"}
                onClick={() => setActiveTab(tab)}
                sx={{
                  flex: 1,
                  borderRadius: "8px",
                  py: 1.5,
                  transition: "all 0.3s ease",
                  bgcolor:
                    activeTab === tab ? "rgba(59, 130, 246, 0.2)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                <WhiteText
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: activeTab === tab ? 600 : 400,
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </WhiteText>
              </IconButton>
            ))}
          </Sheet>

          {/* Content Sections */}
          <GlowCard sx={{ borderRadius: "20px", p: 3 }}>
            {activeTab === "personal" && (
              <Box>
                <GradientText level="h4" sx={{ mb: 3, fontSize: "1.6rem" }}>
                  Personal Details
                </GradientText>
                <Grid container spacing={3}>
                  {[
                    {
                      icon: <CalendarTodayIcon />,
                      label: "Date of Birth",
                      value: formatDate(member.dob),
                    },
                    {
                      icon: <ContactPhoneIcon />,
                      label: "Phone",
                      value: member.phone || "N/A",
                    },
                    {
                      icon: <HeightIcon />,
                      label: "Height",
                      value: member.height ? `${member.height} cm` : "N/A",
                    },
                    {
                      icon: <HomeIcon />,
                      label: "Address",
                      value: member.address || "N/A",
                    },
                    {
                      icon: <MonitorWeightIcon />,
                      label: "Weight",
                      value: member.weight ? `${member.weight} kg` : "N/A",
                    },
                    {
                      icon: <FitnessCenterIcon />,
                      label: "Days Present",
                      value: `${member.days_present} days`,
                    },
                  ].map((item, index) => (
                    <Grid xs={12} md={6} key={index}>
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemDecorator sx={{ color: "#3B82F6", mr: 2 }}>
                          {item.icon}
                        </ListItemDecorator>
                        <Box>
                          <HighlightedText level="body-xs" sx={{ mb: 0.5 }}>
                            {item.label}
                          </HighlightedText>
                          <WhiteText sx={{ fontSize: "1.1rem" }}>
                            {item.value}
                          </WhiteText>
                        </Box>
                      </ListItem>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {activeTab === "membership" && (
              <Box>
                <GradientText level="h4" sx={{ mb: 3, fontSize: "1.6rem" }}>
                  Membership Details
                </GradientText>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <List sx={{ "--ListItem-paddingY": "1rem" }}>
                      <ListItem>
                        <ListItemDecorator sx={{ color: "#3B82F6" }}>
                          <AccessTimeIcon />
                        </ListItemDecorator>
                        <Box>
                          <HighlightedText level="body-xs" sx={{ mb: 0.5 }}>
                            Membership Period
                          </HighlightedText>
                          <WhiteText>
                            {formatDate(member.membership_start)} -{" "}
                            {formatDate(member.membership_end)}
                          </WhiteText>
                        </Box>
                      </ListItem>
                      <ListItem>
                        <ListItemDecorator sx={{ color: "#3B82F6" }}>
                          <PaidIcon />
                        </ListItemDecorator>
                        <Box>
                          <HighlightedText level="body-xs" sx={{ mb: 0.5 }}>
                            Payment Status
                          </HighlightedText>
                          <WhiteText>
                            {member.is_fully_paid ? "Fully Paid" : "Pending"} (₹
                            {member.amount_paid}/₹{member.membership_plan.price})
                          </WhiteText>
                        </Box>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <List sx={{ "--ListItem-paddingY": "1rem" }}>
                      <ListItem>
                        <ListItemDecorator sx={{ color: "#3B82F6" }}>
                          <FitnessCenterIcon />
                        </ListItemDecorator>
                        <Box>
                          <HighlightedText level="body-xs" sx={{ mb: 0.5 }}>
                            Current Plan
                          </HighlightedText>
                          <WhiteText>
                            {member.membership_plan.name} (
                            {member.membership_plan.duration_days} days)
                          </WhiteText>
                        </Box>
                      </ListItem>
                      <ListItem>
                        <ListItemDecorator sx={{ color: "#3B82F6" }}>
                          <BlockIcon />
                        </ListItemDecorator>
                        <Box>
                          <HighlightedText level="body-xs" sx={{ mb: 0.5 }}>
                            Plan Status
                          </HighlightedText>
                          <WhiteText>
                            {member.membership_plan.is_locked ? "Locked" : "Unlocked"}
                          </WhiteText>
                        </Box>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === "fitness" && (
              <Box>
                <GradientText level="h4" sx={{ mb: 3, fontSize: "1.6rem" }}>
                  Fitness Details
                </GradientText>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <List sx={{ "--ListItem-paddingY": "1rem" }}>
                      <ListItem>
                        <ListItemDecorator sx={{ color: "#3B82F6" }}>
                          <DirectionsRunIcon />
                        </ListItemDecorator>
                        <Box>
                          <HighlightedText level="body-xs" sx={{ mb: 0.5 }}>
                            Days Present
                          </HighlightedText>
                          <WhiteText>
                            {member.days_present} days
                          </WhiteText>
                        </Box>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <List sx={{ "--ListItem-paddingY": "1rem" }}>
                      <ListItem>
                        <ListItemDecorator sx={{ color: "#3B82F6" }}>
                          <ShowChartIcon />
                        </ListItemDecorator>
                        <Box>
                          <HighlightedText level="body-xs" sx={{ mb: 0.5 }}>
                            BMI
                          </HighlightedText>
                          <WhiteText>
                            {member.weight && member.height
                              ? (
                                  member.weight /
                                  ((member.height / 100) ** 2)
                                ).toFixed(2)
                              : "N/A"}
                          </WhiteText>
                        </Box>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Box>
            )}
          </GlowCard>
        </Grid>
      </Grid>
    </Box>
  );
}
