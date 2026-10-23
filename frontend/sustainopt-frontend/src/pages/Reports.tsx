import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import { useState } from "react";
import api from "../api/axiosConfig";


const PaperReportSummary = () => (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
            ["Scope", "Authenticated organization", "Data access is organization-scoped."],
            ["Formats", "PDF + Excel", "Executive and operational outputs."],
            ["Source", "Backend reporting engine", "Generated from application data."],
        ].map(([label, value, detail]) => (
            <Grid key={label} size={{ xs: 12, md: 4 }}>
                <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 3px 14px rgba(15,23,42,0.04)" }}>
                    <CardContent sx={{ p: 2.5 }}>
                        <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.7 }}>
                            {label}
                        </Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ color: "#172033", mt: 0.5 }}>
                            {value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
                            {detail}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);

const Reports = () => {
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [error, setError] = useState("");
    const [lastGenerated, setLastGenerated] = useState<"PDF" | "Excel" | "">("");

    const downloadReport = async (type: "pdf" | "excel") => {
        setError("");
        type === "pdf" ? setLoadingPdf(true) : setLoadingExcel(true);

        try {
            const response = await api.get(
                type === "pdf" ? "/report/pdf" : "/report/excel",
                { responseType: "blob" }
            );

            const contentType = String(
                response.headers["content-type"] || ""
            ).toLowerCase();

            if (!contentType.includes("application/pdf") &&
                !contentType.includes("spreadsheetml") &&
                !contentType.includes("octet-stream")) {
                const text = await response.data.text();
                throw new Error(text || "The backend did not return a report file.");
            }

            const blob = new Blob([response.data], {
                type: contentType,
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = type === "pdf"
                ? "SustainOpt-Sustainability-Report.pdf"
                : "SustainOpt-Sustainability-Report.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            setLastGenerated(type === "pdf" ? "PDF" : "Excel");
        } catch (err: any) {
            console.error("Report download failed:", err);

            let message = `Failed to generate ${type === "pdf" ? "PDF" : "Excel"} report.`;

            if (err?.response?.data instanceof Blob) {
                try {
                    const backendMessage = await err.response.data.text();
                    if (backendMessage) {
                        message = backendMessage;
                    }
                } catch {
                    // Keep default message.
                }
            } else if (err?.message) {
                message = err.message;
            }

            setError(message);
        } finally {
            type === "pdf" ? setLoadingPdf(false) : setLoadingExcel(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100%", background: "#F6F8FB", p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <AssessmentIcon sx={{ color: "#15803D" }} />
                            <Typography sx={{ color: "#15803D", fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>
                                SUSTAINOPT REPORTING CENTER
                            </Typography>
                        </Stack>
                        <Typography variant="h4" fontWeight={800} sx={{ color: "#172033", mb: 0.8 }}>
                            Sustainability Reports
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748B", maxWidth: 780, lineHeight: 1.7 }}>
                            Generate organization-scoped reports from the SustainOpt backend for executive review, operational analysis and structured data export.
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip icon={<CheckCircleIcon />} label="Backend Connected" sx={{ fontWeight: 700, bgcolor: "#ECFDF3", color: "#15803D", border: "1px solid #BBF7D0" }} />
                        {lastGenerated && (
                            <Chip label={`Last generated: ${lastGenerated}`} sx={{ fontWeight: 700, bgcolor: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }} />
                        )}
                    </Stack>
                </Stack>
            </Box>

            <PaperReportSummary />

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, whiteSpace: "pre-wrap" }}>{error}</Alert>}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 4px 18px rgba(15,23,42,0.05)" }}>
                        <CardContent sx={{ p: 3.5 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box sx={{ width: 52, height: 52, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#FEF2F2", color: "#DC2626" }}>
                                    <PictureAsPdfIcon fontSize="large" />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} color="#172033">Sustainability PDF</Typography>
                                    <Typography variant="body2" color="#64748B">Executive-ready sustainability report</Typography>
                                </Box>
                            </Stack>
                            <Divider sx={{ mb: 3 }} />
                            <Stack spacing={1.5} sx={{ mb: 3 }}>
                                <Typography variant="body2" color="#475569">• Organization-scoped sustainability data</Typography>
                                <Typography variant="body2" color="#475569">• Sustainability performance assessment</Typography>
                                <Typography variant="body2" color="#475569">• Recommendations and decision intelligence</Typography>
                                <Typography variant="body2" color="#475569">• AMSDOA decision engine information</Typography>
                            </Stack>
                            <Button fullWidth variant="contained" startIcon={loadingPdf ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />} disabled={loadingPdf} onClick={() => downloadReport("pdf")} sx={{ py: 1.5, backgroundColor: "#DC2626", fontWeight: 700, textTransform: "none", borderRadius: 2, "&:hover": { backgroundColor: "#B91C1C" } }}>
                                {loadingPdf ? "Generating PDF..." : "Generate PDF Report"}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 4px 18px rgba(15,23,42,0.05)" }}>
                        <CardContent sx={{ p: 3.5 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box sx={{ width: 52, height: 52, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#ECFDF3", color: "#15803D" }}>
                                    <TableViewIcon fontSize="large" />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} color="#172033">Sustainability Excel</Typography>
                                    <Typography variant="body2" color="#64748B">Structured operational data export</Typography>
                                </Box>
                            </Stack>
                            <Divider sx={{ mb: 3 }} />
                            <Stack spacing={1.5} sx={{ mb: 3 }}>
                                <Typography variant="body2" color="#475569">• Reporting month and department</Typography>
                                <Typography variant="body2" color="#475569">• Electricity and water consumption</Typography>
                                <Typography variant="body2" color="#475569">• Waste and carbon emissions</Typography>
                                <Typography variant="body2" color="#475569">• Renewable energy and transport metrics</Typography>
                            </Stack>
                            <Button fullWidth variant="contained" startIcon={loadingExcel ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />} disabled={loadingExcel} onClick={() => downloadReport("excel")} sx={{ py: 1.5, backgroundColor: "#15803D", fontWeight: 700, textTransform: "none", borderRadius: 2, "&:hover": { backgroundColor: "#166534" } }}>
                                {loadingExcel ? "Generating Excel..." : "Generate Excel Report"}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{ mt: 3, borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 4px 18px rgba(15,23,42,0.05)" }}>
                <CardContent sx={{ p: 3.5 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Box sx={{ width: 52, height: 52, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#EFF6FF", color: "#2563EB" }}>
                            <AssessmentIcon fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={800} color="#172033">Reporting Architecture</Typography>
                            <Typography variant="body2" color="#64748B">Reports are generated from the same backend data used by SustainOpt analytics and decision intelligence.</Typography>
                        </Box>
                    </Stack>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={2}>
                        {[
                            ["Organization Data", "Organization-scoped sustainability metrics."],
                            ["Sustainability Metrics", "Electricity, water, waste, carbon, renewable and transport indicators."],
                            ["Decision Intelligence", "Recommendations, SHI and AMSDOA decision information."],
                            ["Report Generation", "Backend-generated PDF and Excel exports."],
                        ].map(([title, text]) => (
                            <Grid key={title} size={{ xs: 12, sm: 6, md: 3 }}>
                                <Box sx={{ p: 2.5, height: "100%", borderRadius: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                                    <DescriptionIcon sx={{ color: "#64748B", mb: 1 }} />
                                    <Typography fontWeight={800} color="#172033" sx={{ mb: 0.7 }}>{title}</Typography>
                                    <Typography variant="body2" color="#64748B">{text}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Reports;
