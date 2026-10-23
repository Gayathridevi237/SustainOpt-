import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ScienceIcon from "@mui/icons-material/Science";
import RefreshIcon from "@mui/icons-material/Refresh";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import Co2Icon from "@mui/icons-material/Co2";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SyncIcon from "@mui/icons-material/Sync";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HubIcon from "@mui/icons-material/Hub";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
    getLatestTwinSnapshot,
    simulateScenario,
} from "../api/twinSnapshotApi";

import type {
    TwinSnapshot,
    ScenarioSimulationResponse,
} from "../api/twinSnapshotApi";


function DigitalTwin() {

    /*
     * Organization currently verified with the existing
     * Digital Twin backend integration.
     */
    const organizationId = 4;

    const [snapshot, setSnapshot] =
        useState<TwinSnapshot | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [electricityReduction, setElectricityReduction] =
        useState(10);

    const [waterReduction, setWaterReduction] =
        useState(15);

    const [wasteReduction, setWasteReduction] =
        useState(20);

    const [renewableIncrease, setRenewableIncrease] =
        useState(25);

    const [simulation, setSimulation] =
        useState<ScenarioSimulationResponse | null>(null);

    const [simulationLoading, setSimulationLoading] =
        useState(false);


    const loadSnapshot = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getLatestTwinSnapshot(organizationId);

            setSnapshot(data);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to load the Digital Twin snapshot."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadSnapshot();
    }, []);


    const handleSimulation = async () => {

        try {

            setSimulationLoading(true);
            setError("");

            const result =
                await simulateScenario({

                    organizationId,

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

            console.error(err);

            setError(
                "Unable to run the scenario simulation."
            );

        } finally {

            setSimulationLoading(false);

        }
    };


    const clampPercentage = (value: number) =>
        Math.min(Math.max(value, 0), 100);


    const stateIndicators = useMemo(() => {

        if (!snapshot) {
            return [];
        }

        return [
            {
                label: "Renewable Energy",
                value: snapshot.renewableEnergyUsage,
                icon: <EnergySavingsLeafIcon />,
                description: "Current renewable energy adoption",
            },
            {
                label: "Recycling",
                value: snapshot.recyclingRate,
                icon: <RecyclingIcon />,
                description: "Current recycling rate",
            },
            {
                label: "Green Transportation",
                value: snapshot.greenTransportationUsage,
                icon: <DirectionsCarIcon />,
                description: "Current green transportation usage",
            },
        ];

    }, [snapshot]);


    const twinState = useMemo(() => {

        if (!snapshot) {
            return {
                label: "Unavailable",
                description: "No current twin state is available.",
            };
        }

        const renewable =
            clampPercentage(snapshot.renewableEnergyUsage);

        const recycling =
            clampPercentage(snapshot.recyclingRate);

        const transport =
            clampPercentage(snapshot.greenTransportationUsage);

        const average =
            (renewable + recycling + transport) / 3;

        if (average >= 70) {
            return {
                label: "Strong",
                description:
                    "The current twin state shows strong adoption across the tracked sustainability indicators.",
            };
        }

        if (average >= 50) {
            return {
                label: "Stable",
                description:
                    "The current twin state shows moderate sustainability adoption with opportunities for improvement.",
            };
        }

        return {
            label: "Needs Improvement",
            description:
                "The current twin state indicates significant opportunities for sustainability improvement.",
        };

    }, [snapshot]);


    const simulationImpact = useMemo(() => {

        if (!snapshot || !simulation) {
            return null;
        }

        const electricityChange =
            snapshot.electricityConsumption -
            simulation.predictedElectricityConsumption;

        const waterChange =
            snapshot.waterConsumption -
            simulation.predictedWaterConsumption;

        const carbonChange =
            snapshot.carbonEmission -
            simulation.predictedCarbonEmission;

        const wasteChange =
            snapshot.wasteGenerated -
            simulation.predictedWasteGenerated;

        return {
            electricityChange,
            waterChange,
            carbonChange,
            wasteChange,
        };

    }, [snapshot, simulation]);


    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#F5F8FA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                >
                    <CircularProgress
                        sx={{
                            color: "#2E7D32",
                        }}
                    />

                    <Typography
                        sx={{
                            color: "#667085",
                            fontWeight: 600,
                        }}
                    >
                        Loading Digital Twin...
                    </Typography>
                </Stack>
            </Box>
        );
    }


    if (!snapshot) {

        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#F5F8FA",
                    p: {
                        xs: 2,
                        md: 4,
                    },
                }}
            >
                <Alert
                    severity="error"
                    sx={{
                        maxWidth: 720,
                        mx: "auto",
                        mt: 5,
                    }}
                >
                    {error ||
                        "Digital Twin snapshot not available."}
                </Alert>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={loadSnapshot}
                        sx={{
                            backgroundColor: "#2E7D32",
                            fontWeight: 700,
                            "&:hover": {
                                backgroundColor: "#256B29",
                            },
                        }}
                    >
                        Retry
                    </Button>
                </Box>
            </Box>
        );
    }


    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F5F8FA",
                p: {
                    xs: 2,
                    md: 4,
                },
            }}
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <Box sx={{ mb: 4 }}>

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
                            spacing={1.5}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >

                            <Box
                                sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: 3,
                                    background:
                                        "linear-gradient(135deg,#E8F5E9,#C8E6C9)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#2E7D32",
                                }}
                            >
                                <HubIcon />
                            </Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    color: "#101828",
                                }}
                            >
                                Digital Twin
                            </Typography>

                        </Stack>

                        <Typography
                            sx={{
                                color: "#667085",
                                fontSize: 16,
                                maxWidth: 820,
                                lineHeight: 1.7,
                            }}
                        >
                            A virtual representation of the
                            organization&apos;s current sustainability
                            state, combining operational indicators,
                            synchronization status, and what-if
                            scenario analysis.
                        </Typography>

                    </Box>


                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadSnapshot}
                        sx={{
                            borderColor: "#2E7D32",
                            color: "#2E7D32",
                            fontWeight: 700,
                            borderRadius: 2.5,
                            px: 2.5,
                            "&:hover": {
                                borderColor: "#256B29",
                                backgroundColor: "#F0F8F1",
                            },
                        }}
                    >
                        Refresh Twin
                    </Button>

                </Stack>

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


            {/* =====================================================
                TWIN OVERVIEW
            ===================================================== */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 3,
                        md: 4,
                    },
                    mb: 3,
                    borderRadius: 4,
                    border: "1px solid #DDE4E8",
                    background:
                        "linear-gradient(135deg,#FFFFFF 0%,#F8FCF9 100%)",
                }}
            >

                <Grid
                    container
                    spacing={3}
                    alignItems="center"
                >

                    <Grid
                        size={{
                            xs: 12,
                            md: 7,
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="flex-start"
                        >

                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    flexShrink: 0,
                                    borderRadius: 3,
                                    backgroundColor: "#E8F5E9",
                                    color: "#2E7D32",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <ScienceIcon
                                    sx={{
                                        fontSize: 30,
                                    }}
                                />
                            </Box>

                            <Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#101828",
                                        mb: 0.7,
                                    }}
                                >
                                    Organization Sustainability Twin
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#667085",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    Organization #{organizationId}
                                    &apos;s latest sustainability
                                    snapshot is represented as the
                                    current virtual state.
                                </Typography>

                            </Box>

                        </Stack>

                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 2.5,
                        }}
                    >

                        <TwinStatus
                            icon={<SyncIcon />}
                            label="Synchronization"
                            value="Synchronized"
                            color="#2E7D32"
                        />

                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 2.5,
                        }}
                    >

                        <TwinStatus
                            icon={<CheckCircleIcon />}
                            label="Twin State"
                            value={twinState.label}
                            color={
                                twinState.label === "Strong"
                                    ? "#2E7D32"
                                    : twinState.label === "Stable"
                                        ? "#B7791F"
                                        : "#C05621"
                            }
                        />

                    </Grid>

                </Grid>

            </Paper>


            {/* =====================================================
                CURRENT OPERATIONAL STATE
            ===================================================== */}

            <Box sx={{ mb: 3 }}>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        color: "#101828",
                        mb: 0.7,
                    }}
                >
                    Current Operational State
                </Typography>

                <Typography
                    sx={{
                        color: "#667085",
                        mb: 2.5,
                    }}
                >
                    Latest resource and environmental indicators
                    represented by the digital twin.
                </Typography>


                <Grid
                    container
                    spacing={2.5}
                >

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            lg: 3,
                        }}
                    >
                        <MetricCard
                            title="Electricity"
                            value={snapshot.electricityConsumption}
                            icon={<EnergySavingsLeafIcon />}
                            iconBackground="#E8F5E9"
                            iconColor="#2E7D32"
                            description="Current electricity consumption"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            lg: 3,
                        }}
                    >
                        <MetricCard
                            title="Water"
                            value={snapshot.waterConsumption}
                            icon={<WaterDropIcon />}
                            iconBackground="#E3F2FD"
                            iconColor="#1976D2"
                            description="Current water consumption"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            lg: 3,
                        }}
                    >
                        <MetricCard
                            title="Carbon Emission"
                            value={snapshot.carbonEmission}
                            icon={<Co2Icon />}
                            iconBackground="#F3E5F5"
                            iconColor="#7B1FA2"
                            description="Current modeled emission"
                        />
                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            lg: 3,
                        }}
                    >
                        <MetricCard
                            title="Waste Generated"
                            value={snapshot.wasteGenerated}
                            icon={<DeleteSweepIcon />}
                            iconBackground="#FFF3E0"
                            iconColor="#EF6C00"
                            description="Current waste generation"
                        />
                    </Grid>

                </Grid>

            </Box>


            {/* =====================================================
                SUSTAINABILITY STATE
            ===================================================== */}

            <Grid
                container
                spacing={3}
                sx={{ mb: 3 }}
            >

                <Grid
                    size={{
                        xs: 12,
                        md: 7,
                    }}
                >

                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            height: "100%",
                            borderRadius: 4,
                            border: "1px solid #DDE4E8",
                            backgroundColor: "#FFFFFF",
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >

                            <EnergySavingsLeafIcon
                                sx={{
                                    color: "#2E7D32",
                                }}
                            />

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    color: "#101828",
                                }}
                            >
                                Sustainability State
                            </Typography>

                        </Stack>

                        <Typography
                            sx={{
                                color: "#667085",
                                mb: 4,
                            }}
                        >
                            The twin tracks the current adoption state
                            of key sustainability practices.
                        </Typography>


                        <Stack spacing={3.2}>

                            {stateIndicators.map((indicator) => (

                                <TwinIndicator
                                    key={indicator.label}
                                    label={indicator.label}
                                    description={indicator.description}
                                    value={indicator.value}
                                    icon={indicator.icon}
                                />

                            ))}

                        </Stack>

                    </Paper>

                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        md: 5,
                    }}
                >

                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            height: "100%",
                            borderRadius: 4,
                            border: "1px solid #DDE4E8",
                            background:
                                "linear-gradient(145deg,#FFFFFF,#F7FBF8)",
                        }}
                    >

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                color: "#101828",
                                mb: 1,
                            }}
                        >
                            Twin Health Summary
                        </Typography>

                        <Typography
                            sx={{
                                color: "#667085",
                                lineHeight: 1.7,
                                mb: 3,
                            }}
                        >
                            A compact view of the current modeled
                            sustainability condition.
                        </Typography>


                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: "#F0F8F1",
                                border: "1px solid #C8E6C9",
                                mb: 3,
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: 34,
                                    fontWeight: 800,
                                    color:
                                        twinState.label === "Strong"
                                            ? "#2E7D32"
                                            : twinState.label === "Stable"
                                                ? "#B7791F"
                                                : "#C05621",
                                    mb: 0.5,
                                }}
                            >
                                {twinState.label}
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#667085",
                                    lineHeight: 1.6,
                                }}
                            >
                                {twinState.description}
                            </Typography>

                        </Box>


                        <Stack spacing={2}>

                            <SummaryRow
                                label="Snapshot ID"
                                value={`#${snapshot.id}`}
                            />

                            <SummaryRow
                                label="Organization"
                                value={`#${organizationId}`}
                            />

                            <SummaryRow
                                label="Last synchronized"
                                value={new Date(
                                    snapshot.snapshotTime
                                ).toLocaleString()}
                            />

                        </Stack>

                    </Paper>

                </Grid>

            </Grid>


            {/* =====================================================
                TWIN STATE DETAILS
            ===================================================== */}

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 3,
                    borderRadius: 4,
                    border: "1px solid #DDE4E8",
                    backgroundColor: "#FFFFFF",
                }}
            >

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 1 }}
                >

                    <HubIcon
                        sx={{
                            color: "#2E7D32",
                        }}
                    />

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            color: "#101828",
                        }}
                    >
                        Digital Twin State Representation
                    </Typography>

                </Stack>

                <Typography
                    sx={{
                        color: "#667085",
                        mb: 3,
                        maxWidth: 850,
                    }}
                >
                    The twin maps the latest sustainability indicators
                    into a virtual state that can be inspected before
                    evaluating potential operational changes.
                </Typography>


                <Grid
                    container
                    spacing={2}
                >

                    <StateDetail
                        label="Electricity"
                        value={snapshot.electricityConsumption}
                        description="Current modeled resource state"
                    />

                    <StateDetail
                        label="Water"
                        value={snapshot.waterConsumption}
                        description="Current modeled resource state"
                    />

                    <StateDetail
                        label="Carbon"
                        value={snapshot.carbonEmission}
                        description="Current modeled environmental state"
                    />

                    <StateDetail
                        label="Waste"
                        value={snapshot.wasteGenerated}
                        description="Current modeled waste state"
                    />

                    <StateDetail
                        label="Renewable Energy"
                        value={`${snapshot.renewableEnergyUsage}%`}
                        description="Current adoption indicator"
                    />

                    <StateDetail
                        label="Recycling"
                        value={`${snapshot.recyclingRate}%`}
                        description="Current circularity indicator"
                    />

                    <StateDetail
                        label="Green Transportation"
                        value={`${snapshot.greenTransportationUsage}%`}
                        description="Current transportation indicator"
                    />

                </Grid>

            </Paper>


            {/* =====================================================
                SCENARIO SIMULATION
            ===================================================== */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 3,
                        md: 4,
                    },
                    mb: 3,
                    borderRadius: 4,
                    border: "1px solid #DDE4E8",
                    backgroundColor: "#FFFFFF",
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
                            spacing={1.5}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >

                            <TimelineIcon
                                sx={{
                                    color: "#2E7D32",
                                }}
                            />

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    color: "#101828",
                                }}
                            >
                                What-If Scenario Simulation
                            </Typography>

                        </Stack>

                        <Typography
                            sx={{
                                color: "#667085",
                                maxWidth: 800,
                                lineHeight: 1.7,
                            }}
                        >
                            Evaluate potential sustainability changes
                            against the current digital twin before
                            implementation.
                        </Typography>

                    </Box>


                    <Chip
                        label="Simulation Ready"
                        icon={<ScienceIcon />}
                        sx={{
                            backgroundColor: "#E8F5E9",
                            color: "#2E7D32",
                            fontWeight: 700,
                            borderRadius: 2,
                        }}
                    />

                </Stack>


                <Divider sx={{ mb: 3 }} />


                <Grid
                    container
                    spacing={2.5}
                >

                    <ScenarioInput
                        label="Electricity Reduction (%)"
                        value={electricityReduction}
                        onChange={setElectricityReduction}
                    />

                    <ScenarioInput
                        label="Water Reduction (%)"
                        value={waterReduction}
                        onChange={setWaterReduction}
                    />

                    <ScenarioInput
                        label="Waste Reduction (%)"
                        value={wasteReduction}
                        onChange={setWasteReduction}
                    />

                    <ScenarioInput
                        label="Renewable Increase (%)"
                        value={renewableIncrease}
                        onChange={setRenewableIncrease}
                    />

                </Grid>


                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                    alignItems={{
                        xs: "stretch",
                        sm: "center",
                    }}
                    sx={{ mt: 3 }}
                >

                    <Button
                        variant="contained"
                        startIcon={<ScienceIcon />}
                        onClick={handleSimulation}
                        disabled={simulationLoading}
                        sx={{
                            backgroundColor: "#2E7D32",
                            fontWeight: 700,
                            px: 3,
                            py: 1.3,
                            borderRadius: 2.5,
                            "&:hover": {
                                backgroundColor: "#256B29",
                            },
                        }}
                    >
                        {simulationLoading
                            ? "Running Simulation..."
                            : "Run Scenario Simulation"}
                    </Button>


                    <Typography
                        variant="body2"
                        sx={{
                            color: "#98A2B3",
                        }}
                    >
                        Results are generated by the backend
                        scenario simulation engine.
                    </Typography>

                </Stack>

            </Paper>


            {/* =====================================================
                SIMULATION RESULT
            ===================================================== */}

            {simulation && (

                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 3,
                            md: 4,
                        },
                        mb: 3,
                        borderRadius: 4,
                        border: "1px solid #B7DFBC",
                        background:
                            "linear-gradient(145deg,#F8FFF8,#F1FAF2)",
                    }}
                >

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            sm: "center",
                        }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >

                        <Box>

                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                                sx={{ mb: 1 }}
                            >

                                <TrendingUpIcon
                                    sx={{
                                        color: "#2E7D32",
                                    }}
                                />

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#101828",
                                    }}
                                >
                                    Predicted Scenario Impact
                                </Typography>

                            </Stack>

                            <Typography
                                sx={{
                                    color: "#667085",
                                }}
                            >
                                Backend-generated projections for
                                the selected scenario.
                            </Typography>

                        </Box>


                        <Chip
                            label="Scenario Evaluated"
                            color="success"
                            sx={{
                                fontWeight: 700,
                            }}
                        />

                    </Stack>


                    <Grid
                        container
                        spacing={2.5}
                    >

                        <ScenarioResult
                            label="Predicted Electricity"
                            value={
                                simulation
                                    .predictedElectricityConsumption
                            }
                            baseline={
                                snapshot.electricityConsumption
                            }
                            change={
                                simulationImpact?.electricityChange
                            }
                        />

                        <ScenarioResult
                            label="Predicted Water"
                            value={
                                simulation
                                    .predictedWaterConsumption
                            }
                            baseline={
                                snapshot.waterConsumption
                            }
                            change={
                                simulationImpact?.waterChange
                            }
                        />

                        <ScenarioResult
                            label="Predicted Carbon"
                            value={
                                simulation
                                    .predictedCarbonEmission
                            }
                            baseline={
                                snapshot.carbonEmission
                            }
                            change={
                                simulationImpact?.carbonChange
                            }
                        />

                        <ScenarioResult
                            label="Predicted Waste"
                            value={
                                simulation
                                    .predictedWasteGenerated
                            }
                            baseline={
                                snapshot.wasteGenerated
                            }
                            change={
                                simulationImpact?.wasteChange
                            }
                        />

                    </Grid>


                    <Box
                        sx={{
                            mt: 3,
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #DDE4E8",
                        }}
                    >

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#667085",
                                mb: 1,
                            }}
                        >
                            Estimated Cost Saving
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 32,
                                fontWeight: 800,
                                color: "#2E7D32",
                            }}
                        >
                            {simulation.estimatedCostSaving.toLocaleString()}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#98A2B3",
                                mt: 0.5,
                            }}
                        >
                            Projected by the scenario simulation engine
                        </Typography>

                    </Box>


                    <Typography
                        variant="body2"
                        sx={{
                            color: "#98A2B3",
                            mt: 2,
                        }}
                    >
                        Simulation generated at{" "}
                        {new Date(
                            simulation.simulationTime
                        ).toLocaleString()}
                    </Typography>

                </Paper>

            )}


            {/* =====================================================
                FOOTER / ARCHITECTURAL NOTE
            ===================================================== */}

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid #DDE4E8",
                    backgroundColor: "#FFFFFF",
                }}
            >

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                >

                    <ScienceIcon
                        sx={{
                            color: "#2E7D32",
                            mt: 0.2,
                        }}
                    />

                    <Box>

                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "#344054",
                                mb: 0.7,
                            }}
                        >
                            Digital Twin & Scenario Architecture
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#667085",
                                lineHeight: 1.7,
                            }}
                        >
                            The Digital Twin maintains a modeled
                            representation of the organization&apos;s
                            sustainability state. Scenario Simulation
                            evaluates potential changes against that
                            state before implementation, supporting
                            evidence-based sustainability decisions.
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#98A2B3",
                            }}
                        >
                            Snapshot #{snapshot.id} • Last synchronized{" "}
                            {new Date(
                                snapshot.snapshotTime
                            ).toLocaleString()}
                        </Typography>

                    </Box>

                </Stack>

            </Paper>

        </Box>
    );
}


