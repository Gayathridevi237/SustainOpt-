import { useState, useEffect } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import { useNavigate } from "react-router-dom";

import {
    registerUser,
} from "../services/authService";


const Register = () => {

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("sustainopt_token");
        localStorage.removeItem("sustainopt_user");
    }, []);


    const [firstName, setFirstName] =
        useState("");

    const [lastName, setLastName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [organizationName, setOrganizationName] =
        useState("");

    const [department, setDepartment] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleRegister = async () => {

        setError("");
        setSuccess("");


        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword ||
            !organizationName.trim() ||
            !department.trim()
        ) {

            setError(
                "Please complete all required fields."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        try {

            setLoading(true);


            await registerUser({

                firstName:
                    firstName.trim(),

                lastName:
                    lastName.trim(),

                email:
                    email.trim(),

                password,

                organizationName:
                    organizationName.trim(),

                department:
                    department.trim(),

                role: "ANALYST",

            });


            setSuccess(
                "Account created successfully. Redirecting to login..."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1200);


        } catch (error: any) {

            console.error(
                "Registration failed:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Unable to create account. Please try again.";

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
                    maxWidth: 560,

                    p: {
                        xs: 3,
                        sm: 5,
                    },

                    borderRadius: 5,

                    border:
                        "1px solid #E5E7EB",

                    boxShadow:
                        "0 20px 50px rgba(0,0,0,0.08)",
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

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


                {/* =================================================
                    TITLE
                ================================================= */}

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={1}
                >
                    Create Your Account
                </Typography>


                <Typography
                    color="text.secondary"
                    mb={3}
                >
                    Set up your organization profile to begin
                    managing sustainability performance.
                </Typography>


                {/* =================================================
                    ALERTS
                ================================================= */}

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


                {success && (

                    <Alert
                        severity="success"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
                    >
                        {success}
                    </Alert>

                )}


                {/* =================================================
                    NAME
                ================================================= */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                        },

                        gap: 2,

                        mb: 2,
                    }}
                >

                    <TextField
                        fullWidth
                        label="First Name"
                        value={firstName}
                        disabled={loading}
                        onChange={(event) =>
                            setFirstName(
                                event.target.value
                            )
                        }
                    />


                    <TextField
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        disabled={loading}
                        onChange={(event) =>
                            setLastName(
                                event.target.value
                            )
                        }
                    />

                </Box>


                {/* =================================================
                    EMAIL
                ================================================= */}

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
                        mb: 2,
                    }}
                />


                {/* =================================================
                    ORGANIZATION
                ================================================= */}

                <TextField
                    fullWidth
                    label="Organization Name"
                    value={organizationName}
                    disabled={loading}
                    onChange={(event) =>
                        setOrganizationName(
                            event.target.value
                        )
                    }
                    sx={{
                        mb: 2,
                    }}
                />


                {/* =================================================
                    DEPARTMENT
                ================================================= */}

                <TextField
                    fullWidth
                    label="Department"
                    placeholder="e.g. Sustainability, Operations, Finance"
                    value={department}
                    disabled={loading}
                    onChange={(event) =>
                        setDepartment(
                            event.target.value
                        )
                    }
                    sx={{
                        mb: 2,
                    }}
                />


                {/* =================================================
                    PASSWORD
                ================================================= */}

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
                        mb: 2,
                    }}
                />


                {/* =================================================
                    CONFIRM PASSWORD
                ================================================= */}

                <TextField
                    fullWidth
                    label="Confirm Password"
                    type={
                        showConfirmPassword
                            ? "text"
                            : "password"
                    }
                    value={confirmPassword}
                    disabled={loading}
                    onChange={(event) =>
                        setConfirmPassword(
                            event.target.value
                        )
                    }
                    onKeyDown={(event) => {

                        if (
                            event.key === "Enter"
                        ) {

                            handleRegister();

                        }

                    }}
                    InputProps={{
                        endAdornment: (

                            <InputAdornment position="end">

                                <IconButton
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    edge="end"
                                    disabled={loading}
                                >

                                    {showConfirmPassword
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


                {/* =================================================
                    REGISTER BUTTON
                ================================================= */}

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleRegister}
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
                                <PersonAddAltIcon />
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
                        ? "Creating Account..."
                        : "Create Account"
                    }
                </Button>


                {/* =================================================
                    LOGIN
                ================================================= */}

                <Button
                    fullWidth
                    variant="text"
                    disabled={loading}
                    onClick={() =>
                        navigate("/login")
                    }
                    sx={{
                        mt: 2,
                        color: "#2E7D32",
                    }}
                >
                    Already have an account? Sign In
                </Button>


                {/* =================================================
                    HOME
                ================================================= */}

                <Button
                    fullWidth
                    variant="text"
                    disabled={loading}
                    onClick={() =>
                        navigate("/")
                    }
                    sx={{
                        mt: 0.5,
                        color: "#64748B",
                    }}
                >
                    Back to Home
                </Button>


                <Typography
                    textAlign="center"
                    color="text.secondary"
                    fontSize={13}
                    mt={4}
                >
                    AMSDOA Powered Sustainability Platform
                </Typography>

            </Paper>

        </Box>
    );
};


export default Register;