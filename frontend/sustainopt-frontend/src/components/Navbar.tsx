import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";

import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E8F5E9",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>

          {/* Logo */}

          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
              cursor: "pointer",
            }}
          >
            <EnergySavingsLeafIcon
              sx={{
                color: "#2E7D32",
                fontSize: 36,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#1B5E20",
              }}
            >
              SustainOpt
            </Typography>
          </Box>

          {/* Navigation */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              gap: 1,
            }}
          >
            <Button
              onClick={() => navigate("/")}
              sx={{ color: "#263238" }}
            >
              Home
            </Button>

            <Button
              onClick={() => navigate("/organization")}
              sx={{ color: "#263238" }}
            >
              Organization
            </Button>

            <Button
              onClick={() => navigate("/metrics")}
              sx={{ color: "#263238" }}
            >
              Metrics
            </Button>

            <Button
              onClick={() => navigate("/analytics")}
              sx={{ color: "#263238" }}
            >
              Analytics
            </Button>

            <Button
              onClick={() => navigate("/digital-twin")}
              sx={{ color: "#263238" }}
            >
              Digital Twin
            </Button>

            <Button
              onClick={() => navigate("/reports")}
              sx={{ color: "#263238" }}
            >
              Reports
            </Button>
          </Box>

          {/* Buttons */}

          <Box
            sx={{
              ml: 3,
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: 3,
                px: 3,
                borderColor: "#2E7D32",
                color: "#2E7D32",
              }}
            >
              Login
            </Button>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/organization")}
              sx={{
                borderRadius: 3,
                px: 3,
                background: "#2E7D32",

                "&:hover": {
                  background: "#1B5E20",
                },
              }}
            >
              Get Started
            </Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;