/* ============================================================
   TWIN STATUS
============================================================ */

interface TwinStatusProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}


const TwinStatus = ({
    icon,
    label,
    value,
    color,
}: TwinStatusProps) => {

    return (
        <Box
            sx={{
                p: 2.2,
                borderRadius: 3,
                backgroundColor: "#FFFFFF",
                border: "1px solid #E1E7EA",
            }}
        >

            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 0.7 }}
            >

                <Box
                    sx={{
                        color,
                        display: "flex",
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#667085",
                        fontWeight: 600,
                    }}
                >
                    {label}
                </Typography>

            </Stack>

            <Typography
                sx={{
                    fontWeight: 800,
                    color,
                }}
            >
                {value}
            </Typography>

        </Box>
    );
};


/* ============================================================
   METRIC CARD
============================================================ */

interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconBackground: string;
    iconColor: string;
    description: string;
}


const MetricCard = ({
    title,
    value,
    icon,
    iconBackground,
    iconColor,
    description,
}: MetricCardProps) => {

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: "100%",
                borderRadius: 4,
                border: "1px solid #DDE4E8",
                backgroundColor: "#FFFFFF",
                transition: "all .2s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(16,24,40,.07)",
                },
            }}
        >

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >

                <Typography
                    sx={{
                        fontWeight: 700,
                        color: "#344054",
                    }}
                >
                    {title}
                </Typography>

                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2.5,
                        backgroundColor: iconBackground,
                        color: iconColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </Box>

            </Stack>


            <Typography
                sx={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: iconColor,
                    lineHeight: 1.1,
                }}
            >
                {value.toLocaleString()}
            </Typography>


            <Typography
                variant="body2"
                sx={{
                    color: "#98A2B3",
                    mt: 1.2,
                }}
            >
                {description}
            </Typography>

        </Paper>
    );
};


