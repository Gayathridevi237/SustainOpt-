package com.sustainopt.backend.decision.dto;

import com.sustainopt.backend.decision.graph.ActionInteraction;
import com.sustainopt.backend.decision.model.DecisionAction;

import java.util.List;

public class DecisionResponse {

    private Long metricId;
    private Double overallScore;
    private String grade;

    private List<DecisionAction> prioritizedActions;

    // Action Interaction Graph (AIG)
    private List<ActionInteraction> actionInteractions;

    public DecisionResponse() {
    }

    public Long getMetricId() {
        return metricId;
    }

    public void setMetricId(Long metricId) {
        this.metricId = metricId;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public List<DecisionAction> getPrioritizedActions() {
        return prioritizedActions;
    }

    public void setPrioritizedActions(List<DecisionAction> prioritizedActions) {
        this.prioritizedActions = prioritizedActions;
    }

    public List<ActionInteraction> getActionInteractions() {
        return actionInteractions;
    }

    public void setActionInteractions(List<ActionInteraction> actionInteractions) {
        this.actionInteractions = actionInteractions;
    }
}