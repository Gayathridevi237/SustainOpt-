
package com.sustainopt.backend.decision.optimizer;

import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import org.springframework.stereotype.Service;

@Service
public class DecisionUtilityOptimizer {

    private static final double BASE_UTILITY = 50.0;
    private static final double MAX_ADDITIONAL_UTILITY = 50.0;

    private static final double ELECTRICITY_THRESHOLD = 1000.0;
    private static final double WATER_THRESHOLD = 3000.0;
    private static final double WASTE_THRESHOLD = 100.0;
    private static final double CARBON_THRESHOLD = 300.0;
    private static final double RENEWABLE_TARGET_PERCENT = 50.0;
    private static final double TRANSPORT_THRESHOLD = 80.0;

    public double calculateUtilityScore(
            SustainabilityMetric metric,
            String actionName) {

        if (metric == null) {
            throw new IllegalArgumentException(
                    "Sustainability metric must not be null."
            );
        }

        if (actionName == null || actionName.isBlank()) {
            throw new IllegalArgumentException(
                    "Action name must not be null or blank."
            );
        }

        String action = actionName.toLowerCase(
                java.util.Locale.ROOT
        );

        // Maintenance actions preserve an existing good practice.
        // They are not treated as urgent corrective actions.
        if (action.contains("maintain")) {
            return 25.0;
        }

        double severityRatio;

        if (action.contains("electricity")) {
            severityRatio = nonNegativeRatio(
                    metric.getElectricityKwh(),
                    ELECTRICITY_THRESHOLD
            );
        } else if (action.contains("water")) {
            severityRatio = nonNegativeRatio(
                    metric.getWaterLiters(),
                    WATER_THRESHOLD
            );
        } else if (action.contains("waste")) {
            severityRatio = nonNegativeRatio(
                    metric.getWasteKg(),
                    WASTE_THRESHOLD
            );
        } else if (action.contains("carbon")) {
            severityRatio = nonNegativeRatio(
                    metric.getCarbonEmission(),
                    CARBON_THRESHOLD
            );
        } else if (action.contains("renewable")) {
            double renewableGap = Math.max(
                    0.0,
                    RENEWABLE_TARGET_PERCENT
                            - metric.getRenewableEnergyPercent()
            );

            severityRatio = renewableGap
                    / RENEWABLE_TARGET_PERCENT;
        } else if (action.contains("transport")) {
            severityRatio = nonNegativeRatio(
                    metric.getTransportEmission(),
                    TRANSPORT_THRESHOLD
            );
        } else {
            // Unknown action: do not invent a metric-specific benefit.
            return BASE_UTILITY;
        }

        // Bounded, threshold-relative utility:
        // U = 50 + 50 * (r / (1 + r))
        double utilityScore = BASE_UTILITY
                + MAX_ADDITIONAL_UTILITY
                * (severityRatio / (1.0 + severityRatio));

        return Math.round(
                utilityScore * 100.0
        ) / 100.0;
    }

    private double nonNegativeRatio(
            double metricValue,
            double referenceThreshold) {

        double nonNegativeValue = Math.max(0.0, metricValue);

        return nonNegativeValue / referenceThreshold;
    }
}
