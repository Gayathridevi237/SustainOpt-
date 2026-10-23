import {
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
} from "@mui/material";

import PsychologyIcon from "@mui/icons-material/Psychology";
import InsightsIcon from "@mui/icons-material/Insights";
import HubIcon from "@mui/icons-material/Hub";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import RecyclingIcon from "@mui/icons-material/Recycling";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const features = [
    {
        icon: <PsychologyIcon color="success" sx={{ fontSize: 50 }} />,
        title: "AI Decision Engine",
        desc: "AMSDOA intelligently prioritizes sustainability initiatives.",
    },
    {
        icon: <InsightsIcon color="primary" sx={{ fontSize: 50 }} />,
        title: "Predictive Analytics",
        desc: "Forecast sustainability outcomes before implementation.",
    },
    {
        icon: <HubIcon color="warning" sx={{ fontSize: 50 }} />,
        title: "Digital Twin",
        desc: "Monitor organizational sustainability in real time.",
    },
    {
        icon: <AutoGraphIcon color="secondary" sx={{ fontSize: 50 }} />,
        title: "Interactive Dashboards",
        desc: "Beautiful executive dashboards powered by live data.",
    },
    {
        icon: <RecyclingIcon color="success" sx={{ fontSize: 50 }} />,
        title: "Scenario Simulation",
        desc: "Evaluate different sustainability strategies instantly.",
    },
    {
        icon: <WorkspacePremiumIcon color="warning" sx={{ fontSize: 50 }} />,
        title: "Enterprise Reports",
        desc: "Generate professional sustainability reports in seconds.",
    },
];

const Features = () => {
    return (
        <Box py={10} bgcolor="#f8fafc">
            <Container maxWidth="xl">
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    align="center"
                    gutterBottom
                >
                    Why Choose SustainOpt?
                </Typography>

                <Typography
                    align="center"
                    color="text.secondary"
                    mb={6}
                >
                    AI-powered sustainability decision support for modern organizations.
                </Typography>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 5,
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "translateY(-10px)",
                                        boxShadow: 8,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    {feature.icon}

                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                        mt={3}
                                    >
                                        {feature.title}
                                    </Typography>

                                    <Typography mt={2} color="text.secondary">
                                        {feature.desc}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Features;