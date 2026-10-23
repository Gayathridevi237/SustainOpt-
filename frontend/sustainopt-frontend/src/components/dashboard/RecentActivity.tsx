import {
    Box,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface RecentActivityProps {
    totalElectricity: number;
    totalWater: number;
    totalWaste: number;
    totalCarbon: number;
}

const RecentActivity = ({
    totalElectricity,
    totalWater,
    totalWaste,
    totalCarbon,
}: RecentActivityProps) => {
    const activities = [
        {
            title: "Electricity consumption",
            value: totalElectricity,
            unit: "kWh",
            icon: <ElectricBoltIcon />,
        },
        {
            title: "Water consumption",
            value: totalWater,
            unit: "L",
            icon: <WaterDropOutlinedIcon />,
        },
        {
            title: "Carbon emissions",
            value: totalCarbon,
            unit: "kg CO₂",
            icon: <Co2OutlinedIcon />,
        },
        {
            title: "Waste generation",
            value: totalWaste,
            unit: "kg",
            icon: <DeleteOutlineIcon />,
        },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.04)",
                height: "100%",
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography
                    sx={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: "#0F172A",
                    }}
                >
                    Resource Activity
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 12.5,
                        color: "#64748B",
                    }}
                >
                    Current sustainability resource levels
                </Typography>
            </Box>

            <Stack spacing={1.5}>
                {activities.map((activity) => (
                    <Stack
                        key={activity.title}
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{
                            p: 1.5,
                            borderRadius: 3,
                            backgroundColor: "#F8FAFC",
                            border: "1px solid #F1F5F9",
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                flexShrink: 0,
                                borderRadius: 2.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#F0FDF4",
                                color: "#2E7D32",
                            }}
                        >
                            {activity.icon}
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography
                                sx={{
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                    color: "#334155",
                                }}
                            >
                                {activity.title}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    fontSize: 11,
                                    color: "#94A3B8",
                                }}
                            >
                                Current recorded value
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 800,
                                color: "#0F172A",
                            }}
                        >
                            {Number(activity.value).toLocaleString()}
                            {" "}
                            <Box
                                component="span"
                                sx={{
                                    fontSize: 10.5,
                                    fontWeight: 600,
                                    color: "#64748B",
                                }}
                            >
                                {activity.unit}
                            </Box>
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Paper>
    );
};

export default RecentActivity;