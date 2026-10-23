package com.sustainopt.backend.organization.dto;

import com.sustainopt.backend.organization.entity.IndustryType;

public class OrganizationRequest {

    private String organizationName;
    private IndustryType industryType;
    private Integer employeeCount;
    private Double facilityArea;
    private Double sustainabilityBudget;
    private String country;

    public OrganizationRequest() {
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
}