/* ============================================================
   TWIN INDICATOR
============================================================ */

interface TwinIndicatorProps {
    label: string;
    description: string;
    value: number;
    icon: React.ReactNode;
}


const TwinIndicator = ({
    label,
    description,
    value,
    icon,
}: TwinIndicatorProps) => {

    const progress =
        Math.min(Math.max(value, 0), 100);

    return (
        <Box>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
            >

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >

                    <Box
                        sx={{
                            color: "#2E7D32",
                            display: "flex",
                        }}
                    >
                        {icon}
                    </Box>

                    <Box>

                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: "#344054",
                            }}
                        >
                            {label}
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color: "#98A2B3",
                            }}
                        >
                            {description}
                        </Typography>

                    </Box>

                </Stack>


                <Typography
                    sx={{
                        fontWeight: 800,
                        color: "#2E7D32",
                    }}
                >
                    {progress.toFixed(1)}%
                </Typography>

            </Stack>


            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 9,
                    borderRadius: 10,
                    backgroundColor: "#E8EDF0",
                    "& .MuiLinearProgress-bar": {
                        backgroundColor: "#2E7D32",
                        borderRadius: 10,
                    },
                }}
            />

        </Box>
    );
};


/* ============================================================
   SUMMARY ROW
============================================================ */

interface SummaryRowProps {
    label: string;
    value: string;
}


