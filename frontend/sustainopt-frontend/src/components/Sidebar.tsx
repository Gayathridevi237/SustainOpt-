import {
    Avatar,
    Box,
    Chip,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import HubIcon from "@mui/icons-material/Hub";
import TimelineIcon from "@mui/icons-material/Timeline";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InsightsIcon from "@mui/icons-material/Insights";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

const mainMenu = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        path: "/dashboard",
    },
    {
        title: "Organization",
        icon: <BusinessIcon />,
        path: "/organization",
    },
    {
        title: "Metrics",
        icon: <AssessmentIcon />,
        path: "/metrics",
    },
];

const aiModules = [
    {
        title: "Sustainability Health",
        icon: <EnergySavingsLeafIcon />,
        path: "/sustainability-health",
    },
    {
        title: "Algorithm Intelligence",
        icon: <AccountTreeOutlinedIcon />,
        path: "/algorithm-intelligence",
    },
    {
        title: "Digital Twin",
        icon: <HubIcon />,
        path: "/digital-twin",
    },
    {
        title: "Scenario Simulation",
        icon: <TimelineIcon />,
        path: "/scenario-simulation",
    },
    {
        title: "Decision Engine",
        icon: <PsychologyIcon />,
        path: "/decision/2",
    },
];

const reports = [
    {
        title: "Analytics",
        icon: <InsightsIcon />,
        path: "/analytics",
    },
    {
        title: "Reports",
        icon: <DescriptionIcon />,
        path: "/reports",
    },
    {
        title: "Settings",
        icon: <SettingsIcon />,
        path: "",
        disabled: true,
    },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <Box
            sx={{
                width: 310,
                bgcolor: "#F8FAFC",
                borderRight: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            {/* Logo */}

            <Box
                sx={{
                    p: 3,
                    background:
                        "linear-gradient(135deg,#0F9D58,#2E7D32,#43A047)",
                    color: "#fff",
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <Avatar
                        sx={{
                            bgcolor: "#fff",
                            color: "#2E7D32",
                            width: 60,
                            height: 60,
                        }}
                    >
                        <EnergySavingsLeafIcon fontSize="large" />
                    </Avatar>

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            SustainOpt
                        </Typography>

                        <Typography
                            fontSize={14}
                            sx={{
                                opacity: 0.9,
                            }}
                        >
                            Enterprise ESG Platform
                        </Typography>
                    </Box>
                </Stack>

                <Chip
                    icon={<AutoAwesomeIcon />}
                    label="AMSDOA AI Enabled"
                    sx={{
                        mt: 3,
                        bgcolor: "rgba(255,255,255,.18)",
                        color: "#fff",
                        fontWeight: "bold",
                    }}
                />
            </Box>

            <Divider />

            {/* MAIN */}

            <Box
                sx={{
                    px: 2,
                    mt: 3,
                }}
            >
                <Typography
                    fontWeight="bold"
                    color="#64748B"
                    mb={2}
                >
                    MAIN
                </Typography>

                <List>
                    {mainMenu.map((item) => {
                        const active =
                            location.pathname === item.path;

                        return (
                            <ListItemButton
                                key={item.title}
                                component={Link}
                                to={item.path}
                                sx={{
                                    borderRadius: 4,
                                    mb: 1,

                                    bgcolor: active
                                        ? "#2E7D32"
                                        : "transparent",

                                    color: active
                                        ? "#fff"
                                        : "#334155",

                                    transition: ".3s",

                                    "&:hover": {
                                        bgcolor: active
                                            ? "#1B5E20"
                                            : "#EEF7F1",

                                        transform:
                                            "translateX(6px)",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: active
                                            ? "#fff"
                                            : "#2E7D32",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.title}
                                />

                                {active && (
                                    <ArrowForwardIosIcon
                                        sx={{
                                            fontSize: 14,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>

            {/* AI MODULES */}

            <Box
                sx={{
                    px: 2,
                    mt: 2,
                }}
            >
                <Typography
                    fontWeight="bold"
                    color="#64748B"
                    mb={2}
                >
                    AI MODULES
                </Typography>

                <List>
                    {aiModules.map((item) => {
                        const active =
                            location.pathname === item.path;

                        return (
                            <ListItemButton
                                key={item.title}
                                component={Link}
                                to={item.path}
                                sx={{
                                    borderRadius: 4,
                                    mb: 1,

                                    bgcolor: active
                                        ? "#2E7D32"
                                        : "transparent",

                                    color: active
                                        ? "#fff"
                                        : "#334155",

                                    transition: ".3s",

                                    "&:hover": {
                                        bgcolor: active
                                            ? "#1B5E20"
                                            : "#EEF7F1",

                                        transform:
                                            "translateX(6px)",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: active
                                            ? "#fff"
                                            : "#2E7D32",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.title}
                                />

                                {active && (
                                    <ArrowForwardIosIcon
                                        sx={{
                                            fontSize: 14,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>

            {/* REPORTS */}

            <Box
                sx={{
                    px: 2,
                    mt: 2,
                }}
            >
                <Typography
                    fontWeight="bold"
                    color="#64748B"
                    mb={2}
                >
                    REPORTS
                </Typography>

                <List>
                    {reports.map((item) => {
                        const active =
                            item.path !== "" &&
                            location.pathname === item.path;

                        return (
                            <ListItemButton
                                key={item.title}
                                component={
                                    item.disabled
                                        ? "div"
                                        : Link
                                }
                                to={
                                    item.disabled
                                        ? undefined
                                        : item.path
                                }
                                disabled={item.disabled}
                                sx={{
                                    borderRadius: 4,
                                    mb: 1,

                                    bgcolor: active
                                        ? "#2E7D32"
                                        : "transparent",

                                    color: active
                                        ? "#fff"
                                        : "#334155",

                                    transition: ".3s",

                                    "&:hover": {
                                        bgcolor: active
                                            ? "#1B5E20"
                                            : "#EEF7F1",

                                        transform:
                                            item.disabled
                                                ? "none"
                                                : "translateX(6px)",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: active
                                            ? "#fff"
                                            : "#2E7D32",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.title}
                                />

                                {active && (
                                    <ArrowForwardIosIcon
                                        sx={{
                                            fontSize: 14,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>

            <Box flexGrow={1} />

            {/* Workspace */}

            <Box
                px={2}
                pb={2}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 4,
                        mb: 2,
                        background:
                            "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
                        border: "1px solid #BBF7D0",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <Avatar
                            sx={{
                                bgcolor: "#2E7D32",
                            }}
                        >
                            <AccountTreeIcon />
                        </Avatar>

                        <Box>
                            <Typography
                                fontWeight="bold"
                            >
                                Enterprise Workspace
                            </Typography>

                            <Typography
                                fontSize={13}
                                color="text.secondary"
                            >
                                Active Organization
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* User */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 4,
                        border: "1px solid #E5E7EB",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <Avatar
                            sx={{
                                width: 55,
                                height: 55,
                                bgcolor: "#2E7D32",
                            }}
                        >
                            G
                        </Avatar>

                        <Box>
                            <Typography
                                fontWeight="bold"
                            >
                                Gayathri Devi
                            </Typography>

                            <Typography
                                fontSize={13}
                                color="text.secondary"
                            >
                                Sustainability Manager
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
};

export default Sidebar;