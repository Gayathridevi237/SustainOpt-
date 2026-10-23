import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ScienceIcon from "@mui/icons-material/Science";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SpeedIcon from "@mui/icons-material/Speed";
import SavingsIcon from "@mui/icons-material/Savings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    simulateScenario,
} from "../api/twinSnapshotApi";

import type {
    ScenarioSimulationResponse,
} from "../api/twinSnapshotApi";

const ORGANIZATION_ID = 4;

const ScenarioSimulation = () => {
    const navigate = useNavigate();

    const [electricityReduction, setElectricityReduction] =
        useState(10);

    const [waterReduction, setWaterReduction] =
        useState(10);

    const [wasteReduction, setWasteReduction] =
        useState(10);

    const [renewableIncrease, setRenewableIncrease] =
        useState(10);

    const [simulation, setSimulation] =
        useState<ScenarioSimulationResponse | null>(null);

    const [comparisons, setComparisons] =
        useState<
            Array<{
                name: string;
                description: string;
                electricity: number;
                water: number;
                waste: number;
                renewable: number;
                result: ScenarioSimulationResponse;
            }>
        >([]);

    const [loading, setLoading] =
        useState(false);

    const [comparisonLoading, setComparisonLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSimulation = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await simulateScenario({
                organizationId: ORGANIZATION_ID,
                electricityReductionPercentage:
                    electricityReduction,
                waterReductionPercentage:
                    waterReduction,
                wasteReductionPercentage:
                    wasteReduction,
                renewableEnergyIncreasePercentage:
                    renewableIncrease,
            });

            setSimulation(result);
        } catch (err) {
            console.error(
                "Scenario simulation failed:",
                err
            );

            setError(
                "Unable to run the scenario simulation. Please make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleCompareScenarios = async () => {
        setError("");
        setComparisonLoading(true);

        const presets = [
            {
                name: "Conservative",
                description: "Moderate operational improvement",
                electricity: 5,
                water: 5,
                waste: 5,
                renewable: 5,
            },
            {
                name: "Balanced",
                description: "Coordinated sustainability improvement",
                electricity: 10,
                water: 10,
                waste: 10,
                renewable: 10,
            },
            {
                name: "Accelerated",
                description: "Higher-intensity intervention plan",
                electricity: 20,
                water: 20,
                waste: 20,
                renewable: 20,
            },
        ];

        try {
            const results = await Promise.all(
                presets.map(async (preset) => {
                    const result = await simulateScenario({
                        organizationId: ORGANIZATION_ID,
                        electricityReductionPercentage:
                            preset.electricity,
                        waterReductionPercentage:
                            preset.water,
                        wasteReductionPercentage:
                            preset.waste,
                        renewableEnergyIncreasePercentage:
                            preset.renewable,
                    });

                    return {
                        ...preset,
                        result,
                    };
                })
            );

            setComparisons(results);
        } catch (err) {
            console.error(
                "Scenario comparison failed:",
                err
            );

            setError(
                "Unable to compare scenarios. Please make sure the backend is running."
            );
        } finally {
            setComparisonLoading(false);
        }
    };

    const MetricResult = ({
        label,
        value,
    }: {
        label: string;
        value: number;
    }) => (
        <Box
            sx={{
                p: 2.5,
                borderRadius: 2.5,
                border: "1px solid #DDE5E1",
                bgcolor: "#FFFFFF",
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: "#64748B",
                    mb: 1,
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                    color: "#15803D",
                }}
            >
                {value.toLocaleString()}
            </Typography>
        </Box>
    );

    const getReduction = (baseline: number, predicted: number) => {
        if (!baseline) return 0;
        return ((baseline - predicted) / baseline) * 100;
    };

    const getShiStatusColor = (status: string) => {
        if (status === "Excellent") return "#15803D";
        if (status === "Good") return "#2563EB";
        if (status === "Moderate") return "#D97706";
        return "#DC2626";
    };

    return (
        <Box
            sx={{
                minHeight: "100%",
                bgcolor: "#F6F8FB",
                p: {
                    xs: 2,
                    md: 4,
                },
            }}
        >
            <Box
                sx={{
                    mb: 4,
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
                }}
            >
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() =>
                            navigate("/digital-twin")
                        }
                        sx={{
                            mb: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            color: "#526581",
                        }}
                    >
                        Back to Digital Twin
                    </Button>

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ mb: 1 }}
                    >
                        <ScienceIcon
                            sx={{
                                color: "#15803D",
                                fontSize: 30,
                            }}
                        />

                        <Typography
                            variant="overline"
                            sx={{
                                color: "#15803D",
                                fontWeight: 800,
                                letterSpacing: 1.2,
                            }}
                        >
                            SUSTAINOPT SCENARIO ENGINE
                        </Typography>
                    </Stack>

                    <Typography
                        variant="h3"
                        fontWeight={800}
                        sx={{
                            color: "#172033",
                            mb: 1,
                        }}
                    >
                        Scenario Simulation
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "#64748B",
                            maxWidth: 850,
                            lineHeight: 1.7,
                        }}
                    >
                        Evaluate sustainability what-if scenarios
                        before implementation by estimating their
                        environmental and economic effects.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                        bgcolor: "#ECFDF3",
                        border: "1px solid #BBF7D0",
                        color: "#15803D",
                        fontWeight: 800,
                    }}
                >
                    What-If Analysis
                </Box>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            <Card
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    boxShadow:
                        "0 4px 18px rgba(15,23,42,0.05)",
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
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 1 }}
                    >
                        <ScienceIcon
                            sx={{
                                color: "#15803D",
                            }}
                        />

                        <Typography
                            variant="h5"
                            fontWeight={800}
                            color="#172033"
                        >
                            Configure What-If Scenario
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#64748B",
                            mb: 3,
                        }}
                    >
                        Define hypothetical sustainability
                        improvements and let the backend simulation
                        engine calculate the resulting state.
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Electricity Reduction (%)"
                                type="number"
                                value={electricityReduction}
                                onChange={(e) =>
                                    setElectricityReduction(
                                        Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        )
                                    )
                                }
                                inputProps={{
                                    min: 0,
                                    max: 100,
                                }}
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Water Reduction (%)"
                                type="number"
                                value={waterReduction}
                                onChange={(e) =>
                                    setWaterReduction(
                                        Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        )
                                    )
                                }
                                inputProps={{
                                    min: 0,
                                    max: 100,
                                }}
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Waste Reduction (%)"
                                type="number"
                                value={wasteReduction}
                                onChange={(e) =>
                                    setWasteReduction(
                                        Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        )
                                    )
                                }
                                inputProps={{
                                    min: 0,
                                    max: 100,
                                }}
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Renewable Increase (%)"
                                type="number"
                                value={renewableIncrease}
                                onChange={(e) =>
                                    setRenewableIncrease(
                                        Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        )
                                    )
                                }
                                inputProps={{
                                    min: 0,
                                    max: 100,
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        startIcon={
                            loading ? (
                                <CircularProgress
                                    size={19}
                                    color="inherit"
                                />
                            ) : (
                                <ScienceIcon />
                            )
                        }
                        onClick={handleSimulation}
                        disabled={loading}
                        sx={{
                            mt: 3,
                            px: 4,
                            py: 1.4,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 800,
                            bgcolor: "#2E7D32",
                            "&:hover": {
                                bgcolor: "#256B29",
                            },
                        }}
                    >
                        {loading
                            ? "Running Simulation..."
                            : "Run Scenario Simulation"}
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={
                            comparisonLoading ? (
                                <CircularProgress
                                    size={18}
                                />
                            ) : (
                                <CompareArrowsIcon />
                            )
                        }
                        onClick={handleCompareScenarios}
                        disabled={comparisonLoading}
                        sx={{
                            mt: 2,
                            ml: {
                                xs: 0,
                                md: 2,
                            },
                            px: 3,
                            py: 1.35,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 800,
                            borderColor: "#2E7D32",
                            color: "#2E7D32",
                            "&:hover": {
                                borderColor: "#256B29",
                                bgcolor: "#F0FDF4",
                            },
                        }}
                    >
                        {comparisonLoading
                            ? "Comparing..."
                            : "Compare Standard Scenarios"}
                    </Button>
                </CardContent>
            </Card>

            {simulation && (
                <Card
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: "1px solid #BBF7D0",
                        bgcolor: "#F7FFF9",
                        boxShadow:
                            "0 4px 18px rgba(15,23,42,0.04)",
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
                            spacing={2}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                            <TrendingDownIcon
                                sx={{
                                    color: "#15803D",
                                    fontSize: 32,
                                }}
                            />

                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                    color="#172033"
                                >
                                    Simulated Sustainability Impact
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="#64748B"
                                >
                                    Backend-generated projection
                                    for the selected scenario.
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Grid container spacing={2}>
                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                }}
                            >
                                <MetricResult
                                    label="Predicted Electricity"
                                    value={
                                        simulation.predictedElectricityConsumption
                                    }
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                }}
                            >
                                <MetricResult
                                    label="Predicted Water"
                                    value={
                                        simulation.predictedWaterConsumption
                                    }
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                }}
                            >
                                <MetricResult
                                    label="Predicted Carbon"
                                    value={
                                        simulation.predictedCarbonEmission
                                    }
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                }}
                            >
                                <MetricResult
                                    label="Predicted Waste"
                                    value={
                                        simulation.predictedWasteGenerated
                                    }
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                }}
                            >
                                <MetricResult
                                    label="Predicted Renewable (%)"
                                    value={
                                        simulation.predictedRenewableEnergyUsage
                                    }
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3,
                                }}
                            >
                                <MetricResult
                                    label="Projected SHI"
                                    value={
                                        simulation.projectedShiScore
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Box
                            sx={{
                                mt: 3,
                                p: 3,
                                borderRadius: 2.5,
                                bgcolor: "#FFFFFF",
                                border: "1px solid #DDE5E1",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <SavingsIcon
                                    sx={{
                                        color: "#15803D",
                                        fontSize: 32,
                                    }}
                                />

                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="#64748B"
                                    >
                                        Estimated Cost Saving
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={800}
                                        color="#15803D"
                                    >
                                        {
                                            simulation.estimatedCostSaving
                                        }
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Box
                            sx={{
                                mt: 3,
                                p: 2.5,
                                borderRadius: 2.5,
                                bgcolor: "#F8FAFC",
                                border: "1px solid #E2E8F0",
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                fontWeight={800}
                                color="#172033"
                                sx={{ mb: 1 }}
                            >
                                Backend Projection Model
                            </Typography>

                            <Typography
                                variant="body2"
                                color="#64748B"
                                sx={{ lineHeight: 1.7 }}
                            >
                                Electricity, water and waste use the
                                configured reduction percentages.
                                Renewable energy is capped at 100%.
                                Carbon reduction uses the backend
                                scenario assumption of 70% electricity
                                intervention and 30% renewable-energy
                                intervention.
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={700}
                                color="#15803D"
                                sx={{ mt: 1.5 }}
                            >
                                Carbon reduction:{" "}
                                {simulation.carbonReductionPercentage.toFixed(2)}%
                                {"  "}•{"  "}
                                Projected SHI:{" "}
                                {simulation.projectedShiScore.toFixed(2)}
                                {"  "}•{"  "}
                                Status: {simulation.shiStatus}
                            </Typography>
                        </Box>

                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mt: 3,
                                color: "#94A3B8",
                            }}
                        >
                            Simulation generated at{" "}
                            {new Date(
                                simulation.simulationTime
                            ).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>
            )}


            {simulation && (
                <Card
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ mb: 3 }}>
                            <Box>
                                <Typography variant="h6" fontWeight={800} color="#172033">
                                    Baseline vs Scenario Impact
                                </Typography>
                                <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
                                    A concise before-and-after view of the simulated intervention.
                                </Typography>
                            </Box>
                            <Box sx={{ px: 1.5, py: 0.75, borderRadius: 2, bgcolor: "#F0FDF4", color: "#15803D", fontWeight: 800, fontSize: 13 }}>
                                Backend Projection
                            </Box>
                        </Stack>

                        <Grid container spacing={2}>
                            {[
                                { label: "Electricity", baseline: simulation.baselineElectricityConsumption, predicted: simulation.predictedElectricityConsumption, unit: "kWh" },
                                { label: "Water", baseline: simulation.baselineWaterConsumption, predicted: simulation.predictedWaterConsumption, unit: "L" },
                                { label: "Waste", baseline: simulation.baselineWasteGenerated, predicted: simulation.predictedWasteGenerated, unit: "kg" },
                                { label: "Carbon", baseline: simulation.baselineCarbonEmission, predicted: simulation.predictedCarbonEmission, unit: "kg CO₂e" },
                            ].map((item) => {
                                const reduction = getReduction(item.baseline, item.predicted);
                                return (
                                    <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Box sx={{ p: 2.5, border: "1px solid #E2E8F0", borderRadius: 2.5, bgcolor: "#FAFCFB" }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography fontSize={13} fontWeight={800} color="#475569">{item.label}</Typography>
                                                <CheckCircleOutlineIcon sx={{ color: "#15803D", fontSize: 19 }} />
                                            </Stack>
                                            <Typography sx={{ mt: 1.5, fontSize: 13, color: "#64748B" }}>
                                                {item.baseline.toFixed(2)} {item.unit} →
                                            </Typography>
                                            <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#172033" }}>
                                                {item.predicted.toFixed(2)} {item.unit}
                                            </Typography>
                                            <Typography sx={{ mt: 0.75, fontSize: 12, fontWeight: 800, color: reduction >= 0 ? "#15803D" : "#DC2626" }}>
                                                {reduction >= 0 ? "↓" : "↑"} {Math.abs(reduction).toFixed(2)}% from baseline
                                            </Typography>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        <Box sx={{ mt: 2, p: 2.5, borderRadius: 2.5, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                                <SpeedIcon sx={{ color: getShiStatusColor(simulation.shiStatus), fontSize: 30 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography fontSize={13} color="#64748B">Projected Sustainability Health</Typography>
                                    <Typography fontWeight={800} color="#172033">
                                        SHI {simulation.projectedShiScore.toFixed(2)} · {simulation.shiStatus}
                                    </Typography>
                                </Box>
                                <Typography fontSize={13} fontWeight={800} color="#15803D">
                                    Estimated saving: {simulation.estimatedCostSaving.toFixed(2)}
                                </Typography>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {comparisons.length > 0 && (
                <Card
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: "1px solid #E2E8F0",
                        boxShadow:
                            "0 4px 18px rgba(15,23,42,0.04)",
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
                            spacing={1.5}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                            <CompareArrowsIcon
                                sx={{
                                    color: "#15803D",
                                }}
                            />

                            <Typography
                                variant="h6"
                                fontWeight={800}
                                color="#172033"
                            >
                                Scenario Comparison
                            </Typography>
                        </Stack>

                        <Typography
                            variant="body2"
                            color="#64748B"
                            sx={{
                                mb: 3,
                                lineHeight: 1.7,
                            }}
                        >
                            Compare the backend-generated projections
                            for three predefined intervention levels.
                            Every value below is returned by the
                            scenario simulation service.
                        </Typography>

                        <Box
                            sx={{
                                overflowX: "auto",
                            }}
                        >
                            <Box
                                component="table"
                                sx={{
                                    width: "100%",
                                    minWidth: 900,
                                    borderCollapse: "collapse",
                                    "& th, & td": {
                                        borderBottom:
                                            "1px solid #E2E8F0",
                                        padding: "14px 12px",
                                        textAlign: "left",
                                    },
                                    "& th": {
                                        backgroundColor: "#F8FAFC",
                                        color: "#475569",
                                        fontSize: 13,
                                        fontWeight: 800,
                                    },
                                    "& td": {
                                        color: "#334155",
                                        fontSize: 14,
                                    },
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Scenario</th>
                                        <th>Electricity</th>
                                        <th>Water</th>
                                        <th>Waste</th>
                                        <th>Carbon</th>
                                        <th>Renewable</th>
                                        <th>Projected SHI</th>
                                        <th>Cost Saving</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {comparisons.map((item) => (
                                        <tr key={item.name}>
                                            <td>
                                                <Typography
                                                    fontWeight={800}
                                                    color="#172033"
                                                >
                                                    {item.name}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="#94A3B8"
                                                >
                                                    {item.description}
                                                </Typography>
                                            </td>

                                            <td>
                                                {item.result.predictedElectricityConsumption.toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td>
                                                {item.result.predictedWaterConsumption.toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td>
                                                {item.result.predictedWasteGenerated.toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td>
                                                {item.result.predictedCarbonEmission.toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td>
                                                {item.result.predictedRenewableEnergyUsage.toFixed(
                                                    2
                                                )}%
                                            </td>

                                            <td>
                                                <Typography
                                                    fontWeight={800}
                                                    color="#15803D"
                                                >
                                                    {item.result.projectedShiScore.toFixed(
                                                        2
                                                    )}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="#64748B"
                                                >
                                                    {item.result.shiStatus}
                                                </Typography>
                                            </td>

                                            <td>
                                                {item.result.estimatedCostSaving.toFixed(
                                                    2
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Card
                sx={{
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    boxShadow:
                        "0 4px 18px rgba(15,23,42,0.04)",
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
                    <Typography
                        variant="h6"
                        fontWeight={800}
                        color="#172033"
                        sx={{ mb: 1 }}
                    >
                        Scenario Simulation Workflow
                    </Typography>

                    <Typography
                        variant="body2"
                        color="#64748B"
                        sx={{
                            maxWidth: 900,
                            lineHeight: 1.7,
                        }}
                    >
                        Current sustainability state → user-defined
                        what-if parameters → backend scenario simulation
                        engine → predicted environmental outcomes →
                        estimated economic effect.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ScenarioSimulation;