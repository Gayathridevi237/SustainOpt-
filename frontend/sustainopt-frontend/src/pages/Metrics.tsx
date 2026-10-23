import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Chip,
    Stack,
    CircularProgress,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import DeleteIcon from "@mui/icons-material/Delete";
import Co2Icon from "@mui/icons-material/Co2";
import EditIcon from "@mui/icons-material/Edit";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import {
    saveMetric,
    getMetrics,
    updateMetric,
    deleteMetric,
} from "../api/metricsApi";

import type {
    SustainabilityMetric,
} from "../api/metricsApi";


// ============================================================
// Empty Form
// ============================================================

const emptyMetric: SustainabilityMetric = {

    organizationName: "",

    department: "",

    reportingMonth: "",

    electricityKwh: 0,

    waterLiters: 0,

    wasteKg: 0,

    carbonEmission: 0,

    renewableEnergyPercent: 0,

    transportEmission: 0,
};


// ============================================================
// Component
// ============================================================

const Metrics = () => {

    // --------------------------------------------------------
    // Form State
    // --------------------------------------------------------

    const [metric, setMetric] =
        useState<SustainabilityMetric>({
            ...emptyMetric,
        });


    // --------------------------------------------------------
    // Metrics List
    // --------------------------------------------------------

    const [metrics, setMetrics] =
        useState<SustainabilityMetric[]>([]);


    // --------------------------------------------------------
    // Loading States
    // --------------------------------------------------------

    const [loading, setLoading] =
        useState(false);

    const [metricsLoading, setMetricsLoading] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState(false);


    // --------------------------------------------------------
    // Edit State
    // --------------------------------------------------------

    const [editingMetricId, setEditingMetricId] =
        useState<number | null>(null);


    // --------------------------------------------------------
    // Delete State
    // --------------------------------------------------------

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [metricToDelete, setMetricToDelete] =
        useState<SustainabilityMetric | null>(null);


    // --------------------------------------------------------
    // Notification State
    // --------------------------------------------------------

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState(false);


    // ========================================================
    // Load Metrics
    // ========================================================

    const loadMetrics = async () => {

        try {

            setMetricsLoading(true);

            const data =
                await getMetrics();

            setMetrics(data);

        } catch (err: any) {

            console.error(
                "Error loading metrics:",
                err
            );

            let backendMessage =
                "Failed to load sustainability metrics.";

            if (
                err?.response?.data?.message
            ) {

                backendMessage =
                    err.response.data.message;

            } else if (
                err?.response?.data?.error
            ) {

                backendMessage =
                    err.response.data.error;
            }

            setError(true);

            setMessage(
                backendMessage
            );

        } finally {

            setMetricsLoading(false);
        }
    };


    // ========================================================
    // Load Metrics On Page Load
    // ========================================================

    useEffect(() => {

        loadMetrics();

    }, []);


    // ========================================================
    // Handle Input Change
    // ========================================================

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {

        const {
            name,
            value,
        } = event.target;


        setMetric((previous) => ({

            ...previous,

            [name]:

                name === "electricityKwh" ||
                    name === "waterLiters" ||
                    name === "wasteKg" ||
                    name === "carbonEmission" ||
                    name === "renewableEnergyPercent" ||
                    name === "transportEmission"

                    ? Number(value)

                    : value,
        }));
    };


    // ========================================================
    // Validate Metric
    // ========================================================

    const validateMetric = (): boolean => {

        if (
            !metric.organizationName.trim() ||
            !metric.department.trim() ||
            !metric.reportingMonth.trim()
        ) {

            setError(true);

            setMessage(
                "Please fill organization, department and reporting month."
            );

            return false;
        }


        if (
            metric.electricityKwh < 0 ||
            metric.waterLiters < 0 ||
            metric.wasteKg < 0 ||
            metric.carbonEmission < 0 ||
            metric.renewableEnergyPercent < 0 ||
            metric.renewableEnergyPercent > 100 ||
            metric.transportEmission < 0
        ) {

            setError(true);

            setMessage(
                "Metric values must be valid positive values. Renewable energy must be between 0 and 100%."
            );

            return false;
        }


        return true;
    };


    // ========================================================
    // Save / Update Metric
    // ========================================================

    const handleSave = async () => {

        if (!validateMetric()) {
            return;
        }


        try {

            setLoading(true);


            const payload: SustainabilityMetric = {

                organizationName:
                    metric.organizationName.trim(),

                department:
                    metric.department.trim(),

                reportingMonth:
                    metric.reportingMonth.trim(),

                electricityKwh:
                    metric.electricityKwh,

                waterLiters:
                    metric.waterLiters,

                wasteKg:
                    metric.wasteKg,

                carbonEmission:
                    metric.carbonEmission,

                renewableEnergyPercent:
                    metric.renewableEnergyPercent,

                transportEmission:
                    metric.transportEmission,
            };


            // =================================================
            // UPDATE
            // =================================================

            if (
                editingMetricId !== null
            ) {

                const updatedMetric =
                    await updateMetric(
                        editingMetricId,
                        payload
                    );


                console.log(
                    "Metric updated successfully:",
                    updatedMetric
                );


                setError(false);

                setMessage(
                    "Sustainability metric updated successfully."
                );

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                const savedMetric =
                    await saveMetric(
                        payload
                    );


                console.log(
                    "Metric saved successfully:",
                    savedMetric
                );


                setError(false);

                setMessage(
                    "Sustainability metric added successfully."
                );
            }


            // =================================================
            // Reset Form
            // =================================================

            setMetric({
                ...emptyMetric,
            });

            setEditingMetricId(null);


            // =================================================
            // Refresh Metrics
            // =================================================

            await loadMetrics();

        } catch (err: any) {

            console.error(
                "Error saving metric:",
                err
            );


            let backendMessage =
                editingMetricId !== null
                    ? "Failed to update sustainability metric."
                    : "Failed to add sustainability metric.";


            if (
                err?.response?.data?.message
            ) {

                backendMessage =
                    err.response.data.message;

            } else if (
                err?.response?.data?.error
            ) {

                backendMessage =
                    err.response.data.error;
            }


            setError(true);

            setMessage(
                backendMessage
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // Edit Metric
    // ========================================================

    const handleEdit = (
        item: SustainabilityMetric
    ) => {

        setEditingMetricId(
            item.id ?? null
        );


        setMetric({

            organizationName:
                item.organizationName,

            department:
                item.department,

            reportingMonth:
                item.reportingMonth,

            electricityKwh:
                item.electricityKwh,

            waterLiters:
                item.waterLiters,

            wasteKg:
                item.wasteKg,

            carbonEmission:
                item.carbonEmission,

            renewableEnergyPercent:
                item.renewableEnergyPercent,

            transportEmission:
                item.transportEmission,
        });


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // ========================================================
    // Cancel Edit
    // ========================================================

    const handleCancelEdit = () => {

        setEditingMetricId(null);

        setMetric({
            ...emptyMetric,
        });
    };


    // ========================================================
    // Open Delete Dialog
    // ========================================================

    const handleDeleteClick = (
        item: SustainabilityMetric
    ) => {

        setMetricToDelete(item);

        setDeleteDialogOpen(true);
    };


    // ========================================================
    // Close Delete Dialog
    // ========================================================

    const handleCloseDeleteDialog = () => {

        if (deleteLoading) {
            return;
        }

        setDeleteDialogOpen(false);

        setMetricToDelete(null);
    };


    // ========================================================
    // Delete Metric
    // ========================================================

    const handleDelete = async () => {

        if (
            !metricToDelete?.id
        ) {
            return;
        }


        try {

            setDeleteLoading(true);


            await deleteMetric(
                metricToDelete.id
            );


            if (
                editingMetricId ===
                metricToDelete.id
            ) {

                setEditingMetricId(null);

                setMetric({
                    ...emptyMetric,
                });
            }


            setDeleteDialogOpen(false);

            setMetricToDelete(null);


            setError(false);

            setMessage(
                "Sustainability metric deleted successfully."
            );


            await loadMetrics();

        } catch (err: any) {

            console.error(
                "Error deleting metric:",
                err
            );


            let backendMessage =
                "Failed to delete sustainability metric.";


            if (
                err?.response?.data?.message
            ) {

                backendMessage =
                    err.response.data.message;

            } else if (
                err?.response?.data?.error
            ) {

                backendMessage =
                    err.response.data.error;
            }


            setError(true);

            setMessage(
                backendMessage
            );

        } finally {

            setDeleteLoading(false);
        }
    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <Box>

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={1}
            >
                Sustainability Metrics
            </Typography>


            <Typography
                variant="body1"
                color="text.secondary"
                mb={3}
            >
                Capture and manage sustainability performance
                data used by SustainOpt's analysis and decision
                engine.
            </Typography>


            {/* =================================================
                ADD / EDIT METRIC
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 5,
                    border: "1px solid #E5E7EB",
                }}
            >

                {/* =================================================
                    FORM HEADER
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight="600"
                        >
                            {editingMetricId !== null
                                ? "Edit Sustainability Metric"
                                : "Add Sustainability Metric"
                            }
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={0.5}
                        >
                            {editingMetricId !== null
                                ? "Update the selected sustainability record."
                                : "Enter the latest sustainability performance data."
                            }
                        </Typography>

                    </Box>


                    {editingMetricId !== null && (

                        <Button
                            variant="outlined"
                            onClick={handleCancelEdit}
                            sx={{
                                borderRadius: 3,
                            }}
                        >
                            Cancel Edit
                        </Button>

                    )}

                </Box>


                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    mb={2}
                >
                    Reporting Information
                </Typography>


                <Grid
                    container
                    spacing={3}
                >

                    {/* Organization */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Organization Name"
                            name="organizationName"
                            value={
                                metric.organizationName
                            }
                            onChange={handleChange}
                            required
                        />

                    </Grid>


                    {/* Department */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Department"
                            name="department"
                            placeholder="Operations"
                            value={
                                metric.department
                            }
                            onChange={handleChange}
                            required
                        />

                    </Grid>


                    {/* Reporting Month */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Reporting Month"
                            name="reportingMonth"
                            type="month"
                            value={
                                metric.reportingMonth
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                    </Grid>

                </Grid>


                <Divider
                    sx={{
                        my: 4,
                    }}
                />


                {/* =================================================
                    RESOURCE METRICS
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    mb={2}
                >
                    Resource Consumption
                </Typography>


                <Grid
                    container
                    spacing={3}
                >

                    {/* Electricity */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Electricity Consumption (kWh)"
                            name="electricityKwh"
                            type="number"
                            value={
                                metric.electricityKwh === 0
                                    ? ""
                                    : metric.electricityKwh
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    step: "any",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <ElectricBoltIcon
                                        sx={{
                                            mr: 1,
                                            color: "#2E7D32",
                                        }}
                                    />
                                ),
                            }}
                        />

                    </Grid>


                    {/* Water */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Water Consumption (L)"
                            name="waterLiters"
                            type="number"
                            value={
                                metric.waterLiters === 0
                                    ? ""
                                    : metric.waterLiters
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    step: "any",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <WaterDropIcon
                                        sx={{
                                            mr: 1,
                                            color: "#1976D2",
                                        }}
                                    />
                                ),
                            }}
                        />

                    </Grid>


                    {/* Waste */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Waste Generated (kg)"
                            name="wasteKg"
                            type="number"
                            value={
                                metric.wasteKg === 0
                                    ? ""
                                    : metric.wasteKg
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    step: "any",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <RecyclingIcon
                                        sx={{
                                            mr: 1,
                                            color: "#757575",
                                        }}
                                    />
                                ),
                            }}
                        />

                    </Grid>

                </Grid>


                <Divider
                    sx={{
                        my: 4,
                    }}
                />


                {/* =================================================
                    ENVIRONMENTAL METRICS
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    mb={2}
                >
                    Environmental Performance
                </Typography>


                <Grid
                    container
                    spacing={3}
                >

                    {/* Carbon */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Carbon Emission (kg CO₂e)"
                            name="carbonEmission"
                            type="number"
                            value={
                                metric.carbonEmission === 0
                                    ? ""
                                    : metric.carbonEmission
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    step: "any",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <Co2Icon
                                        sx={{
                                            mr: 1,
                                            color: "#8E24AA",
                                        }}
                                    />
                                ),
                            }}
                        />

                    </Grid>


                    {/* Renewable Energy */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Renewable Energy (%)"
                            name="renewableEnergyPercent"
                            type="number"
                            value={
                                metric.renewableEnergyPercent === 0
                                    ? ""
                                    : metric.renewableEnergyPercent
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    max: 100,
                                    step: "any",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <WbSunnyIcon
                                        sx={{
                                            mr: 1,
                                            color: "#F9A825",
                                        }}
                                    />
                                ),
                            }}
                        />

                    </Grid>


                    {/* Transport */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Transport Emission"
                            name="transportEmission"
                            type="number"
                            value={
                                metric.transportEmission === 0
                                    ? ""
                                    : metric.transportEmission
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    step: "any",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <DirectionsCarIcon
                                        sx={{
                                            mr: 1,
                                            color: "#546E7A",
                                        }}
                                    />
                                ),
                            }}
                        />

                    </Grid>

                </Grid>


                {/* =================================================
                    FORM ACTION
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mt: 4,
                    }}
                >

                    <Button
                        variant="contained"
                        startIcon={
                            editingMetricId !== null
                                ? <EditIcon />
                                : <AddIcon />
                        }
                        onClick={handleSave}
                        disabled={loading}
                        sx={{
                            bgcolor: "#2E7D32",
                            px: 4,
                            py: 1.4,
                            borderRadius: 3,
                            fontWeight: 600,

                            "&:hover": {
                                bgcolor: "#1B5E20",
                            },
                        }}
                    >

                        {loading

                            ? editingMetricId !== null
                                ? "Updating..."
                                : "Adding..."

                            : editingMetricId !== null
                                ? "Update Metric"
                                : "Add Metric"

                        }

                    </Button>


                    {editingMetricId !== null && (

                        <Button
                            variant="outlined"
                            onClick={handleCancelEdit}
                            disabled={loading}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                            }}
                        >
                            Cancel
                        </Button>

                    )}

                </Box>

            </Paper>


            {/* =================================================
                EXISTING METRICS
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    mt: 4,
                    borderRadius: 5,
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #E5E7EB",
                    }}
                >

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight="600"
                        >
                            Existing Metrics
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={0.5}
                        >
                            Sustainability records belonging to
                            the current account.
                        </Typography>

                    </Box>


                    <Chip
                        label={`${metrics.length} ${metrics.length === 1
                                ? "Metric"
                                : "Metrics"
                            }`}
                        sx={{
                            fontWeight: 600,
                            borderRadius: 2,
                        }}
                    />

                </Box>


                {/* =================================================
                    LOADING
                ================================================= */}

                {metricsLoading ? (

                    <Box
                        sx={{
                            py: 8,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >

                        <CircularProgress
                            size={28}
                            sx={{
                                color: "#2E7D32",
                            }}
                        />

                        <Typography
                            color="text.secondary"
                        >
                            Loading sustainability metrics...
                        </Typography>

                    </Box>

                ) : metrics.length === 0 ? (

                    /* =================================================
                        EMPTY STATE
                    ================================================= */

                    <Box
                        sx={{
                            py: 8,
                            textAlign: "center",
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight="600"
                            mb={1}
                        >
                            No metrics found
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Add your first sustainability metric
                            using the form above.
                        </Typography>

                    </Box>

                ) : (

                    /* =================================================
                        METRIC LIST
                    ================================================= */

                    <Stack
                        spacing={2}
                        sx={{
                            p: 3,
                        }}
                    >

                        {metrics.map(
                            (item) => (

                                <Paper
                                    key={item.id}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        border: "1px solid #E5E7EB",
                                        transition:
                                            "all 0.2s ease",

                                        "&:hover": {
                                            boxShadow:
                                                "0 4px 16px rgba(0,0,0,0.06)",
                                        },
                                    }}
                                >

                                    {/* =================================================
                                        METRIC HEADER
                                    ================================================= */}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            mb: 2,
                                        }}
                                    >

                                        <Box>

                                            <Typography
                                                variant="h6"
                                                fontWeight="700"
                                            >
                                                {
                                                    item.organizationName
                                                }
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {
                                                    item.department
                                                }
                                                {" • "}
                                                {
                                                    item.reportingMonth
                                                }
                                                {" • Metric #"}
                                                {
                                                    item.id
                                                }
                                            </Typography>

                                        </Box>


                                        <Box>

                                            <Tooltip
                                                title="Edit metric"
                                            >

                                                <IconButton
                                                    onClick={() =>
                                                        handleEdit(
                                                            item
                                                        )
                                                    }
                                                    sx={{
                                                        mr: 1,
                                                    }}
                                                >

                                                    <EditIcon />

                                                </IconButton>

                                            </Tooltip>


                                            <Tooltip
                                                title="Delete metric"
                                            >

                                                <IconButton
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            item
                                                        )
                                                    }
                                                    sx={{
                                                        color:
                                                            "#D32F2F",
                                                    }}
                                                >

                                                    <DeleteIcon />

                                                </IconButton>

                                            </Tooltip>

                                        </Box>

                                    </Box>


                                    <Divider
                                        sx={{
                                            mb: 2,
                                        }}
                                    />


                                    {/* =================================================
                                        METRIC VALUES
                                    ================================================= */}

                                    <Grid
                                        container
                                        spacing={2}
                                    >

                                        {/* Electricity */}

                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 4,
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: "#F8FAFC",
                                                }}
                                            >

                                                <ElectricBoltIcon
                                                    sx={{
                                                        color:
                                                            "#2E7D32",
                                                    }}
                                                />

                                                <Box>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Electricity
                                                    </Typography>

                                                    <Typography
                                                        fontWeight="700"
                                                    >
                                                        {
                                                            item.electricityKwh.toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }{" "}
                                                        kWh
                                                    </Typography>

                                                </Box>

                                            </Box>

                                        </Grid>


                                        {/* Water */}

                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 4,
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: "#F8FAFC",
                                                }}
                                            >

                                                <WaterDropIcon
                                                    sx={{
                                                        color:
                                                            "#1976D2",
                                                    }}
                                                />

                                                <Box>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Water
                                                    </Typography>

                                                    <Typography
                                                        fontWeight="700"
                                                    >
                                                        {
                                                            item.waterLiters.toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }{" "}
                                                        L
                                                    </Typography>

                                                </Box>

                                            </Box>

                                        </Grid>


                                        {/* Waste */}

                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 4,
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: "#F8FAFC",
                                                }}
                                            >

                                                <RecyclingIcon
                                                    sx={{
                                                        color:
                                                            "#757575",
                                                    }}
                                                />

                                                <Box>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Waste
                                                    </Typography>

                                                    <Typography
                                                        fontWeight="700"
                                                    >
                                                        {
                                                            item.wasteKg.toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }{" "}
                                                        kg
                                                    </Typography>

                                                </Box>

                                            </Box>

                                        </Grid>


                                        {/* Carbon */}

                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 4,
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: "#F8FAFC",
                                                }}
                                            >

                                                <Co2Icon
                                                    sx={{
                                                        color:
                                                            "#8E24AA",
                                                    }}
                                                />

                                                <Box>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Carbon Emission
                                                    </Typography>

                                                    <Typography
                                                        fontWeight="700"
                                                    >
                                                        {
                                                            item.carbonEmission.toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }{" "}
                                                        kg CO₂e
                                                    </Typography>

                                                </Box>

                                            </Box>

                                        </Grid>


                                        {/* Renewable */}

                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 4,
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: "#F8FAFC",
                                                }}
                                            >

                                                <WbSunnyIcon
                                                    sx={{
                                                        color:
                                                            "#F9A825",
                                                    }}
                                                />

                                                <Box>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Renewable Energy
                                                    </Typography>

                                                    <Typography
                                                        fontWeight="700"
                                                    >
                                                        {
                                                            item.renewableEnergyPercent
                                                        }%
                                                    </Typography>

                                                </Box>

                                            </Box>

                                        </Grid>


                                        {/* Transport */}

                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 4,
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: "#F8FAFC",
                                                }}
                                            >

                                                <DirectionsCarIcon
                                                    sx={{
                                                        color:
                                                            "#546E7A",
                                                    }}
                                                />

                                                <Box>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Transport Emission
                                                    </Typography>

                                                    <Typography
                                                        fontWeight="700"
                                                    >
                                                        {
                                                            item.transportEmission.toLocaleString(
                                                                "en-IN"
                                                            )
                                                        }
                                                    </Typography>

                                                </Box>

                                            </Box>

                                        </Grid>

                                    </Grid>

                                </Paper>

                            )
                        )}

                    </Stack>

                )}

            </Paper>


            {/* =================================================
                DELETE CONFIRMATION
            ================================================= */}

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle
                    fontWeight="700"
                >
                    Delete Sustainability Metric?
                </DialogTitle>


                <DialogContent>

                    <Typography
                        color="text.secondary"
                    >
                        Are you sure you want to delete the metric
                        for{" "}
                        <strong>
                            {
                                metricToDelete?.organizationName
                            }
                        </strong>
                        ?
                    </Typography>


                    <Alert
                        severity="warning"
                        sx={{
                            mt: 2,
                        }}
                    >
                        This action permanently removes this
                        sustainability record.
                    </Alert>

                </DialogContent>


                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                    }}
                >

                    <Button
                        onClick={
                            handleCloseDeleteDialog
                        }
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={deleteLoading}
                    >

                        {deleteLoading
                            ? "Deleting..."
                            : "Delete"
                        }

                    </Button>

                </DialogActions>

            </Dialog>


            {/* =================================================
                NOTIFICATION
            ================================================= */}

            <Snackbar
                open={Boolean(message)}
                autoHideDuration={5000}
                onClose={() => setMessage("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >

                <Alert
                    severity={
                        error
                            ? "error"
                            : "success"
                    }
                    onClose={() => setMessage("")}
                    sx={{
                        width: "100%",
                    }}
                >
                    {message}
                </Alert>

            </Snackbar>

        </Box>
    );
};


export default Metrics;