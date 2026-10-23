import api from "./axiosConfig";

export interface RecommendationResponse {
    metricId: number;
    overallScore: number;
    grade: string;
    organizationId: number;
    sustainabilityStateId: number;
    shiScore: number;
    shiStatus: string;
    estimatedCostSaving: number;
    scenarioAvailable: boolean;
    recommendations: string[];
    generatedAt: string;
}

export const getRecommendation = async (
    metricId: number
): Promise<RecommendationResponse> => {

    const response = await api.get(
        `/recommendations/${metricId}`
    );

    return response.data.data;
};