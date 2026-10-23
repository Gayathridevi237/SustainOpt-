import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

interface RecommendationCardProps {
    recommendation?: string;
    metricId?: number;
}

const RecommendationCard = ({
    recommendation = "Review current sustainability metrics and prioritize the highest-impact improvement opportunity.",
    metricId = 2,
}: RecommendationCardProps) => {
    const navigate = useNavigate();

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
                                backgroundColor: "#F3E8FF",
                                color: "#7B1FA2",
                            }}
                        >
                            <AutoAwesomeIcon />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 16,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                }}
                            >
                                AI Recommendation
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontSize: 11.5,
                                    color: "#64748B",
                                }}
                            >
                                Intelligent sustainability guidance
                            </Typography>
                        </Box>
                    </Stack>

                    <Box
                        sx={{
                            px: 1.25,
                            py: 0.6,
                            borderRadius: 2,
                            backgroundColor: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                color: "#64748B",
                            }}
                        >
                            AMSDOA
                        </Typography>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: "#FAF5FF",
                        border: "1px solid #F3E8FF",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            lineHeight: 1.7,
                            color: "#475569",
                        }}
                    >
                        {recommendation}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(`/decision/${metricId}`)}
                    sx={{
                        alignSelf: "flex-start",
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: 12.5,
                        borderColor: "#DDD6FE",
                        color: "#6B21A8",
                        "&:hover": {
                            borderColor: "#C4B5FD",
                            backgroundColor: "#FAF5FF",
                        },
                    }}
                >
                    Review Decision
                </Button>
            </Stack>
        </Paper>
    );
};

export default RecommendationCard;