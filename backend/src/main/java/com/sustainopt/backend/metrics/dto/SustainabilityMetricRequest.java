package com.sustainopt.backend.metrics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SustainabilityMetricRequest {

    @NotBlank
    private String organizationName;

    @NotBlank
    private String department;

    @NotBlank
    private String reportingMonth;

    @NotNull
    private Double electricityKwh;

    @NotNull
    private Double waterLiters;

    @NotNull
    private Double wasteKg;

    @NotNull
    private Double carbonEmission;

    @NotNull
    private Double renewableEnergyPercent;

    @NotNull
    private Double transportEmission;

    public SustainabilityMetricRequest() {
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
}