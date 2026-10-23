import api from "./axiosConfig";

export interface SustainabilityState {
    id?: number;
    organizationId: number;
    electricityConsumption: number;
    waterConsumption: number;
    carbonEmission: number;
    wasteGenerated: number;
    renewableEnergyUsage: number;
    recyclingRate: number;
    greenTransportationUsage: number;
    createdAt?: string;
    updatedAt?: string;
}

export const getSustainabilityState = async (
    organizationId: number
): Promise<SustainabilityState> => {
    const response = await api.get<SustainabilityState>(
        `/sustainability-state/${organizationId}`
    );

    return response.data;
};

export const createSustainabilityState = async (
    state: SustainabilityState
): Promise<SustainabilityState> => {
    const response = await api.post<SustainabilityState>(
        "/sustainability-state",
        state
    );

    return response.data;
};

export const updateSustainabilityState = async (
    organizationId: number,
    state: SustainabilityState
): Promise<SustainabilityState> => {
    const response = await api.put<SustainabilityState>(
        `/sustainability-state/${organizationId}`,
        state
    );

    return response.data;
};