const SummaryRow = ({
    label,
    value,
}: SummaryRowProps) => {

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
        >

            <Typography
                variant="body2"
                sx={{
                    color: "#667085",
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: "#344054",
                    fontWeight: 700,
                    textAlign: "right",
                }}
            >
                {value}
            </Typography>

        </Stack>
    );
};


/* ============================================================
   STATE DETAIL
============================================================ */

interface StateDetailProps {
    label: string;
    value: string | number;
    description: string;
}


const StateDetail = ({
    label,
    value,
    description,
}: StateDetailProps) => {

    return (
        <Grid
            size={{
                xs: 12,
                sm: 6,
                md: 4,
            }}
        >

            <Box
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: "#F8FAFB",
                    border: "1px solid #E7ECEF",
                    height: "100%",
                }}
            >

                <Typography
                    variant="body2"
                    sx={{
                        color: "#667085",
                        mb: 0.7,
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 25,
                        fontWeight: 800,
                        color: "#101828",
                    }}
                >
                    {typeof value === "number"
                        ? value.toLocaleString()
                        : value}
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        color: "#98A2B3",
                    }}
                >
                    {description}
                </Typography>

            </Box>

        </Grid>
    );
};


/* ============================================================
   SCENARIO INPUT
============================================================ */

interface ScenarioInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}


