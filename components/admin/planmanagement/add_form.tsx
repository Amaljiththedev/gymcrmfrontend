"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CssVarsProvider } from "@mui/joy/styles";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Switch,
  Typography
} from "@mui/joy";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Create } from "@mui/icons-material";

// ------------------------------------------
// Dummy Backend Function
// ------------------------------------------
const createPlanDummy = (planData: any): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Dummy plan created:", planData);
      resolve(planData);
    }, 1500);
  });
};

// ------------------------------------------
// Style Objects
// ------------------------------------------
const styles = {
  formContainer: {
    width: "100%",
    minHeight: "100vh",
    margin: 0,
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "xl",
    p: { xs: 2, sm: 4 },
    background: "linear-gradient(135deg, rgba(20,20,40,0.8), rgba(10,10,30,0.9))",
    backdropFilter: "blur(20px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(139,92,246,0.1), transparent 60%)",
      zIndex: 0,
    },
  },
  sectionCard: {
    bgcolor: "rgba(15,15,35,0.5)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "lg",
    p: 3,
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    position: "relative",
    zIndex: 1,
    "&:hover": {
      borderColor: "rgba(255,255,255,0.3)",
      transform: "translateY(-4px)",
      boxShadow:
        "0 15px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1) inset",
    },
  },
  input: {
    bgcolor: "rgba(10,10,25,0.5)",
    border: "1px solid rgba(255,255,255,0.15)",
    fontSize: "1.2rem",
    py: 2,
    borderRadius: "10px",
    transition: "all 0.25s ease",
    color: "rgba(255,255,255,0.95)",
    "&:hover": {
      borderColor: "rgba(255,255,255,0.3)",
      bgcolor: "rgba(20,20,40,0.5)",
    },
    "&:focus-within": {
      borderColor: "#6366f1",
      boxShadow: "0 0 0 3px rgba(99,102,241,0.25)",
      bgcolor: "rgba(25,25,45,0.6)",
    },
  },
  label: {
    color: "rgba(255,255,255,0.85)",
    mb: 1,
    fontWeight: "600",
    fontSize: "1.2rem",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  button: {
    px: 4,
    py: 1.5,
    fontSize: "1rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(99,102,241,0.4)",
      background: "linear-gradient(45deg, #5a5de8, #7c4fe9)",
    },
    "&:active": {
      transform: "translateY(1px)",
    },
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    color: "white",
    fontWeight: "700",
    fontSize: "1.25rem",
    "& svg": {
      transition: "all 0.3s ease",
    },
    "&:hover svg": {
      transform: "scale(1.15)",
      color: "#8b5cf6",
    },
  },
  requiredBadge: {
    display: "inline-flex",
    ml: 1,
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.6)",
    bgcolor: "rgba(99,102,241,0.2)",
    px: 1,
    py: 0.3,
    borderRadius: "4px",
    alignItems: "center",
  },
  submitSection: {
    display: "flex",
    justifyContent: "flex-end",
    mt: 4,
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "80%",
      height: "1px",
      background: "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
      top: "-20px",
      left: "10%",
    },
  },
};

// ------------------------------------------
// Animation Variants
// ------------------------------------------
const animations = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  },
  itemVariants: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } },
  },
  fadeInVariants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  },
};

