import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    MenuItem,
    Rating,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HistoryIcon from "@mui/icons-material/History";

import {
    getFeedback,
    submitFeedback,
    type DecisionFeedback,
} from "../../api/feedbackApi";

interface FeedbackPanelProps {
    metricId: number;
    actionName: string;
}

const FeedbackPanel = ({
    metricId,
    actionName,
}: FeedbackPanelProps) => {

    const [implementationStatus, setImplementationStatus] =
        useState("IMPLEMENTED");

    const [successScore, setSuccessScore] =
        useState(4);

    const [comments, setComments] =
        useState("");

    const [feedbackHistory, setFeedbackHistory] =
        useState<DecisionFeedback[]>([]);

    const [loadingHistory, setLoadingHistory] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");


    useEffect(() => {

        const loadFeedback = async () => {

            try {

                setLoadingHistory(true);

                const data =
                    await getFeedback(metricId);

                setFeedbackHistory(data);

            } catch (error) {

                console.error(
                    "Failed to load feedback:",
                    error
                );

            } finally {

                setLoadingHistory(false);

            }
        };

        loadFeedback();

    }, [metricId]);


    const handleSubmit = async () => {

        setSuccessMessage("");
        setErrorMessage("");

        if (!actionName.trim()) {

            setErrorMessage(
                "Unable to submit feedback because the action name is missing."
            );

            return;
        }

        try {

            setSubmitting(true);

            const feedback: DecisionFeedback = {

                metricId,

                actionName,

                implementationStatus,

                successScore: successScore * 20,

                comments: comments.trim(),
            };

            const savedFeedback =
                await submitFeedback(feedback);

            setFeedbackHistory((previous) => [
                ...previous,
                savedFeedback,
            ]);

            setSuccessMessage(
                "Feedback submitted successfully. AMSDOA can use this outcome to refine future decisions."
            );

            setComments("");

            setSuccessScore(4);

        } catch (error) {

            console.error(
                "Failed to submit feedback:",
                error
            );

            setErrorMessage(
                "Unable to submit feedback. Please make sure the backend is running."
            );

        } finally {

            setSubmitting(false);

        }
    };


    const getStatusColor = (
        status: string
    ) => {

        switch (status) {

            case "IMPLEMENTED":
                return "#2E7D32";

            case "PARTIALLY_IMPLEMENTED":
                return "#F57C00";

            case "NOT_IMPLEMENTED":
                return "#D32F2F";

            default:
                return "#64748B";
        }
    };


    return (

        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #DDE5E1",
                background:
                    "linear-gradient(135deg,#F8FFFA,#FFFFFF)",
                overflow: "hidden",
            }}
        >

            {/* Header */}

            <Box
                sx={{
                    px: {
                        xs: 3,
                        md: 4,
                    },
                    py: 2.5,
                    background:
                        "linear-gradient(135deg,#E8F5E9,#F1F8E9)",
                    borderBottom:
                        "1px solid #DDE5E1",
                }}
            >

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >

                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2.5,
                            bgcolor: "#2E7D32",
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >

                        <FeedbackIcon />

                    </Box>

                    <Box>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                            }}
                        >
                            Adaptive Feedback Refinement
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.3,
                                fontSize: 14,
                            }}
                        >
                            Record the outcome of this sustainability action
                            to improve future AMSDOA decisions.
                        </Typography>

                    </Box>

                </Stack>

            </Box>


            <CardContent
                sx={{
                    p: {
                        xs: 3,
                        md: 4,
                    },
                }}
            >

                {/* Selected Action */}

                <Box
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
                        bgcolor: "#F8FAFC",
                        border:
                            "1px solid #E2E8F0",
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#64748B",
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                        }}
                    >
                        Selected Decision
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.7,
                            fontWeight: 700,
                            lineHeight: 1.5,
                        }}
                    >
                        {actionName}
                    </Typography>

                </Box>


                {/* Form */}

                <Stack
                    spacing={3}
                >

                    {/* Implementation Status */}

                    <Box>

                        <Typography
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            Implementation Status
                        </Typography>

                        <Select
                            fullWidth
                            value={implementationStatus}
                            onChange={(event) =>
                                setImplementationStatus(
                                    event.target.value
                                )
                            }
                            sx={{
                                borderRadius: 2.5,
                                bgcolor: "#FFFFFF",
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

                        </Select>

                    </Box>


                    {/* Success Score */}

                    <Box>

                        <Typography
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            Implementation Success
                        </Typography>

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

                            <Rating
                                value={successScore}
                                onChange={(
                                    _event,
                                    value
                                ) => {

                                    if (value !== null) {
                                        setSuccessScore(value);
                                    }

                                }}
                                max={5}
                                size="large"
                            />

                            <Chip
                                label={`${successScore * 20}% success`}
                                sx={{
                                    bgcolor: "#E8F5E9",
                                    color: "#2E7D32",
                                    fontWeight: 800,
                                }}
                            />

                        </Stack>

                    </Box>


                    {/* Comments */}

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Implementation Feedback"
                        placeholder="Describe the implementation outcome, observed benefits, challenges, or improvements..."
                        value={comments}
                        onChange={(event) =>
                            setComments(
                                event.target.value
                            )
                        }
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2.5,
                                bgcolor: "#FFFFFF",
                            },
                        }}
                    />


                    {/* Messages */}

                    {successMessage && (

                        <Alert
                            severity="success"
                            icon={<CheckCircleIcon />}
                            sx={{
                                borderRadius: 2.5,
                            }}
                        >
                            {successMessage}
                        </Alert>

                    )}


                    {errorMessage && (

                        <Alert
                            severity="error"
                            sx={{
                                borderRadius: 2.5,
                            }}
                        >
                            {errorMessage}
                        </Alert>

                    )}


                    {/* Submit */}

                    <Button
                        variant="contained"
                        startIcon={
                            submitting
                                ? <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                                : <SendIcon />
                        }
                        onClick={handleSubmit}
                        disabled={submitting}
                        sx={{
                            alignSelf: {
                                xs: "stretch",
                                sm: "flex-start",
                            },
                            borderRadius: 2.5,
                            px: 3,
                            py: 1.3,
                            bgcolor: "#2E7D32",
                            fontWeight: 700,

                            "&:hover": {
                                bgcolor: "#256B2A",
                            },
                        }}
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Feedback"}
                    </Button>

                </Stack>


                {/* Feedback History */}

                <Divider
                    sx={{
                        my: 4,
                    }}
                />

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={2}
                >

                    <HistoryIcon
                        sx={{
                            color: "#1976D2",
                        }}
                    />

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                        }}
                    >
                        Previous Feedback
                    </Typography>

                </Stack>


                {loadingHistory ? (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 3,
                        }}
                    >

                        <CircularProgress
                            size={28}
                            sx={{
                                color: "#2E7D32",
                            }}
                        />

                    </Box>

                ) : feedbackHistory.length === 0 ? (

                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            bgcolor: "#F8FAFC",
                            border:
                                "1px dashed #CBD5E1",
                        }}
                    >

                        <Typography
                            color="text.secondary"
                            textAlign="center"
                        >
                            No feedback has been recorded for this metric yet.
                        </Typography>

                    </Box>

                ) : (

                    <Stack
                        spacing={2}
                    >

                        {feedbackHistory.map(
                            (
                                feedback,
                                index
                            ) => (

                                <Box
                                    key={
                                        feedback.id ??
                                        `${feedback.actionName}-${index}`
                                    }
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 3,
                                        bgcolor: "#F8FAFC",
                                        border:
                                            "1px solid #E2E8F0",
                                    }}
                                >

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        justifyContent="space-between"
                                        spacing={2}
                                    >

                                        <Box>

                                            <Typography
                                                fontWeight={700}
                                            >
                                                {feedback.actionName}
                                            </Typography>

                                            {feedback.comments && (

                                                <Typography
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 1,
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {feedback.comments}
                                                </Typography>

                                            )}

                                        </Box>


                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="flex-start"
                                            flexWrap="wrap"
                                        >

                                            <Chip
                                                size="small"
                                                label={
                                                    feedback.implementationStatus
                                                        .replace(
                                                            /_/g,
                                                            " "
                                                        )
                                                }
                                                sx={{
                                                    bgcolor:
                                                        `${getStatusColor(
                                                            feedback.implementationStatus
                                                        )}15`,
                                                    color:
                                                        getStatusColor(
                                                            feedback.implementationStatus
                                                        ),
                                                    fontWeight: 700,
                                                }}
                                            />

                                            <Chip
                                                size="small"
                                                label={`${feedback.successScore}%`}
                                                sx={{
                                                    bgcolor: "#E3F2FD",
                                                    color: "#1976D2",
                                                    fontWeight: 800,
                                                }}
                                            />

                                        </Stack>

                                    </Stack>

                                </Box>

                            )
                        )}

                    </Stack>

                )}

            </CardContent>

        </Card>
    );
};

export default FeedbackPanel;