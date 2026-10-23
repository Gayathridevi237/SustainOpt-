// CHANGE: Replace
// C:\SustainOpt\frontend\sustainopt-frontend\src\components\dashboard\KPICards.tsx

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import SavingsIcon from "@mui/icons-material/Savings";
import PsychologyIcon from "@mui/icons-material/Psychology";

interface Props {
    overallScore: number;
    shiScore: number;
    costSaving: number;
    decisionScore: number;
}

interface KPIItem {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
}

const KPICards = ({
    overallScore,
    shiScore,
    costSaving,
    decisionScore,
}: Props) => {
    const safeOverallScore = Number.isFinite(overallScore)
        ? overallScore
        : 0;

    const safeShiScore = Number.isFinite(shiScore)
        ? shiScore
        : 0;

    const safeCostSaving = Number.isFinite(costSaving)
        ? costSaving
        : 0;

    const safeDecisionScore = Number.isFinite(decisionScore)
        ? decisionScore
        : 0;

    const items: KPIItem[] = [
        {
            title: "Overall Score",
            value: safeOverallScore.toFixed(2),
            description: "Overall sustainability performance",
            icon: <EmojiEventsIcon />,
            accent: "#2E7D32",
        },
        {
            title: "SHI Score",
            value: safeShiScore.toFixed(2),
            description: "Sustainability Health Index",
            icon: <EnergySavingsLeafIcon />,
            accent: "#1976D2",
        },
        {
            title: "Cost Saving",
            value: `${safeCostSaving.toFixed(0)}%`,
            description: "Estimated optimization benefit",
            icon: <SavingsIcon />,
            accent: "#ED6C02",
        },
        {
            title: "Decision Score",
            value: safeDecisionScore.toFixed(2),
            description: "Top sustainability decision priority",
            icon: <PsychologyIcon />,
            accent: "#7B1FA2",
        },
    ];

    return (
        <Grid container spacing={2.5}>
            {items.map((item) => (
                <Grid
                    key={item.title}
                    size={{
                        xs: 12,
                        sm: 6,
                        lg: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            height: "100%",
                            minHeight: 155,
                            p: 2.5,
                            borderRadius: 4,
                            border: "1px solid #E2E8F0",
                            backgroundColor: "#FFFFFF",
                            position: "relative",
                            overflow: "hidden",
                            transition:
                                "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                borderColor: `${item.accent}55`,
                                boxShadow:
                                    "0 12px 28px rgba(15, 23, 42, 0.08)",
                            },
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 4,
                                backgroundColor: item.accent,
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        color: "#64748B",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        letterSpacing: "0.01em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {item.title}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1,
                                        color: "#0F172A",
                                        fontSize: {
                                            xs: 28,
                                            md: 30,
                                        },
                                        fontWeight: 800,
                                        lineHeight: 1.1,
                                        letterSpacing: "-0.025em",
                                    }}
                                >
                                    {item.value}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: 2.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: item.accent,
                                    backgroundColor: `${item.accent}12`,
                                }}
                            >
                                {item.icon}
                            </Box>
                        </Stack>

                        <Typography
                            sx={{
                                mt: 2,
                                color: "#64748B",
                                fontSize: 12.5,
                                lineHeight: 1.5,
                            }}
                        >
                            {item.description}
                        </Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default KPICards;