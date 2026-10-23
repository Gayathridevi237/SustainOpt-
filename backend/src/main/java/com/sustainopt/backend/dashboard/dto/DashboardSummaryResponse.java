package com.sustainopt.backend.dashboard.dto;

public class DashboardSummaryResponse {

    // ===========================
    // Dashboard Statistics
    // ===========================
    private Long totalMetrics;

    private Double totalElectricity;

    private Double totalWater;

    private Double totalWaste;

    private Double totalCarbon;

    private Double averageRenewableEnergy;

    private Double averageTransportEmission;

    // ===========================
    // Executive Dashboard
    // ===========================
    private Double overallScore;

    private String grade;

    private Double shiScore;

    private String shiStatus;

    private Double estimatedCostSaving;

    private Boolean scenarioAvailable;

    private String topPriorityAction;

    private Double topPriorityScore;

    public DashboardSummaryResponse() {
    }

    // ===========================
    // Dashboard Statistics
    // ===========================

    public Long getTotalMetrics() {
        return totalMetrics;
    }

    public void setTotalMetrics(Long totalMetrics) {
        this.totalMetrics = totalMetrics;
    }

    public Double getTotalElectricity() {
        return totalElectricity;
    }

    public void setTotalElectricity(Double totalElectricity) {
        this.totalElectricity = totalElectricity;
    }

    public Double getTotalWater() {
        return totalWater;
    }

    public void setTotalWater(Double totalWater) {
        this.totalWater = totalWater;
    }

    public Double getTotalWaste() {
        return totalWaste;
    }

    public void setTotalWaste(Double totalWaste) {
        this.totalWaste = totalWaste;
    }

    public Double getTotalCarbon() {
        return totalCarbon;
    }

    public void setTotalCarbon(Double totalCarbon) {
        this.totalCarbon = totalCarbon;
    }

    public Double getAverageRenewableEnergy() {
        return averageRenewableEnergy;
    }

    public void setAverageRenewableEnergy(Double averageRenewableEnergy) {
        this.averageRenewableEnergy = averageRenewableEnergy;
    }

    public Double getAverageTransportEmission() {
        return averageTransportEmission;
    }

    public void setAverageTransportEmission(Double averageTransportEmission) {
        this.averageTransportEmission = averageTransportEmission;
    }

    // ===========================
    // Executive Dashboard
    // ===========================

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

    public Boolean getScenarioAvailable() {
        return scenarioAvailable;
    }

    public void setScenarioAvailable(Boolean scenarioAvailable) {
        this.scenarioAvailable = scenarioAvailable;
    }

    public String getTopPriorityAction() {
        return topPriorityAction;
    }

    public void setTopPriorityAction(String topPriorityAction) {
        this.topPriorityAction = topPriorityAction;
    }

    public Double getTopPriorityScore() {
        return topPriorityScore;
    }

    public void setTopPriorityScore(Double topPriorityScore) {
        this.topPriorityScore = topPriorityScore;
    }
}