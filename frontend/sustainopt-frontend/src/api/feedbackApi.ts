import api from "./axiosConfig";

export interface DecisionFeedback {
    id?: number;
    metricId: number;
    actionName: string;
    implementationStatus: string;
    successScore: number;
    comments: string;
}

export const submitFeedback = async (
    feedback: DecisionFeedback
): Promise<DecisionFeedback> => {

    const response = await api.post(
        "/feedback",
        feedback
    );

    return response.data.data;
};

export const getFeedback = async (
    metricId: number
): Promise<DecisionFeedback[]> => {

    const response = await api.get(
        `/feedback/${metricId}`
    );

    return response.data.data;
};