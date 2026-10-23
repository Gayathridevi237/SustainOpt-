// CHANGE: Replace
// C:\SustainOpt\frontend\sustainopt-frontend\src\components\dashboard\QuickActions.tsx

import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Generate Report",
            description: "Create sustainability reports",
            icon: <AssessmentOutlinedIcon />,
            path: "/reports",
        },
        {
            title: "AI Decision",
            description: "Review intelligent recommendations",
            icon: <PsychologyOutlinedIcon />,
            path: "/decision/2",
        },
        {
            title: "Digital Twin",
            description: "View operational sustainability state",
            icon: <HubOutlinedIcon />,
            path: "/digital-twin",
        },
        {
            title: "Scenario Simulation",
            description: "Explore sustainability what-if scenarios",
            icon: <PlayCircleOutlineOutlinedIcon />,
            path: "/digital-twin",
        },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                p: {
                    xs: 2.5,
                    sm: 3,
                },
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                boxShadow:
                    "0 6px 20px rgba(15, 23, 42, 0.04)",
            }}
        >
            <Box sx={{ mb: 2.5 }}>
                <Typography
                    sx={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: "#0F172A",
                    }}
                >
                    Quick Actions
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 12.5,
                        color: "#64748B",
                    }}
                >
                    Access the key sustainability decision tools
                </Typography>
            </Box>

            <Stack spacing={1.25}>
                {actions.map((action) => (
                    <Button
                        key={action.title}
                        fullWidth
                        onClick={() => navigate(action.path)}
                        sx={{
                            p: 1.5,
                            minHeight: 68,
                            borderRadius: 3,
                            justifyContent: "flex-start",
                            textAlign: "left",
                            textTransform: "none",
                            color: "#0F172A",
                            backgroundColor: "#F8FAFC",
                            border: "1px solid #F1F5F9",
                            "&:hover": {
                                backgroundColor: "#F0FDF4",
                                borderColor: "#DCFCE7",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                flexShrink: 0,
                                mr: 1.5,
                                borderRadius: 2.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#EAF6EC",
                                color: "#2E7D32",
                            }}
                        >
                            {action.icon}
                        </Box>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: 13.5,
                                    fontWeight: 750,
                                    color: "#0F172A",
                                }}
                            >
                                {action.title}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontSize: 11.5,
                                    color: "#64748B",
                                }}
                            >
                                {action.description}
                            </Typography>
                        </Box>

                        <ArrowForwardIcon
                            sx={{
                                ml: 1,
                                fontSize: 19,
                                color: "#94A3B8",
                            }}
                        />
                    </Button>
                ))}
            </Stack>
        </Paper>
    );
};

export default QuickActions;