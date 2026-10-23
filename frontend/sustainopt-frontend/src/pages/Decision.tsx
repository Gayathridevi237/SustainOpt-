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

import { getDecision } from "../api/decisionApi";
import { getMetrics } from "../api/metricsApi";
import type { SustainabilityMetric } from "../api/metricsApi";

import type {
    DecisionResponse,
    PrioritizedAction,
} from "../api/decisionApi";

import DecisionFeedback from "../components/decision/DecisionFeedback";


const Decision = () => {

    const navigate = useNavigate();

    const { metricId } = useParams();

    const parsedMetricId = Number(metricId);

    const [currentMetricId, setCurrentMetricId] =
        useState<number | null>(null);

    const [decision, setDecision] =
        useState<DecisionResponse | null>(null);

    const [selectedActionName, setSelectedActionName] =
        useState<string>("");


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    /*
     * ============================================================
     * LOAD DECISION
     * ============================================================
     */

    useEffect(() => {

        let cancelled = false;

        const loadDecision = async () => {

            try {

                setLoading(true);
                setError("");
                setDecision(null);

                /*
                 * Resolve the decision metric from the authenticated user's
                 * metric list. A URL metric ID is used only when it is
                 * actually present in that user's metrics.
                 */
                const metrics = await getMetrics();

                if (!metrics || metrics.length === 0) {
                    throw new Error(
                        "No sustainability metrics are available for your account."
                    );
                }

                const validMetrics = metrics.filter(
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

                const requestedMetric =
                    Number.isInteger(parsedMetricId) &&
                        parsedMetricId > 0
                        ? validMetrics.find(
                            (metric: SustainabilityMetric) =>
                                Number(metric.id) === parsedMetricId
                        )
                        : undefined;

                /*
                 * Use the requested metric only if it came from the current
                 * user's /metrics response. Otherwise use the latest metric
                 * returned for the current user.
                 */
                const latestMetric = [...validMetrics].sort(
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

                if (!cancelled) {
                    setCurrentMetricId(resolvedMetricId);
                }

                console.log(
                    "Loading decision analysis for current user's metric:",
                    resolvedMetricId
                );

                const data = await getDecision(resolvedMetricId);

                if (!cancelled) {
                    setDecision(data);

                    setSelectedActionName(
                        data.prioritizedActions?.[0]?.actionName ?? ""
                    );
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

                if (err?.response?.status === 400) {

                    setError(
                        backendMessage ||
                        "Decision analysis could not be generated for the selected sustainability metric."
                    );

                } else if (err?.response?.status === 401) {

                    setError(
                        "Your session has expired. Please sign in again."
                    );

                } else if (err?.response?.status === 403) {

                    setError(
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


    /*
     * ============================================================
     * PRIORITY HELPERS
     * ============================================================
     */

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


    /*
     * ============================================================
     * LOADING STATE
     * ============================================================
     */

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

                <Typography
                    color="text.secondary"
                    fontSize={13}
                >
                    Resolving your latest available sustainability metric...
                </Typography>

            </Box>

        );

    }


    /*
     * ============================================================
     * ERROR STATE
     * ============================================================
     */

    if (error) {

        return (

            <Box
                sx={{
                    p: {
                        xs: 2,
                        md: 4,
                    },

                    maxWidth: 1000,
                    mx: "auto",
                }}
            >

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #FECACA",
                        background: "#FFF7F7",
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

                        <Alert
                            severity="error"
                            sx={{
                                borderRadius: 3,
                                mb: 3,
                            }}
                        >
                            {error}
                        </Alert>


                        <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{
                                mb: 1,
                            }}
                        >
                            Decision analysis unavailable
                        </Typography>


                        <Typography
                            color="text.secondary"
                            sx={{
                                lineHeight: 1.7,
                            }}
                        >
                            The application could not generate decision
                            intelligence for sustainability metric #
                            {currentMetricId}. Please return to the
                            dashboard and select an available metric.
                        </Typography>


                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                            sx={{
                                mt: 3,
                            }}
                        >

                            <Button
                                startIcon={
                                    <ArrowBackIcon />
                                }
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                                variant="outlined"
                                sx={{
                                    borderRadius: 2.5,
                                }}
                            >
                                Back to Dashboard
                            </Button>


                            <Button
                                variant="contained"
                                onClick={() =>
                                    window.location.reload()
                                }
                                sx={{
                                    borderRadius: 2.5,
                                    bgcolor: "#2E7D32",

                                    "&:hover": {
                                        bgcolor: "#256B2A",
                                    },
                                }}
                            >
                                Retry Analysis
                            </Button>

                        </Stack>

                    </CardContent>

                </Card>

            </Box>

        );

    }


    /*
     * ============================================================
     * SAFETY CHECK
     * ============================================================
     */

    if (!decision) {

        return (

            <Box
                sx={{
                    p: 4,
                }}
            >

                <Alert
                    severity="warning"
                    sx={{
                        borderRadius: 3,
                    }}
                >
                    No decision analysis data is available.
                </Alert>

            </Box>

        );

    }


    /*
     * ============================================================
     * TOP ACTION
     * ============================================================
     */

    const topAction:
        PrioritizedAction | undefined =
        decision.prioritizedActions?.[0];

    const selectedAction:
        PrioritizedAction | undefined =
        decision.prioritizedActions?.find(
            (action) =>
                action.actionName === selectedActionName
        ) ?? topAction;


    /*
     * ============================================================
     * MAIN UI
     * ============================================================
     */

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
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={() =>
                        navigate("/dashboard")
                    }
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
                            Sustainability Decisions
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
                            Prioritized sustainability actions generated
                            by the AMSDOA optimization engine using
                            organizational context, sustainability metrics,
                            impact, cost and urgency.
                        </Typography>


                        <Chip
                            label={`Metric #${currentMetricId ?? "—"}`}
                            size="small"
                            sx={{
                                mt: 2,
                                bgcolor: "#F1F5F9",
                                color: "#475569",
                                fontWeight: 700,
                            }}
                        />

                    </Box>


                    <Chip
                        icon={
                            <PsychologyIcon />
                        }
                        label="AI Decision Engine"
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
                        lg: "1.2fr 1fr 1fr",
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
                                    Overall Sustainability Score
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize: 48,
                                        fontWeight: 800,
                                        mt: 1,
                                    }}
                                >
                                    {Number(
                                        decision.overallScore ?? 0
                                    ).toFixed(2)}
                                </Typography>


                                <Chip
                                    label={`Grade: ${decision.grade || "N/A"
                                        }`}
                                    size="small"
                                    sx={{
                                        mt: 1,
                                        bgcolor: "#E8F5E9",
                                        color: "#2E7D32",
                                        fontWeight: 700,
                                    }}
                                />

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
                            Top Decision Priority
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
                                ? Number(
                                    topAction.priorityScore
                                ).toFixed(1)
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
                            Optimized Actions
                        </Typography>


                        <Typography
                            sx={{
                                fontSize: 42,
                                fontWeight: 800,
                                mt: 1,
                                color: "#1976D2",
                            }}
                        >
                            {decision.prioritizedActions?.length ?? 0}
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
                                    Highest Priority Decision
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
                                    {Number(
                                        topAction.priorityScore
                                    ).toFixed(1)}
                                </Typography>

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
                    Prioritized Actions
                </Typography>


                <Typography
                    color="text.secondary"
                    sx={{
                        mb: 3,
                    }}
                >
                    Actions ranked by the AMSDOA Decision Utility
                    Optimizer.
                </Typography>


                <Stack
                    spacing={2}
                >

                    {(
                        decision.prioritizedActions || []
                    ).map(
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
                                    onClick={() =>
                                        setSelectedActionName(action.actionName)
                                    }
                                    sx={{
                                        borderRadius: 4,
                                        border:
                                            action.actionName === selectedActionName
                                                ? "2px solid #7B1FA2"
                                                : "1px solid #E2E8F0",
                                        background:
                                            action.actionName === selectedActionName
                                                ? "#FCF7FF"
                                                : "#FFFFFF",
                                        cursor: "pointer",
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
                                                            {Number(
                                                                action.priorityScore
                                                            ).toFixed(1)}
                                                        </Typography>

                                                    </Stack>


                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.min(
                                                            Number(
                                                                action.priorityScore
                                                            ) || 0,
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
                                                        label={`Impact: ${action.expectedImpact ??
                                                            "N/A"
                                                            }`}
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
                                                        label={`Cost: ${action.implementationCost ??
                                                            "N/A"
                                                            }`}
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
                                                        label={`Urgency: ${action.urgency ??
                                                            "N/A"
                                                            }`}
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


                {(
                    decision.actionInteractions || []
                ).length === 0 ? (

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
                                                        {
                                                            interaction.sourceAction
                                                        }
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
                                                        {
                                                            interaction.targetAction
                                                        }
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
                EXPLAINABILITY
            ===================================================== */}

            <Card
                elevation={0}
                sx={{
                    borderRadius: 4,
                    mb: 4,
                    border:
                        "1px solid #DDE5E1",
                    background:
                        "linear-gradient(135deg,#F8FFFA,#FFFFFF)",
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
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                    >

                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                flexShrink: 0,
                                borderRadius: 2.5,
                                bgcolor: "#E8F5E9",
                                color: "#2E7D32",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <PsychologyIcon />

                        </Box>


                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight={800}
                            >
                                Explainable Decision Intelligence
                            </Typography>


                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    lineHeight: 1.7,
                                }}
                            >
                                Each recommendation is ranked using
                                sustainability impact, implementation
                                considerations, urgency and contextual
                                relationships. The explanation associated
                                with every action provides transparency into
                                why AMSDOA prioritized that decision.
                            </Typography>

                        </Box>

                    </Stack>

                </CardContent>

            </Card>


            {/* =====================================================
                AFR FEEDBACK
            ===================================================== */}

            {selectedAction && (

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


                    <Chip
                        label={`Selected action: ${selectedAction.actionName}`}
                        size="small"
                        sx={{
                            mb: 2,
                            bgcolor: "#F3E5F5",
                            color: "#7B1FA2",
                            fontWeight: 700,
                        }}
                    />

                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 3,
                            maxWidth: 850,
                            lineHeight: 1.7,
                        }}
                    >
                        Submit implementation results for the
                        selected decision. The feedback is stored
                        by the AFR module and can be used to refine future
                        sustainability decision priorities.
                    </Typography>


                    <DecisionFeedback
                        metricId={decision.metricId}
                        actionName={selectedAction.actionName}
                    />

                </Box>

            )}


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
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={() =>
                        navigate("/dashboard")
                    }
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
                    endIcon={
                        <ArrowForwardIcon />
                    }
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