import {
    Box,
    Button,
    Chip,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InsightsIcon from "@mui/icons-material/Insights";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import SavingsIcon from "@mui/icons-material/Savings";

import { useNavigate } from "react-router-dom";


const Hero = () => {

    const navigate = useNavigate();

    return (
        <Box
            sx={{
                background:
                    "linear-gradient(135deg,#F5FFF7 0%,#EEF8FF 100%)",
                py: 10,
            }}
        >

            <Container maxWidth="xl">

                <Grid
                    container
                    spacing={6}
                    alignItems="center"
                >

                    {/* =========================
                        LEFT SIDE
                    ========================= */}

                    <Grid size={{ xs: 12, md: 7 }}>

                        <Chip
                            label="AI Powered Sustainability Platform"
                            color="success"
                            sx={{
                                mb: 3,
                                fontWeight: 600,
                            }}
                        />

                        <Typography
                            variant="h2"
                            fontWeight="bold"
                            sx={{
                                lineHeight: 1.2,
                            }}
                        >
                            Make Smarter
                            <br />
                            Sustainability
                            <span
                                style={{
                                    color: "#2E7D32",
                                }}
                            >
                                {" "}Decisions
                            </span>
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                mt: 3,
                                mb: 4,
                                maxWidth: 750,
                                lineHeight: 1.6,
                            }}
                        >
                            SustainOpt helps organizations monitor
                            sustainability metrics, calculate SHI,
                            simulate future scenarios, optimize
                            decisions using AMSDOA, and generate
                            intelligent sustainability reports.
                        </Typography>


                        {/* =========================
                            ACTION BUTTONS
                        ========================= */}

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                        >

                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate("/dashboard")}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    background: "#2E7D32",

                                    "&:hover": {
                                        background: "#1B5E20",
                                    },
                                }}
                            >
                                Explore Dashboard
                            </Button>


                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => {
                                    document
                                        .getElementById("features")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    borderColor: "#2E7D32",
                                    color: "#2E7D32",

                                    "&:hover": {
                                        borderColor: "#1B5E20",
                                        background: "#F1F8F2",
                                    },
                                }}
                            >
                                Learn More
                            </Button>

                        </Stack>

                    </Grid>


                    {/* =========================
                        RIGHT SIDE
                    ========================= */}

                    <Grid size={{ xs: 12, md: 5 }}>

                        <Stack spacing={3}>


                            {/* Sustainability Health Index */}

                            <Paper
                                elevation={4}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >

                                    <EnergySavingsLeafIcon
                                        color="success"
                                        fontSize="large"
                                    />

                                    <Box>

                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            78.43
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            Sustainability Health Index
                                        </Typography>

                                    </Box>

                                </Stack>

                            </Paper>


                            {/* Decision Confidence */}

                            <Paper
                                elevation={4}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >

                                    <InsightsIcon
                                        color="primary"
                                        fontSize="large"
                                    />

                                    <Box>

                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            87.8%
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            Decision Confidence
                                        </Typography>

                                    </Box>

                                </Stack>

                            </Paper>


                            {/* Estimated Cost Saving */}

                            <Paper
                                elevation={4}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >

                                    <SavingsIcon
                                        color="warning"
                                        fontSize="large"
                                    />

                                    <Box>

                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            18%
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            Estimated Cost Saving
                                        </Typography>

                                    </Box>

                                </Stack>

                            </Paper>

                        </Stack>

                    </Grid>

                </Grid>

            </Container>

        </Box>
    );
};


export default Hero;