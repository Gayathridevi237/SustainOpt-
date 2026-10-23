
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Chip,
    LinearProgress,
    Stack,
    Alert,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

import { useEffect, useState } from "react";

import { calculateSustainabilityHealth } from "../api/sustainabilityHealthApi";

import type {
    SustainabilityHealthIndexResponse,
} from "../api/sustainabilityHealthApi";

function SustainabilityHealth() {
    const [data, setData] =
        useState<SustainabilityHealthIndexResponse | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const organizationId = 1;

    const loadHealthIndex = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await calculateSustainabilityHealth(
                organizationId
            );

            setData(result);
        } catch (err) {
            console.error("Sustainability Health API Error:", err);

            setError(
                "Unable to calculate the Sustainability Health Index."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadHealthIndex();
    }, []);

    const score = data?.score ?? 0;

    let scoreLabel = "Awaiting calculation";
    let scoreColor = "#64748B";
    let ScoreIcon = HealthAndSafetyIcon;

    if (data) {
        if (score >= 90) {
            scoreLabel = "Excellent";
            scoreColor = "#2E7D32";
            ScoreIcon = CheckCircleIcon;
        } else if (score >= 75) {
            scoreLabel = "Good";
            scoreColor = "#388E3C";
            ScoreIcon = TrendingUpIcon;
        } else if (score >= 60) {
            scoreLabel = "Moderate";
            scoreColor = "#B77900";
            ScoreIcon = WarningIcon;
        } else if (score >= 40) {
            scoreLabel = "Needs Improvement";
            scoreColor = "#E65100";
            ScoreIcon = WarningIcon;
        } else {
            scoreLabel = "Critical";
            scoreColor = "#C62828";
            ScoreIcon = WarningIcon;
        }
    }

    const statusBackgroundColor = !data
        ? "#F1F5F9"
        : data.status === "Excellent" || data.status === "Good"
          ? "#E8F5E9"
          : data.status === "Moderate"
            ? "#FFF8E1"
            : data.status === "Needs Improvement"
              ? "#FFF3E0"
              : data.status === "Critical"
                ? "#FFEBEE"
                : "#F1F5F9";

    const statusTextColor = !data
        ? "#64748B"
        : data.status === "Excellent" || data.status === "Good"
          ? "#2E7D32"
          : data.status === "Moderate"
            ? "#8D6E00"
            : data.status === "Needs Improvement"
              ? "#E65100"
              : data.status === "Critical"
                ? "#C62828"
                : "#64748B";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F5F8FA",
                p: { xs: 2, md: 4 },
            }}
        >
            {/* PAGE HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        Sustainability Health
                    </Typography>

                    <Typography color="text.secondary">
                        Monitor the organization's overall sustainability
                        performance.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={loadHealthIndex}
                    disabled={loading}
                    sx={{
                        backgroundColor: "#2E7D32",
                        borderRadius: 3,
                        textTransform: "none",
                        px: 3,
                        py: 1.2,
                        "&:hover": {
                            backgroundColor: "#1B5E20",
                        },
                    }}
                >
                    {loading ? "Calculating..." : "Recalculate"}
                </Button>
            </Box>

            {/* ERROR */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* TOP CARDS */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1.2fr 1fr 1fr",
                    },
                    gap: 3,
                    mb: 3,
                }}
            >
                {/* SHI SCORE */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        border: "1px solid #DDE5E0",
                        background:
                            "linear-gradient(135deg,#F0FDF4,#FFFFFF)",
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <Box>
                            <Typography
                                color="text.secondary"
                                fontWeight={600}
                                mb={1}
                            >
                                Sustainability Health Index
                            </Typography>

                            {loading ? (
                                <CircularProgress
                                    size={45}
                                    sx={{
                                        color: "#2E7D32",
                                        mt: 2,
                                    }}
                                />
                            ) : (
                                <Typography
                                    sx={{
                                        fontSize: 58,
                                        fontWeight: 700,
                                        color: scoreColor,
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {data ? data.score.toFixed(2) : "--"}
                                </Typography>
                            )}

                            <Typography
                                color="text.secondary"
                                mt={1}
                            >
                                Score out of 100
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                width: 58,
                                height: 58,
                                borderRadius: 3,
                                backgroundColor: "#2E7D32",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <HealthAndSafetyIcon />
                        </Box>
                    </Stack>

                    <Box mt={3}>
                        <LinearProgress
                            variant="determinate"
                            value={Math.max(0, Math.min(score, 100))}
                            sx={{
                                height: 9,
                                borderRadius: 10,
                                backgroundColor: "#DCFCE7",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: scoreColor,
                                    borderRadius: 10,
                                },
                            }}
                        />
                    </Box>
                </Paper>

                {/* STATUS */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        border: "1px solid #E1E5E8",
                    }}
                >
                    <Typography
                        color="text.secondary"
                        fontWeight={600}
                        mb={2}
                    >
                        Health Status
                    </Typography>

                    <Chip
                        label={data ? data.status : "Awaiting calculation"}
                        icon={data ? <ScoreIcon /> : undefined}
                        sx={{
                            fontWeight: 700,
                            fontSize: 15,
                            px: 1,
                            py: 2.5,
                            backgroundColor: statusBackgroundColor,
                            color: statusTextColor,
                            "& .MuiChip-icon": {
                                color: statusTextColor,
                            },
                        }}
                    />

                    <Typography
                        color="text.secondary"
                        mt={3}
                    >
                        Current assessment:
                    </Typography>

                    <Typography
                        fontWeight={700}
                        fontSize={20}
                        mt={0.5}
                        sx={{ color: scoreColor }}
                    >
                        {data ? data.status : scoreLabel}
                    </Typography>
                </Paper>

                {/* ORGANIZATION */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        border: "1px solid #E1E5E8",
                    }}
                >
                    <Typography
                        color="text.secondary"
                        fontWeight={600}
                        mb={2}
                    >
                        Organization
                    </Typography>

                    <Typography
                        fontSize={38}
                        fontWeight={700}
                        color="#2E7D32"
                    >
                        #{organizationId}
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={1}
                    >
                        Organization ID
                    </Typography>

                    {data && (
                        <Typography
                            color="text.secondary"
                            fontSize={13}
                            mt={3}
                        >
                            Last calculated:
                            <br />
                            {new Date(data.calculatedAt).toLocaleString()}
                        </Typography>
                    )}
                </Paper>
            </Box>

            {/* PERFORMANCE SUMMARY */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    border: "1px solid #E1E5E8",
                    mb: 3,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={1}
                >
                    Sustainability Performance
                </Typography>

                <Typography
                    color="text.secondary"
                    mb={4}
                >
                    The Sustainability Health Index provides an overall view
                    of the organization's sustainability condition.
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 3,
                    }}
                >
                    {/* ENVIRONMENTAL */}
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: "#F0FDF4",
                        }}
                    >
                        <Typography
                            fontWeight={700}
                            mb={1}
                        >
                            Environmental
                        </Typography>

                        <Typography
                            color="text.secondary"
                            fontSize={14}
                        >
                            Energy consumption, water usage, waste and carbon
                            emissions.
                        </Typography>
                    </Box>

                    {/* RESOURCE EFFICIENCY */}
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: "#EFF6FF",
                        }}
                    >
                        <Typography
                            fontWeight={700}
                            mb={1}
                        >
                            Resource Efficiency
                        </Typography>

                        <Typography
                            color="text.secondary"
                            fontSize={14}
                        >
                            Measures how efficiently organizational resources
                            are being utilized.
                        </Typography>
                    </Box>

                    {/* IMPROVEMENT AREAS */}
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: "#FFF7ED",
                        }}
                    >
                        <Typography
                            fontWeight={700}
                            mb={1}
                        >
                            Improvement Areas
                        </Typography>

                        <Typography
                            color="text.secondary"
                            fontSize={14}
                        >
                            Identifies sustainability areas requiring
                            additional attention.
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* ABOUT SHI */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    border: "1px solid #E1E5E8",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2}
                >
                    About the Sustainability Health Index
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ lineHeight: 1.8 }}
                >
                    The Sustainability Health Index provides an overall
                    assessment of the organization's sustainability condition
                    using available sustainability metrics. The score supports
                    subsequent recommendation and decision-making processes.
                </Typography>

                {data && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 3,
                            backgroundColor: "#F8FAFC",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            The current health index was calculated using
                            Organization ID {data.organizationId}.
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default SustainabilityHealth;
