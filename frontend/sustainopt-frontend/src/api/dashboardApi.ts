import api from "./axiosConfig";

export const getDashboardSummary = async () => {
    const response = await api.get("/dashboard/summary");
    return response.data.data;
};