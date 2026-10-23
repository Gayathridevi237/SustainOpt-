package com.sustainopt.backend.dashboard.service;

import com.sustainopt.backend.auth.entity.User;
import com.sustainopt.backend.auth.repository.UserRepository;
import com.sustainopt.backend.common.util.SecurityUtils;
import com.sustainopt.backend.dashboard.dto.DashboardSummaryResponse;
import com.sustainopt.backend.dashboard.repository.DashboardRepository;
import com.sustainopt.backend.decision.dto.DecisionResponse;
import com.sustainopt.backend.decision.model.DecisionAction;
import com.sustainopt.backend.decision.service.DecisionService;
import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import com.sustainopt.backend.recommendation.dto.RecommendationResponse;
import com.sustainopt.backend.recommendation.service.RecommendationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;
    private final RecommendationService recommendationService;
    private final DecisionService decisionService;
    private final UserRepository userRepository;

    public DashboardService(
            DashboardRepository dashboardRepository,
            RecommendationService recommendationService,
            DecisionService decisionService,
            UserRepository userRepository) {

        this.dashboardRepository = dashboardRepository;
        this.recommendationService = recommendationService;
        this.decisionService = decisionService;
        this.userRepository = userRepository;
    }

    public DashboardSummaryResponse getDashboardSummary() {

        String email =
                SecurityUtils.getCurrentUserEmail();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                ));

        String organizationName =
                user.getOrganizationName();

        DashboardSummaryResponse response =
                new DashboardSummaryResponse();

        // ===========================
        // Organization-scoped statistics
        // ===========================

        response.setTotalMetrics(
                dashboardRepository.getTotalMetrics(
                        organizationName
                )
        );

        response.setTotalElectricity(
                dashboardRepository.getTotalElectricity(
                        organizationName
                )
        );

        response.setTotalWater(
                dashboardRepository.getTotalWater(
                        organizationName
                )
        );

        response.setTotalWaste(
                dashboardRepository.getTotalWaste(
                        organizationName
                )
        );

        response.setTotalCarbon(
                dashboardRepository.getTotalCarbon(
                        organizationName
                )
        );

        response.setAverageRenewableEnergy(
                dashboardRepository.getAverageRenewableEnergy(
                        organizationName
                )
        );

        response.setAverageTransportEmission(
                dashboardRepository.getAverageTransportEmission(
                        organizationName
                )
        );

        // ===========================
        // Latest metric for this organization
        // ===========================

        List<SustainabilityMetric> metrics =
                dashboardRepository
                        .findByOrganizationNameOrderByCreatedAtDesc(
                                organizationName
                        );

        if (metrics.isEmpty()) {

            response.setOverallScore(0.0);
            response.setGrade("N/A");
            response.setShiScore(0.0);
            response.setShiStatus("No Data");
            response.setEstimatedCostSaving(0.0);
            response.setScenarioAvailable(false);
            response.setTopPriorityAction(
                    "No sustainability metrics available."
            );
            response.setTopPriorityScore(0.0);

            return response;
        }

        SustainabilityMetric latestMetric =
                metrics.get(0);

        Long metricId =
                latestMetric.getId();

        // ===========================
        // Recommendation Engine
        // ===========================

        RecommendationResponse recommendation =
                recommendationService
                        .generateRecommendations(metricId);

        // ===========================
        // AMSDOA Decision Engine
        // ===========================

        DecisionResponse decision =
                decisionService
                        .optimizeDecision(metricId);

        response.setOverallScore(
                recommendation.getOverallScore()
        );

        response.setGrade(
                recommendation.getGrade()
        );

        response.setShiScore(
                recommendation.getShiScore()
        );

        response.setShiStatus(
                recommendation.getShiStatus()
        );

        response.setEstimatedCostSaving(
                recommendation.getEstimatedCostSaving()
        );

        response.setScenarioAvailable(
                recommendation.isScenarioAvailable()
        );

        // ===========================
        // Highest-priority decision
        // ===========================

        if (!decision.getPrioritizedActions().isEmpty()) {

            DecisionAction topAction =
                    decision.getPrioritizedActions().get(0);

            response.setTopPriorityAction(
                    topAction.getActionName()
            );

            response.setTopPriorityScore(
                    topAction.getPriorityScore()
            );

        } else {

            response.setTopPriorityAction(
                    "No priority action available."
            );

            response.setTopPriorityScore(0.0);
        }

        return response;
    }
}