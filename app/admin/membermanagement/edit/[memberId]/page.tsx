"use client";
import * as React from 'react';
import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { CssVarsProvider, styled } from '@mui/joy/styles';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Typography
} from '@mui/joy';
import {
  AttachMoney,
  CalendarToday,
  Email,
  FitnessCenter,
  Home,
  KeyboardArrowRight,
  PersonAdd,
  Phone
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------------------------------------
// Styled Components & Helper Function

const StyledDateInput = styled(Input)(({ theme }) => ({
  '&::-webkit-calendar-picker-indicator': {
    filter: 'invert(0.8) brightness(1.5) contrast(2)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    '&:hover': {
      filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(220deg)',
      transform: 'scale(1.1)',
    },
  },
}));

const MotionCard = motion(Card);
const MotionBox = motion(Box);

// ==========================================
// Style Objects
// ==========================================
const styles = {
  formContainer: {
    width: '100%',
    height: '100%',
    margin: 0,
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 'xl',
    p: { xs: 2, sm: 4 },
    background: 'linear-gradient(135deg, rgba(20,20,40,0.8), rgba(10,10,30,0.9))',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        'radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(139,92,246,0.1), transparent 60%)',
      zIndex: 0,
    },
  },
  sectionCard: {
    bgcolor: 'rgba(15,15,35,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'lg',
    p: 3,
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    zIndex: 1,
    '&:hover': {
      borderColor: 'rgba(255,255,255,0.3)',
      transform: 'translateY(-4px)',
      boxShadow:
        '0 15px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1) inset',
    },
  },
  input: {
    bgcolor: 'rgba(10,10,25,0.5)',
    border: '1px solid rgba(255,255,255,0.15)',
    fontSize: '1.2rem',
    py: 2,
    borderRadius: '10px',
    transition: 'all 0.25s ease',
    color: 'rgba(255,255,255,0.95)',
    '&:hover': {
      borderColor: 'rgba(255,255,255,0.3)',
      bgcolor: 'rgba(20,20,40,0.5)',
    },
    '&:focus-within': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.25)',
      bgcolor: 'rgba(25,25,45,0.6)',
    },
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    mb: 1,
    fontWeight: '600',
    fontSize: '1.2rem',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  button: {
    px: 4,
    py: 1.5,
    fontSize: '1rem',
    fontWeight: '700',
    background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
      background: 'linear-gradient(45deg, #5a5de8, #7c4fe9)',
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    color: 'white',
    fontWeight: '700',
    fontSize: '1.25rem',
    '& svg': {
      transition: 'all 0.3s ease',
    },
    '&:hover svg': {
      transform: 'scale(1.15)',
      color: '#8b5cf6',
    },
  },
  requiredBadge: {
    display: 'inline-flex',
    ml: 1,
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.6)',
    bgcolor: 'rgba(99,102,241,0.2)',
    px: 1,
    py: 0.3,
    borderRadius: '4px',
    alignItems: 'center',
  },
  submitSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 4,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '80%',
      height: '1px',
      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
      top: '-20px',
      left: '10%',
    },
  }
};




const animations = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  },
  itemVariants: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  },
  fadeInVariants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }
};

const getExpiryDate = (startDateStr: string, durationDays: number): string => {
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return "";
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + durationDays);
  return expiryDate.toISOString().slice(0, 10);
};

// ---------------------------------------------
// Interfaces
// ---------------------------------------------
interface MembershipPlan {
  id: number;
  name: string;
  duration_days: number;
  price: number;
  is_locked: boolean;
}

