import { useState, useEffect } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { useNavigate } from "react-router-dom";

import {
    loginUser,
} from "../services/authService";


const Login = () => {

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("sustainopt_token");
        localStorage.removeItem("sustainopt_user");
    }, []);


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleLogin = async () => {

        setError("");


        if (!email.trim() || !password.trim()) {

            setError(
                "Please enter your email and password."
            );

            return;
        }


        try {

            setLoading(true);


            const user =
                await loginUser({

                    email: email.trim(),

                    password,

                });


            /*
             * Store JWT token
             */

            localStorage.setItem(
                "sustainopt_token",
                user.token
            );


            /*
             * Store logged-in user
             */

            localStorage.setItem(
                "sustainopt_user",
                JSON.stringify(user)
            );


            /*
             * Navigate to application dashboard
             */

            navigate("/dashboard");


        } catch (error: any) {

            const message =
                error.response?.data?.message ||
                "Invalid email or password. Please try again.";

            setError(message);


        } finally {

            setLoading(false);

        }

    };


    return (

        <Box
            sx={{
                minHeight: "100vh",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                background:
                    "linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 50%, #ECFDF5 100%)",

                p: 3,
            }}
        >

            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 450,

                    p: 5,

                    borderRadius: 5,

                    border:
                        "1px solid #E5E7EB",

                    boxShadow:
                        "0 20px 50px rgba(0,0,0,0.08)",
                }}
            >

                {/* Logo */}

                <Box
                    sx={{
                        display: "flex",

                        flexDirection: "column",

                        alignItems: "center",

                        mb: 4,
                    }}
                >

                    <Box
                        sx={{
                            width: 70,
                            height: 70,

                            borderRadius: "50%",

                            bgcolor: "#2E7D32",

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            mb: 2,
                        }}
                    >

                        <EnergySavingsLeafIcon
                            sx={{
                                color: "#fff",
                                fontSize: 40,
                            }}
                        />

                    </Box>


                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="#1B5E20"
                    >
                        SustainOpt
                    </Typography>


                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Enterprise ESG Platform
                    </Typography>

                </Box>


                {/* Heading */}

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={1}
                >
                    Welcome Back
                </Typography>


                <Typography
                    color="text.secondary"
                    mb={3}
                >
                    Sign in to your sustainability
                    management platform.
                </Typography>


                {/* Error */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>

                )}


                {/* Email */}

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    disabled={loading}
                    onChange={(event) =>
                        setEmail(
                            event.target.value
                        )
                    }
                    sx={{
                        mb: 3,
                    }}
                />


                {/* Password */}

                <TextField
                    fullWidth
                    label="Password"
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={password}
                    disabled={loading}
                    onChange={(event) =>
                        setPassword(
                            event.target.value
                        )
                    }
                    onKeyDown={(event) => {

                        if (
                            event.key === "Enter"
                        ) {

                            handleLogin();

                        }

                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">

                                <IconButton
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    edge="end"
                                    disabled={loading}
                                >

                                    {showPassword
                                        ? (
                                            <VisibilityOffIcon />
                                        )
                                        : (
                                            <VisibilityIcon />
                                        )
                                    }

                                </IconButton>

                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        mb: 3,
                    }}
                />


                {/* Login Button */}

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleLogin}
                    disabled={loading}
                    startIcon={
                        loading
                            ? (
                                <CircularProgress
                                    size={20}
                                    color="inherit"
                                />
                            )
                            : (
                                <AutoAwesomeIcon />
                            )
                    }
                    sx={{
                        bgcolor: "#2E7D32",

                        borderRadius: 3,

                        py: 1.5,

                        fontWeight: "bold",

                        "&:hover": {
                            bgcolor: "#1B5E20",
                        },
                    }}
                >
                    {loading
                        ? "Signing In..."
                        : "Sign In"
                    }
                </Button>


                {/* Back to Home */}

                <Button
                    fullWidth
                    variant="text"
                    disabled={loading}
                    onClick={() =>
                        navigate("/")
                    }
                    sx={{
                        mt: 2,
                        color: "#2E7D32",
                    }}
                >
                    Back to Home
                </Button>


                {/* Footer */}

                <Typography
                    textAlign="center"
                    color="text.secondary"
                    fontSize={13}
                    mt={4}
                >
                    AMSDOA Powered Sustainability
                    Platform
                </Typography>

            </Paper>

        </Box>
    );
};


export default Login;