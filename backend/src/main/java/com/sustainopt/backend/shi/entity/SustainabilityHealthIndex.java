package com.sustainopt.backend.shi.entity;

import com.sustainopt.backend.organization.entity.Organization;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sustainability_health_index")
public class SustainabilityHealthIndex {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    private Double score;

    private String status;

    private LocalDateTime calculatedAt;

    @PrePersist
    public void onCreate() {
        calculatedAt = LocalDateTime.now();
    }

    public SustainabilityHealthIndex() {
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

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }
}