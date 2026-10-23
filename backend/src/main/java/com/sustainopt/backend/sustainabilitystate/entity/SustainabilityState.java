package com.sustainopt.backend.sustainabilitystate.entity;

import com.sustainopt.backend.organization.entity.Organization;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sustainability_states")
public class SustainabilityState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "organization_id", nullable = false, unique = true)
    private Organization organization;

    @Column(nullable = false)
    private Double electricityConsumption;

    @Column(nullable = false)
    private Double waterConsumption;

    @Column(nullable = false)
    private Double carbonEmission;

    @Column(nullable = false)
    private Double wasteGenerated;

    @Column(nullable = false)
    private Double renewableEnergyUsage;

    @Column(nullable = false)
    private Double recyclingRate;

    @Column(nullable =false)
    private Double greenTransportationUsage;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public SustainabilityState() {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}