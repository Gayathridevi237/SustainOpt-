import { Box, Container, Grid, Paper, Typography } from "@mui/material";

const stats = [
    {
        value: "500+",
        title: "Organizations",
    },
    {
        value: "95%",
        title: "Decision Accuracy",
    },
    {
        value: "32%",
        title: "Average Carbon Reduction",
    },
    {
        value: "$2.4M",
        title: "Estimated Cost Savings",
    },
];

const Stats = () => {
    return (
        <Box py={8} bgcolor="#ffffff">
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {stats.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 4,
                                    borderRadius: 5,
                                    textAlign: "center",
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "translateY(-8px)",
                                    },
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    color="success.main"
                                >
                                    {item.value}
                                </Typography>

                                <Typography mt={1} color="text.secondary">
                                    {item.title}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Stats;