import api from "./axiosConfig";

export interface TwinSnapshot {
    id: number;
    organizationId: number;
    electricityConsumption: number;
    waterConsumption: number;
    carbonEmission: number;
    wasteGenerated: number;
    renewableEnergyUsage: number;
    recyclingRate: number;
    greenTransportationUsage: number;
    snapshotTime: string;
}

export interface ScenarioSimulationRequest {
    organizationId: number;
    electricityReductionPercentage: number;
    waterReductionPercentage: number;
    wasteReductionPercentage: number;
    renewableEnergyIncreasePercentage: number;
}

export interface ScenarioSimulationResponse {
    id: number;
    organizationId: number;

    baselineElectricityConsumption: number;
    baselineWaterConsumption: number;
    baselineCarbonEmission: number;
    baselineWasteGenerated: number;
    baselineRenewableEnergyUsage: number;
    baselineRecyclingRate: number;

    predictedElectricityConsumption: number;
    predictedWaterConsumption: number;
    predictedCarbonEmission: number;
    predictedWasteGenerated: number;
    predictedRenewableEnergyUsage: number;

    electricityReductionPercentage: number;
    waterReductionPercentage: number;
    wasteReductionPercentage: number;
    renewableEnergyIncreasePercentage: number;

    carbonReductionPercentage: number;
    projectedShiScore: number;
    shiStatus: string;

    estimatedCostSaving: number;
    carbonModel: string;
    simulationTime: string;
}

export const getLatestTwinSnapshot = async (
    organizationId: number
): Promise<TwinSnapshot> => {
    const response = await api.get<TwinSnapshot>(
        `/twin-snapshots/${organizationId}`
    );

    return response.data;
};

export const simulateScenario = async (
    request: ScenarioSimulationRequest
): Promise<ScenarioSimulationResponse> => {
    const response = await api.post<ScenarioSimulationResponse>(
        "/scenario-simulations",
        request
    );

    return response.data;
};