const ScenarioInput = ({
    label,
    value,
    onChange,
}: ScenarioInputProps) => {

    return (
        <Grid
            size={{
                xs: 12,
                sm: 6,
                md: 3,
            }}
        >

            <TextField
                fullWidth
                label={label}
                type="number"
                value={value}
                onChange={(event) => {

                    const nextValue =
                        Number(event.target.value);

                    onChange(
                        Math.min(
                            Math.max(
                                Number.isFinite(nextValue)
                                    ? nextValue
                                    : 0,
                                0
                            ),
                            100
                        )
                    );
                }}
                slotProps={{
                    htmlInput: {
                        min: 0,
                        max: 100,
                    },
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                        backgroundColor: "#FFFFFF",
                    },
                }}
            />

        </Grid>
    );
};


/* ============================================================
   SCENARIO RESULT
============================================================ */

interface ScenarioResultProps {
    label: string;
    value: number;
    baseline: number;
    change?: number;
}


const ScenarioResult = ({
    label,
    value,
    baseline,
    change,
}: ScenarioResultProps) => {

    const improved =
        typeof change === "number" && change > 0;

    const increased =
        typeof change === "number" && change < 0;

    return (
        <Grid
            size={{
                xs: 12,
                sm: 6,
                md: 3,
            }}
        >

            <Box
                sx={{
                    p: 2.5,
                    height: "100%",
                    borderRadius: 3,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #DDE4E8",
                }}
            >

                <Typography
                    variant="body2"
                    sx={{
                        color: "#667085",
                        mb: 1,
                    }}
                >
                    {label}
                </Typography>


                <Typography
                    sx={{
                        fontSize: 27,
                        fontWeight: 800,
                        color: "#2E7D32",
                    }}
                >
                    {value.toLocaleString()}
                </Typography>


                <Typography
                    variant="caption"
                    sx={{
                        color: "#98A2B3",
                        display: "block",
                        mt: 0.5,
                    }}
                >
                    Current baseline: {baseline.toLocaleString()}
                </Typography>


                {typeof change === "number" && (
                    <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        sx={{
                            mt: 1.5,
                            color: improved
                                ? "#2E7D32"
                                : increased
                                    ? "#C62828"
                                    : "#667085",
                        }}
                    >

                        {improved ? (
                            <TrendingDownIcon
                                sx={{ fontSize: 18 }}
                            />
                        ) : (
                            <TrendingUpIcon
                                sx={{ fontSize: 18 }}
                            />
                        )}

                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {Math.abs(change).toLocaleString()}{" "}
                            {improved
                                ? "lower"
                                : increased
                                    ? "higher"
                                    : "change"}
                        </Typography>

                    </Stack>
                )}

            </Box>

        </Grid>
    );
};


export default DigitalTwin;