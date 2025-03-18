"use client";
import * as React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { loginManager } from "@/src/store/authSlice";

const customTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        mode: "dark",
      },
    },
  },
});

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persistent, setPersistent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fix validation errors.");
      return;
    }
    const result = await dispatch(loginManager({ email, password }));
    if (loginManager.fulfilled.match(result)) {
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } else {
      toast.error("Login failed.");
    }
  };

  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange defaultColorScheme="dark">
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s",
          },
        }}
      />
      <Box
        sx={{
          width: { xs: "100%", md: "50vw" },
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(19 19 24 / 0.4)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100dvh", width: "100%", px: 2 }}>
          <Box component="header" sx={{ py: 3, display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <Typography level="title-lg">Admin</Typography>
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
            }}
          >
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Typography component="h1" level="h3">
                Sign in
              </Typography>
            </Stack>
            <Divider sx={{ color: "text.tertiary" }}>or</Divider>
            <Stack sx={{ gap: 4, mt: 2 }}>
              {isAuthenticated && user ? (
                <Box sx={{ padding: 2, backgroundColor: "#000000", borderRadius: 1, textAlign: "center" }}>
                  <Typography level="body-lg">
                    Logged in as: {user.email ? user.email : user.username}
                  </Typography>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <FormControl required error={Boolean(errors.email)}>
                    <FormLabel>
                      Email{" "}
                      {errors.email && (
                        <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.email}</span>
                      )}
                    </FormLabel>
                    <Input
                      type="email"
                      name="email"
                      size="lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <FormControl required error={Boolean(errors.password)}>
                    <FormLabel>
                      Password{" "}
                      {errors.password && (
                        <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.password}</span>
                      )}
                    </FormLabel>
                    <Input
                      type="password"
                      name="password"
                      size="lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                  <Stack sx={{ gap: 4, mt: 2 }}>
                    <Checkbox
                      size="sm"
                      label="Remember me"
                      name="persistent"
                      checked={persistent}
                      onChange={(e) => setPersistent(e.target.checked)}
                    />
                    <Button
  type="submit"
  fullWidth
  size="lg"
  sx={{
    backgroundColor: "red",
    color: "white",
    "&:hover": {
      backgroundColor: "darkred",
    },
  }}
>
  Sign in
</Button>


                  </Stack>
                </form>
              )}
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: "center" }}>
              © Ascension Wave {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Box
        sx={{
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition: "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: 'url(/frontpage.jpg)',
        }}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </CssVarsProvider>
  );
}
