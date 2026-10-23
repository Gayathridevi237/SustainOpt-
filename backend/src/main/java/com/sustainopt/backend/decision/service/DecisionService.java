package com.sustainopt.backend.decision.service;

import com.sustainopt.backend.decision.algorithm.AMSDOAScoreCalculator;
import com.sustainopt.backend.decision.algorithm.CACService;
import com.sustainopt.backend.decision.dto.DecisionResponse;
import com.sustainopt.backend.decision.explainability.ExplanationService;
import com.sustainopt.backend.decision.feedback.DecisionFeedbackService;
import com.sustainopt.backend.decision.graph.ActionInteraction;
import com.sustainopt.backend.decision.graph.ActionInteractionGraph;
import com.sustainopt.backend.decision.model.DecisionAction;
import com.sustainopt.backend.decision.optimizer.DecisionUtilityOptimizer;
import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import com.sustainopt.backend.metrics.repository.SustainabilityMetricRepository;
import com.sustainopt.backend.recommendation.dto.RecommendationResponse;
import com.sustainopt.backend.recommendation.service.RecommendationService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DecisionService {

    private final RecommendationService recommendationService;
    private final SustainabilityMetricRepository metricRepository;
    private final CACService cacService;
    private final DecisionUtilityOptimizer decisionUtilityOptimizer;
    private final ActionInteractionGraph actionInteractionGraph;
    private final ExplanationService explanationService;
    private final DecisionFeedbackService decisionFeedbackService;
    private final AMSDOAScoreCalculator amsdoaScoreCalculator;

    public DecisionService(
            RecommendationService recommendationService,
            SustainabilityMetricRepository metricRepository,
            CACService cacService,
            DecisionUtilityOptimizer decisionUtilityOptimizer,
            ActionInteractionGraph actionInteractionGraph,
            ExplanationService explanationService,
            DecisionFeedbackService decisionFeedbackService,
            AMSDOAScoreCalculator amsdoaScoreCalculator) {

        this.recommendationService = recommendationService;
        this.metricRepository = metricRepository;
        this.cacService = cacService;
        this.decisionUtilityOptimizer = decisionUtilityOptimizer;
        this.actionInteractionGraph = actionInteractionGraph;
        this.explanationService = explanationService;
        this.decisionFeedbackService = decisionFeedbackService;
        this.amsdoaScoreCalculator = amsdoaScoreCalculator;
    }

    public DecisionResponse optimizeDecision(Long metricId) {

        RecommendationResponse recommendation =
                recommendationService.generateRecommendations(metricId);

        SustainabilityMetric metric =
                metricRepository.findById(metricId)
                        .orElseThrow(() ->
                                new RuntimeException("Metric not found."));

        // CAC
        double contextCoefficient =
                cacService.calculateContextCoefficient(metric);

        // AIG
        List<ActionInteraction> interactions =
                actionInteractionGraph.buildGraph(
                        recommendation.getRecommendations()
                );

        DecisionResponse response =
                new DecisionResponse();

        response.setMetricId(metricId);
        response.setOverallScore(recommendation.getOverallScore());
        response.setGrade(recommendation.getGrade());

        List<DecisionAction> actions =
                new ArrayList<>();

        for (String recommendationText :
                recommendation.getRecommendations()) {

            DecisionAction action =
                    new DecisionAction();

            action.setActionName(
                    recommendationText
            );

            // DUO
            double utilityScore =
                    decisionUtilityOptimizer.calculateUtilityScore(
                            metric,
                            recommendationText
                    );

            // AFR
            double feedbackAdjustment =
                    decisionFeedbackService.calculateFeedbackAdjustment(
                            metricId,
                            recommendationText
                    );

            // AIG Interaction Score
            double interactionScore = 0.0;

            for (ActionInteraction interaction :
                    interactions) {

                if (interaction.getSourceAction()
                        .equalsIgnoreCase(recommendationText)) {

                    interactionScore +=
                            interaction.getInteractionScore();
                }
            }

            // AMSDOA Base Score
            double amsdoaBaseScore =
                    amsdoaScoreCalculator.calculatePriorityScore(
                            utilityScore,
                            contextCoefficient,
                            interactionScore,
                            feedbackAdjustment
                    );

            double finalPriority =
                    amsdoaBaseScore;

            
            // SHI Adjustment
            double shiAdjustment = 0.0;

            if (recommendation.getShiScore() != null) {
                double shiScore = recommendation.getShiScore();

                if (shiScore < 60.0) {
                    shiAdjustment = 10.0;
                } else if (shiScore < 75.0) {
                    shiAdjustment = 5.0;
                } else if (shiScore >= 90.0) {
                    shiAdjustment = -5.0;
                }

                finalPriority += shiAdjustment;
            }


            
            // Scenario Adjustment
            double scenarioAdjustment = 0.0;

            Double estimatedCostSaving =
                    recommendation.getEstimatedCostSaving();

            if (recommendation.isScenarioAvailable()
                    && estimatedCostSaving != null
                    && Double.isFinite(estimatedCostSaving)
                    && estimatedCostSaving >= 0.0) {

                if (estimatedCostSaving >= 20.0) {
                    scenarioAdjustment = 5.0;
                } else if (estimatedCostSaving >= 10.0) {
                    scenarioAdjustment = 2.0;
                }
            }

            finalPriority += scenarioAdjustment;


            // Maintenance actions should not be treated as urgent corrective actions.
            boolean maintenanceAction =
                    recommendationText.toLowerCase().contains("maintain");

            if (maintenanceAction) {
                finalPriority = Math.min(finalPriority, 45.0);
            }

            finalPriority =
                    Math.max(
                            0,
                            Math.min(
                                    100,
                                    finalPriority
                            )
                    );

            // AMSDOA transparency values
            action.setUtilityScore(utilityScore);
            action.setContextCoefficient(contextCoefficient);
            action.setInteractionScore(interactionScore);
            action.setFeedbackAdjustment(feedbackAdjustment);
            action.setAmsdoaBaseScore(amsdoaBaseScore);
            action.setShiAdjustment(shiAdjustment);
            action.setScenarioAdjustment(scenarioAdjustment);
            action.setPriorityScore(finalPriority);

            // Dynamic decision metadata
            action.setExpectedImpact(
                    calculateExpectedImpact(
                            metric,
                            recommendationText
                    )
            );

            action.setImplementationCost(
                    calculateImplementationCost(
                            recommendationText
                    )
            );

            action.setUrgency(
                    calculateUrgency(
                            metric,
                            recommendationText
                    )
            );

            // Explainability Engine
            action.setExplanation(
                    explanationService.generateExplanation(
                            metric,
                            recommendationText
                    )
            );

            actions.add(action);
        }

        // Highest Priority First
        actions.sort(
                (a, b) ->
                        Double.compare(
                                b.getPriorityScore(),
                                a.getPriorityScore()
                        )
        );

        response.setPrioritizedActions(
                actions
        );

        response.setActionInteractions(
                interactions
        );

        return response;
    }

    private String calculateExpectedImpact(
            SustainabilityMetric metric,
            String actionName) {

        if (isMaintenanceAction(actionName)) {
            return "Low";
        }

        String action = actionName.toLowerCase();

        double severity = 0.0;

        if (action.contains("electricity")) {
            severity = metric.getElectricityKwh() / 1000.0;
        } else if (action.contains("water")) {
            severity = metric.getWaterLiters() / 3000.0;
        } else if (action.contains("waste")) {
            severity = metric.getWasteKg() / 100.0;
        } else if (action.contains("carbon")) {
            severity = metric.getCarbonEmission() / 300.0;
        } else if (action.contains("renewable")) {
            severity = (50.0 - metric.getRenewableEnergyPercent()) / 50.0;
        } else if (action.contains("transport")) {
            severity = metric.getTransportEmission() / 80.0;
        }

        if (severity >= 1.5) {
            return "High";
        }

        if (severity >= 1.0) {
            return "Medium";
        }

        return "Low";
    }

    private String calculateImplementationCost(
            String actionName) {

        if (isMaintenanceAction(actionName)) {
            return "Low";
        }

        String action = actionName.toLowerCase();

        if (action.contains("solar")
                || action.contains("green energy procurement")) {
            return "High";
        }

        if (action.contains("water-saving fixtures")
                || action.contains("energy-efficient equipment")
                || action.contains("electric vehicles")) {
            return "Medium";
        }

        if (action.contains("recycling")
                || action.contains("carpooling")
                || action.contains("remote work")
                || action.contains("cleaner energy")) {
            return "Medium";
        }

        return "Low";
    }

    private String calculateUrgency(
            SustainabilityMetric metric,
            String actionName) {

        if (isMaintenanceAction(actionName)) {
            return "Low";
        }

        String action = actionName.toLowerCase();
        double severity = 0.0;

        if (action.contains("electricity")) {
            severity = metric.getElectricityKwh() / 1000.0;
        } else if (action.contains("water")) {
            severity = metric.getWaterLiters() / 3000.0;
        } else if (action.contains("waste")) {
            severity = metric.getWasteKg() / 100.0;
        } else if (action.contains("carbon")) {
            severity = metric.getCarbonEmission() / 300.0;
        } else if (action.contains("renewable")) {
            severity = (50.0 - metric.getRenewableEnergyPercent()) / 50.0;
        } else if (action.contains("transport")) {
            severity = metric.getTransportEmission() / 80.0;
        }

        if (severity >= 1.5) {
            return "High";
        }

        if (severity >= 1.0) {
            return "Medium";
        }

        return "Low";
    }

    private boolean isMaintenanceAction(String actionName) {
        return actionName != null
                && actionName.toLowerCase().contains("maintain");
    }
}