// ------------------------------------------
// Main Component: PlanCreationForm
// ------------------------------------------
export default function PlanCreationForm() {
  const router = useRouter();

  // State for MembershipPlan fields
  const [name, setName] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [price, setPrice] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const planData = {
      name,
      duration_days: Number(durationDays),
      price: Number(price),
      is_locked: isLocked,
    };

    try {
      await createPlanDummy(planData);
      toast.success("Plan created successfully!");
      router.push("/admin/planmanagement");
    } catch (error: any) {
      toast.error("Failed to create plan: " + error.message);
    }
  };

  return (
    <CssVarsProvider defaultMode="dark">
      <ToastContainer />
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0f1e, #1a1a2e)",
          p: { xs: 2, sm: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.formContainer as any}
          >
            <form onSubmit={handleSubmit}>
              <motion.div variants={animations.containerVariants} initial="hidden" animate="visible">
                <Stack spacing={4} sx={{ height: "100%", position: "relative", zIndex: 1 }}>
                  {/* --- Header Section --- */}
                  <motion.div variants={animations.itemVariants}>
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                        <IconButton
                          variant="soft"
                          color="primary"
                          sx={{
                            mb: 2,
                            p: 2,
                            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
                            border: "1px solid rgba(255,255,255,0.1)",
                            animation: "pulse 2s infinite",
                            "@keyframes pulse": {
                              "0%": { boxShadow: "0 0 0 0 rgba(99,102,241,0.4)" },
                              "70%": { boxShadow: "0 0 0 10px rgba(99,102,241,0)" },
                              "100%": { boxShadow: "0 0 0 0 rgba(99,102,241,0)" },
                            },
                          }}
                        >
                          <Create sx={{ fontSize: "2rem", color: "white" }} />
                        </IconButton>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                        <Typography
                          level="h2"
                          sx={{
                            color: "white",
                            fontWeight: "800",
                            letterSpacing: "0.5px",
                            background: "linear-gradient(to right, #fff, #c7d2fe)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          New Membership Plan
                        </Typography>
                      </motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
                        <Typography
                          level="body-sm"
                          sx={{ color: "rgba(255,255,255,0.7)", mt: 1, maxWidth: "600px", mx: "auto" }}
                        >
                          Enter the details below to create a new membership plan.
                        </Typography>
                      </motion.div>
                    </Box>
                  </motion.div>

                  {/* --- Plan Details Section --- */}
                  <motion.div variants={animations.itemVariants}>
                    <Card variant="outlined" sx={styles.sectionCard}>
                      <Box sx={{ mb: 3 }}>
                        <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Typography level="title-lg" sx={styles.sectionHeader}>
                            Plan Details
                          </Typography>
                        </motion.div>
                        <Divider sx={{ mt: 1.5, bgcolor: "rgba(255,255,255,0.1)" }} />
                      </Box>
                      <Stack spacing={3}>
                        <FormControl>
                          <FormLabel sx={styles.label}>
                            Plan Name
                            <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                              Required
                            </Box>
                          </FormLabel>
                          <Input
                            size="lg"
                            sx={styles.input}
                            placeholder="Enter plan name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </FormControl>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              Duration (days)
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              type="number"
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter duration in days"
                              value={durationDays}
                              onChange={(e) => setDurationDays(e.target.value)}
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel sx={styles.label}>
                              Price
                              <Box component={motion.span} sx={styles.requiredBadge} whileHover={{ scale: 1.05 }}>
                                Required
                              </Box>
                            </FormLabel>
                            <Input
                              type="number"
                              size="lg"
                              sx={styles.input}
                              placeholder="Enter price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </FormControl>
                        </Stack>
                        <FormControl>
                          <FormLabel sx={styles.label}>Locked Plan?</FormLabel>
                          <Switch
                            checked={isLocked}
                            onChange={(e) => setIsLocked(e.target.checked)}
                          />
                        </FormControl>
                      </Stack>
                    </Card>
                  </motion.div>

                  {/* --- Submit Section --- */}
                  <motion.div variants={animations.fadeInVariants}>
                    <Box sx={styles.submitSection}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          component={motion.button}
                          size="lg"
                          sx={styles.button}
                          type="submit"
                          endDecorator={
                            <motion.div animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                              <Create />
                            </motion.div>
                          }
                        >
                          Create Plan
                        </Button>
                      </motion.div>
                    </Box>
                  </motion.div>
                </Stack>
              </motion.div>
            </form>
          </motion.div>
        </AnimatePresence>
      </Box>
    </CssVarsProvider>
  );
}
