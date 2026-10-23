import {
    Box,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

interface DashboardCardProps {
    title: string;
    value: string | number;
    color?: string;
    icon?: React.ReactNode;
}

const DashboardCard = ({
    title,
    value,
    color = "#2E7D32",
    icon,
}: DashboardCardProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                height: "100%",
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                boxShadow:
                    "0 6px 20px rgba(15, 23, 42, 0.04)",
                transition: "all 0.2s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                        "0 10px 26px rgba(15, 23, 42, 0.08)",
                },
            }}
        >
            <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: "#64748B",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: 28,
                            lineHeight: 1,
                            fontWeight: 800,
                            color: "#0F172A",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        {value}
                    </Typography>
                </Box>

                {icon && (
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: `${color}12`,
                            color,
                            "& svg": {
                                fontSize: 22,
                            },
                        }}
                    >
                        {icon}
                    </Box>
                )}
            </Stack>

            <Box
                sx={{
                    mt: 2.5,
                    height: 4,
                    borderRadius: 10,
                    backgroundColor: "#F1F5F9",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        width: "68%",
                        height: "100%",
                        borderRadius: 10,
                        backgroundColor: color,
                    }}
                />
            </Box>
        </Paper>
    );
};

export default DashboardCard;