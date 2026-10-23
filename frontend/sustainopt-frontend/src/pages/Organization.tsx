import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    MenuItem,
    Alert,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    saveOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,
} from "../api/organizationApi";

import type {
    Organization as OrganizationType,
} from "../api/organizationApi";


// ============================================================
// Organization Form Data
// ============================================================

interface OrganizationData {

    organizationName: string;

    industryType: string;

    employeeCount: number;

    facilityArea: number;

    sustainabilityBudget: number;

    country: string;
}


// ============================================================
// Empty Organization
// ============================================================

const emptyOrganization: OrganizationData = {

    organizationName: "",

    industryType: "",

    employeeCount: 0,

    facilityArea: 0,

    sustainabilityBudget: 0,

    country: "",
};


// ============================================================
// Component
// ============================================================

const Organization = () => {

    // --------------------------------------------------------
    // Form State
    // --------------------------------------------------------

    const [organization, setOrganization] =
        useState<OrganizationData>({
            ...emptyOrganization,
        });


    // --------------------------------------------------------
    // Organization List
    // --------------------------------------------------------

    const [organizations, setOrganizations] =
        useState<OrganizationType[]>([]);


    // --------------------------------------------------------
    // Loading States
    // --------------------------------------------------------

    const [loading, setLoading] =
        useState(false);

    const [organizationsLoading, setOrganizationsLoading] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState(false);


    // --------------------------------------------------------
    // Edit State
    // --------------------------------------------------------

    const [editingOrganizationId, setEditingOrganizationId] =
        useState<number | null>(null);


    // --------------------------------------------------------
    // Delete Confirmation State
    // --------------------------------------------------------

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [organizationToDelete, setOrganizationToDelete] =
        useState<OrganizationType | null>(null);


    // --------------------------------------------------------
    // Snackbar State
    // --------------------------------------------------------

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState(false);


    // ========================================================
    // Load Organizations
    // ========================================================

    const loadOrganizations = async () => {

        try {

            setOrganizationsLoading(true);

            const data =
                await getOrganizations();

            setOrganizations(data);

        } catch (err: any) {

            console.error(
                "Error loading organizations:",
                err
            );

            let backendMessage =
                "Failed to load organizations.";

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

            setOrganizationsLoading(false);
        }
    };


    // ========================================================
    // Load Organizations On Page Load
    // ========================================================

    useEffect(() => {

        loadOrganizations();

    }, []);


    // ========================================================
    // Handle Input Changes
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


        setOrganization((previous) => ({

            ...previous,

            [name]:

                name === "employeeCount" ||
                    name === "facilityArea" ||
                    name === "sustainabilityBudget"

                    ? Number(value)

                    : value,
        }));
    };


    // ========================================================
    // Validate Organization
    // ========================================================

    const validateOrganization = (): boolean => {

        if (
            !organization.organizationName.trim() ||
            !organization.industryType ||
            !organization.country.trim() ||
            organization.employeeCount <= 0 ||
            organization.facilityArea <= 0 ||
            organization.sustainabilityBudget < 0
        ) {

            setError(true);

            setMessage(
                "Please fill all required fields correctly."
            );

            return false;
        }

        return true;
    };


    // ========================================================
    // CREATE / UPDATE ORGANIZATION
    // ========================================================

    const handleSave = async () => {

        if (!validateOrganization()) {
            return;
        }


        try {

            setLoading(true);


            // =================================================
            // UPDATE
            // =================================================

            if (editingOrganizationId !== null) {

                const updatedOrganization =
                    await updateOrganization(
                        editingOrganizationId,
                        {
                            organizationName:
                                organization.organizationName.trim(),

                            industryType:
                                organization.industryType,

                            employeeCount:
                                organization.employeeCount,

                            facilityArea:
                                organization.facilityArea,

                            sustainabilityBudget:
                                organization.sustainabilityBudget,

                            country:
                                organization.country.trim(),
                        }
                    );


                console.log(
                    "Organization updated successfully:",
                    updatedOrganization
                );


                setError(false);

                setMessage(
                    "Organization updated successfully!"
                );


                setEditingOrganizationId(null);

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                const savedOrganization =
                    await saveOrganization(
                        {
                            organizationName:
                                organization.organizationName.trim(),

                            industryType:
                                organization.industryType,

                            employeeCount:
                                organization.employeeCount,

                            facilityArea:
                                organization.facilityArea,

                            sustainabilityBudget:
                                organization.sustainabilityBudget,

                            country:
                                organization.country.trim(),
                        }
                    );


                console.log(
                    "Organization saved successfully:",
                    savedOrganization
                );


                setError(false);

                setMessage(
                    "Organization saved successfully!"
                );
            }


            // =================================================
            // Reset Form
            // =================================================

            setOrganization({
                ...emptyOrganization,
            });


            // =================================================
            // Refresh List
            // =================================================

            await loadOrganizations();

        } catch (err: any) {

            console.error(
                "Error saving organization:",
                err
            );


            let backendMessage =
                editingOrganizationId !== null
                    ? "Failed to update organization."
                    : "Failed to save organization.";


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
    // START EDIT
    // ========================================================

    const handleEdit = (
        item: OrganizationType
    ) => {

        setEditingOrganizationId(
            item.id ?? null
        );


        setOrganization({

            organizationName:
                item.organizationName,

            industryType:
                item.industryType,

            employeeCount:
                item.employeeCount,

            facilityArea:
                item.facilityArea,

            sustainabilityBudget:
                item.sustainabilityBudget,

            country:
                item.country,
        });


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // ========================================================
    // CANCEL EDIT
    // ========================================================

    const handleCancelEdit = () => {

        setEditingOrganizationId(null);

        setOrganization({
            ...emptyOrganization,
        });
    };


    // ========================================================
    // OPEN DELETE DIALOG
    // ========================================================

    const handleDeleteClick = (
        item: OrganizationType
    ) => {

        setOrganizationToDelete(item);

        setDeleteDialogOpen(true);
    };


    // ========================================================
    // CLOSE DELETE DIALOG
    // ========================================================

    const handleCloseDeleteDialog = () => {

        if (deleteLoading) {
            return;
        }

        setDeleteDialogOpen(false);

        setOrganizationToDelete(null);
    };


    // ========================================================
    // DELETE ORGANIZATION
    // ========================================================

    const handleDelete = async () => {

        if (
            !organizationToDelete?.id
        ) {
            return;
        }


        try {

            setDeleteLoading(true);


            await deleteOrganization(
                organizationToDelete.id
            );


            setDeleteDialogOpen(false);

            setOrganizationToDelete(null);


            // ------------------------------------------------
            // If deleted organization was being edited
            // ------------------------------------------------

            if (
                editingOrganizationId ===
                organizationToDelete.id
            ) {

                setEditingOrganizationId(null);

                setOrganization({
                    ...emptyOrganization,
                });
            }


            setError(false);

            setMessage(
                "Organization deleted successfully!"
            );


            await loadOrganizations();

        } catch (err: any) {

            console.error(
                "Error deleting organization:",
                err
            );


            let backendMessage =
                "Failed to delete organization.";


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
    // Format Currency
    // ========================================================

    const formatCurrency = (
        value: number
    ) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(value);
    };


    // ========================================================
    // Format Industry
    // ========================================================

    const formatIndustry = (
        industry: string
    ) => {

        return industry
            .toLowerCase()
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase()
            );
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
                Organization Management
            </Typography>


            <Typography
                variant="body1"
                color="text.secondary"
                mb={3}
            >
                Manage organization information used by SustainOpt
                for sustainability analysis and decision support.
            </Typography>


            {/* =================================================
                ORGANIZATION FORM
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 5,
                    border: "1px solid #E5E7EB",
                }}
            >

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
                            {editingOrganizationId !== null
                                ? "Edit Organization"
                                : "Organization Information"
                            }
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={0.5}
                        >
                            {editingOrganizationId !== null
                                ? "Update the selected organization's information."
                                : "Enter the organization's sustainability profile."
                            }
                        </Typography>

                    </Box>


                    {editingOrganizationId !== null && (

                        <Button
                            variant="outlined"
                            onClick={handleCancelEdit}
                            sx={{
                                borderRadius: 3,
                                px: 2.5,
                            }}
                        >
                            Cancel Edit
                        </Button>

                    )}

                </Box>


                {/* =================================================
                    FORM GRID
                ================================================= */}

                <Grid
                    container
                    spacing={3}
                >

                    {/* Organization Name */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Organization Name"
                            name="organizationName"
                            value={
                                organization.organizationName
                            }
                            onChange={handleChange}
                            required
                        />

                    </Grid>


                    {/* Industry */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            fullWidth
                            select
                            label="Industry"
                            name="industryType"
                            value={
                                organization.industryType
                            }
                            onChange={handleChange}
                            required
                        >

                            <MenuItem value="MANUFACTURING">
                                Manufacturing
                            </MenuItem>

                            <MenuItem value="IT">
                                IT
                            </MenuItem>

                            <MenuItem value="HEALTHCARE">
                                Healthcare
                            </MenuItem>

                            <MenuItem value="FINANCE">
                                Finance
                            </MenuItem>

                            <MenuItem value="RETAIL">
                                Retail
                            </MenuItem>

                            <MenuItem value="ENERGY">
                                Energy
                            </MenuItem>

                        </TextField>

                    </Grid>


                    {/* Country */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            value={
                                organization.country
                            }
                            onChange={handleChange}
                            required
                        />

                    </Grid>


                    {/* Employees */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Employees"
                            name="employeeCount"
                            type="number"
                            value={
                                organization.employeeCount === 0
                                    ? ""
                                    : organization.employeeCount
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 1,
                                },
                            }}
                        />

                    </Grid>


                    {/* Facility Area */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Facility Area (sq. ft.)"
                            name="facilityArea"
                            type="number"
                            value={
                                organization.facilityArea === 0
                                    ? ""
                                    : organization.facilityArea
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 1,
                                },
                            }}
                        />

                    </Grid>


                    {/* Sustainability Budget */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Sustainability Budget"
                            name="sustainabilityBudget"
                            type="number"
                            value={
                                organization.sustainabilityBudget === 0
                                    ? ""
                                    : organization.sustainabilityBudget
                            }
                            onChange={handleChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                },
                            }}
                        />

                    </Grid>

                </Grid>


                {/* =================================================
                    FORM ACTIONS
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
                        onClick={handleSave}
                        disabled={loading}
                        sx={{
                            bgcolor: "#2E7D32",
                            borderRadius: 3,
                            px: 3,
                            py: 1.3,
                            fontWeight: 600,

                            "&:hover": {
                                bgcolor: "#1B5E20",
                            },
                        }}
                    >

                        {loading

                            ? editingOrganizationId !== null
                                ? "Updating..."
                                : "Saving..."

                            : editingOrganizationId !== null
                                ? "Update Organization"
                                : "Save Organization"

                        }

                    </Button>


                    {editingOrganizationId !== null && (

                        <Button
                            variant="outlined"
                            onClick={handleCancelEdit}
                            disabled={loading}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                py: 1.3,
                            }}
                        >
                            Cancel
                        </Button>

                    )}

                </Box>

            </Paper>


            {/* =================================================
                SAVED ORGANIZATIONS
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
                    SECTION HEADER
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
                            Saved Organizations
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={0.5}
                        >
                            Organizations currently registered
                            in SustainOpt.
                        </Typography>

                    </Box>


                    <Chip
                        label={`${organizations.length} ${organizations.length === 1
                                ? "Organization"
                                : "Organizations"
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

                {organizationsLoading ? (

                    <Box
                        sx={{
                            py: 7,
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
                            Loading organizations...
                        </Typography>

                    </Box>

                ) : organizations.length === 0 ? (

                    /* =================================================
                        EMPTY STATE
                    ================================================= */

                    <Box
                        sx={{
                            py: 7,
                            textAlign: "center",
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight="600"
                            mb={1}
                        >
                            No organizations found
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Create your first organization
                            using the form above.
                        </Typography>

                    </Box>

                ) : (

                    /* =================================================
                        TABLE
                    ================================================= */

                    <TableContainer>

                        <Table>

                            <TableHead>

                                <TableRow>

                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: "#F8FAFC",
                                        }}
                                    >
                                        ID
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: "#F8FAFC",
                                        }}
                                    >
                                        Organization
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: "#F8FAFC",
                                        }}
                                    >
                                        Industry
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: "#F8FAFC",
                                        }}
                                    >
                                        Employees
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: "#F8FAFC",
                                        }}
                                    >
                                        Facility Area
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: "#F8FAFC",
                                        }}
                                    >
                                        Sustainability Budget
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: "#F8FAFC",
                                        }}
                                    >
                                        Country
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: "#F8FAFC",
                                        }}
                                    >
                                        Actions
                                    </TableCell>

                                </TableRow>

                            </TableHead>


                            <TableBody>

                                {organizations.map(
                                    (item) => (

                                        <TableRow
                                            key={item.id}
                                            hover
                                        >

                                            {/* ID */}

                                            <TableCell>
                                                #{item.id}
                                            </TableCell>


                                            {/* Organization */}

                                            <TableCell>

                                                <Typography
                                                    fontWeight={600}
                                                >
                                                    {
                                                        item.organizationName
                                                    }
                                                </Typography>

                                            </TableCell>


                                            {/* Industry */}

                                            <TableCell>

                                                <Chip
                                                    label={
                                                        formatIndustry(
                                                            item.industryType
                                                        )
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                />

                                            </TableCell>


                                            {/* Employees */}

                                            <TableCell>
                                                {
                                                    item.employeeCount.toLocaleString(
                                                        "en-IN"
                                                    )
                                                }
                                            </TableCell>


                                            {/* Facility */}

                                            <TableCell>
                                                {
                                                    item.facilityArea.toLocaleString(
                                                        "en-IN"
                                                    )
                                                } sq. ft.
                                            </TableCell>


                                            {/* Budget */}

                                            <TableCell>
                                                {
                                                    formatCurrency(
                                                        item.sustainabilityBudget
                                                    )
                                                }
                                            </TableCell>


                                            {/* Country */}

                                            <TableCell>
                                                {
                                                    item.country
                                                }
                                            </TableCell>


                                            {/* Actions */}

                                            <TableCell
                                                align="center"
                                            >

                                                <Tooltip
                                                    title="Edit organization"
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
                                                    title="Delete organization"
                                                >

                                                    <IconButton
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                item
                                                            )
                                                        }
                                                        sx={{
                                                            color: "#D32F2F",
                                                        }}
                                                    >

                                                        <DeleteIcon />

                                                    </IconButton>

                                                </Tooltip>

                                            </TableCell>

                                        </TableRow>

                                    )
                                )}

                            </TableBody>

                        </Table>

                    </TableContainer>

                )}

            </Paper>


            {/* =================================================
                DELETE CONFIRMATION DIALOG
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
                    Delete Organization?
                </DialogTitle>


                <DialogContent>

                    <Typography
                        color="text.secondary"
                    >
                        Are you sure you want to delete{" "}
                        <strong>
                            {
                                organizationToDelete?.organizationName
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
                        This action permanently removes the
                        organization from SustainOpt.
                    </Alert>

                </DialogContent>


                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                    }}
                >

                    <Button
                        onClick={handleCloseDeleteDialog}
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


export default Organization;