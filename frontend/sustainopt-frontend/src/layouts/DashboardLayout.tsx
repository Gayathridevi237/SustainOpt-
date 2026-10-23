import type { ReactNode } from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface Props {
    children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "#F4F8FB",
            }}
        >
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* Top Navigation */}
                <Topbar />

                {/* Page Content */}
                <Box
                    sx={{
                        flex: 1,
                        overflow: "auto",
                        p: 4,
                        bgcolor: "#F4F8FB",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;