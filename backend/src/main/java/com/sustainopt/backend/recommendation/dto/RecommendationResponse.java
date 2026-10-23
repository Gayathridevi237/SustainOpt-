package com.sustainopt.backend.recommendation.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RecommendationResponse {

    // Legacy fields (used by RecommendationService and DecisionService)
    private Long metricId;
    private Double overallScore;
    private String grade;

    // New fields
    private Long organizationId;
    private Long sustainabilityStateId;
    private Double shiScore;
    private String shiStatus;
    private Double estimatedCostSaving;
    private boolean scenarioAvailable;

    private List<String> recommendations;
    private LocalDateTime generatedAt;

    public RecommendationResponse() {
    }

    // ---------- Legacy getters/setters ----------

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

    // ---------- New getters/setters ----------

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Long getSustainabilityStateId() {
        return sustainabilityStateId;
    }

    public void setSustainabilityStateId(Long sustainabilityStateId) {
        this.sustainabilityStateId = sustainabilityStateId;
    }

    public Double getShiScore() {
        return shiScore;
    }

    public void setShiScore(Double shiScore) {
        this.shiScore = shiScore;
    }

    public String getShiStatus() {
        return shiStatus;
    }

    public void setShiStatus(String shiStatus) {
        this.shiStatus = shiStatus;
    }

    public Double getEstimatedCostSaving() {
        return estimatedCostSaving;
    }

    public void setEstimatedCostSaving(Double estimatedCostSaving) {
        this.estimatedCostSaving = estimatedCostSaving;
    }

    public boolean isScenarioAvailable() {
        return scenarioAvailable;
    }

    public void setScenarioAvailable(boolean scenarioAvailable) {
        this.scenarioAvailable = scenarioAvailable;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}