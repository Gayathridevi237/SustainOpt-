package com.sustainopt.backend.decision.algorithm;

import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import org.springframework.stereotype.Service;

@Service
public class CACService {

    public double calculateContextCoefficient(
            SustainabilityMetric metric) {

        double coefficient = 60.0;

        if (metric.getElectricityKwh() > 1000) {
            coefficient += 15;
        }

        if (metric.getWaterLiters() > 3000) {
            coefficient += 12;
        }

        if (metric.getWasteKg() > 100) {
            coefficient += 10;
        }

        if (metric.getCarbonEmission() > 300) {
            coefficient += 18;
        }

        if (metric.getRenewableEnergyPercent() < 50) {
            coefficient += 20;
        }

        if (metric.getTransportEmission() > 80) {
            coefficient += 10;
        }

        return Math.min(coefficient, 100);
    }
}