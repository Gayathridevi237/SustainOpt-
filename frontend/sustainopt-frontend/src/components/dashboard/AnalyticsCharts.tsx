import {
    Box,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface AnalyticsChartsProps {
    totalElectricity: number;
    totalWater: number;
    totalWaste: number;
    totalCarbon: number;
}

const AnalyticsCharts = ({
    totalElectricity,
    totalWater,
    totalWaste,
    totalCarbon,
}: AnalyticsChartsProps) => {
    const resources = [
        {
            title: "Electricity",
            value: totalElectricity,
            unit: "kWh",
            icon: <ElectricBoltIcon />,
        },
        {
            title: "Water",
            value: totalWater,
            unit: "L",
            icon: <WaterDropOutlinedIcon />,
        },
        {
            title: "Carbon",
            value: totalCarbon,
            unit: "kg CO₂",
            icon: <Co2OutlinedIcon />,
        },
        {
            title: "Waste",
            value: totalWaste,
            unit: "kg",
            icon: <DeleteOutlineIcon />,
        },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2.5, sm: 3, md: 3.5 },
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
                mb={3}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 17,
                            fontWeight: 800,
                            color: "#0F172A",
                        }}
                    >
                        Resource Performance
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 12.5,
                            color: "#64748B",
                        }}
                    >
                        Current sustainability resource consumption
                    </Typography>
                </Box>

                <Box
                    sx={{
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        backgroundColor: "#F0FDF4",
                        border: "1px solid #DCFCE7",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: "#166534",
                        }}
                    >
                        Live Dashboard Data
                    </Typography>
                </Box>
            </Stack>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: 2,
                }}
            >
                {resources.map((resource) => (
                    <Box
                        key={resource.title}
                        sx={{
                            p: 2.25,
                            borderRadius: 3,
                            border: "1px solid #E2E8F0",
                            backgroundColor: "#F8FAFC",
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#FFFFFF",
                                    color: "#2E7D32",
                                }}
                            >
                                {resource.icon}
                            </Box>

                            <TrendingDownIcon
                                sx={{
                                    fontSize: 18,
                                    color: "#2E7D32",
                                }}
                            />
                        </Stack>

                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#64748B",
                            }}
                        >
                            {resource.title}
                        </Typography>

                        <Stack
                            direction="row"
                            alignItems="baseline"
                            spacing={0.75}
                        >
                            <Typography
                                sx={{
                                    fontSize: 25,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                }}
                            >
                                {Number(resource.value).toLocaleString()}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "#94A3B8",
                                }}
                            >
                                {resource.unit}
                            </Typography>
                        </Stack>

                        <Typography
                            sx={{
                                mt: 0.75,
                                fontSize: 11.5,
                                color: "#64748B",
                            }}
                        >
                            Current recorded consumption
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default AnalyticsCharts;