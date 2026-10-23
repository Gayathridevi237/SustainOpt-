package com.sustainopt.backend.twinsnapshot.entity;

import com.sustainopt.backend.organization.entity.Organization;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "twin_snapshots")
public class TwinSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    private Double electricityConsumption;

    private Double waterConsumption;

    private Double carbonEmission;

    private Double wasteGenerated;

    private Double renewableEnergyUsage;

    private Double recyclingRate;

    private Double greenTransportationUsage;

    private LocalDateTime snapshotTime;

    @PrePersist
    public void onCreate() {
        snapshotTime = LocalDateTime.now();
    }

    public TwinSnapshot() {
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