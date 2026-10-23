import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    IconButton,
    Badge,
    Chip,
    TextField,
    InputAdornment,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";

const Topbar = () => {

    const today = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (

        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: "#fff",
                borderBottom: "1px solid #E5E7EB",
                color: "#111827",
            }}
        >

            <Toolbar>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ flexGrow: 1 }}
                >
                    Executive Dashboard
                </Typography>

                <TextField
                    size="small"
                    placeholder="Search..."
                    sx={{
                        width: 260,
                        mr: 3,
                        bgcolor: "#F8FAFC",
                        borderRadius: 3,
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <Chip
                    icon={<EnergySavingsLeafIcon />}
                    label="System Online"
                    color="success"
                    sx={{ mr: 3 }}
                />

                <Chip
                    icon={<CalendarMonthIcon />}
                    label={today}
                    variant="outlined"
                    sx={{ mr: 3 }}
                />

                <IconButton sx={{ mr: 2 }}>

                    <Badge
                        badgeContent={4}
                        color="error"
                    >
                        <NotificationsIcon />
                    </Badge>

                </IconButton>

                <Avatar
                    sx={{
                        bgcolor: "#2E7D32",
                        mr: 2,
                    }}
                >
                    G
                </Avatar>

                <Box>

                    <Typography
                        fontWeight="bold"
                    >
                        Gayathri Devi
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Sustainability Manager
                    </Typography>

                </Box>

            </Toolbar>

        </AppBar>

    );

};

export default Topbar;