package com.sustainopt.backend.organization.dto;

import com.sustainopt.backend.organization.entity.IndustryType;

import java.time.LocalDateTime;

public class OrganizationResponse {

    private Long id;
    private String organizationName;
    private IndustryType industryType;
    private Integer employeeCount;
    private Double facilityArea;
    private Double sustainabilityBudget;
    private String country;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrganizationResponse() {
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

    public IndustryType getIndustryType() {
        return industryType;
    }

    public void setIndustryType(IndustryType industryType) {
        this.industryType = industryType;
    }

    public Integer getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Integer employeeCount) {
        this.employeeCount = employeeCount;
    }

    public Double getFacilityArea() {
        return facilityArea;
    }

    public void setFacilityArea(Double facilityArea) {
        this.facilityArea = facilityArea;
    }

    public Double getSustainabilityBudget() {
        return sustainabilityBudget;
    }

    public void setSustainabilityBudget(Double sustainabilityBudget) {
        this.sustainabilityBudget = sustainabilityBudget;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}