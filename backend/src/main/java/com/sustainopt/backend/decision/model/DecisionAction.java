package com.sustainopt.backend.decision.model;

public class DecisionAction {

    private String actionName;
    private Double priorityScore;
    private String expectedImpact;
    private String implementationCost;
    private String urgency;

    // AMSDOA transparency
    private Double utilityScore;
    private Double contextCoefficient;
    private Double interactionScore;
    private Double feedbackAdjustment;
    private Double amsdoaBaseScore;
    private Double shiAdjustment;
    private Double scenarioAdjustment;

    // Explainability Engine
    private String explanation;

    public DecisionAction() {
    }

    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public Double getPriorityScore() {
        return priorityScore;
    }

    public void setPriorityScore(Double priorityScore) {
        this.priorityScore = priorityScore;
    }

    public String getExpectedImpact() {
        return expectedImpact;
    }

    public void setExpectedImpact(String expectedImpact) {
        this.expectedImpact = expectedImpact;
    }

    public String getImplementationCost() {
        return implementationCost;
    }

    public void setImplementationCost(String implementationCost) {
        this.implementationCost = implementationCost;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public Double getUtilityScore() {
        return utilityScore;
    }

    public void setUtilityScore(Double utilityScore) {
        this.utilityScore = utilityScore;
    }

    public Double getContextCoefficient() {
        return contextCoefficient;
    }

    public void setContextCoefficient(Double contextCoefficient) {
        this.contextCoefficient = contextCoefficient;
    }

    public Double getInteractionScore() {
        return interactionScore;
    }

    public void setInteractionScore(Double interactionScore) {
        this.interactionScore = interactionScore;
    }

    public Double getFeedbackAdjustment() {
        return feedbackAdjustment;
    }

    public void setFeedbackAdjustment(Double feedbackAdjustment) {
        this.feedbackAdjustment = feedbackAdjustment;
    }

    public Double getAmsdoaBaseScore() {
        return amsdoaBaseScore;
    }

    public void setAmsdoaBaseScore(Double amsdoaBaseScore) {
        this.amsdoaBaseScore = amsdoaBaseScore;
    }

    public Double getShiAdjustment() {
        return shiAdjustment;
    }

    public void setShiAdjustment(Double shiAdjustment) {
        this.shiAdjustment = shiAdjustment;
    }

    public Double getScenarioAdjustment() {
        return scenarioAdjustment;
    }

    public void setScenarioAdjustment(Double scenarioAdjustment) {
        this.scenarioAdjustment = scenarioAdjustment;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}