import { Box, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box
            sx={{
                bgcolor: "#1B5E20",
                color: "white",
                py: 4,
                textAlign: "center",
            }}
        >
            <Typography variant="h6">
                SustainOpt
            </Typography>

            <Typography mt={1}>
                Intelligent Corporate Sustainability Decision Support Platform
            </Typography>

            <Typography mt={2} fontSize={14}>
                © 2026 SustainOpt. All Rights Reserved.
            </Typography>
        </Box>
    );
};

export default Footer;