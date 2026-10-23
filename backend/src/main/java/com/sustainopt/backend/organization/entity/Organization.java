package com.sustainopt.backend.organization.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String organizationName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IndustryType industryType;

    @Column(nullable = false)
    private Integer employeeCount;

    @Column(nullable = false)
    private Double facilityArea;

    @Column(nullable = false)
    private Double sustainabilityBudget;

    @Column(nullable = false)
    private String country;

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

    public Organization() {
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}