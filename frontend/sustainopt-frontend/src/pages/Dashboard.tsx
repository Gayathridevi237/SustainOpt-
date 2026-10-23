import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ScheduleIcon from "@mui/icons-material/Schedule";
import InsightsIcon from "@mui/icons-material/Insights";
import HubIcon from "@mui/icons-material/Hub";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SpeedIcon from "@mui/icons-material/Speed";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import { getDecision } from "../api/decisionApi";
import { getMetrics } from "../api/metricsApi";

import type {
    DecisionResponse,
    PrioritizedAction,
} from "../api/decisionApi";

import type { SustainabilityMetric } from "../api/metricsApi";

import DecisionFeedback from "../components/decision/DecisionFeedback";


const Decision = () => {

    const navigate = useNavigate();

    const { metricId } = useParams();

    const parsedMetricId = Number(metricId);

    const [, setCurrentMetricId] =
        useState<number | null>(null);


    const [decision, setDecision] =
        useState<DecisionResponse | null>(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    useEffect(() => {

        let cancelled = false;

        const loadDecision = async () => {

            try {

                setLoading(true);

                setError("");

                setDecision(null);

                // Always resolve the decision metric from the
                // authenticated user's own metric list.
                const metrics = await getMetrics();

                if (!metrics || metrics.length === 0) {

                    throw new Error(
                        "No sustainability metrics are available for your account."
                    );
                }

                const validMetrics =
                    metrics.filter(
                        (metric: SustainabilityMetric) =>
                            metric.id !== undefined &&
                            metric.id !== null &&
                            Number(metric.id) > 0
                    );

                if (validMetrics.length === 0) {

                    throw new Error(
                        "No valid sustainability metric is available for your account."
                    );
                }

                // If a metric ID is supplied in the URL, use it only when
                // that metric is actually returned for the current user.
                const requestedMetric =
                    Number.isInteger(parsedMetricId) &&
                        parsedMetricId > 0
                        ? validMetrics.find(
                            (metric: SustainabilityMetric) =>
                                Number(metric.id) === parsedMetricId
                        )
                        : undefined;

                // Otherwise use the latest metric belonging to the current user.
                const latestMetric =
                    [...validMetrics].sort(
                        (a: SustainabilityMetric, b: SustainabilityMetric) =>
                            Number(b.id) - Number(a.id)
                    )[0];

                const resolvedMetricId = Number(
                    requestedMetric?.id ?? latestMetric.id
                );

                if (!resolvedMetricId || resolvedMetricId <= 0) {

                    throw new Error(
                        "A valid sustainability metric is required."
                    );
                }

                if (cancelled) {
                    return;
                }

                setCurrentMetricId(resolvedMetricId);

                console.log(
                    "Loading decision analysis for current user's metric:",
                    resolvedMetricId
                );

                const data =
                    await getDecision(resolvedMetricId);

                if (!cancelled) {
                    setDecision(data);
                }

            } catch (err: any) {

                console.error(
                    "Failed to load decision analysis:",
                    err
                );

                if (cancelled) {
                    return;
                }

                const backendMessage =
                    err?.response?.data?.message;

                if (err?.response?.status === 401) {

                    setError(
                        "Your session has expired. Please sign in again."
                    );

                } else if (err?.response?.status === 400) {

                    setError(
                        backendMessage ||
                        "Decision analysis could not be generated for your sustainability metric."
                    );

                } else if (err?.response?.status === 403) {

                    setError(
                        backendMessage ||
                        "You are not authorized to access this sustainability metric."
                    );

                } else if (err?.response?.status === 404) {

                    setError(
                        backendMessage ||
                        "No decision analysis was found for your sustainability metrics."
                    );

                } else {

                    setError(
                        backendMessage ||
                        err?.message ||
                        "Unable to load decision analysis. Please try again."
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }
        };

        loadDecision();

        return () => {
            cancelled = true;
        };

    }, [metricId]);


    const getPriorityColor = (
        score: number
    ) => {

        if (score >= 80) {
            return "#2E7D32";
        }

        if (score >= 70) {
            return "#F57C00";
        }

        return "#1976D2";
    };


    const getPriorityLabel = (
        score: number
    ) => {

        if (score >= 80) {
            return "High Priority";
        }

        if (score >= 70) {
            return "Medium Priority";
        }

        return "Recommended";
    };


    const getRelationshipColor = (
        relationship: string
    ) => {

        if (relationship === "COMPLEMENTS") {
            return "#2E7D32";
        }

        if (relationship === "CONFLICTS") {
            return "#D32F2F";
        }

        return "#1976D2";
    };


    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                <CircularProgress
                    size={42}
                    sx={{
                        color: "#2E7D32",
                    }}
                />

                <Typography
                    color="text.secondary"
                >
                    Running AMSDOA decision analysis...
                </Typography>

            </Box>
        );
    }


    if (error) {

        return (

            <Box
                sx={{
                    p: 4,
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        borderRadius: 3,
                    }}
                >
                    {error}
                </Alert>


                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    sx={{
                        mt: 3,
                    }}
                >
                    Back to Dashboard
                </Button>

            </Box>
        );
    }


    if (!decision) {
        return null;
    }


    const topAction:
        PrioritizedAction | undefined =
        decision.prioritizedActions[0];


    const score = Math.max(0, Math.min(100, decision.overallScore));
    const scoreProgress = Math.round(score);
    const actionCount = decision.prioritizedActions.length;
    const interactionCount = decision.actionInteractions.length;
    const topPriorityLabel = topAction
        ? getPriorityLabel(topAction.priorityScore)
        : "No priority action";

    return (

        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 4,
                },

                maxWidth: 1500,
                mx: "auto",
            }}
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <Box
                sx={{
                    mb: 4,
                }}
            >

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    sx={{
                        mb: 2,
                        color: "#64748B",
                        fontWeight: 600,
                    }}
                >
                    Back to Dashboard
                </Button>


                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        md: "center",
                    }}
                    flexDirection={{
                        xs: "column",
                        md: "row",
                    }}
                    gap={2}
                >

                    <Box>

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                        >

                            <AutoAwesomeIcon
                                sx={{
                                    color: "#2E7D32",
                                }}
                            />

                            <Typography
                                sx={{
                                    color: "#2E7D32",
                                    fontWeight: 700,
                                    fontSize: 14,
                                }}
                            >
                                AMSDOA DECISION ENGINE
                            </Typography>

                        </Stack>


                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: "-1px",
                                fontSize: {
                                    xs: 32,
                                    md: 42,
                                },
                            }}
                        >
                            Sustainability Decision Dashboard
                        </Typography>


                        <Typography
                            sx={{
                                mt: 1,
                                color: "#64748B",
                                maxWidth: 760,
                                fontSize: 16,
                                lineHeight: 1.7,
                            }}
                        >
                            Executive view of the latest sustainability decision analysis.
                            Review the current sustainability score, prioritized interventions,
                            action dependencies and adaptive feedback in one decision workspace.
                        </Typography>

                    </Box>


                    <Chip
                        icon={<PsychologyIcon />}
                        label="AMSDOA ACTIVE"
                        sx={{
                            px: 1,
                            py: 2.5,
                            borderRadius: 3,
                            background:
                                "linear-gradient(135deg,#E8F5E9,#F1F8E9)",
                            color: "#2E7D32",
                            fontWeight: 700,
                        }}
                    />

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.2}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<HubIcon />}
                            onClick={() => navigate("/algorithm-intelligence")}
                            sx={{
                                borderRadius: 2.5,
                                borderColor: "#C8E6C9",
                                color: "#2E7D32",
                                fontWeight: 700,
                                px: 2,
                            }}
                        >
                            Algorithm Intelligence
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/scenario-simulation")}
                            sx={{
                                borderRadius: 2.5,
                                bgcolor: "#2E7D32",
                                fontWeight: 700,
                                px: 2,
                                "&:hover": { bgcolor: "#256B2A" },
                            }}
                        >
                            Run Scenario
                        </Button>
                    </Stack>

                </Box>

            </Box>


            {/* =====================================================
                SCORE OVERVIEW
            ===================================================== */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "1.2fr 1fr 1fr 1fr",
                    },
                    gap: 3,
                    mb: 4,
                }}
            >

                {/* Overall Score */}

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #E2E8F0",
                        background:
                            "linear-gradient(135deg,#F0FDF4,#FFFFFF)",
                    }}
                >

                    <CardContent
                        sx={{
                            p: 3,
                        }}
                    >

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >

                            <Box>

                                <Typography
                                    color="text.secondary"
                                    fontWeight={600}
                                >
                                    Sustainability Score
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize: 48,
                                        fontWeight: 800,
                                        mt: 1,
                                    }}
                                >
                                    {decision.overallScore.toFixed(2)}
                                </Typography>


                                <Chip
                                    label={`Grade: ${decision.grade}`}
                                    size="small"
                                    sx={{
                                        mt: 1,
                                        bgcolor: "#E8F5E9",
                                        color: "#2E7D32",
                                        fontWeight: 700,
                                    }}
                                />

                                <Box sx={{ mt: 2.2 }}>
                                    <Stack direction="row" justifyContent="space-between" mb={0.6}>
                                        <Typography fontSize={11} color="text.secondary" fontWeight={700}>
                                            PERFORMANCE INDEX
                                        </Typography>
                                        <Typography fontSize={11} fontWeight={800}>
                                            {scoreProgress}%
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={scoreProgress}
                                        sx={{ height: 7, borderRadius: 10, bgcolor: "#E2E8F0", "& .MuiLinearProgress-bar": { bgcolor: "#2E7D32", borderRadius: 10 } }}
                                    />
                                </Box>

                            </Box>


                            <Box
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: 3,
                                    background: "#2E7D32",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >

                                <InsightsIcon
                                    sx={{
                                        fontSize: 36,
                                    }}
                                />

                            </Box>

                        </Stack>

                    </CardContent>

                </Card>


                {/* Top Priority */}

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #E2E8F0",
                        background: "#FFFFFF",
                    }}
                >

                    <CardContent
                        sx={{
                            p: 3,
                        }}
                    >

                        <Typography
                            color="text.secondary"
                            fontWeight={600}
                        >
                            Highest Priority
                        </Typography>


                        <Typography
                            sx={{
                                fontSize: 42,
                                fontWeight: 800,
                                mt: 1,
                                color:
                                    getPriorityColor(
                                        topAction?.priorityScore ?? 0
                                    ),
                            }}
                        >
                            {topAction
                                ? topAction.priorityScore.toFixed(1)
                                : "0.0"}
                        </Typography>


                        <Typography
                            sx={{
                                mt: 1,
                                fontWeight: 600,
                            }}
                        >
                            Priority Score
                        </Typography>

                    </CardContent>

                </Card>


                {/* Actions */}

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #E2E8F0",
                        background: "#FFFFFF",
                    }}
                >

                    <CardContent
                        sx={{
                            p: 3,
                        }}
                    >

                        <Typography
                            color="text.secondary"
                            fontWeight={600}
                        >
                            Optimized Initiatives
                        </Typography>


                        <Typography
                            sx={{
                                fontSize: 42,
                                fontWeight: 800,
                                mt: 1,
                                color: "#1976D2",
                            }}
                        >
                            {decision.prioritizedActions.length}
                        </Typography>


                        <Typography
                            sx={{
                                mt: 1,
                                fontWeight: 600,
                            }}
                        >
                            Sustainability Initiatives
                        </Typography>

                    </CardContent>

                </Card>

                {/* Interaction Signals */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #E2E8F0",
                        background: "#FFFFFF",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography color="text.secondary" fontWeight={600}>
                            Decision Signals
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.4 }}>
                            <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: "#F3E8FF", color: "#7B1FA2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <HubIcon />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>
                                    {interactionCount}
                                </Typography>
                                <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
                                    Action relationships
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

            </Box>


            {/* =====================================================
                TOP PRIORITY BANNER
            ===================================================== */}

            {topAction && (

                <Card
                    elevation={0}
                    sx={{
                        mb: 4,
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid #C8E6C9",
                        background:
                            "linear-gradient(135deg,#E8F5E9,#FFFFFF)",
                    }}
                >

                    <CardContent
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                        }}
                    >

                        <Stack
                            direction={{
                                xs: "column",
                                md: "row",
                            }}
                            spacing={3}
                            alignItems={{
                                xs: "flex-start",
                                md: "center",
                            }}
                        >

                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    flexShrink: 0,
                                    borderRadius: 3,
                                    bgcolor: "#2E7D32",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >

                                <TrendingUpIcon
                                    sx={{
                                        fontSize: 32,
                                    }}
                                />

                            </Box>


                            <Box
                                flex={1}
                            >

                                <Typography
                                    sx={{
                                        color: "#2E7D32",
                                        fontWeight: 800,
                                        fontSize: 13,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.8,
                                    }}
                                >
                                    Recommended Priority Action
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 750,
                                        mt: 0.5,
                                    }}
                                >
                                    {topAction.actionName}
                                </Typography>


                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        mt: 1,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {topAction.explanation}
                                </Typography>

                            </Box>


                            <Box
                                sx={{
                                    minWidth: 120,
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                    fontSize={13}
                                    fontWeight={600}
                                >
                                    Priority
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize: 32,
                                        fontWeight: 800,
                                        color:
                                            getPriorityColor(
                                                topAction.priorityScore
                                            ),
                                    }}
                                >
                                    {topAction.priorityScore.toFixed(1)}
                                </Typography>
                                <Chip
                                    size="small"
                                    label={topPriorityLabel}
                                    icon={<ArrowUpwardIcon />}
                                    sx={{ mt: 0.5, fontWeight: 700, bgcolor: `${getPriorityColor(topAction.priorityScore)}15`, color: getPriorityColor(topAction.priorityScore) }}
                                />

                            </Box>

                        </Stack>

                    </CardContent>

                </Card>

            )}


            {/* =====================================================
                PRIORITIZED ACTIONS
            ===================================================== */}

            <Box
                sx={{
                    mb: 5,
                }}
            >

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 800,
                        mb: 1,
                    }}
                >
                    Priority Action Plan
                </Typography>


                <Typography
                    color="text.secondary"
                    sx={{
                        mb: 3,
                    }}
                >
                    Actions are ordered by the backend AMSDOA decision engine so the most
                    relevant sustainability initiatives are visible first.
                </Typography>


                <Stack
                    spacing={2}
                >

                    {decision.prioritizedActions.map(
                        (
                            action: PrioritizedAction,
                            index: number
                        ) => {

                            const priorityColor =
                                getPriorityColor(
                                    action.priorityScore
                                );


                            return (

                                <Card
                                    key={`${action.actionName}-${index}`}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 4,
                                        border:
                                            "1px solid #E2E8F0",
                                        transition:
                                            "all .25s ease",

                                        "&:hover": {
                                            transform:
                                                "translateY(-3px)",
                                            boxShadow:
                                                "0 15px 35px rgba(15,23,42,.08)",
                                        },
                                    }}
                                >

                                    <CardContent
                                        sx={{
                                            p: {
                                                xs: 2.5,
                                                md: 3,
                                            },
                                        }}
                                    >

                                        <Stack
                                            direction={{
                                                xs: "column",
                                                md: "row",
                                            }}
                                            spacing={3}
                                        >

                                            {/* Number */}

                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    flexShrink: 0,
                                                    borderRadius: 2.5,
                                                    bgcolor:
                                                        `${priorityColor}15`,
                                                    color:
                                                        priorityColor,
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    fontWeight: 800,
                                                    fontSize: 18,
                                                }}
                                            >
                                                {index + 1}
                                            </Box>


                                            {/* Main */}

                                            <Box
                                                flex={1}
                                            >

                                                <Stack
                                                    direction={{
                                                        xs: "column",
                                                        sm: "row",
                                                    }}
                                                    spacing={1}
                                                    alignItems={{
                                                        xs: "flex-start",
                                                        sm: "center",
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            fontSize: 18,
                                                            fontWeight: 750,
                                                        }}
                                                    >
                                                        {action.actionName}
                                                    </Typography>


                                                    <Chip
                                                        label={getPriorityLabel(
                                                            action.priorityScore
                                                        )}
                                                        size="small"
                                                        sx={{
                                                            bgcolor:
                                                                `${priorityColor}15`,
                                                            color:
                                                                priorityColor,
                                                            fontWeight: 700,
                                                        }}
                                                    />

                                                </Stack>


                                                <Typography
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 1.5,
                                                        lineHeight: 1.65,
                                                    }}
                                                >
                                                    {action.explanation}
                                                </Typography>

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    useFlexGap
                                                    flexWrap="wrap"
                                                    sx={{ mt: 2 }}
                                                >
                                                    <Chip size="small" icon={<SpeedIcon />} label={`Utility ${action.utilityScore?.toFixed(1) ?? "—"}`} />
                                                    <Chip size="small" label={`Context ${action.contextCoefficient?.toFixed(1) ?? "—"}`} />
                                                    <Chip size="small" label={`Interaction ${action.interactionScore?.toFixed(1) ?? "—"}`} />
                                                    <Chip size="small" icon={<AutoAwesomeIcon />} label={`Feedback ${action.feedbackAdjustment?.toFixed(1) ?? "—"}`} />
                                                </Stack>

                                                <Box
                                                    sx={{
                                                        mt: 2.5,
                                                    }}
                                                >

                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        mb={0.7}
                                                    >

                                                        <Typography
                                                            fontSize={12}
                                                            color="text.secondary"
                                                            fontWeight={600}
                                                        >
                                                            Priority Score
                                                        </Typography>


                                                        <Typography
                                                            fontSize={12}
                                                            fontWeight={800}
                                                        >
                                                            {action.priorityScore.toFixed(1)}
                                                        </Typography>

                                                    </Stack>


                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.min(
                                                            action.priorityScore,
                                                            100
                                                        )}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 10,
                                                            bgcolor:
                                                                "#E2E8F0",

                                                            "& .MuiLinearProgress-bar":
                                                            {
                                                                bgcolor:
                                                                    priorityColor,
                                                                borderRadius:
                                                                    10,
                                                            },
                                                        }}
                                                    />

                                                </Box>

                                            </Box>


                                            {/* Metadata */}

                                            <Box
                                                sx={{
                                                    minWidth: {
                                                        xs: "100%",
                                                        md: 180,
                                                    },
                                                }}
                                            >

                                                <Stack
                                                    spacing={1}
                                                >

                                                    <Chip
                                                        icon={
                                                            <TrendingUpIcon />
                                                        }
                                                        label={`Impact: ${action.expectedImpact}`}
                                                        size="small"
                                                        sx={{
                                                            justifyContent:
                                                                "flex-start",
                                                            fontWeight: 600,
                                                        }}
                                                    />


                                                    <Chip
                                                        icon={
                                                            <AttachMoneyIcon />
                                                        }
                                                        label={`Cost: ${action.implementationCost}`}
                                                        size="small"
                                                        sx={{
                                                            justifyContent:
                                                                "flex-start",
                                                            fontWeight: 600,
                                                        }}
                                                    />


                                                    <Chip
                                                        icon={
                                                            <ScheduleIcon />
                                                        }
                                                        label={`Urgency: ${action.urgency}`}
                                                        size="small"
                                                        sx={{
                                                            justifyContent:
                                                                "flex-start",
                                                            fontWeight: 600,
                                                        }}
                                                    />

                                                </Stack>

                                            </Box>

                                        </Stack>

                                    </CardContent>

                                </Card>

                            );

                        }
                    )}

                </Stack>

            </Box>


            {/* =====================================================
                ACTION INTERACTIONS
            ===================================================== */}

            <Box
                sx={{
                    mb: 5,
                }}
            >

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    mb={1}
                >

                    <HubIcon
                        sx={{
                            color: "#7B1FA2",
                        }}
                    />


                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                        }}
                    >
                        Action Interaction Graph
                    </Typography>

                </Stack>


                <Typography
                    color="text.secondary"
                    sx={{
                        mb: 3,
                    }}
                >
                    AMSDOA identifies relationships between sustainability
                    initiatives to improve decision sequencing and avoid
                    conflicting actions.
                </Typography>


                {decision.actionInteractions.length === 0 ? (

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            border:
                                "1px solid #E2E8F0",
                        }}
                    >

                        <CardContent>

                            <Typography
                                color="text.secondary"
                            >
                                No action interactions were identified.
                            </Typography>

                        </CardContent>

                    </Card>

                ) : (

                    <Stack
                        spacing={2}
                    >

                        {decision.actionInteractions.map(
                            (interaction, index) => {

                                const relationshipColor =
                                    getRelationshipColor(
                                        interaction.relationshipType
                                    );


                                return (

                                    <Card
                                        key={index}
                                        elevation={0}
                                        sx={{
                                            borderRadius: 4,
                                            border:
                                                "1px solid #E2E8F0",
                                            background:
                                                "#FFFFFF",
                                        }}
                                    >

                                        <CardContent
                                            sx={{
                                                p: 3,
                                            }}
                                        >

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    md: "row",
                                                }}
                                                spacing={2}
                                                alignItems={{
                                                    xs: "flex-start",
                                                    md: "center",
                                                }}
                                            >

                                                <Box
                                                    flex={1}
                                                >

                                                    <Typography
                                                        fontWeight={700}
                                                    >
                                                        {interaction.sourceAction}
                                                    </Typography>

                                                </Box>


                                                <Box
                                                    sx={{
                                                        minWidth: 130,
                                                        textAlign: "center",
                                                    }}
                                                >

                                                    <Chip
                                                        label={
                                                            interaction.relationshipType
                                                        }
                                                        sx={{
                                                            bgcolor:
                                                                `${relationshipColor}15`,
                                                            color:
                                                                relationshipColor,
                                                            fontWeight: 800,
                                                        }}
                                                    />


                                                    <Typography
                                                        fontSize={12}
                                                        color="text.secondary"
                                                        sx={{
                                                            mt: 0.7,
                                                        }}
                                                    >
                                                        Interaction Score:{" "}
                                                        {
                                                            interaction.interactionScore
                                                        }
                                                    </Typography>

                                                </Box>


                                                <Box
                                                    flex={1}
                                                >

                                                    <Typography
                                                        fontWeight={700}
                                                    >
                                                        {interaction.targetAction}
                                                    </Typography>

                                                </Box>

                                            </Stack>

                                        </CardContent>

                                    </Card>

                                );

                            }
                        )}

                    </Stack>

                )}

            </Box>


            {/* =====================================================
                AFR FEEDBACK
            ===================================================== */}

            {topAction && (

                <Box
                    sx={{
                        mb: 5,
                    }}
                >

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            mb: 1,
                        }}
                    >

                        <AutoAwesomeIcon
                            sx={{
                                color: "#7B1FA2",
                            }}
                        />


                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                            }}
                        >
                            Adaptive Feedback Refinement
                        </Typography>

                    </Stack>


                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 3,
                            maxWidth: 850,
                            lineHeight: 1.7,
                        }}
                    >
                        Submit implementation results for the highest-priority
                        decision. The feedback is stored by the AFR module
                        and can be used to refine future sustainability
                        decision priorities.
                    </Typography>


                    <DecisionFeedback
                        metricId={decision.metricId}
                        actionName={topAction.actionName}
                    />

                </Box>

            )}


            {/* =====================================================
                DECISION WORKFLOW
            ===================================================== */}

            <Card
                elevation={0}
                sx={{
                    mb: 5,
                    borderRadius: 4,
                    border: "1px solid #E2E8F0",
                    background: "linear-gradient(135deg,#F8FAFC,#FFFFFF)",
                }}
            >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "#E8F5E9", color: "#2E7D32", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CheckCircleOutlineIcon />
                            </Box>
                            <Box>
                                <Typography fontWeight={800}>Decision workflow ready</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {actionCount} prioritized actions • {interactionCount} interaction signals • AFR feedback enabled
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <Button variant="outlined" startIcon={<HubIcon />} onClick={() => navigate("/algorithm-intelligence")} sx={{ borderRadius: 2.5, fontWeight: 700 }}>
                                Inspect Algorithm
                            </Button>
                            <Button variant="contained" startIcon={<LightbulbOutlinedIcon />} onClick={() => navigate("/scenario-simulation")} sx={{ borderRadius: 2.5, bgcolor: "#2E7D32", fontWeight: 700, "&:hover": { bgcolor: "#256B2A" } }}>
                                Test Scenario
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {/* =====================================================
                FOOTER ACTIONS
            ===================================================== */}

            <Divider
                sx={{
                    mb: 3,
                }}
            />


            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                spacing={2}
            >

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    variant="outlined"
                    sx={{
                        borderRadius: 2.5,
                        px: 3,
                        py: 1.3,
                    }}
                >
                    Back to Dashboard
                </Button>


                <Button
                    endIcon={<ArrowForwardIcon />}
                    variant="contained"
                    onClick={() =>
                        navigate(
                            "/sustainability-health"
                        )
                    }
                    sx={{
                        borderRadius: 2.5,
                        px: 3,
                        py: 1.3,
                        bgcolor: "#2E7D32",

                        "&:hover": {
                            bgcolor: "#256B2A",
                        },
                    }}
                >
                    View Sustainability Health
                </Button>

            </Stack>

        </Box>
    );
};


export default Decision;