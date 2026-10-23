package com.sustainopt.backend.decision.graph;

public class ActionInteraction {

    private String sourceAction;
    private String targetAction;
    private String relationshipType;

    // NEW FIELD
    private double interactionScore;

    public ActionInteraction() {
    }

    public ActionInteraction(
            String sourceAction,
            String targetAction,
            String relationshipType,
            double interactionScore) {

        this.sourceAction = sourceAction;
        this.targetAction = targetAction;
        this.relationshipType = relationshipType;
        this.interactionScore = interactionScore;
    }

    public String getSourceAction() {
        return sourceAction;
    }

    public void setSourceAction(String sourceAction) {
        this.sourceAction = sourceAction;
    }

    public String getTargetAction() {
        return targetAction;
    }

    public void setTargetAction(String targetAction) {
        this.targetAction = targetAction;
    }

    public String getRelationshipType() {
        return relationshipType;
    }

    public void setRelationshipType(String relationshipType) {
        this.relationshipType = relationshipType;
    }

    public double getInteractionScore() {
        return interactionScore;
    }

    public void setInteractionScore(double interactionScore) {
        this.interactionScore = interactionScore;
    }
}