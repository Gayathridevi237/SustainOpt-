import api from "./axiosConfig";


// ============================================================
// Sustainability Metric
// ============================================================

export interface SustainabilityMetric {

    id?: number;

    organizationName: string;

    department: string;

    reportingMonth: string;

    electricityKwh: number;

    waterLiters: number;

    wasteKg: number;

    carbonEmission: number;

    renewableEnergyPercent: number;

    transportEmission: number;

    createdBy?: string;
}


// ============================================================
// Backend API Response
// ============================================================

interface ApiResponse<T> {

    success: boolean;

    message: string;

    data: T;

    timestamp: string;
}


// ============================================================
// CREATE METRIC
// ============================================================

export const saveMetric = async (
    metric: SustainabilityMetric
): Promise<SustainabilityMetric> => {

    const response =
        await api.post<ApiResponse<SustainabilityMetric>>(
            "/metrics",
            metric
        );

    return response.data.data;
};


// ============================================================
// GET CURRENT USER METRICS
// ============================================================

export const getMetrics = async (): Promise<SustainabilityMetric[]> => {

    const response =
        await api.get<
            ApiResponse<SustainabilityMetric[]>
        >(
            "/metrics"
        );

    return response.data.data;
};


// ============================================================
// GET METRIC BY ID
// ============================================================

export const getMetricById = async (
    id: number
): Promise<SustainabilityMetric> => {

    const response =
        await api.get<
            ApiResponse<SustainabilityMetric>
        >(
            `/metrics/${id}`
        );

    return response.data.data;
};


// ============================================================
// UPDATE METRIC
// ============================================================

export const updateMetric = async (
    id: number,
    metric: SustainabilityMetric
): Promise<SustainabilityMetric> => {

    const response =
        await api.put<
            ApiResponse<SustainabilityMetric>
        >(
            `/metrics/${id}`,
            metric
        );

    return response.data.data;
};


// ============================================================
// DELETE METRIC
// ============================================================

export const deleteMetric = async (
    id: number
): Promise<void> => {

    await api.delete(
        `/metrics/${id}`
    );
};