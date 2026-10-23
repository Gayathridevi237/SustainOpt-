package com.sustainopt.backend.metrics.entity;

import com.sustainopt.backend.auth.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sustainability_metrics")
public class SustainabilityMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String organizationName;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String reportingMonth;

    @Column(nullable = false)
    private Double electricityKwh;

    @Column(nullable = false)
    private Double waterLiters;

    @Column(nullable = false)
    private Double wasteKg;

    @Column(nullable = false)
    private Double carbonEmission;

    @Column(nullable = false)
    private Double renewableEnergyPercent;

    @Column(nullable = false)
    private Double transportEmission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDateTime createdAt;

    public SustainabilityMetric() {
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ---------- Getters ----------

    public Long getId() {
        return id;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public String getDepartment() {
        return department;
    }

    public String getReportingMonth() {
        return reportingMonth;
    }

    public Double getElectricityKwh() {
        return electricityKwh;
    }

    public Double getWaterLiters() {
        return waterLiters;
    }

    public Double getWasteKg() {
        return wasteKg;
    }

    public Double getCarbonEmission() {
        return carbonEmission;
    }

    public Double getRenewableEnergyPercent() {
        return renewableEnergyPercent;
    }

    public Double getTransportEmission() {
        return transportEmission;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ---------- Setters ----------

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setReportingMonth(String reportingMonth) {
        this.reportingMonth = reportingMonth;
    }

    public void setElectricityKwh(Double electricityKwh) {
        this.electricityKwh = electricityKwh;
    }

    public void setWaterLiters(Double waterLiters) {
        this.waterLiters = waterLiters;
    }

    public void setWasteKg(Double wasteKg) {
        this.wasteKg = wasteKg;
    }

    public void setCarbonEmission(Double carbonEmission) {
        this.carbonEmission = carbonEmission;
    }

    public void setRenewableEnergyPercent(Double renewableEnergyPercent) {
        this.renewableEnergyPercent = renewableEnergyPercent;
    }

    public void setTransportEmission(Double transportEmission) {
        this.transportEmission = transportEmission;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
}