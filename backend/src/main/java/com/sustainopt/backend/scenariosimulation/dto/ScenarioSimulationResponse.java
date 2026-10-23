package com.sustainopt.backend.scenariosimulation.dto;

import java.time.LocalDateTime;

public class ScenarioSimulationResponse {

    private Long id;
    private Long organizationId;

    // Baseline values
    private Double baselineElectricityConsumption;
    private Double baselineWaterConsumption;
    private Double baselineCarbonEmission;
    private Double baselineWasteGenerated;
    private Double baselineRenewableEnergyUsage;
    private Double baselineRecyclingRate;

    // Projected values
    private Double predictedElectricityConsumption;
    private Double predictedWaterConsumption;
    private Double predictedCarbonEmission;
    private Double predictedWasteGenerated;
    private Double predictedRenewableEnergyUsage;

    // Scenario inputs echoed by backend
    private Double electricityReductionPercentage;
    private Double waterReductionPercentage;
    private Double wasteReductionPercentage;
    private Double renewableEnergyIncreasePercentage;

    // Derived decision-support outputs
    private Double carbonReductionPercentage;
    private Double projectedShiScore;
    private String shiStatus;
    private Double estimatedCostSaving;
    private String carbonModel;

    private LocalDateTime simulationTime;

    public ScenarioSimulationResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Double getBaselineElectricityConsumption() {
        return baselineElectricityConsumption;
    }

    public void setBaselineElectricityConsumption(Double value) {
        this.baselineElectricityConsumption = value;
    }

    public Double getBaselineWaterConsumption() {
        return baselineWaterConsumption;
    }

    public void setBaselineWaterConsumption(Double value) {
        this.baselineWaterConsumption = value;
    }

    public Double getBaselineCarbonEmission() {
        return baselineCarbonEmission;
    }

    public void setBaselineCarbonEmission(Double value) {
        this.baselineCarbonEmission = value;
    }

    public Double getBaselineWasteGenerated() {
        return baselineWasteGenerated;
    }

    public void setBaselineWasteGenerated(Double value) {
        this.baselineWasteGenerated = value;
    }

    public Double getBaselineRenewableEnergyUsage() {
        return baselineRenewableEnergyUsage;
    }

    public void setBaselineRenewableEnergyUsage(Double value) {
        this.baselineRenewableEnergyUsage = value;
    }

    public Double getBaselineRecyclingRate() {
        return baselineRecyclingRate;
    }

    public void setBaselineRecyclingRate(Double value) {
        this.baselineRecyclingRate = value;
    }

    public Double getPredictedElectricityConsumption() {
        return predictedElectricityConsumption;
    }

    public void setPredictedElectricityConsumption(Double value) {
        this.predictedElectricityConsumption = value;
    }

    public Double getPredictedWaterConsumption() {
        return predictedWaterConsumption;
    }

    public void setPredictedWaterConsumption(Double value) {
        this.predictedWaterConsumption = value;
    }

    public Double getPredictedCarbonEmission() {
        return predictedCarbonEmission;
    }

    public void setPredictedCarbonEmission(Double value) {
        this.predictedCarbonEmission = value;
    }

    public Double getPredictedWasteGenerated() {
        return predictedWasteGenerated;
    }

    public void setPredictedWasteGenerated(Double value) {
        this.predictedWasteGenerated = value;
    }

    public Double getPredictedRenewableEnergyUsage() {
        return predictedRenewableEnergyUsage;
    }

    public void setPredictedRenewableEnergyUsage(Double value) {
        this.predictedRenewableEnergyUsage = value;
    }

    public Double getElectricityReductionPercentage() {
        return electricityReductionPercentage;
    }

    public void setElectricityReductionPercentage(Double value) {
        this.electricityReductionPercentage = value;
    }

    public Double getWaterReductionPercentage() {
        return waterReductionPercentage;
    }

    public void setWaterReductionPercentage(Double value) {
        this.waterReductionPercentage = value;
    }

    public Double getWasteReductionPercentage() {
        return wasteReductionPercentage;
    }

    public void setWasteReductionPercentage(Double value) {
        this.wasteReductionPercentage = value;
    }

    public Double getRenewableEnergyIncreasePercentage() {
        return renewableEnergyIncreasePercentage;
    }

    public void setRenewableEnergyIncreasePercentage(Double value) {
        this.renewableEnergyIncreasePercentage = value;
    }

    public Double getCarbonReductionPercentage() {
        return carbonReductionPercentage;
    }

    public void setCarbonReductionPercentage(Double value) {
        this.carbonReductionPercentage = value;
    }

    public Double getProjectedShiScore() {
        return projectedShiScore;
    }

    public void setProjectedShiScore(Double value) {
        this.projectedShiScore = value;
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

    public void setEstimatedCostSaving(Double value) {
        this.estimatedCostSaving = value;
    }

    public String getCarbonModel() {
        return carbonModel;
    }

    public void setCarbonModel(String carbonModel) {
        this.carbonModel = carbonModel;
    }

    public LocalDateTime getSimulationTime() {
        return simulationTime;
    }

    public void setSimulationTime(LocalDateTime simulationTime) {
        this.simulationTime = simulationTime;
    }
}
