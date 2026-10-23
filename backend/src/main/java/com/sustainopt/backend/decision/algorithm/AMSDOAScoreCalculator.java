
package com.sustainopt.backend.decision.algorithm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AMSDOAScoreCalculator {

    @Value("${amsdoa.weight.utility}")
    private double utilityWeight;

    @Value("${amsdoa.weight.context}")
    private double contextWeight;

    @Value("${amsdoa.weight.interaction}")
    private double interactionWeight;

    @Value("${amsdoa.weight.feedback}")
    private double feedbackWeight;

    public double calculatePriorityScore(
            double utilityScore,
            double contextCoefficient,
            double interactionScore,
            double feedbackAdjustment) {

        double finalScore =
                (utilityWeight * utilityScore)
                + (contextWeight * contextCoefficient)
                + (interactionWeight * interactionScore)
                + (feedbackWeight * feedbackAdjustment);

        finalScore = Math.max(0.0, Math.min(100.0, finalScore));

        return Math.round(finalScore * 100.0) / 100.0;
    }
}
