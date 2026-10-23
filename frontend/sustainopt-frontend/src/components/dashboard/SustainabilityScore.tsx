// CHANGE: Replace
// C:\SustainOpt\frontend\sustainopt-frontend\src\components\dashboard\SustainabilityScore.tsx

import {
    Paper,
    Typography,
    Box,
    CircularProgress,
    Stack,
    Chip,
} from "@mui/material";

import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface SustainabilityScoreProps {
    score: number;
    status: string;
    grade: string;
}

const SustainabilityScore = ({
    score,
    status,
    grade,
}: SustainabilityScoreProps) => {
    const safeScore = Number.isFinite(score)
        ? Math.max(0, Math.min(100, score))
        : 0;

    const statusLabel = status || "Not Available";
    const gradeLabel = grade || "-";

    const getStatus = () => {
        if (safeScore >= 75) return "Healthy";
        if (safeScore >= 60) return "Moderate";
        if (safeScore >= 40) return "Needs Attention";
        return "Critical";
    };

    const displayStatus =
        status && status.trim().length > 0
            ? status
            : getStatus();

    return (
        <Paper
            elevation={0}
            sx={{
                p: {
                    xs: 2.5,
                    sm: 3,
                    md: 3.5,
                },
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                height: "100%",
                boxShadow:
                    "0 6px 20px rgba(15, 23, 42, 0.04)",
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 17,
                            fontWeight: 800,
                            color: "#0F172A",
                        }}
                    >
                        Sustainability Health Index
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 12,
                            color: "#64748B",
                        }}
                    >
                        Current organizational sustainability health
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#F0FDF4",
                        color: "#2E7D32",
                    }}
                >
                    <EnergySavingsLeafIcon />
                </Box>
            </Stack>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 3,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        display: "inline-flex",
                    }}
                >
                    <CircularProgress
                        variant="determinate"
                        value={safeScore}
                        size={175}
                        thickness={5}
                        sx={{
                            color: "#2E7D32",
                            "& .MuiCircularProgress-circle": {
                                strokeLinecap: "round",
                            },
                        }}
                    />

                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={175}
                        thickness={5}
                        sx={{
                            color: "#E2E8F0",
                            position: "absolute",
                            left: 0,
                            zIndex: -1,
                        }}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 38,
                                fontWeight: 800,
                                lineHeight: 1,
                                color: "#0F172A",
                                letterSpacing: "-0.03em",
                            }}
                        >
                            {safeScore.toFixed(1)}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.75,
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#94A3B8",
                            }}
                        >
                            OUT OF 100
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Stack
                direction="row"
                justifyContent="center"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
            >
                <Chip
                    icon={
                        <EnergySavingsLeafIcon
                            sx={{
                                fontSize: "17px !important",
                            }}
                        />
                    }
                    label={displayStatus}
                    sx={{
                        height: 32,
                        borderRadius: 2,
                        backgroundColor: "#F0FDF4",
                        color: "#166534",
                        border: "1px solid #DCFCE7",
                        fontSize: 12,
                        fontWeight: 700,
                        "& .MuiChip-icon": {
                            color: "#2E7D32",
                        },
                    }}
                />

                <Chip
                    icon={
                        <CheckCircleIcon
                            sx={{
                                fontSize: "17px !important",
                            }}
                        />
                    }
                    label={`Grade ${statusLabel ? gradeLabel : "-"}`}
                    sx={{
                        height: 32,
                        borderRadius: 2,
                        backgroundColor: "#F8FAFC",
                        color: "#475569",
                        border: "1px solid #E2E8F0",
                        fontSize: 12,
                        fontWeight: 700,
                        "& .MuiChip-icon": {
                            color: "#64748B",
                        },
                    }}
                />
            </Stack>

            <Box
                sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                }}
            >
                <Typography
                    sx={{
                        fontSize: 12.5,
                        color: "#64748B",
                        lineHeight: 1.65,
                    }}
                >
                    The Sustainability Health Index summarizes
                    the organization's current sustainability
                    condition using available sustainability
                    metrics.
                </Typography>
            </Box>
        </Paper>
    );
};

export default SustainabilityScore;