interface Member {
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

// ---------------------------------------------
// Main Component: EditMember
// ---------------------------------------------
export default function EditMember() {
  const { memberId } = useParams() as { memberId: string };
  const router = useRouter();

  // State for member details and form fields.
  const [member, setMember] = useState<Member | null>(null);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [membershipStart, setMembershipStart] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<number>(0);

  // Compute expiry date and plan duration based on membership start and plan details.
  const computedExpiryDate = useMemo(() => {
    if (!membershipStart || !selectedPlan) return "";
    const plan = membershipPlans.find((p) => p.id === selectedPlan);
    return plan ? getExpiryDate(membershipStart, plan.duration_days) : "";
  }, [membershipStart, selectedPlan, membershipPlans]);

  const computedDurationMonths = useMemo(() => {
    if (!selectedPlan) return "";
    const plan = membershipPlans.find((p) => p.id === selectedPlan);
    return plan ? Math.ceil(plan.duration_days / 30).toString() : "";
  }, [selectedPlan, membershipPlans]);

  // Fetch member details
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get<Member>(
          `http://localhost:8000/api/members/${memberId}/`,
          { withCredentials: true }
        );
        const data = response.data;
        setMember(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setMembershipStart(data.membership_start.slice(0, 10));
        setAmountPaid(data.amount_paid);
        setHeight(data.height ? String(data.height) : "");
        setWeight(data.weight ? String(data.weight) : "");
        setDob(data.dob || "");
        setSelectedPlan(data.membership_plan.id);
        if (data.photo) {
          setPhotoPreview(data.photo);
        }
      } catch (err: any) {
        setError(err instanceof Error ? err.message : "Failed to fetch member details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [memberId]);

  // Fetch membership plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get<MembershipPlan[]>(
          `http://localhost:8000/api/membership-plans/`,
          { withCredentials: true }
        );
        setMembershipPlans(response.data);
      } catch (err: any) {
        console.error("Failed to fetch membership plans:", err);
      }
    };
    fetchPlans();
  }, []);

  // Update photo preview when a new file is selected.
  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const focusSection = (section: number) => {
    setActiveSection(section);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("membership_start", membershipStart);
    if (selectedPlan) formData.append("membership_plan", String(selectedPlan));
    formData.append("amount_paid", amountPaid);
    if (height) formData.append("height", height);
    if (weight) formData.append("weight", weight);
    if (dob) formData.append("dob", dob);
    if (photo) formData.append("photo", photo);

    try {
      await axios.put(
        `http://localhost:8000/api/members/${memberId}/`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Member updated successfully! 🎉");
      router.push("/admin/membermanagement");
    } catch (error: any) {
      toast.error("Failed to update member 😢: " + error.message);
    }
  };

  if (loading) {
    return (
      <CssVarsProvider>
        <Typography>Loading...</Typography>
      </CssVarsProvider>
    );
  }

  if (error) {
    return (
      <CssVarsProvider>
        <Typography color="danger">{error}</Typography>
      </CssVarsProvider>
    );
  }

  return (
    <CssVarsProvider defaultMode="dark">
      <ToastContainer />
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f1e, #1a1a2e)',
          p: { xs: 2, sm: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence>
          <MotionBox
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={styles.formContainer}
          >
            <form onSubmit={handleSubmit}>
              <motion.div
                variants={animations.containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Stack spacing={4} sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
                  {/* Header Section */}
                  <motion.div variants={animations.itemVariants}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                        <IconButton
                          variant="soft"
                          color="primary"
                          sx={{
                            mb: 2,
                            p: 2,
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <PersonAdd sx={{ fontSize: '2rem', color: 'white' }} />
                        </IconButton>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <Typography
                          level="h2"
                          sx={{
                            color: 'white',
                            fontWeight: '800',
                            letterSpacing: '0.5px',
                            background: 'linear-gradient(to right, #fff, #c7d2fe)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          Edit Member
                        </Typography>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                      >
                        <Typography
                          level="body-sm"
                          sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, maxWidth: '600px', mx: 'auto' }}
                        >
                          Update member details below.
                        </Typography>
                      </motion.div>
                    </Box>
                  </motion.div>

                  {/* Personal Information Section */}
                  <motion.div variants={animations.itemVariants}>
                    <MotionCard
                      variant="outlined"
                      sx={styles.sectionCard}
                      onClick={() => focusSection(0)}
                      whileHover={{
                        boxShadow: activeSection === 0
                          ? '0 0 0 2px rgba(99,102,241,0.5), 0 15px 30px rgba(0,0,0,0.2)'
                          : '0 15px 30px rgba(0,0,0,0.2)',
                      }}
                      animate={{
                        borderColor: activeSection === 0
                          ? 'rgba(99,102,241,0.7)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Typography level="title-lg" sx={styles.sectionHeader}>
                            <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}>
                              <PersonAdd sx={{ fontSize: '1.5rem', color: '#6366f1' }} />
                            </motion.div>
                            Personal Information
                          </Typography>
                        </motion.div>
                        <Divider sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      </Box>
                      <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              First Name
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter first name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              Last Name
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter last name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </FormControl>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                <Email fontSize="small" />
                              </motion.div>
                              Email
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              type="email"
                              size="lg"
                              sx={styles.input}
                              placeholder="your.email@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                <Phone fontSize="small" />
                              </motion.div>
                              Phone
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter phone number"
                              startDecorator={<span>+91&nbsp;</span>}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </FormControl>
                        </Stack>
                        <FormControl>
                          <FormLabel sx={styles.label}>
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                              <Home fontSize="small" />
                            </motion.div>
                            Address
                          </FormLabel>
                          <Input
                            size="lg"
                            sx={styles.input}
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </FormControl>
                      </Stack>
                    </MotionCard>
                  </motion.div>

                  {/* Membership Details Section */}
                  <motion.div variants={animations.itemVariants}>
                    <MotionCard
                      variant="outlined"
                      sx={styles.sectionCard}
                      onClick={() => focusSection(1)}
                      whileHover={{
                        boxShadow: activeSection === 1
                          ? '0 0 0 2px rgba(99,102,241,0.5), 0 15px 30px rgba(0,0,0,0.2)'
                          : '0 15px 30px rgba(0,0,0,0.2)',
                      }}
                      animate={{
                        borderColor: activeSection === 1
                          ? 'rgba(99,102,241,0.7)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Typography level="title-lg" sx={styles.sectionHeader}>
                            <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}>
                              <KeyboardArrowRight sx={{ fontSize: '1.5rem', color: '#6366f1' }} />
                            </motion.div>
                            Membership Details
                          </Typography>
                        </motion.div>
                        <Divider sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      </Box>
                      <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>Plan</FormLabel>
                            <Select
                              placeholder="Select Plan"
                              size="lg"
                              sx={styles.input}
                              value={selectedPlan ? String(selectedPlan) : ""}
                              onChange={(e, newValue) => setSelectedPlan(Number(newValue))}
                            >
                              {membershipPlans.map((plan) => (
                                <Option key={plan.id} value={plan.id.toString()}>
                                  {plan.name}
                                </Option>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>Plan Duration (months)</FormLabel>
                            <Input
                              size="lg"
                              sx={styles.input}
                              placeholder="Calculated from plan"
                              value={computedDurationMonths}
                              readOnly
                            />
                          </FormControl>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                <AttachMoney fontSize="small" />
                              </motion.div>
                              Initial Payment
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              type="number"
                              size="lg"
                              sx={styles.input}
                              placeholder="0.00"
                              value={amountPaid}
                              onChange={(e) => setAmountPaid(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>Photo</FormLabel>
                            <Box
                              component="input"
                              type="file"
                              accept="image/*"
                              sx={{
                                ...styles.input,
                                p: 1,
                                border: 'none',
                                bgcolor: 'transparent',
                              }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setPhoto(e.target.files[0]);
                                }
                              }}
                            />
                          </FormControl>
                        </Stack>
                        {photoPreview && (
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography level="body-sm" sx={{ mb: 1 }}>Photo Preview:</Typography>
                            <Box
                              component="img"
                              src={photoPreview}
                              alt="Photo Preview"
                              sx={{ maxWidth: '200px', borderRadius: '8px' }}
                            />
                          </Box>
                        )}
                        <Stack direction="row" spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>Membership Start</FormLabel>
                            <StyledDateInput
                              type="date"
                              size="lg"
                              sx={styles.input}
                              value={membershipStart}
                              onChange={(e) => setMembershipStart(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>Membership End</FormLabel>
                            <Input
                              size="lg"
                              sx={styles.input}
                              placeholder="Calculated automatically"
                              value={computedExpiryDate}
                              readOnly
                            />
                          </FormControl>
                        </Stack>
                      </Stack>
                    </MotionCard>
                  </motion.div>

                  {/* Health Metrics Section */}
                  <motion.div variants={animations.itemVariants}>
                    <MotionCard
                      variant="outlined"
                      sx={styles.sectionCard}
                      onClick={() => focusSection(2)}
                      whileHover={{
                        boxShadow: activeSection === 2
                          ? '0 0 0 2px rgba(99,102,241,0.5), 0 15px 30px rgba(0,0,0,0.2)'
                          : '0 15px 30px rgba(0,0,0,0.2)',
                      }}
                      animate={{
                        borderColor: activeSection === 2
                          ? 'rgba(99,102,241,0.7)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Typography level="title-lg" sx={styles.sectionHeader}>
                            <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}>
                              <FitnessCenter sx={{ fontSize: '1.5rem', color: '#6366f1' }} />
                            </motion.div>
                            Health Information
                          </Typography>
                        </motion.div>
                        <Typography
                          level="body-sm"
                          sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontStyle: 'italic' }}
                        >
                          Optional information to help personalize your fitness journey.
                        </Typography>
                        <Divider sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      </Box>
                      <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>Height (cm)</FormLabel>
                            <Input
                              type="number"
                              size="lg"
                              sx={styles.input}
                              placeholder="e.g. 170"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>Weight (kg)</FormLabel>
                            <Input
                              type="number"
                              size="lg"
                              sx={styles.input}
                              placeholder="e.g. 70"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                            />
                          </FormControl>
                        </Stack>
                        <FormControl>
                          <FormLabel sx={styles.label}>
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                              <CalendarToday fontSize="small" />
                            </motion.div>
                            Date of Birth
                          </FormLabel>
                          <StyledDateInput
                            type="date"
                            size="lg"
                            sx={styles.input}
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                          />
                        </FormControl>
                      </Stack>
                    </MotionCard>
                  </motion.div>

                  {/* Submit Button */}
                  <Box sx={styles.submitSection}>
                    <Button type="submit" sx={styles.button}>
                      Update Member
                    </Button>
                  </Box>
                </Stack>
              </motion.div>
            </form>
          </MotionBox>
        </AnimatePresence>
      </Box>
    </CssVarsProvider>
  );
}
