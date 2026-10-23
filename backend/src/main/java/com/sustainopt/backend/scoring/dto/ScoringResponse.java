package com.sustainopt.backend.scoring.dto;

public class ScoringResponse {

    private Double overallScore;
    private String grade;

    private Double electricityScore;
    private Double waterScore;
    private Double wasteScore;
    private Double carbonScore;
    private Double renewableScore;
    private Double transportScore;

    public ScoringResponse() {
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Double getElectricityScore() {
        return electricityScore;
    }

    public void setElectricityScore(Double electricityScore) {
        this.electricityScore = electricityScore;
    }

    public Double getWaterScore() {
        return waterScore;
    }

    public void setWaterScore(Double waterScore) {
        this.waterScore = waterScore;
    }

    public Double getWasteScore() {
        return wasteScore;
    }

    public void setWasteScore(Double wasteScore) {
        this.wasteScore = wasteScore;
    }

    public Double getCarbonScore() {
        return carbonScore;
    }

    public void setCarbonScore(Double carbonScore) {
        this.carbonScore = carbonScore;
    }

    public Double getRenewableScore() {
        return renewableScore;
    }

    public void setRenewableScore(Double renewableScore) {
        this.renewableScore = renewableScore;
    }

    public Double getTransportScore() {
        return transportScore;
    }

    public void setTransportScore(Double transportScore) {
        this.transportScore = transportScore;
    }
}