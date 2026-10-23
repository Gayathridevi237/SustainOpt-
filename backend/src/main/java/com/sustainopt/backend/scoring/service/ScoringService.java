package com.sustainopt.backend.scoring.service;

import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import com.sustainopt.backend.metrics.repository.SustainabilityMetricRepository;
import com.sustainopt.backend.scoring.dto.ScoringResponse;
import org.springframework.stereotype.Service;

@Service
public class ScoringService {

    private final SustainabilityMetricRepository metricRepository;

    public ScoringService(SustainabilityMetricRepository metricRepository) {
        this.metricRepository = metricRepository;
    }

    public ScoringResponse calculateScore(Long metricId) {

        SustainabilityMetric metric = metricRepository.findById(metricId)
                .orElseThrow(() ->
                        new RuntimeException("Metric not found."));

        ScoringResponse response = new ScoringResponse();

        double electricityScore =
                Math.max(0, 100 - (metric.getElectricityKwh() / 100));

        double waterScore =
                Math.max(0, 100 - (metric.getWaterLiters() / 1000));

        double wasteScore =
                Math.max(0, 100 - (metric.getWasteKg() / 10));

        double carbonScore =
                Math.max(0, 100 - (metric.getCarbonEmission() / 10));

        double renewableScore =
                Math.min(100, metric.getRenewableEnergyPercent());

        double transportScore =
                Math.max(0, 100 - (metric.getTransportEmission() / 10));

        double overallScore =
                (
                        electricityScore +
                        waterScore +
                        wasteScore +
                        carbonScore +
                        renewableScore +
                        transportScore
                ) / 6.0;

        response.setElectricityScore(electricityScore);
        response.setWaterScore(waterScore);
        response.setWasteScore(wasteScore);
        response.setCarbonScore(carbonScore);
        response.setRenewableScore(renewableScore);
        response.setTransportScore(transportScore);
        response.setOverallScore(overallScore);

        if (overallScore >= 90) {
            response.setGrade("Excellent");
        } else if (overallScore >= 75) {
            response.setGrade("Good");
        } else if (overallScore >= 60) {
            response.setGrade("Average");
        } else {
            response.setGrade("Poor");
        }

        return response;
    }
}