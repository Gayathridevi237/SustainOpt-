package com.sustainopt.backend.twinsnapshot.dto;

import java.time.LocalDateTime;

public class TwinSnapshotResponse {

    private Long id;
    private Long organizationId;

    private Double electricityConsumption;
    private Double waterConsumption;
    private Double carbonEmission;
    private Double wasteGenerated;
    private Double renewableEnergyUsage;
    private Double recyclingRate;
    private Double greenTransportationUsage;

    private LocalDateTime snapshotTime;

    public TwinSnapshotResponse() {
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

    public Double getElectricityConsumption() {
        return electricityConsumption;
    }

    public void setElectricityConsumption(Double electricityConsumption) {
        this.electricityConsumption = electricityConsumption;
    }

    public Double getWaterConsumption() {
        return waterConsumption;
    }

    public void setWaterConsumption(Double waterConsumption) {
        this.waterConsumption = waterConsumption;
    }

    public Double getCarbonEmission() {
        return carbonEmission;
    }

    public void setCarbonEmission(Double carbonEmission) {
        this.carbonEmission = carbonEmission;
    }

    public Double getWasteGenerated() {
        return wasteGenerated;
    }

    public void setWasteGenerated(Double wasteGenerated) {
        this.wasteGenerated = wasteGenerated;
    }

    public Double getRenewableEnergyUsage() {
        return renewableEnergyUsage;
    }

    public void setRenewableEnergyUsage(Double renewableEnergyUsage) {
        this.renewableEnergyUsage = renewableEnergyUsage;
    }

    public Double getRecyclingRate() {
        return recyclingRate;
    }

    public void setRecyclingRate(Double recyclingRate) {
        this.recyclingRate = recyclingRate;
    }

    public Double getGreenTransportationUsage() {
        return greenTransportationUsage;
    }

    public void setGreenTransportationUsage(Double greenTransportationUsage) {
        this.greenTransportationUsage = greenTransportationUsage;
    }

    public LocalDateTime getSnapshotTime() {
        return snapshotTime;
    }

    public void setSnapshotTime(LocalDateTime snapshotTime) {
        this.snapshotTime = snapshotTime;
    }
}