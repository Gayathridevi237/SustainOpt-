import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import CircleIcon from "@mui/icons-material/Circle";

const Topbar = () => {
    const today = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: "rgba(255,255,255,0.96)",
                color: "#172033",
                borderBottom: "1px solid #E7EBF0",
                backdropFilter: "blur(12px)",
                zIndex: (theme) => theme.zIndex.drawer - 1,
            }}
        >
            <Toolbar
                sx={{
                    minHeight: "76px !important",
                    px: {
                        xs: 2,
                        sm: 3,
                        lg: 4,
                    },
                    gap: 2,
                }}
            >
                {/* =====================================================
                    PAGE TITLE
                ===================================================== */}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: {
                                xs: "1rem",
                                sm: "1.15rem",
                            },
                            letterSpacing: "-0.02em",
                            color: "#172033",
                            lineHeight: 1.2,
                        }}
                    >
                        Executive Dashboard
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.45,
                            fontSize: "0.75rem",
                            color: "#7A8496",
                            display: {
                                xs: "none",
                                md: "block",
                            },
                        }}
                    >
                        Sustainability intelligence & decision support
                    </Typography>
                </Box>

                {/* =====================================================
                    SEARCH
                ===================================================== */}
                <TextField
                    size="small"
                    placeholder="Search..."
                    aria-label="Search"
                    sx={{
                        display: {
                            xs: "none",
                            lg: "block",
                        },
                        width: 250,
                        "& .MuiOutlinedInput-root": {
                            height: 42,
                            borderRadius: "12px",
                            bgcolor: "#F7F9FB",
                            color: "#172033",
                            "& fieldset": {
                                borderColor: "#E4E8EE",
                            },
                            "&:hover fieldset": {
                                borderColor: "#C9D2DD",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#2E7D32",
                                borderWidth: "1px",
                            },
                        },
                        "& input::placeholder": {
                            color: "#8B95A5",
                            opacity: 1,
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon
                                    sx={{
                                        fontSize: 20,
                                        color: "#8A94A6",
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* =====================================================
                    SYSTEM STATUS
                ===================================================== */}
                <Chip
                    icon={
                        <CircleIcon
                            sx={{
                                fontSize: "9px !important",
                                color: "#22A06B !important",
                            }}
                        />
                    }
                    label="System Online"
                    sx={{
                        display: {
                            xs: "none",
                            md: "flex",
                        },
                        height: 38,
                        borderRadius: "10px",
                        bgcolor: "#EFFAF4",
                        color: "#18794E",
                        border: "1px solid #D7F1E2",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                            ml: 1,
                        },
                    }}
                />

                {/* =====================================================
                    DATE
                ===================================================== */}
                <Chip
                    icon={
                        <CalendarMonthOutlinedIcon
                            sx={{
                                fontSize: 18,
                                color: "#667085",
                            }}
                        />
                    }
                    label={today}
                    variant="outlined"
                    sx={{
                        display: {
                            xs: "none",
                            xl: "flex",
                        },
                        height: 38,
                        borderRadius: "10px",
                        bgcolor: "#FFFFFF",
                        borderColor: "#E4E8EE",
                        color: "#667085",
                        fontSize: "0.78rem",
                        fontWeight: 500,
                        "& .MuiChip-icon": {
                            ml: 1,
                        },
                    }}
                />

                {/* =====================================================
                    THEME
                ===================================================== */}
                <Tooltip title="Appearance">
                    <IconButton
                        aria-label="Appearance"
                        sx={{
                            width: 40,
                            height: 40,
                            border: "1px solid #E4E8EE",
                            bgcolor: "#FFFFFF",
                            color: "#667085",
                            borderRadius: "10px",
                            "&:hover": {
                                bgcolor: "#F5F8F6",
                                color: "#2E7D32",
                                borderColor: "#CFE4D4",
                            },
                        }}
                    >
                        <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Tooltip>

                {/* =====================================================
                    NOTIFICATIONS
                ===================================================== */}
                <Tooltip title="Notifications">
                    <IconButton
                        aria-label="Notifications"
                        sx={{
                            width: 40,
                            height: 40,
                            border: "1px solid #E4E8EE",
                            bgcolor: "#FFFFFF",
                            color: "#667085",
                            borderRadius: "10px",
                            "&:hover": {
                                bgcolor: "#F5F8F6",
                                color: "#2E7D32",
                                borderColor: "#CFE4D4",
                            },
                        }}
                    >
                        <Badge
                            badgeContent={5}
                            color="error"
                            sx={{
                                "& .MuiBadge-badge": {
                                    fontSize: "0.62rem",
                                    minWidth: 16,
                                    height: 16,
                                    px: 0.4,
                                    border: "2px solid #FFFFFF",
                                },
                            }}
                        >
                            <NotificationsNoneOutlinedIcon
                                sx={{ fontSize: 21 }}
                            />
                        </Badge>
                    </IconButton>
                </Tooltip>

                {/* =====================================================
                    AI ASSISTANT
                ===================================================== */}
                <Chip
                    icon={
                        <SmartToyOutlinedIcon
                            sx={{
                                fontSize: 18,
                                color: "#2E7D32 !important",
                            }}
                        />
                    }
                    label="AI Assistant"
                    sx={{
                        display: {
                            xs: "none",
                            lg: "flex",
                        },
                        height: 38,
                        borderRadius: "10px",
                        bgcolor: "#EEF8F0",
                        color: "#286A35",
                        border: "1px solid #D7EBD9",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                            ml: 1,
                        },
                    }}
                />

                {/* =====================================================
                    USER PROFILE
                ===================================================== */}
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                        my: 1.5,
                        borderColor: "#E7EBF0",
                    }}
                />

                <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                    sx={{
                        ml: {
                            xs: 0,
                            sm: 0.5,
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            width: 42,
                            height: 42,
                            bgcolor: "#2E7D32",
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            boxShadow:
                                "0 0 0 3px rgba(46,125,50,0.10)",
                        }}
                    >
                        G
                    </Avatar>

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block",
                            },
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                color: "#172033",
                                lineHeight: 1.25,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Gayathri Devi
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.35,
                                fontSize: "0.7rem",
                                color: "#7A8496",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Sustainability Manager
                        </Typography>
                    </Box>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;