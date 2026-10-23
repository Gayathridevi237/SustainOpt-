package com.sustainopt.backend.decision.feedback;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "decision_feedback")
public class DecisionFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long metricId;

    @Column(nullable = false, length = 500)
    private String actionName;

    @Column(nullable = false, length = 100)
    private String implementationStatus;

    @Column(nullable = false)
    private Integer successScore;

    @Column(columnDefinition = "TEXT")
    private String comments;

    public DecisionFeedback() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMetricId() {
        return metricId;
    }

    public void setMetricId(Long metricId) {
        this.metricId = metricId;
    }

    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public String getImplementationStatus() {
        return implementationStatus;
    }

    public void setImplementationStatus(String implementationStatus) {
        this.implementationStatus = implementationStatus;
    }

    public Integer getSuccessScore() {
        return successScore;
    }

    public void setSuccessScore(Integer successScore) {
        this.successScore = successScore;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}