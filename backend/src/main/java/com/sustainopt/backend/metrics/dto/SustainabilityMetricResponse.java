package com.sustainopt.backend.metrics.dto;

public class SustainabilityMetricResponse {

    private Long id;
    private String organizationName;
    private String department;
    private String reportingMonth;
    private Double electricityKwh;
    private Double waterLiters;
    private Double wasteKg;
    private Double carbonEmission;
    private Double renewableEnergyPercent;
    private Double transportEmission;
    private String createdBy;

    public SustainabilityMetricResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getReportingMonth() {
        return reportingMonth;
    }

    public void setReportingMonth(String reportingMonth) {
        this.reportingMonth = reportingMonth;
    }

    public Double getElectricityKwh() {
        return electricityKwh;
    }

    public void setElectricityKwh(Double electricityKwh) {
        this.electricityKwh = electricityKwh;
    }

    public Double getWaterLiters() {
        return waterLiters;
    }

    public void setWaterLiters(Double waterLiters) {
        this.waterLiters = waterLiters;
    }

    public Double getWasteKg() {
        return wasteKg;
    }

    public void setWasteKg(Double wasteKg) {
        this.wasteKg = wasteKg;
    }

    public Double getCarbonEmission() {
        return carbonEmission;
    }

    public void setCarbonEmission(Double carbonEmission) {
        this.carbonEmission = carbonEmission;
    }

    public Double getRenewableEnergyPercent() {
        return renewableEnergyPercent;
    }

    public void setRenewableEnergyPercent(Double renewableEnergyPercent) {
        this.renewableEnergyPercent = renewableEnergyPercent;
    }

    public Double getTransportEmission() {
        return transportEmission;
    }

    public void setTransportEmission(Double transportEmission) {
        this.transportEmission = transportEmission;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}