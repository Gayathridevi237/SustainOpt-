import api from "./axiosConfig";

// ============================================================
// SCORING RESPONSE
// ============================================================

export interface ScoringResponse {
    electricityScore: number;
    waterScore: number;
    wasteScore: number;
    carbonScore: number;
    renewableScore: number;
    transportScore: number;
    overallScore: number;
    grade: string;
}

// ============================================================
// BACKEND API RESPONSE
// ============================================================

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

// ============================================================
// GET SCORE BY METRIC ID
// ============================================================

export const getScore = async (
    metricId: number
): Promise<ScoringResponse> => {

    const response =
        await api.get<ApiResponse<ScoringResponse>>(
            `/scoring/${metricId}`
        );

    return response.data.data;
};