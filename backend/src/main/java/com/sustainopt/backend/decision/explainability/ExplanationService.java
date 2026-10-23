package com.sustainopt.backend.decision.explainability;

import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import org.springframework.stereotype.Service;

@Service
public class ExplanationService {

    public String generateExplanation(
            SustainabilityMetric metric,
            String recommendation) {

        String normalizedRecommendation =
                recommendation.toLowerCase();

        if (normalizedRecommendation.contains("electricity")) {
            if (normalizedRecommendation.contains("maintain")) {
                return "Electricity consumption is within the recommended threshold. Continue monitoring efficiency to prevent deterioration.";
            }

            return "Electricity consumption is higher than the recommended sustainability threshold. Reducing electricity usage can lower operational costs and associated environmental impact.";
        }

        if (normalizedRecommendation.contains("water")) {
            if (normalizedRecommendation.contains("maintain")) {
                return "Water consumption is within the recommended level. Continue monitoring usage and maintain current water-efficiency practices.";
            }

            return "Water consumption exceeds the recommended level. Implementing water-saving measures can improve sustainability performance.";
        }

        if (normalizedRecommendation.contains("waste")) {
            if (normalizedRecommendation.contains("maintain")) {
                return "Waste generation is within the current acceptable threshold. Continue monitoring segregation and recycling performance.";
            }

            return "Waste generation is above the acceptable threshold. Better segregation and recycling can reduce environmental impact.";
        }

        if (normalizedRecommendation.contains("carbon")) {
            if (normalizedRecommendation.contains("maintain")) {
                return "Carbon emissions are within the current target level. Continue monitoring emissions and maintaining current controls.";
            }

            return "Carbon emissions are above the target level. Reducing emissions through cleaner energy and operational improvements can provide significant sustainability benefits.";
        }

        if (normalizedRecommendation.contains("renewable")) {
            if (normalizedRecommendation.contains("maintain")) {
                return "Renewable energy usage is at or above the desired level. Continue maintaining clean-energy adoption and monitor opportunities for further improvement.";
            }

            return "Renewable energy usage is below the desired level. Increasing renewable energy adoption can improve the organization's sustainability profile.";
        }

        if (normalizedRecommendation.contains("transport")) {
            if (normalizedRecommendation.contains("maintain")) {
                return "Transport emissions are within the current threshold. Continue monitoring mobility patterns and maintaining efficient transport practices.";
            }

            return "Transport emissions are high. Encouraging carpooling, electric vehicles, or remote work can reduce transport-related emissions.";
        }

        return "This recommendation supports continued sustainability performance monitoring and improvement.";
    }
}
