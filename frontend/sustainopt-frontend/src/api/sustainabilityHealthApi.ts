import api from "./axiosConfig";

export interface SustainabilityHealthIndexRequest {
    organizationId: number;
}

export interface SustainabilityHealthIndexResponse {
    id: number;
    organizationId: number;
    score: number;
    status: string;
    calculatedAt: string;
}

export const calculateSustainabilityHealth =
    async (
        organizationId: number
    ): Promise<SustainabilityHealthIndexResponse> => {

        const response =
            await api.post<SustainabilityHealthIndexResponse>(
                "/sustainability-health-index",
                {
                    organizationId,
                }
            );

        return response.data;
    };