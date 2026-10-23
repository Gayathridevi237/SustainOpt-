import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import HubIcon from "@mui/icons-material/Hub";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsightsIcon from "@mui/icons-material/Insights";
import TuneIcon from "@mui/icons-material/Tune";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FeedbackIcon from "@mui/icons-material/Feedback";

import { getDecision } from "../api/decisionApi";
import type { DecisionResponse, PrioritizedAction } from "../api/decisionApi";

import { getMetrics } from "../api/metricsApi";
import type { SustainabilityMetric } from "../api/metricsApi";

import { getScore } from "../api/scoringApi";
import type { ScoringResponse } from "../api/scoringApi";


const AlgorithmIntelligence = () => {

    const [decision, setDecision] =
        useState<DecisionResponse | null>(null);

    const [selectedMetric, setSelectedMetric] =
        useState<SustainabilityMetric | null>(null);

    const [scoring, setScoring] =
        useState<ScoringResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadAlgorithmData = async () => {

            try {

                setLoading(true);
                setError("");

                /*
                 * IMPORTANT:
                 * Do not use a hardcoded metric ID.
                 *
                 * getMetrics() returns only the metrics available
                 * to the authenticated user.
                 */
                const metrics =
                    await getMetrics();

                if (!metrics || metrics.length === 0) {
                    throw new Error(
                        "No sustainability metrics are available."
                    );
                }

                /*
                 * Use the most recently created metric.
                 *
                 * The backend remains responsible for the
                 * actual AMSDOA calculations.
                 */
                const validMetrics =
                    metrics.filter(
                        (
                            metric: SustainabilityMetric
                        ) =>
                            metric.id !== undefined &&
                            metric.id !== null
                    );

                if (validMetrics.length === 0) {
                    throw new Error(
                        "No valid sustainability metric is available."
                    );
                }

                const latestMetric =
                    [...validMetrics].sort(
                        (
                            a: SustainabilityMetric,
                            b: SustainabilityMetric
                        ) =>
                            Number(b.id) -
                            Number(a.id)
                    )[0];

                const metricId =
                    Number(latestMetric.id);

                if (!metricId) {
                    throw new Error(
                        "Unable to determine the sustainability metric."
                    );
                }

                /*
                 * Fetch the real backend outputs. The backend remains the
                 * single source of truth for all numerical calculations.
                 */
                const [decisionData, scoringData] =
                    await Promise.all([
                        getDecision(metricId),
                        getScore(metricId),
                    ]);

                setSelectedMetric(latestMetric);
                setDecision(decisionData);
                setScoring(scoringData);

            } catch (err) {

                console.error(
                    "Failed to load AMSDOA intelligence:",
                    err
                );

                setDecision(null);

                setError(
                    "Unable to load live AMSDOA decision intelligence. Please make sure the backend is running and you are logged in."
                );

            } finally {

                setLoading(false);

            }

        };

        loadAlgorithmData();

    }, []);


    /*
     * ------------------------------------------------------------
     * Helper functions
     * ------------------------------------------------------------
     */

    const getPriorityColor = (
        score: number
    ) => {

        if (score >= 80) {
            return "#15803D";
        }

        if (score >= 60) {
            return "#D97706";
        }

        return "#2563EB";
    };


    const getPriorityLabel = (
        score: number
    ) => {

        if (score >= 80) {
            return "High Priority";
        }

        if (score >= 60) {
            return "Medium Priority";
        }

        return "Recommended";
    };


    const formatValue = (
        value: number | undefined | null
    ) => {

        if (
            value === undefined ||
            value === null ||
            Number.isNaN(Number(value))
        ) {
            return "—";
        }

        return Number(value).toFixed(2);
    };


    /*
     * ------------------------------------------------------------
     * Loading
     * ------------------------------------------------------------
     */

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "75vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                    backgroundColor: "#F5F8FC",
                }}
            >

                <CircularProgress
                    size={44}
                    sx={{
                        color: "#2E7D32",
                    }}
                />

                <Typography
                    sx={{
                        color: "#475569",
                        fontWeight: 600,
                    }}
                >
                    Loading AMSDOA decision intelligence...
                </Typography>

            </Box>
        );

    }


    /*
     * ------------------------------------------------------------
     * Extract backend values
     * ------------------------------------------------------------
     */

    const prioritizedActions:
        PrioritizedAction[] =
        decision?.prioritizedActions ?? [];

    const topAction =
        prioritizedActions.length > 0
            ? prioritizedActions[0]
            : null;


    /*
     * ------------------------------------------------------------
     * Main page
     * ------------------------------------------------------------
     */

    return (

        <Box
            sx={{
                minHeight: "100%",
                backgroundColor: "#F5F8FC",
                px: {
                    xs: 2,
                    sm: 3,
                    md: 6,
                },
                py: {
                    xs: 3,
                    md: 4,
                },
            }}
        >

            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <Box
                sx={{
                    mb: 4,
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        md: "center",
                    }}
                    spacing={2}
                >

                    <Box>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >

                            <AutoAwesomeIcon
                                sx={{
                                    color: "#2E7D32",
                                    fontSize: 22,
                                }}
                            />

                            <Typography
                                sx={{
                                    color: "#166534",
                                    fontWeight: 800,
                                    fontSize: 14,
                                    letterSpacing: 1.2,
                                    textTransform: "uppercase",
                                }}
                            >
                                SustainOpt Decision Intelligence
                            </Typography>

                        </Stack>

                        <Typography
                            variant="h3"
                            sx={{
                                color: "#0F172A",
                                fontWeight: 800,
                                letterSpacing: "-1px",
                                fontSize: {
                                    xs: 34,
                                    md: 46,
                                },
                                mb: 1,
                            }}
                        >
                            Algorithm Intelligence
                        </Typography>

                        <Typography
                            sx={{
                                color: "#56708F",
                                maxWidth: 850,
                                fontSize: {
                                    xs: 15,
                                    md: 17,
                                },
                                lineHeight: 1.8,
                            }}
                        >
                            Understand how the Adaptive Multi-Context
                            Sustainability Decision Optimization Algorithm
                            transforms sustainability conditions into
                            prioritized and explainable decisions.
                        </Typography>

                    </Box>

                    <Chip
                        icon={
                            <AutoAwesomeIcon />
                        }
                        label={
                            decision
                                ? "Engine Active"
                                : "Engine Unavailable"
                        }
                        sx={{
                            fontWeight: 700,
                            px: 1,
                            backgroundColor: decision
                                ? "#ECFDF3"
                                : "#FFF7E8",
                            color: decision
                                ? "#15803D"
                                : "#B45309",
                            border: decision
                                ? "1px solid #BBF7D0"
                                : "1px solid #FDE68A",
                        }}
                    />

                </Stack>

            </Box>


            {/* =====================================================
                AMSDOA PIPELINE
            ====================================================== */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #DDE5ED",
                    background: "linear-gradient(135deg,#F8FFFA,#FFFFFF)",
                }}
            >
                <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", md: "center" }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >
                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#15803D", letterSpacing: 1, textTransform: "uppercase" }}>
                                Decision Pipeline
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mt: 0.4 }}>
                                From sustainability data to prioritized action
                            </Typography>
                        </Box>
                        <Chip label="Backend-driven" size="small" sx={{ fontWeight: 700, bgcolor: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }} />
                    </Stack>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(5,1fr)" },
                            gap: 1.5,
                        }}
                    >
                        {[
                            ["01", "INPUT", "Sustainability metrics"],
                            ["02", "ASSESS", "SHI & component scores"],
                            ["03", "OPTIMIZE", "CAC • AIG • DUO"],
                            ["04", "ADAPT", "AFR + SHI/scenario adjustments"],
                            ["05", "DECIDE", "Prioritized actions"],
                        ].map(([step, title, text]) => (
                            <Box key={step} sx={{ position: "relative", p: 2, borderRadius: 2.5, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", minHeight: 105 }}>
                                <Typography sx={{ fontSize: 11, fontWeight: 900, color: "#2563EB", letterSpacing: 0.8 }}>
                                    STEP {step}
                                </Typography>
                                <Typography sx={{ mt: 0.6, fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                                    {title}
                                </Typography>
                                <Typography sx={{ mt: 0.6, fontSize: 12.5, lineHeight: 1.5, color: "#64748B" }}>
                                    {text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>


            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (

                <Alert
                    severity="warning"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        border: "1px solid #FDE68A",
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* =====================================================
                AMSDOA INTRODUCTION
            ====================================================== */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #DDE5ED",
                    backgroundColor: "#FFFFFF",
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2.5,
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
                                width: 64,
                                height: 64,
                                borderRadius: 2.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#EAF7EE",
                                color: "#2E7D32",
                                flexShrink: 0,
                            }}
                        >

                            <PsychologyIcon
                                sx={{
                                    fontSize: 36,
                                }}
                            />

                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                            }}
                        >

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 800,
                                    color: "#0F172A",
                                    mb: 1,
                                }}
                            >
                                AMSDOA Optimization Engine
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#56708F",
                                    lineHeight: 1.8,
                                }}
                            >
                                AMSDOA is the computational decision engine
                                within SustainOpt. It combines context
                                adaptation, action interactions, utility
                                optimization, explainability and adaptive
                                feedback into a single decision loop.
                            </Typography>

                        </Box>

                        <Chip
                            label="Adaptive Decision Loop"
                            sx={{
                                fontWeight: 700,
                                color: "#166534",
                                backgroundColor: "#F0FDF4",
                                border: "1px solid #BBF7D0",
                            }}
                        />

                    </Stack>

                </CardContent>

            </Card>


            {/* =====================================================
                PIPELINE
            ====================================================== */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #DDE5ED",
                    backgroundColor: "#FFFFFF",
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2.5,
                            md: 4,
                        },
                    }}
                >

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            color: "#0F172A",
                            mb: 0.8,
                        }}
                    >
                        Decision Intelligence Pipeline
                    </Typography>

                    <Typography
                        sx={{
                            color: "#64748B",
                            mb: 3,
                        }}
                    >
                        How sustainability information moves through the
                        decision engine.
                    </Typography>


                    <Grid
                        container
                        spacing={1.5}
                        alignItems="center"
                    >

                        {[
                            "Sustainability Data",
                            "SHI Assessment",
                            "CAC",
                            "AIG",
                            "DUO",
                            "Prioritized Decision",
                        ].map(
                            (
                                item,
                                index
                            ) => (

                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        md: 2,
                                    }}
                                    key={item}
                                >

                                    <Box
                                        sx={{
                                            minHeight: 82,
                                            px: 1.5,
                                            py: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            borderRadius: 2,
                                            backgroundColor:
                                                index === 5
                                                    ? "#F0FDF4"
                                                    : "#F8FAFC",
                                            border:
                                                index === 5
                                                    ? "1px solid #BBF7D0"
                                                    : "1px solid #E2E8F0",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                fontWeight: 800,
                                                color:
                                                    index === 5
                                                        ? "#166534"
                                                        : "#334155",
                                            }}
                                        >
                                            {item}
                                        </Typography>

                                    </Box>

                                </Grid>

                            )
                        )}

                    </Grid>

                </CardContent>

            </Card>


            {/* =====================================================
                FIVE COMPONENTS
            ====================================================== */}

            <Grid
                container
                spacing={2.5}
                sx={{ mb: 3 }}
            >

                {[
                    {
                        title: "CAC",
                        subtitle:
                            "Context Adaptation Coefficient",
                        description:
                            "Adapts decision priorities according to the current sustainability context and organizational conditions.",
                        icon: <TuneIcon />,
                    },
                    {
                        title: "AIG",
                        subtitle:
                            "Action Interaction Graph",
                        description:
                            "Models relationships between sustainability actions and identifies complementary or related initiatives.",
                        icon: <HubIcon />,
                    },
                    {
                        title: "DUO",
                        subtitle:
                            "Decision Utility Optimizer",
                        description:
                            "Evaluates candidate actions using sustainability conditions and utility-related decision factors.",
                        icon: <TrendingUpIcon />,
                    },
                    {
                        title: "Explainability Engine",
                        subtitle:
                            "Decision Reasoning",
                        description:
                            "Converts the decision engine's internal results into understandable explanations for users.",
                        icon: <InsightsIcon />,
                    },
                    {
                        title: "AFR",
                        subtitle:
                            "Adaptive Feedback Refinement",
                        description:
                            "Uses implementation feedback and outcomes to adjust future decision priorities.",
                        icon: <FeedbackIcon />,
                    },
                ].map(
                    (component) => (

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                            }}
                            key={component.title}
                        >

                            <Card
                                elevation={0}
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    border:
                                        "1px solid #DDE5ED",
                                    backgroundColor:
                                        "#FFFFFF",
                                }}
                            >

                                <CardContent
                                    sx={{
                                        p: 3,
                                    }}
                                >

                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            backgroundColor:
                                                "#EFF6FF",
                                            color: "#2563EB",
                                            mb: 2,
                                        }}
                                    >
                                        {component.icon}
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                            color: "#0F172A",
                                            mb: 0.5,
                                        }}
                                    >
                                        {component.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#2563EB",
                                            fontWeight: 700,
                                            mb: 1.5,
                                        }}
                                    >
                                        {component.subtitle}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#64748B",
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {component.description}
                                    </Typography>

                                </CardContent>

                            </Card>

                        </Grid>

                    )
                )}

            </Grid>


            {/* =====================================================
                HOW THE BACKEND WORKS
            ====================================================== */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #DDE5ED",
                    backgroundColor: "#FFFFFF",
                }}
            >
                <CardContent
                    sx={{
                        p: { xs: 2.5, md: 4 },
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.8 }}>
                            <AccountTreeIcon sx={{ color: "#2563EB" }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A" }}>
                                How SustainOpt's Backend Works
                            </Typography>
                        </Stack>
                        <Typography sx={{ color: "#64748B", lineHeight: 1.8, maxWidth: 950 }}>
                            This section explains the role of each backend component in simple terms.
                            The backend receives the organization's sustainability metrics, evaluates the current
                            sustainability condition, analyzes possible actions, and produces explainable priorities.
                        </Typography>
                    </Box>

                    <Stack spacing={2}>
                        {[
                            {
                                step: "01",
                                title: "Sustainability Data",
                                purpose: "Receives the organization's measured sustainability indicators such as electricity, water, waste, carbon, renewable energy and transport emissions.",
                                backend: "The selected metric is loaded from the database for the authenticated user's organization.",
                                output: "A current sustainability state that becomes the input to the decision pipeline.",
                                icon: <AssessmentIcon />,
                            },
                            {
                                step: "02",
                                title: "SHI Assessment",
                                purpose: "Converts the current sustainability state into a Sustainability Health Index using weighted environmental dimensions.",
                                backend: "The backend calculates separate dimension scores and combines them using the SHI weights.",
                                output: "A sustainability health score and status that provide context for later decision adjustments.",
                                icon: <InsightsIcon />,
                            },
                            {
                                step: "03",
                                title: "CAC — Context Adaptation Coefficient",
                                purpose: "Determines how strongly the current sustainability conditions should influence decision priority.",
                                backend: "CAC examines threshold conditions such as high electricity, water, waste, carbon, transport emissions and low renewable energy usage.",
                                output: "A context coefficient between 0 and 100 that represents the current organizational sustainability pressure.",
                                icon: <TuneIcon />,
                            },
                            {
                                step: "04",
                                title: "AIG — Action Interaction Graph",
                                purpose: "Checks whether sustainability actions support or relate to one another.",
                                backend: "The backend stores relationships such as renewable energy ↔ carbon and electricity ↔ renewable energy, with interaction strengths.",
                                output: "An interaction score that captures the additional value or relationship between candidate actions.",
                                icon: <HubIcon />,
                            },
                            {
                                step: "05",
                                title: "DUO — Decision Utility Optimizer",
                                purpose: "Estimates the usefulness of each candidate action based on the organization's actual sustainability conditions.",
                                backend: "DUO evaluates the relevant metric for each action and increases utility when the associated sustainability problem is more significant.",
                                output: "A utility score for each candidate intervention.",
                                icon: <TrendingUpIcon />,
                            },
                            {
                                step: "06",
                                title: "AFR — Adaptive Feedback Refinement",
                                purpose: "Allows previous implementation feedback to influence future decisions.",
                                backend: "Recorded feedback success scores are converted into a feedback adjustment for the decision calculation.",
                                output: "A feedback adjustment that can raise or lower a future action's priority.",
                                icon: <FeedbackIcon />,
                            },
                            {
                                step: "07",
                                title: "AMSDOA Score Calculation",
                                purpose: "Combines the decision-engine components into a base priority score.",
                                backend: "The configured weights are Utility 60%, Context 25%, Interaction 10% and Feedback 5%.",
                                output: "AMSDOA Base Score = 0.60 × Utility + 0.25 × Context + 0.10 × Interaction + 0.05 × Feedback.",
                                icon: <PsychologyIcon />,
                            },
                            {
                                step: "08",
                                title: "Decision Adjustments & Explainability",
                                purpose: "Applies the current sustainability health and scenario context before presenting the final recommendation.",
                                backend: "The decision service applies SHI and scenario adjustments, limits the result to 0–100, sorts actions by priority, and generates an explanation.",
                                output: "A prioritized, explainable list of sustainability actions for the organization.",
                                icon: <AutoAwesomeIcon />,
                            },
                        ].map((item) => (
                            <Box
                                key={item.step}
                                sx={{
                                    p: { xs: 2, md: 2.5 },
                                    borderRadius: 2.5,
                                    border: "1px solid #E2E8F0",
                                    backgroundColor: "#F8FAFC",
                                }}
                            >
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "flex-start" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: { md: 235 } }}>
                                        <Box sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#EFF6FF", color: "#2563EB", flexShrink: 0 }}>
                                            {item.icon}
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#2563EB", letterSpacing: 0.8 }}>
                                                STEP {item.step}
                                            </Typography>
                                            <Typography sx={{ fontWeight: 800, color: "#0F172A" }}>
                                                {item.title}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontWeight: 700, color: "#334155", mb: 0.5 }}>
                                            What it does
                                        </Typography>
                                        <Typography sx={{ color: "#64748B", lineHeight: 1.7, mb: 1.2 }}>
                                            {item.purpose}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 700, color: "#334155", mb: 0.5 }}>
                                            What the backend does
                                        </Typography>
                                        <Typography sx={{ color: "#64748B", lineHeight: 1.7, mb: 1.2 }}>
                                            {item.backend}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 700, color: "#334155", mb: 0.5 }}>
                                            Output
                                        </Typography>
                                        <Typography sx={{ color: "#166534", lineHeight: 1.7, fontWeight: 600 }}>
                                            {item.output}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>


            {/* =====================================================
                METRIC & FORMULA TRANSPARENCY
            ====================================================== */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #DDE5ED",
                    backgroundColor: "#FFFFFF",
                }}
            >

                <CardContent
                    sx={{
                        p: { xs: 2.5, md: 4 },
                    }}
                >

                    <Stack spacing={3}>

                        <Box>
                            <Stack
                                direction="row"
                                spacing={1.2}
                                alignItems="center"
                                sx={{ mb: 0.8 }}
                            >
                                <TuneIcon sx={{ color: "#2E7D32" }} />
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 800, color: "#0F172A" }}
                                >
                                    Metric Calculation & Formula Transparency
                                </Typography>
                            </Stack>

                            <Typography sx={{ color: "#64748B", lineHeight: 1.7 }}>
                                The values below are returned by the backend scoring service.
                                SustainOpt does not recalculate these scores in the frontend.
                            </Typography>
                        </Box>

                        {selectedMetric && (
                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2.5,
                                    backgroundColor: "#F8FAFC",
                                    border: "1px solid #E2E8F0",
                                }}
                            >
                                <Typography sx={{ fontWeight: 800, color: "#0F172A", mb: 1.5 }}>
                                    Current Input Metric
                                </Typography>

                                <Grid container spacing={1.5}>
                                    {[
                                        ["Electricity", selectedMetric.electricityKwh, "kWh"],
                                        ["Water", selectedMetric.waterLiters, "L"],
                                        ["Waste", selectedMetric.wasteKg, "kg"],
                                        ["Carbon", selectedMetric.carbonEmission, "units"],
                                        ["Renewable Energy", selectedMetric.renewableEnergyPercent, "%"],
                                        ["Transport Emission", selectedMetric.transportEmission, "units"],
                                    ].map(([label, value, unit]) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={label as string}>
                                            <Box sx={{ p: 1.8, borderRadius: 2, backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                                                <Typography sx={{ fontSize: 12, color: "#64748B", fontWeight: 700 }}>
                                                    {label as string}
                                                </Typography>
                                                <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#0F172A" }}>
                                                    {formatValue(Number(value))} {unit as string}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        <Grid container spacing={2}>
                            {[
                                { name: "Electricity Score", formula: "max(0, 100 − Electricity / 100)", value: scoring?.electricityScore },
                                { name: "Water Score", formula: "max(0, 100 − Water / 1000)", value: scoring?.waterScore },
                                { name: "Waste Score", formula: "max(0, 100 − Waste / 10)", value: scoring?.wasteScore },
                                { name: "Carbon Score", formula: "max(0, 100 − Carbon / 10)", value: scoring?.carbonScore },
                                { name: "Renewable Score", formula: "min(100, Renewable Energy %)", value: scoring?.renewableScore },
                                { name: "Transport Score", formula: "max(0, 100 − Transport Emission / 10)", value: scoring?.transportScore },
                            ].map((item) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.name}>
                                    <Box
                                        sx={{
                                            height: "100%",
                                            p: 2.2,
                                            borderRadius: 2.5,
                                            border: "1px solid #E2E8F0",
                                            backgroundColor: "#FFFFFF",
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: "monospace",
                                                fontSize: 13,
                                                color: "#475569",
                                                minHeight: 42,
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {item.formula}
                                        </Typography>
                                        <Typography sx={{ mt: 1.5, fontSize: 24, fontWeight: 800, color: "#166534" }}>
                                            {formatValue(item.value)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius: 2.5,
                                backgroundColor: "#F0FDF4",
                                border: "1px solid #BBF7D0",
                            }}
                        >
                            <Typography sx={{ fontWeight: 800, color: "#14532D", mb: 1 }}>
                                Overall Sustainability Score
                            </Typography>
                            <Typography sx={{ color: "#166534", lineHeight: 1.7 }}>
                                Overall Score = (Electricity + Water + Waste + Carbon + Renewable + Transport) / 6
                            </Typography>
                            <Typography sx={{ mt: 1, fontSize: 26, fontWeight: 900, color: "#166534" }}>
                                {formatValue(scoring?.overallScore)} / 100
                            </Typography>
                            <Chip
                                label={scoring?.grade ?? "—"}
                                size="small"
                                sx={{ mt: 1, fontWeight: 800, color: "#166534", backgroundColor: "#DCFCE7" }}
                            />
                        </Box>

                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius: 2.5,
                                backgroundColor: "#F8FAFC",
                                border: "1px solid #E2E8F0",
                            }}
                        >
                            <Typography sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                                SHI and AMSDOA Calculation Layers
                            </Typography>
                            <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>
                                The Sustainability Health Index uses its own weighted formula in the backend.
                                AMSDOA then combines utility, context, interaction and feedback components
                                using configured weights before applying the decision-layer adjustments.
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography sx={{ fontFamily: "monospace", color: "#334155", lineHeight: 1.8 }}>
                                AMSDOA Base = 0.60 × Utility + 0.25 × Context + 0.10 × Interaction + 0.05 × Feedback
                            </Typography>
                        </Box>

                    </Stack>

                </CardContent>

            </Card>


            {/* =====================================================
                LIVE BACKEND OUTPUT
            ====================================================== */}

            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #DDE5ED",
                    backgroundColor: "#FFFFFF",
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2.5,
                            md: 4,
                        },
                    }}
                >

                    <Stack
                        direction={{
                            xs: "column",
                            md: "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            md: "center",
                        }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >

                        <Box>

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                            >

                                <AccountTreeIcon
                                    sx={{
                                        color: "#2E7D32",
                                    }}
                                />

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#0F172A",
                                    }}
                                >
                                    Live AMSDOA Output
                                </Typography>

                            </Stack>

                            <Typography
                                sx={{
                                    color: "#64748B",
                                }}
                            >
                                Values below are returned directly from
                                the backend decision engine.
                            </Typography>

                        </Box>

                        {topAction && (

                            <Chip
                                label={getPriorityLabel(
                                    Number(
                                        topAction.priorityScore
                                    )
                                )}
                                sx={{
                                    fontWeight: 800,
                                    color: getPriorityColor(
                                        Number(
                                            topAction.priorityScore
                                        )
                                    ),
                                    backgroundColor: "#F8FAFC",
                                    border: `1px solid ${getPriorityColor(
                                        Number(
                                            topAction.priorityScore
                                        )
                                    )}40`,
                                }}
                            />

                        )}

                    </Stack>


                    {!topAction ? (

                        <Alert
                            severity="info"
                            sx={{
                                borderRadius: 2,
                            }}
                        >
                            The backend returned no prioritized decisions
                            for the available sustainability metrics.
                        </Alert>

                    ) : (

                        <>

                            {/* Top action */}

                            <Box
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    borderRadius: 2.5,
                                    backgroundColor: "#F8FAFC",
                                    border:
                                        "1px solid #E2E8F0",
                                }}
                            >

                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#64748B",
                                        fontWeight: 800,
                                    }}
                                >
                                    TOP PRIORITIZED ACTION
                                </Typography>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "#0F172A",
                                        fontWeight: 800,
                                        mt: 0.5,
                                        mb: 1.5,
                                    }}
                                >
                                    {topAction.actionName}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#64748B",
                                        lineHeight: 1.8,
                                        maxWidth: 900,
                                    }}
                                >
                                    {topAction.explanation ||
                                        "The backend generated this action using the AMSDOA decision pipeline."}
                                </Typography>

                            </Box>


                            {/* Score */}

                            <Box
                                sx={{
                                    mb: 3,
                                    p: 3,
                                    borderRadius: 2.5,
                                    backgroundColor: "#F0FDF4",
                                    border:
                                        "1px solid #BBF7D0",
                                }}
                            >

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    justifyContent="space-between"
                                    spacing={2}
                                    sx={{ mb: 1 }}
                                >

                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            color: "#166534",
                                        }}
                                    >
                                        Final Priority Score
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 28,
                                            fontWeight: 900,
                                            color:
                                                getPriorityColor(
                                                    Number(
                                                        topAction.priorityScore
                                                    )
                                                ),
                                        }}
                                    >
                                        {formatValue(
                                            topAction.priorityScore
                                        )}
                                    </Typography>

                                </Stack>

                                <LinearProgress
                                    variant="determinate"
                                    value={Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            Number(
                                                topAction.priorityScore
                                            ) || 0
                                        )
                                    )}
                                    sx={{
                                        height: 9,
                                        borderRadius: 10,
                                        backgroundColor:
                                            "#DCFCE7",
                                        "& .MuiLinearProgress-bar":
                                        {
                                            borderRadius: 10,
                                            backgroundColor:
                                                getPriorityColor(
                                                    Number(
                                                        topAction.priorityScore
                                                    )
                                                ),
                                        },
                                    }}
                                />

                            </Box>


                            {/* AMSDOA values */}

                            <Grid
                                container
                                spacing={2}
                            >

                                {[
                                    {
                                        title:
                                            "Context Coefficient",
                                        value:
                                            topAction.contextCoefficient,
                                        description:
                                            "CAC context adaptation",
                                    },
                                    {
                                        title:
                                            "Interaction Score",
                                        value:
                                            topAction.interactionScore,
                                        description:
                                            "AIG interaction contribution",
                                    },
                                    {
                                        title:
                                            "Utility Score",
                                        value:
                                            topAction.utilityScore,
                                        description:
                                            "DUO utility evaluation",
                                    },
                                    {
                                        title:
                                            "Feedback Adjustment",
                                        value:
                                            topAction.feedbackAdjustment,
                                        description:
                                            "AFR feedback contribution",
                                    },
                                    {
                                        title:
                                            "AMSDOA Base Score",
                                        value:
                                            topAction.amsdoaBaseScore,
                                        description:
                                            "Weighted component score",
                                    },
                                    {
                                        title:
                                            "SHI Adjustment",
                                        value:
                                            topAction.shiAdjustment,
                                        description:
                                            "Sustainability health adjustment",
                                    },
                                    {
                                        title:
                                            "Scenario Adjustment",
                                        value:
                                            topAction.scenarioAdjustment,
                                        description:
                                            "Eligible scenario contribution",
                                    },
                                ].map(
                                    (item) => (

                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 4,
                                            }}
                                            key={
                                                item.title
                                            }
                                        >

                                            <Box
                                                sx={{
                                                    height:
                                                        "100%",
                                                    p: 2.5,
                                                    borderRadius:
                                                        2,
                                                    backgroundColor:
                                                        "#FFFFFF",
                                                    border:
                                                        "1px solid #E2E8F0",
                                                }}
                                            >

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color:
                                                            "#64748B",
                                                        fontWeight:
                                                            700,
                                                        mb: 1,
                                                    }}
                                                >
                                                    {item.title}
                                                </Typography>

                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        color:
                                                            "#0F172A",
                                                        fontWeight:
                                                            800,
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {formatValue(
                                                        item.value
                                                    )}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color:
                                                            "#94A3B8",
                                                    }}
                                                >
                                                    {
                                                        item.description
                                                    }
                                                </Typography>

                                            </Box>

                                        </Grid>

                                    )
                                )}

                            </Grid>

                        </>

                    )}

                </CardContent>

            </Card>


            {/* =====================================================
                ACTION SUMMARY
            ====================================================== */}

            {prioritizedActions.length > 0 && (

                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        border:
                            "1px solid #DDE5ED",
                        backgroundColor:
                            "#FFFFFF",
                    }}
                >

                    <CardContent
                        sx={{
                            p: {
                                xs: 2.5,
                                md: 4,
                            },
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >

                            <InsightsIcon
                                sx={{
                                    color: "#2E7D32",
                                }}
                            />

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 800,
                                    color: "#0F172A",
                                }}
                            >
                                Prioritized Sustainability Actions
                            </Typography>

                        </Stack>

                        <Typography
                            sx={{
                                color: "#64748B",
                                mb: 3,
                            }}
                        >
                            Candidate actions returned by the backend
                            decision engine in priority order.
                        </Typography>


                        <Stack
                            divider={
                                <Divider flexItem />
                            }
                        >

                            {prioritizedActions
                                .slice(0, 5)
                                .map(
                                    (
                                        action,
                                        index
                                    ) => (

                                        <Box
                                            key={`${action.actionName}-${index}`}
                                            sx={{
                                                py: 2.5,
                                            }}
                                        >

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    md: "row",
                                                }}
                                                spacing={2}
                                                justifyContent="space-between"
                                                alignItems={{
                                                    xs: "flex-start",
                                                    md: "center",
                                                }}
                                            >

                                                <Box>

                                                    <Typography
                                                        sx={{
                                                            fontWeight:
                                                                800,
                                                            color:
                                                                "#0F172A",
                                                            mb:
                                                                0.5,
                                                        }}
                                                    >
                                                        {index +
                                                            1}.{" "}
                                                        {
                                                            action.actionName
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color:
                                                                "#64748B",
                                                        }}
                                                    >
                                                        {action.explanation ||
                                                            "Backend-generated sustainability decision."}
                                                    </Typography>

                                                </Box>

                                                <Chip
                                                    label={`${formatValue(
                                                        action.priorityScore
                                                    )} Priority`}
                                                    sx={{
                                                        fontWeight:
                                                            800,
                                                        color:
                                                            getPriorityColor(
                                                                Number(
                                                                    action.priorityScore
                                                                )
                                                            ),
                                                        backgroundColor:
                                                            "#F8FAFC",
                                                    }}
                                                />

                                            </Stack>

                                        </Box>

                                    )
                                )}

                        </Stack>

                    </CardContent>

                </Card>

            )}


            {/* =====================================================
                FOOTER EXPLANATION
            ====================================================== */}

            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border:
                        "1px solid #DDE5ED",
                    backgroundColor:
                        "#FFFFFF",
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2.5,
                            md: 3.5,
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
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                    "#F0FDF4",
                                color: "#2E7D32",
                                flexShrink: 0,
                            }}
                        >

                            <PsychologyIcon />

                        </Box>

                        <Box>

                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 800,
                                    color: "#0F172A",
                                    mb: 0.7,
                                }}
                            >
                                Backend-driven algorithm intelligence
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#64748B",
                                    lineHeight: 1.8,
                                }}
                            >
                                This page visualizes the actual AMSDOA
                                decision outputs generated by the SustainOpt
                                backend. The frontend does not reproduce the
                                optimization formulas; it presents the
                                calculated values, decision factors and
                                explanations returned by the decision engine.
                            </Typography>

                        </Box>

                    </Stack>

                </CardContent>

            </Card>

        </Box>
    );
};


export default AlgorithmIntelligence;