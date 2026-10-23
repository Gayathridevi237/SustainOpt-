import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

interface TopPriorityCardProps {
    action?: string;
    score?: number;
    metricId?: number;
}

const TopPriorityCard = ({
    action = "Review the highest-impact sustainability improvement opportunity.",
    score = 0,
    metricId = 2,
}: TopPriorityCardProps) => {
    const navigate = useNavigate();

    const safeScore = Number.isFinite(score) ? score : 0;

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
                height: "100%",
            }}
        >
            <Stack spacing={2.5}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FFF7ED",
                                color: "#EA580C",
                            }}
                        >
                            <PriorityHighRoundedIcon />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 16,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                }}
                            >
                                Top Decision Priority
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontSize: 11.5,
                                    color: "#64748B",
                                }}
                            >
                                Highest-impact action identified
                            </Typography>
                        </Box>
                    </Stack>

                    <Box
                        sx={{
                            px: 1.25,
                            py: 0.6,
                            borderRadius: 2,
                            backgroundColor: "#FFF7ED",
                            border: "1px solid #FED7AA",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                color: "#C2410C",
                            }}
                        >
                            PRIORITY
                        </Typography>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #F1F5F9",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            lineHeight: 1.65,
                            color: "#334155",
                        }}
                    >
                        {action}
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                            }}
                        >
                            Decision Score
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: 22,
                                fontWeight: 800,
                                color: "#0F172A",
                            }}
                        >
                            {safeScore.toFixed(1)}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() =>
                            navigate(`/decision/${metricId}`)
                        }
                        sx={{
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 12,
                            backgroundColor: "#0F766E",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#115E59",
                                boxShadow: "none",
                            },
                        }}
                    >
                        View Decision
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default TopPriorityCard;