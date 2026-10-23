import api from "./axiosConfig";

export interface PrioritizedAction {
    actionName: string;
    priorityScore: number;
    expectedImpact: string;
    implementationCost: string;
    urgency: string;
    explanation: string;

    // AMSDOA calculation outputs
    utilityScore?: number;
    contextCoefficient?: number;
    interactionScore?: number;
    feedbackAdjustment?: number;
    amsdoaBaseScore?: number;
    shiAdjustment?: number;
    scenarioAdjustment?: number;
}

export interface ActionInteraction {
    sourceAction: string;
    targetAction: string;
    relationshipType: string;
    interactionScore: number;
}

export interface DecisionResponse {
    metricId: number;
    overallScore: number;
    grade: string;
    prioritizedActions: PrioritizedAction[];
    actionInteractions: ActionInteraction[];
}

export const getDecision = async (
    metricId: number
): Promise<DecisionResponse> => {
    const response = await api.get(
        `/decision/${metricId}`
    );

    return response.data.data;
};