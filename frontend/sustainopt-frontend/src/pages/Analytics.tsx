import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Chip,
    Grid,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material";

import InsightsIcon from "@mui/icons-material/Insights";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Co2Icon from "@mui/icons-material/Co2";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type DatasetRow = {
    record_id: number;
    electricity_kwh: number;
    water_liters: number;
    waste_kg: number;
    carbon_emissions: number;
    renewable_energy_percentage: number;
    transport_emissions: number;
};

type MetricDefinition = {
    key: keyof Omit<DatasetRow, "record_id">;
    name: string;
    unit: string;
    lowerIsBetter: boolean;
    icon: React.ReactNode;
};

type WindowSummary = {
    label: string;
    electricity: number;
    water: number;
    waste: number;
    carbon: number;
    renewable: number;
    transport: number;
};

type ChangeRow = {
    name: string;
    previous: number;
    current: number;
    change: number;
    unit: string;
    lowerIsBetter: boolean;
};

const DATASET_PATH = "/analytics/sustainopt_analytics_dataset.csv";

const metricDefinitions: MetricDefinition[] = [
    {
        key: "electricity_kwh",
        name: "Electricity",
        unit: "kWh",
        lowerIsBetter: true,
        icon: <EnergySavingsLeafIcon />,
    },
    {
        key: "water_liters",
        name: "Water",
        unit: "L",
        lowerIsBetter: true,
        icon: <WaterDropIcon />,
    },
    {
        key: "waste_kg",
        name: "Waste",
        unit: "kg",
        lowerIsBetter: true,
        icon: <DeleteOutlineIcon />,
    },
    {
        key: "carbon_emissions",
        name: "Carbon",
        unit: "kg",
        lowerIsBetter: true,
        icon: <Co2Icon />,
    },
    {
        key: "renewable_energy_percentage",
        name: "Renewable Energy",
        unit: "%",
        lowerIsBetter: false,
        icon: <EnergySavingsLeafIcon />,
    },
    {
        key: "transport_emissions",
        name: "Transport Emission",
        unit: "units",
        lowerIsBetter: true,
        icon: <DirectionsCarIcon />,
    },
];

const parseCsv = (text: string): DatasetRow[] => {
    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0].split(",").map((value) => value.trim());

    return lines.slice(1).map((line) => {
        const values = line.split(",").map((value) => value.trim());
        const row = Object.fromEntries(
            headers.map((header, index) => [header, values[index]])
        ) as Record<string, string>;

        return {
            record_id: Number(row.record_id),
            electricity_kwh: Number(row.electricity_kwh),
            water_liters: Number(row.water_liters),
            waste_kg: Number(row.waste_kg),
            carbon_emissions: Number(row.carbon_emissions),
            renewable_energy_percentage: Number(
                row.renewable_energy_percentage
            ),
            transport_emissions: Number(row.transport_emissions),
        };
    });
};

