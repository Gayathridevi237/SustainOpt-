import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    MenuItem,
    Rating,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HistoryIcon from "@mui/icons-material/History";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";

import {
    getFeedback,
    submitFeedback,
} from "../../api/feedbackApi";

import type {
    DecisionFeedback as DecisionFeedbackData,
} from "../../api/feedbackApi";

interface DecisionFeedbackProps {
    metricId: number;
    actionName: string;
}

const DecisionFeedback = ({
    metricId,
    actionName,
}: DecisionFeedbackProps) => {

    const [implementationStatus, setImplementationStatus] =
        useState("IMPLEMENTED");

    const [successScore, setSuccessScore] =
        useState<number>(4);

    const [comments, setComments] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [loadingHistory, setLoadingHistory] =
        useState(false);

    const [success, setSuccess] =
        useState(false);

    const [error, setError] =
        useState("");

    const [feedbackHistory, setFeedbackHistory] =
        useState<DecisionFeedbackData[]>([]);


    /*
     * ============================================================
     * LOAD AFR FEEDBACK HISTORY
     * ============================================================
     */
    const loadFeedbackHistory = async () => {

        if (!metricId || metricId <= 0) {
            return;
        }

        try {

            setLoadingHistory(true);

            const history =
                await getFeedback(metricId);

            setFeedbackHistory(
                Array.isArray(history)
                    ? history
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load AFR feedback history:",
                err
            );

        } finally {

            setLoadingHistory(false);

        }
    };


    useEffect(() => {

        loadFeedbackHistory();

    }, [metricId]);


    /*
     * ============================================================
     * ACTION-SPECIFIC REINFORCEMENT DATA
     * ============================================================
     *
     * Reward:
     *
     *     reward = (successScore - 50) / 50
     *
     * Therefore:
     *
     *     100 -> +1.0
     *      50 ->  0.0
     *       0 -> -1.0
     *
     * The backend converts the average reward into the
     * AFR adjustment using:
     *
     *     AFR adjustment = average reward × 10
     *
     * This is the reinforcement signal used by the
     * current RB-AFR implementation.
     */

    const matchingFeedback = useMemo(() => {

        return feedbackHistory.filter(
            (feedback) =>
                feedback.actionName &&
                feedback.actionName.toLowerCase() ===
                actionName.toLowerCase()
        );

    }, [feedbackHistory, actionName]);


    const reinforcementData = useMemo(() => {

        if (matchingFeedback.length === 0) {

            return {
                averageReward: 0,
                adjustment: 0,
                positiveCount: 0,
                negativeCount: 0,
                neutralCount: 0,
            };

        }

        let totalReward = 0;

        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;

        matchingFeedback.forEach(
            (feedback) => {

                if (
                    feedback.successScore ===
                    undefined ||
                    feedback.successScore === null
                ) {
                    return;
                }

                const reward =
                    Math.max(
                        -1,
                        Math.min(
                            1,
                            (
                                feedback.successScore -
                                50
                            ) / 50
                        )
                    );

                totalReward += reward;

                if (reward > 0) {
                    positiveCount++;
                } else if (reward < 0) {
                    negativeCount++;
                } else {
                    neutralCount++;
                }

            }
        );

        const averageReward =
            totalReward /
            matchingFeedback.length;

        const adjustment =
            averageReward * 10;

        return {
            averageReward,
            adjustment,
            positiveCount,
            negativeCount,
            neutralCount,
        };

    }, [matchingFeedback]);


    const rewardPercentage =
        reinforcementData.averageReward * 100;


    const adjustmentLabel =
        reinforcementData.adjustment > 0
            ? "Positive reinforcement"
            : reinforcementData.adjustment < 0
                ? "Negative reinforcement"
                : "Neutral reinforcement";


    const handleSubmit = async () => {

        if (!actionName) {

            setError(
                "Please select a sustainability action."
            );

            return;
        }

        try {

            setLoading(true);
            setError("");
            setSuccess(false);

            const feedback: DecisionFeedbackData = {

                metricId,

                actionName,

                implementationStatus,

                successScore:
                    successScore * 20,

                comments,
            };

            await submitFeedback(feedback);

            setSuccess(true);

            setComments("");

            /*
             * Reload the stored feedback immediately so
             * the reinforcement showcase reflects the
             * newly submitted result.
             */
            await loadFeedbackHistory();

        } catch (err) {

            console.error(
                "Failed to submit feedback:",
                err
            );

            setError(
                "Unable to submit feedback. Please check the backend connection and try again."
            );

        } finally {

            setLoading(false);

        }
    };


    const getRewardColor = (
        reward: number
    ) => {

        if (reward > 0) {
            return "#2E7D32";
        }

        if (reward < 0) {
            return "#D32F2F";
        }

        return "#64748B";
    };


    const getRewardLabel = (
        reward: number
    ) => {

        if (reward > 0) {
            return "Positive";
        }

        if (reward < 0) {
            return "Negative";
        }

        return "Neutral";
    };


    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border:
                    "1px solid #E2E8F0",
                background:
                    "linear-gradient(135deg,#FFFFFF,#F8FBFF)",
                overflow: "hidden",
            }}
        >

            <Box
                sx={{
                    height: 6,
                    background:
                        "linear-gradient(90deg,#2E7D32,#66BB6A)",
                }}
            />

            <CardContent
                sx={{
                    p: {
                        xs: 3,
                        md: 4,
                    },
                }}
            >

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                >

                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            flexShrink: 0,
                            borderRadius: 3,
                            bgcolor: "#E8F5E9",
                            color: "#2E7D32",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >

                        <FeedbackIcon
                            sx={{
                                fontSize: 28,
                            }}
                        />

                    </Box>

                    <Box>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                }}
                            >
                                Decision Feedback
                            </Typography>

                            <Chip
                                icon={
                                    <PsychologyIcon />
                                }
                                label="RB-AFR"
                                size="small"
                                sx={{
                                    bgcolor:
                                        "#F3E5F5",
                                    color:
                                        "#7B1FA2",
                                    fontWeight: 700,
                                }}
                            />

                        </Stack>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.8,
                                lineHeight: 1.6,
                            }}
                        >
                            Implementation feedback is converted
                            into a reinforcement signal that can
                            adapt future decision priorities.
                        </Typography>

                    </Box>

                </Stack>


                <Divider
                    sx={{
                        my: 3,
                    }}
                />


                {/* =====================================================
                    SELECTED ACTION
                ===================================================== */}

                <Box
                    sx={{
                        mb: 3,
                    }}
                >

                    <Typography
                        fontSize={13}
                        color="text.secondary"
                        fontWeight={700}
                        sx={{
                            mb: 1,
                        }}
                    >
                        SELECTED ACTION
                    </Typography>

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            bgcolor: "#F8FAFC",
                            border:
                                "1px solid #E2E8F0",
                        }}
                    >

                        <CardContent
                            sx={{
                                p: 2,
                                "&:last-child": {
                                    pb: 2,
                                },
                            }}
                        >

                            <Typography
                                fontWeight={700}
                            >
                                {actionName}
                            </Typography>

                        </CardContent>

                    </Card>

                </Box>


                {/* =====================================================
                    FEEDBACK INPUT
                ===================================================== */}

                <Stack
                    spacing={3}
                >

                    <Box>

                        <Typography
                            fontSize={14}
                            fontWeight={700}
                            sx={{
                                mb: 1,
                            }}
                        >
                            Implementation Status
                        </Typography>

                        <Select
                            fullWidth
                            value={
                                implementationStatus
                            }
                            onChange={(event) =>
                                setImplementationStatus(
                                    event.target.value
                                )
                            }
                            size="small"
                            sx={{
                                borderRadius: 2,
                            }}
                        >

                            <MenuItem value="IMPLEMENTED">
                                Implemented
                            </MenuItem>

                            <MenuItem value="PARTIALLY_IMPLEMENTED">
                                Partially Implemented
                            </MenuItem>

                            <MenuItem value="NOT_IMPLEMENTED">
                                Not Implemented
                            </MenuItem>

                            <MenuItem value="IN_PROGRESS">
                                In Progress
                            </MenuItem>

                        </Select>

                    </Box>


                    <Box>

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >

                            <Typography
                                fontSize={14}
                                fontWeight={700}
                            >
                                Implementation Success Score
                            </Typography>

                            <Chip
                                label={
                                    `${successScore * 20}%`
                                }
                                size="small"
                                sx={{
                                    bgcolor:
                                        "#E8F5E9",
                                    color:
                                        "#2E7D32",
                                    fontWeight: 800,
                                }}
                            />

                        </Stack>


                        <Box
                            sx={{
                                mt: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >

                            <Rating
                                value={successScore}
                                onChange={
                                    (_, newValue) => {

                                        if (
                                            newValue !==
                                            null
                                        ) {

                                            setSuccessScore(
                                                newValue
                                            );

                                        }

                                    }
                                }
                                max={5}
                                size="large"
                            />

                            <Typography
                                color="text.secondary"
                                fontSize={13}
                            >
                                {successScore}/5
                            </Typography>

                        </Box>

                    </Box>


                    <Box>

                        <Typography
                            fontSize={14}
                            fontWeight={700}
                            sx={{
                                mb: 1,
                            }}
                        >
                            Implementation Comments
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            value={comments}
                            onChange={(event) =>
                                setComments(
                                    event.target.value
                                )
                            }
                            placeholder="Describe the implementation result, observed impact, challenges, or improvements..."
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />

                    </Box>


                    {error && (

                        <Alert
                            severity="error"
                            sx={{
                                borderRadius: 2,
                            }}
                        >
                            {error}
                        </Alert>

                    )}


                    {success && (

                        <Alert
                            severity="success"
                            icon={
                                <CheckCircleIcon />
                            }
                            sx={{
                                borderRadius: 2,
                            }}
                        >
                            Feedback submitted successfully.
                            The reinforcement signal has been
                            added to the AFR history.
                        </Alert>

                    )}


                    <Button
                        variant="contained"
                        size="large"
                        startIcon={
                            <SendIcon />
                        }
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            alignSelf:
                                "flex-start",
                            borderRadius: 2.5,
                            px: 4,
                            py: 1.3,
                            bgcolor:
                                "#2E7D32",
                            fontWeight: 700,

                            "&:hover": {
                                bgcolor:
                                    "#256B2A",
                            },
                        }}
                    >

                        {loading
                            ? "Submitting..."
                            : "Submit Decision Feedback"}

                    </Button>

                </Stack>


                {/* =====================================================
                    REINFORCEMENT SHOWCASE
                ===================================================== */}

                <Divider
                    sx={{
                        my: 4,
                    }}
                />

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3.5,
                        border:
                            "1px solid #E1D5E8",
                        background:
                            "linear-gradient(135deg,#FCF8FF,#FFFFFF)",
                        overflow: "hidden",
                    }}
                >

                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            background:
                                "linear-gradient(90deg,#F3E5F5,#FAF5FC)",
                            borderBottom:
                                "1px solid #E8DDF0",
                        }}
                    >

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={1.5}
                            alignItems={{
                                xs: "flex-start",
                                sm: "center",
                            }}
                            justifyContent="space-between"
                        >

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >

                                <AutoAwesomeIcon
                                    sx={{
                                        color:
                                            "#7B1FA2",
                                    }}
                                />

                                <Typography
                                    fontWeight={800}
                                >
                                    Reinforcement Learning Signal
                                </Typography>

                            </Stack>

                            <Chip
                                label={
                                    matchingFeedback.length === 0
                                        ? "Awaiting feedback"
                                        : "Learning signal active"
                                }
                                size="small"
                                sx={{
                                    bgcolor:
                                        matchingFeedback.length === 0
                                            ? "#F1F5F9"
                                            : "#F3E5F5",
                                    color:
                                        matchingFeedback.length === 0
                                            ? "#64748B"
                                            : "#7B1FA2",
                                    fontWeight: 700,
                                }}
                            />

                        </Stack>

                    </Box>


                    <CardContent
                        sx={{
                            p: 3,
                        }}
                    >

                        <Typography
                            color="text.secondary"
                            fontSize={14}
                            sx={{
                                lineHeight: 1.7,
                                mb: 3,
                            }}
                        >
                            Implementation success is converted
                            into a reward signal. Positive outcomes
                            reinforce the action, while poor outcomes
                            reduce its future adaptive priority.
                        </Typography>


                        {matchingFeedback.length === 0 ? (

                            <Alert
                                severity="info"
                                icon={
                                    <PsychologyIcon />
                                }
                                sx={{
                                    borderRadius: 2.5,
                                }}
                            >
                                No previous feedback exists for this
                                action. Submit an implementation result
                                to create the first reinforcement signal.
                            </Alert>

                        ) : (

                            <>

                                {/* =================================================
                                    SIGNAL METRICS
                                ================================================= */}

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "repeat(3, 1fr)",
                                        },
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >

                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 3,
                                            border:
                                                "1px solid #E2E8F0",
                                            bgcolor:
                                                "#FFFFFF",
                                        }}
                                    >

                                        <CardContent
                                            sx={{
                                                p: 2,
                                                "&:last-child": {
                                                    pb: 2,
                                                },
                                            }}
                                        >

                                            <Typography
                                                fontSize={12}
                                                color="text.secondary"
                                                fontWeight={700}
                                            >
                                                AVERAGE REWARD
                                            </Typography>

                                            <Typography
                                                variant="h5"
                                                fontWeight={800}
                                                sx={{
                                                    mt: 0.5,
                                                    color:
                                                        getRewardColor(
                                                            reinforcementData.averageReward
                                                        ),
                                                }}
                                            >
                                                {reinforcementData.averageReward >= 0
                                                    ? "+"
                                                    : ""}
                                                {reinforcementData.averageReward.toFixed(
                                                    2
                                                )}
                                            </Typography>

                                            <Typography
                                                fontSize={12}
                                                color="text.secondary"
                                            >
                                                Reward range: −1 to +1
                                            </Typography>

                                        </CardContent>

                                    </Card>


                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 3,
                                            border:
                                                "1px solid #E2E8F0",
                                            bgcolor:
                                                "#FFFFFF",
                                        }}
                                    >

                                        <CardContent
                                            sx={{
                                                p: 2,
                                                "&:last-child": {
                                                    pb: 2,
                                                },
                                            }}
                                        >

                                            <Typography
                                                fontSize={12}
                                                color="text.secondary"
                                                fontWeight={700}
                                            >
                                                AFR ADJUSTMENT
                                            </Typography>

                                            <Typography
                                                variant="h5"
                                                fontWeight={800}
                                                sx={{
                                                    mt: 0.5,
                                                    color:
                                                        getRewardColor(
                                                            reinforcementData.adjustment
                                                        ),
                                                }}
                                            >
                                                {reinforcementData.adjustment >= 0
                                                    ? "+"
                                                    : ""}
                                                {reinforcementData.adjustment.toFixed(
                                                    2
                                                )}
                                            </Typography>

                                            <Typography
                                                fontSize={12}
                                                color="text.secondary"
                                            >
                                                Applied to future action priority
                                            </Typography>

                                        </CardContent>

                                    </Card>


                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 3,
                                            border:
                                                "1px solid #E2E8F0",
                                            bgcolor:
                                                "#FFFFFF",
                                        }}
                                    >

                                        <CardContent
                                            sx={{
                                                p: 2,
                                                "&:last-child": {
                                                    pb: 2,
                                                },
                                            }}
                                        >

                                            <Typography
                                                fontSize={12}
                                                color="text.secondary"
                                                fontWeight={700}
                                            >
                                                FEEDBACK RECORDS
                                            </Typography>

                                            <Typography
                                                variant="h5"
                                                fontWeight={800}
                                                sx={{
                                                    mt: 0.5,
                                                }}
                                            >
                                                {matchingFeedback.length}
                                            </Typography>

                                            <Typography
                                                fontSize={12}
                                                color="text.secondary"
                                            >
                                                Matching records for this action
                                            </Typography>

                                        </CardContent>

                                    </Card>

                                </Box>


                                {/* =================================================
                                    REINFORCEMENT STATUS
                                ================================================= */}

                                <Box
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        borderRadius: 3,
                                        bgcolor:
                                            reinforcementData.adjustment > 0
                                                ? "#F1F8F3"
                                                : reinforcementData.adjustment < 0
                                                    ? "#FFF5F5"
                                                    : "#F8FAFC",
                                        border:
                                            `1px solid ${reinforcementData.adjustment > 0
                                                ? "#C8E6C9"
                                                : reinforcementData.adjustment < 0
                                                    ? "#FFCDD2"
                                                    : "#E2E8F0"
                                            }`,
                                    }}
                                >

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={2}
                                        alignItems={{
                                            xs: "flex-start",
                                            sm: "center",
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor:
                                                    reinforcementData.adjustment > 0
                                                        ? "#E8F5E9"
                                                        : reinforcementData.adjustment < 0
                                                            ? "#FFEBEE"
                                                            : "#F1F5F9",
                                                color:
                                                    getRewardColor(
                                                        reinforcementData.adjustment
                                                    ),
                                            }}
                                        >

                                            {reinforcementData.adjustment > 0 ? (
                                                <ArrowUpwardIcon />
                                            ) : reinforcementData.adjustment < 0 ? (
                                                <ArrowDownwardIcon />
                                            ) : (
                                                <RemoveIcon />
                                            )}

                                        </Box>

                                        <Box>

                                            <Typography
                                                fontWeight={800}
                                            >
                                                {adjustmentLabel}
                                            </Typography>

                                            <Typography
                                                fontSize={13}
                                                color="text.secondary"
                                                sx={{
                                                    mt: 0.3,
                                                }}
                                            >
                                                Average reinforcement reward:
                                                {" "}
                                                {rewardPercentage >= 0
                                                    ? "+"
                                                    : ""}
                                                {rewardPercentage.toFixed(
                                                    1
                                                )}
                                                %
                                            </Typography>

                                        </Box>

                                    </Stack>

                                </Box>


                                {/* =================================================
                                    REWARD DISTRIBUTION
                                ================================================= */}

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    spacing={1}
                                    sx={{
                                        mb: 3,
                                    }}
                                >

                                    <Chip
                                        icon={
                                            <ArrowUpwardIcon />
                                        }
                                        label={
                                            `${reinforcementData.positiveCount} positive`
                                        }
                                        sx={{
                                            bgcolor:
                                                "#E8F5E9",
                                            color:
                                                "#2E7D32",
                                            fontWeight: 700,
                                        }}
                                    />

                                    <Chip
                                        icon={
                                            <RemoveIcon />
                                        }
                                        label={
                                            `${reinforcementData.neutralCount} neutral`
                                        }
                                        sx={{
                                            bgcolor:
                                                "#F1F5F9",
                                            color:
                                                "#64748B",
                                            fontWeight: 700,
                                        }}
                                    />

                                    <Chip
                                        icon={
                                            <ArrowDownwardIcon />
                                        }
                                        label={
                                            `${reinforcementData.negativeCount} negative`
                                        }
                                        sx={{
                                            bgcolor:
                                                "#FFEBEE",
                                            color:
                                                "#C62828",
                                            fontWeight: 700,
                                        }}
                                    />

                                </Stack>


                                {/* =================================================
                                    FEEDBACK HISTORY
                                ================================================= */}

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 2,
                                    }}
                                >

                                    <HistoryIcon
                                        sx={{
                                            color:
                                                "#475569",
                                        }}
                                    />

                                    <Typography
                                        fontWeight={800}
                                    >
                                        Feedback History
                                    </Typography>

                                    <Chip
                                        label={
                                            `${matchingFeedback.length} records`
                                        }
                                        size="small"
                                        sx={{
                                            fontWeight: 700,
                                        }}
                                    />

                                </Stack>


                                <Stack
                                    spacing={1.5}
                                >

                                    {matchingFeedback
                                        .slice()
                                        .reverse()
                                        .map(
                                            (
                                                feedback,
                                                index
                                            ) => {

                                                const reward =
                                                    Math.max(
                                                        -1,
                                                        Math.min(
                                                            1,
                                                            (
                                                                feedback.successScore -
                                                                50
                                                            ) / 50
                                                        )
                                                    );

                                                return (

                                                    <Card
                                                        key={
                                                            feedback.id ??
                                                            `${feedback.actionName}-${index}`
                                                        }
                                                        elevation={0}
                                                        sx={{
                                                            borderRadius: 2.5,
                                                            border:
                                                                "1px solid #E2E8F0",
                                                            bgcolor:
                                                                "#FFFFFF",
                                                        }}
                                                    >

                                                        <CardContent
                                                            sx={{
                                                                p: 2,
                                                                "&:last-child": {
                                                                    pb: 2,
                                                                },
                                                            }}
                                                        >

                                                            <Stack
                                                                direction={{
                                                                    xs: "column",
                                                                    md: "row",
                                                                }}
                                                                spacing={2}
                                                                justifyContent="space-between"
                                                            >

                                                                <Box
                                                                    flex={1}
                                                                >

                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        alignItems="center"
                                                                        sx={{
                                                                            mb: 0.8,
                                                                        }}
                                                                    >

                                                                        <Chip
                                                                            label={
                                                                                feedback.implementationStatus
                                                                            }
                                                                            size="small"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                            }}
                                                                        />

                                                                        <Chip
                                                                            label={
                                                                                `${feedback.successScore}% success`
                                                                            }
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor:
                                                                                    "#E8F5E9",
                                                                                color:
                                                                                    "#2E7D32",
                                                                                fontWeight: 700,
                                                                            }}
                                                                        />

                                                                    </Stack>

                                                                    {feedback.comments && (

                                                                        <Typography
                                                                            fontSize={13}
                                                                            color="text.secondary"
                                                                            sx={{
                                                                                lineHeight: 1.6,
                                                                            }}
                                                                        >
                                                                            {feedback.comments}
                                                                        </Typography>

                                                                    )}

                                                                </Box>


                                                                <Box
                                                                    sx={{
                                                                        minWidth: {
                                                                            xs: "100%",
                                                                            md: 130,
                                                                        },
                                                                        textAlign: {
                                                                            xs: "left",
                                                                            md: "right",
                                                                        },
                                                                    }}
                                                                >

                                                                    <Typography
                                                                        fontSize={11}
                                                                        color="text.secondary"
                                                                        fontWeight={700}
                                                                    >
                                                                        REWARD
                                                                    </Typography>

                                                                    <Typography
                                                                        fontWeight={800}
                                                                        sx={{
                                                                            color:
                                                                                getRewardColor(
                                                                                    reward
                                                                                ),
                                                                        }}
                                                                    >
                                                                        {reward >= 0
                                                                            ? "+"
                                                                            : ""}
                                                                        {reward.toFixed(
                                                                            2
                                                                        )}
                                                                    </Typography>

                                                                    <Typography
                                                                        fontSize={11}
                                                                        color="text.secondary"
                                                                    >
                                                                        {getRewardLabel(
                                                                            reward
                                                                        )}
                                                                    </Typography>

                                                                </Box>

                                                            </Stack>

                                                        </CardContent>

                                                    </Card>

                                                );

                                            }
                                        )}

                                </Stack>

                            </>

                        )}

                    </CardContent>

                </Card>


                {/* =====================================================
                    REINFORCEMENT PIPELINE
                ===================================================== */}

                <Card
                    elevation={0}
                    sx={{
                        mt: 3,
                        borderRadius: 3,
                        border:
                            "1px solid #E2E8F0",
                        bgcolor: "#F8FAFC",
                    }}
                >

                    <CardContent
                        sx={{
                            p: 2.5,
                            "&:last-child": {
                                pb: 2.5,
                            },
                        }}
                    >

                        <Stack
                            direction={{
                                xs: "column",
                                md: "row",
                            }}
                            spacing={{
                                xs: 2,
                                md: 0,
                            }}
                            alignItems={{
                                xs: "flex-start",
                                md: "center",
                            }}
                            justifyContent="space-between"
                        >

                            <Box>

                                <Typography
                                    fontSize={12}
                                    color="text.secondary"
                                    fontWeight={700}
                                >
                                    RB-AFR PIPELINE
                                </Typography>

                                <Typography
                                    fontWeight={800}
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    Feedback → Reward → Adaptive Priority
                                </Typography>

                            </Box>


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

                                <Chip
                                    label="Implementation Feedback"
                                    size="small"
                                />

                                <Typography
                                    color="text.secondary"
                                >
                                    →
                                </Typography>

                                <Chip
                                    label="Reward Signal"
                                    size="small"
                                    sx={{
                                        bgcolor:
                                            "#F3E5F5",
                                        color:
                                            "#7B1FA2",
                                        fontWeight: 700,
                                    }}
                                />

                                <Typography
                                    color="text.secondary"
                                >
                                    →
                                </Typography>

                                <Chip
                                    label="AFR Adjustment"
                                    size="small"
                                    sx={{
                                        bgcolor:
                                            "#E8F5E9",
                                        color:
                                            "#2E7D32",
                                        fontWeight: 700,
                                    }}
                                />

                                <Typography
                                    color="text.secondary"
                                >
                                    →
                                </Typography>

                                <Chip
                                    label="Future AMSDOA Priority"
                                    size="small"
                                    sx={{
                                        bgcolor:
                                            "#E3F2FD",
                                        color:
                                            "#1565C0",
                                        fontWeight: 700,
                                    }}
                                />

                            </Stack>

                        </Stack>

                    </CardContent>

                </Card>


                {loadingHistory && (

                    <Typography
                        fontSize={12}
                        color="text.secondary"
                        sx={{
                            mt: 1.5,
                        }}
                    >
                        Refreshing AFR feedback history...
                    </Typography>

                )}

            </CardContent>

        </Card>
    );
};

export default DecisionFeedback;