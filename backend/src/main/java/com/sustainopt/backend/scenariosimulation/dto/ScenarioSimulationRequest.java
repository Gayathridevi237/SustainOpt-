package com.sustainopt.backend.scenariosimulation.dto;

public class ScenarioSimulationRequest {

    private Long organizationId;

    // User-defined simulation inputs (%)
    private Double electricityReductionPercentage;
    private Double waterReductionPercentage;
    private Double wasteReductionPercentage;
    private Double renewableEnergyIncreasePercentage;

    public ScenarioSimulationRequest() {
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Double getElectricityReductionPercentage() {
        return electricityReductionPercentage;
    }

    public void setElectricityReductionPercentage(Double electricityReductionPercentage) {
        this.electricityReductionPercentage = electricityReductionPercentage;
    }

    public Double getWaterReductionPercentage() {
        return waterReductionPercentage;
    }

    public void setWaterReductionPercentage(Double waterReductionPercentage) {
        this.waterReductionPercentage = waterReductionPercentage;
    }

    public Double getWasteReductionPercentage() {
        return wasteReductionPercentage;
    }

    public void setWasteReductionPercentage(Double wasteReductionPercentage) {
        this.wasteReductionPercentage = wasteReductionPercentage;
    }

    public Double getRenewableEnergyIncreasePercentage() {
        return renewableEnergyIncreasePercentage;
    }

    public void setRenewableEnergyIncreasePercentage(Double renewableEnergyIncreasePercentage) {
        this.renewableEnergyIncreasePercentage = renewableEnergyIncreasePercentage;
    }
}