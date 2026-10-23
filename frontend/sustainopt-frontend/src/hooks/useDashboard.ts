import { useEffect, useState } from "react";

import { getDashboardSummary } from "../api/dashboardApi";

const useDashboard = () => {

    const [dashboard, setDashboard] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const data =
                await getDashboardSummary();

            setDashboard(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return {

        dashboard,

        loading,

        refresh: loadDashboard,

    };

};

export default useDashboard;