package com.sustainopt.backend.scenariosimulation.entity;

import com.sustainopt.backend.organization.entity.Organization;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "scenario_simulations")
public class ScenarioSimulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    // Scenario inputs
    private Double electricityReductionPercentage;
    private Double waterReductionPercentage;
    private Double wasteReductionPercentage;
    private Double renewableEnergyIncreasePercentage;

    // Predicted outputs
    private Double predictedElectricityConsumption;
    private Double predictedWaterConsumption;
    private Double predictedCarbonEmission;
    private Double predictedWasteGenerated;

    private Double estimatedCostSaving;

    private LocalDateTime simulationTime;

    @PrePersist
    public void onCreate() {
        simulationTime = LocalDateTime.now();
    }

    public ScenarioSimulation() {
    }

    public Long getId() {
        return id;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
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

    public Double getPredictedElectricityConsumption() {
        return predictedElectricityConsumption;
    }

    public void setPredictedElectricityConsumption(Double predictedElectricityConsumption) {
        this.predictedElectricityConsumption = predictedElectricityConsumption;
    }

    public Double getPredictedWaterConsumption() {
        return predictedWaterConsumption;
    }

    public void setPredictedWaterConsumption(Double predictedWaterConsumption) {
        this.predictedWaterConsumption = predictedWaterConsumption;
    }

    public Double getPredictedCarbonEmission() {
        return predictedCarbonEmission;
    }

    public void setPredictedCarbonEmission(Double predictedCarbonEmission) {
        this.predictedCarbonEmission = predictedCarbonEmission;
    }

    public Double getPredictedWasteGenerated() {
        return predictedWasteGenerated;
    }

    public void setPredictedWasteGenerated(Double predictedWasteGenerated) {
        this.predictedWasteGenerated = predictedWasteGenerated;
    }

    public Double getEstimatedCostSaving() {
        return estimatedCostSaving;
    }

    public void setEstimatedCostSaving(Double estimatedCostSaving) {
        this.estimatedCostSaving = estimatedCostSaving;
    }

    public LocalDateTime getSimulationTime() {
        return simulationTime;
    }

    public void setSimulationTime(LocalDateTime simulationTime) {
        this.simulationTime = simulationTime;
    }
}