const average = (values: number[]): number => {
    if (values.length === 0) {
        return 0;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const getMetricValue = (
    row: DatasetRow,
    key: MetricDefinition["key"]
): number => Number(row[key]);

const Analytics = () => {
    const [dataset, setDataset] = useState<DatasetRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [windowCount, setWindowCount] = useState("12");

    useEffect(() => {
        const loadDataset = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${DATASET_PATH}?v=20260930`);

                if (!response.ok) {
                    throw new Error(`Dataset request failed: ${response.status}`);
                }

                const csv = await response.text();
                const rows = parseCsv(csv);

                if (rows.length === 0) {
                    throw new Error("The Analytics dataset is empty.");
                }

                setDataset(rows);
            } catch (err) {
                console.error("Failed to load Analytics dataset:", err);
                setError(
                    "Unable to load the Analytics dataset. Make sure SustainOpt_Synthetic_Dataset_2000.csv is inside frontend/public/analytics/."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDataset();
    }, []);

    const windowSize = useMemo(() => {
        const requested = Number(windowCount);
        return Number.isFinite(requested) && requested > 0
            ? requested
            : 12;
    }, [windowCount]);

    const summaries = useMemo<WindowSummary[]>(() => {
        if (dataset.length === 0) {
            return [];
        }

        const size = Math.max(1, Math.ceil(dataset.length / windowSize));
        const result: WindowSummary[] = [];

        for (let start = 0; start < dataset.length; start += size) {
            const rows = dataset.slice(start, start + size);

            result.push({
                label: `${rows[0].record_id}-${rows[rows.length - 1].record_id}`,
                electricity: average(rows.map((row) => row.electricity_kwh)),
                water: average(rows.map((row) => row.water_liters)),
                waste: average(rows.map((row) => row.waste_kg)),
                carbon: average(rows.map((row) => row.carbon_emissions)),
                renewable: average(
                    rows.map((row) => row.renewable_energy_percentage)
                ),
                transport: average(
                    rows.map((row) => row.transport_emissions)
                ),
            });
        }

        return result;
    }, [dataset, windowSize]);

    const latestSummary = summaries[summaries.length - 1];
    const previousSummary = summaries[summaries.length - 2];

    const changeRows = useMemo<ChangeRow[]>(() => {
        if (!latestSummary || !previousSummary) {
            return [];
        }

        const values = [
            {
                name: "Electricity",
                current: latestSummary.electricity,
                previous: previousSummary.electricity,
                unit: "kWh",
                lowerIsBetter: true,
            },
            {
                name: "Water",
                current: latestSummary.water,
                previous: previousSummary.water,
                unit: "L",
                lowerIsBetter: true,
            },
            {
                name: "Waste",
                current: latestSummary.waste,
                previous: previousSummary.waste,
                unit: "kg",
                lowerIsBetter: true,
            },
            {
                name: "Carbon",
                current: latestSummary.carbon,
                previous: previousSummary.carbon,
                unit: "kg",
                lowerIsBetter: true,
            },
            {
                name: "Renewable Energy",
                current: latestSummary.renewable,
                previous: previousSummary.renewable,
                unit: "%",
                lowerIsBetter: false,
            },
            {
                name: "Transport Emission",
                current: latestSummary.transport,
                previous: previousSummary.transport,
                unit: "units",
                lowerIsBetter: true,
            },
        ];

        return values.map((item) => ({
            ...item,
            change:
                item.previous === 0
                    ? 0
                    : ((item.current - item.previous) /
                        Math.abs(item.previous)) *
                    100,
        }));
    }, [latestSummary, previousSummary]);

    const latestAverages = useMemo(() => {
        if (dataset.length === 0) {
            return metricDefinitions.map((metric) => ({
                ...metric,
                value: 0,
            }));
        }

        return metricDefinitions.map((metric) => ({
            ...metric,
            value: average(
                dataset.map((row) => getMetricValue(row, metric.key))
            ),
        }));
    }, [dataset]);

    const attentionRows = useMemo(() => {
        return changeRows
            .filter((item) =>
                item.lowerIsBetter ? item.change > 0 : item.change < 0
            )
            .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    }, [changeRows]);

    const improvementRows = useMemo(() => {
        return changeRows
            .filter((item) =>
                item.lowerIsBetter ? item.change < 0 : item.change > 0
            )
            .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    }, [changeRows]);

    const trendData = useMemo(() => {
        return summaries.map((summary) => ({
            period: summary.label,
            electricity: Number(summary.electricity.toFixed(1)),
            water: Number(summary.water.toFixed(1)),
            waste: Number(summary.waste.toFixed(1)),
            carbon: Number(summary.carbon.toFixed(1)),
            renewable: Number(summary.renewable.toFixed(1)),
            transport: Number(summary.transport.toFixed(1)),
        }));
    }, [summaries]);

    const normalizedComparison = useMemo(() => {
        if (!latestSummary) {
            return [];
        }

        const values = [
            { name: "Electricity", value: latestSummary.electricity },
            { name: "Water", value: latestSummary.water },
            { name: "Waste", value: latestSummary.waste },
            { name: "Carbon", value: latestSummary.carbon },
            { name: "Renewable", value: latestSummary.renewable },
            { name: "Transport", value: latestSummary.transport },
        ];

        const max = Math.max(...values.map((item) => item.value), 1);

        return values.map((item) => ({
            name: item.name,
            value: Number(((item.value / max) * 100).toFixed(1)),
        }));
    }, [latestSummary]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <LinearProgress sx={{ width: 260 }} />
                    <Typography color="text.secondary">
                        Loading Analytics dataset...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: { xs: 2, md: 5 } }}>
                <Alert severity="error" sx={{ borderRadius: 3 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F5F8FA",
                px: { xs: 2, md: 5 },
                py: 4,
            }}
        >
            <Box mb={4}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                >
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <InsightsIcon sx={{ color: "#2E7D32" }} />
                            <Typography
                                sx={{
                                    color: "#2E7D32",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    letterSpacing: 0.5,
                                }}
                            >
                                SUSTAINOPT ANALYTICS
                            </Typography>
                        </Stack>

                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "#101828",
                                mb: 1,
                                fontSize: { xs: "2.1rem", md: "3rem" },
                            }}
                        >
                            Sustainability Analytics
                        </Typography>

                        <Typography
                            sx={{
                                color: "#58708A",
                                fontSize: 17,
                                maxWidth: 900,
                                lineHeight: 1.7,
                            }}
                        >
                            Historical analysis using the dedicated 2,000-record
                            sustainability dataset. The dataset is isolated to Analytics
                            and does not modify SustainOpt decision calculations.
                        </Typography>
                    </Box>

                    <Chip
                        icon={<CheckCircleIcon />}
                        label={`${dataset.length.toLocaleString()} Dataset Records`}
                        sx={{
                            backgroundColor: "#EAF6EC",
                            color: "#247A2C",
                            fontWeight: 700,
                            height: 42,
                            px: 1,
                        }}
                    />
                </Stack>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #E0E6EA",
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                >
                    <Box>
                        <Typography fontWeight={700}>
                            Historical Observation Groups
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Records are grouped by observation order because the supplied
                            dataset contains record IDs but no date field.
                        </Typography>
                    </Box>

                    <Select
                        value={windowCount}
                        size="small"
                        onChange={(event) => setWindowCount(event.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="6">6 groups</MenuItem>
                        <MenuItem value="12">12 groups</MenuItem>
                        <MenuItem value="20">20 groups</MenuItem>
                    </Select>
                </Stack>
            </Paper>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB", height: "100%" }}>
                        <Typography color="text.secondary" fontSize={14}>
                            Records analysed
                        </Typography>
                        <Typography variant="h4" fontWeight={800} mt={0.5}>
                            {dataset.length.toLocaleString()}
                        </Typography>
                        <Typography color="text.secondary" variant="body2" mt={1}>
                            Synthetic sustainability observations supplied for Analytics.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB", height: "100%" }}>
                        <Typography color="text.secondary" fontSize={14}>
                            Latest observation group
                        </Typography>
                        <Typography variant="h4" fontWeight={800} mt={0.5}>
                            {latestSummary?.label ?? "—"}
                        </Typography>
                        <Typography color="text.secondary" variant="body2" mt={1}>
                            Latest grouped record range used for comparison.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB", height: "100%" }}>
                        <Typography color="text.secondary" fontSize={14}>
                            Dimensions analysed
                        </Typography>
                        <Typography variant="h4" fontWeight={800} mt={0.5}>
                            6
                        </Typography>
                        <Typography color="text.secondary" variant="body2" mt={1}>
                            Electricity, water, waste, carbon, renewable energy and transport.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB", height: "100%" }}>
                        <Typography variant="h6" fontWeight="bold">
                            Historical Resource Trend
                        </Typography>
                        <Typography color="text.secondary" variant="body2" mt={0.5} mb={3}>
                            Average resource and environmental values across the selected observation groups.
                        </Typography>

                        <ResponsiveContainer width="100%" height={360}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="electricity" name="Electricity" stroke="#2E7D32" strokeWidth={3} />
                                <Line type="monotone" dataKey="water" name="Water" stroke="#1976D2" strokeWidth={3} />
                                <Line type="monotone" dataKey="carbon" name="Carbon" stroke="#7B1FA2" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB", height: "100%" }}>
                        <Typography variant="h6" fontWeight="bold">
                            Latest Dataset Profile
                        </Typography>
                        <Typography color="text.secondary" variant="body2" mt={0.5} mb={3}>
                            Average value across all 2,000 supplied records.
                        </Typography>

                        <Stack spacing={2}>
                            {latestAverages.map((item) => (
                                <Box key={item.name}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.6}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ color: "#2E7D32", display: "flex" }}>{item.icon}</Box>
                                            <Typography fontSize={14} fontWeight={600}>{item.name}</Typography>
                                        </Stack>
                                        <Typography fontWeight={800}>
                                            {item.value.toFixed(1)} {item.unit}
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min(100, (item.value / Math.max(...latestAverages.map((value) => value.value), 1)) * 100)}
                                        sx={{ height: 6, borderRadius: 10 }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB", height: "100%" }}>
                        <Typography variant="h6" fontWeight="bold">
                            Latest vs Previous Group
                        </Typography>
                        <Typography color="text.secondary" variant="body2" mt={0.5} mb={3}>
                            Percentage movement between the two most recent observation groups.
                        </Typography>

                        <ResponsiveContainer width="100%" height={360}>
                            <BarChart data={changeRows} layout="vertical" margin={{ left: 25, right: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                                <YAxis type="category" dataKey="name" width={125} />
                                <Tooltip formatter={(value) => `${Number(value ?? 0).toFixed(1)}%`} />
                                <Bar dataKey="change" name="Change" radius={[0, 6, 6, 0]}>
                                    {changeRows.map((item) => {
                                        const improvement = item.lowerIsBetter
                                            ? item.change < 0
                                            : item.change > 0;
                                        return (
                                            <Cell
                                                key={item.name}
                                                fill={improvement ? "#2E7D32" : "#C62828"}
                                            />
                                        );
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 5 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB", height: "100%" }}>
                        <Typography variant="h6" fontWeight="bold">
                            Analytical Signals
                        </Typography>
                        <Typography color="text.secondary" variant="body2" mt={0.5} mb={3}>
                            Dimensions whose latest grouped value moved relative to the preceding group.
                        </Typography>

                        {attentionRows.length > 0 && (
                            <Stack spacing={1.5} mb={2}>
                                {attentionRows.slice(0, 3).map((item) => (
                                    <Paper key={item.name} elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #F4D5D5", backgroundColor: "#FFF9F9" }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <WarningAmberIcon sx={{ color: "#C62828" }} />
                                            <Box>
                                                <Typography fontWeight={800}>{item.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.change > 0 ? "+" : ""}{item.change.toFixed(1)}% adverse movement.
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        )}

                        {improvementRows.length > 0 && (
                            <Stack spacing={1.5}>
                                {improvementRows.slice(0, 3).map((item) => (
                                    <Paper key={item.name} elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #DCEBDD", backgroundColor: "#F7FCF8" }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <CheckCircleIcon sx={{ color: "#2E7D32" }} />
                                            <Box>
                                                <Typography fontWeight={800}>{item.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.change > 0 ? "+" : ""}{item.change.toFixed(1)}% improvement direction.
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        )}

                        {attentionRows.length === 0 && improvementRows.length === 0 && (
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <TrendingFlatIcon sx={{ color: "#667085" }} />
                                <Typography color="text.secondary">No movement detected.</Typography>
                            </Stack>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB", height: "100%" }}>
                        <Typography variant="h6" fontWeight="bold">
                            Latest Dimension Comparison
                        </Typography>
                        <Typography color="text.secondary" variant="body2" mt={0.5} mb={3}>
                            Relative scale of the latest observation group. Values are normalized only for visual comparison.
                        </Typography>

                        <ResponsiveContainer width="100%" height={330}>
                            <BarChart data={normalizedComparison}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(value) => `${Number(value ?? 0).toFixed(1)}% of group maximum`} />
                                <Bar dataKey="value" name="Relative level" fill="#2E7D32" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB", height: "100%", overflowX: "auto" }}>
                        <Typography variant="h6" fontWeight="bold">
                            Comparative Values
                        </Typography>
                        <Typography color="text.secondary" variant="body2" mt={0.5} mb={2}>
                            Exact values supporting the change analysis.
                        </Typography>

                        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                            <Box component="thead">
                                <Box component="tr">
                                    {['Dimension', 'Previous', 'Latest', 'Change'].map((heading) => (
                                        <Box component="th" key={heading} sx={{ p: 1.2, textAlign: heading === 'Dimension' ? 'left' : 'right', borderBottom: '1px solid #E5E7EB', color: '#667085', fontSize: 13 }}>
                                            {heading}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            <Box component="tbody">
                                {changeRows.map((item) => {
                                    const improvement = item.lowerIsBetter
                                        ? item.change < 0
                                        : item.change > 0;

                                    return (
                                        <Box component="tr" key={item.name}>
                                            <Box component="td" sx={{ p: 1.2, borderBottom: '1px solid #F0F2F4', fontWeight: 700 }}>{item.name}</Box>
                                            <Box component="td" sx={{ p: 1.2, borderBottom: '1px solid #F0F2F4', textAlign: 'right' }}>{item.previous.toFixed(1)} {item.unit}</Box>
                                            <Box component="td" sx={{ p: 1.2, borderBottom: '1px solid #F0F2F4', textAlign: 'right' }}>{item.current.toFixed(1)} {item.unit}</Box>
                                            <Box component="td" sx={{ p: 1.2, borderBottom: '1px solid #F0F2F4', textAlign: 'right' }}>
                                                <Chip
                                                    size="small"
                                                    icon={item.change === 0 ? <TrendingFlatIcon /> : improvement ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                                    label={`${item.change > 0 ? '+' : ''}${item.change.toFixed(1)}%`}
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: improvement ? '#247A2C' : '#C62828',
                                                        backgroundColor: improvement ? '#EAF6EC' : '#FDECEC',
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: "1px solid #E5E7EB" }}>
                <Typography variant="h6" fontWeight="bold">
                    Dataset and Calculation Note
                </Typography>
                <Typography color="text.secondary" variant="body2" mt={1} lineHeight={1.8}>
                    This Analytics page reads the supplied synthetic dataset directly from the
                    frontend public folder. It contains 2,000 records and six sustainability
                    dimensions: electricity, water, waste, carbon emissions, renewable energy
                    percentage and transport emissions. Because the supplied file contains no
                    date column, the page uses record ID order and explicitly labels grouped
                    observations instead of inventing months or reporting dates. The dataset is
                    used for Analytics only; existing SustainOpt scoring, SHI, AMSDOA, decision
                    logic and Digital Twin calculations remain unchanged.
                </Typography>
            </Paper>
        </Box>
    );
};

export default Analytics;
