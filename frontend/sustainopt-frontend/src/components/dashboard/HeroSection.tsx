import {
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";

import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
    shiScore: number;
    overallScore: number;
    costSaving: number;
    topPriorityScore: number;
    scenarioAvailable: boolean;
}

const HeroSection = ({
    shiScore,
    overallScore,
    costSaving,
    topPriorityScore,
    scenarioAvailable,
}: HeroSectionProps) => {
    const navigate = useNavigate();

    return (
        <Paper
            elevation={0}
            sx={{
                position: "relative",
                overflow: "hidden",
                p: { xs: 2.5, sm: 3.5, md: 4.5 },
                borderRadius: 4,
                border: "1px solid #DCEFE1",
                background:
                    "linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 58%, #F8FAFC 100%)",
                boxShadow:
                    "0 10px 30px rgba(15, 23, 42, 0.05)",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    backgroundColor: "#DCFCE7",
                    opacity: 0.45,
                    right: -90,
                    top: -110,
                }}
            />

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={{ xs: 3, md: 5 }}
                justifyContent="space-between"
                sx={{ position: "relative", zIndex: 1 }}
            >
                <Box sx={{ maxWidth: 720 }}>
                    <Chip
                        icon={<AutoAwesomeIcon />}
                        label="AMSDOA Decision Intelligence"
                        size="small"
                        sx={{
                            mb: 2,
                            height: 30,
                            borderRadius: 2,
                            backgroundColor: "#DCFCE7",
                            color: "#166534",
                            fontSize: 11,
                            fontWeight: 800,
                            "& .MuiChip-icon": {
                                color: "#2E7D32",
                                fontSize: 16,
                            },
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: { xs: 28, sm: 34, md: 40 },
                            lineHeight: 1.12,
                            fontWeight: 850,
                            letterSpacing: "-0.035em",
                            color: "#0F172A",
                        }}
                    >
                        Sustainability decisions,
                        <Box
                            component="span"
                            sx={{
                                display: "block",
                                color: "#2E7D32",
                            }}
                        >
                            powered by intelligence.
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.75,
                            maxWidth: 650,
                            fontSize: { xs: 13, sm: 14 },
                            lineHeight: 1.7,
                            color: "#64748B",
                        }}
                    >
                        Monitor sustainability performance, understand
                        organizational health, and identify high-impact
                        improvement opportunities through the SustainOpt
                        decision framework.
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        sx={{ mt: 3 }}
                    >
                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate("/analytics")}
                            sx={{
                                minHeight: 42,
                                px: 2.5,
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontSize: 12.5,
                                fontWeight: 750,
                                backgroundColor: "#2E7D32",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#256B29",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Explore Analytics
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate("/digital-twin")
                            }
                            sx={{
                                minHeight: 42,
                                px: 2.5,
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontSize: 12.5,
                                fontWeight: 750,
                                color: "#334155",
                                borderColor: "#CBD5E1",
                                "&:hover": {
                                    borderColor: "#94A3B8",
                                    backgroundColor: "#F8FAFC",
                                },
                            }}
                        >
                            Open Digital Twin
                        </Button>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        width: { xs: "100%", md: 330 },
                        flexShrink: 0,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3.5,
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.25}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#FFF7ED",
                                    color: "#EA580C",
                                }}
                            >
                                <TrendingUpIcon />
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: "#94A3B8",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Top Priority
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.25,
                                        fontSize: 13,
                                        fontWeight: 800,
                                        color: "#0F172A",
                                    }}
                                >
                                    Decision opportunity
                                </Typography>
                            </Box>
                        </Stack>

                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: 12.5,
                                lineHeight: 1.65,
                                color: "#475569",
                            }}
                        >
                            The highest-priority sustainability
                            decision currently has a score of{" "}
                            <strong>
                                {Number(topPriorityScore).toFixed(1)}
                            </strong>
                            .
                        </Typography>

                        <Button
                            endIcon={<ArrowForwardIcon />}
                            onClick={() =>
                                navigate("/decision/2")
                            }
                            sx={{
                                mt: 1.5,
                                p: 0,
                                minWidth: 0,
                                textTransform: "none",
                                fontSize: 12,
                                fontWeight: 750,
                                color: "#2E7D32",
                                "&:hover": {
                                    backgroundColor: "transparent",
                                },
                            }}
                        >
                            Review recommendation
                        </Button>
                    </Paper>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1.25 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 1.5,
                                borderRadius: 3,
                                border: "1px solid #E2E8F0",
                            }}
                        >
                            <HealthAndSafetyOutlinedIcon
                                sx={{
                                    fontSize: 18,
                                    color: "#2E7D32",
                                }}
                            />

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 20,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                }}
                            >
                                {Number(shiScore).toFixed(1)}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 10.5,
                                    color: "#64748B",
                                }}
                            >
                                SHI
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 1.5,
                                borderRadius: 3,
                                border: "1px solid #E2E8F0",
                            }}
                        >
                            <SavingsOutlinedIcon
                                sx={{
                                    fontSize: 18,
                                    color: "#0F766E",
                                }}
                            />

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 20,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                }}
                            >
                                {Number(costSaving).toFixed(1)}%
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 10.5,
                                    color: "#64748B",
                                }}
                            >
                                Saving
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 1.5,
                                borderRadius: 3,
                                border: "1px solid #E2E8F0",
                            }}
                        >
                            <TrendingUpIcon
                                sx={{
                                    fontSize: 18,
                                    color: "#1976D2",
                                }}
                            />

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 20,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                }}
                            >
                                {Number(overallScore).toFixed(1)}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 10.5,
                                    color: "#64748B",
                                }}
                            >
                                Overall
                            </Typography>
                        </Paper>
                    </Stack>

                    <Typography
                        sx={{
                            display: "none",
                        }}
                    >
                        {scenarioAvailable ? "Available" : "Unavailable"}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

export default HeroSection;