package com.sustainopt.backend.recommendation.service;

import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import com.sustainopt.backend.metrics.repository.SustainabilityMetricRepository;
import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.organization.repository.OrganizationRepository;
import com.sustainopt.backend.recommendation.dto.RecommendationResponse;
import com.sustainopt.backend.scenariosimulation.entity.ScenarioSimulation;
import com.sustainopt.backend.scenariosimulation.repository.ScenarioSimulationRepository;
import com.sustainopt.backend.scoring.dto.ScoringResponse;
import com.sustainopt.backend.scoring.service.ScoringService;
import com.sustainopt.backend.shi.entity.SustainabilityHealthIndex;
import com.sustainopt.backend.shi.repository.SustainabilityHealthIndexRepository;
import com.sustainopt.backend.sustainabilitystate.repository.SustainabilityStateRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class RecommendationService {

    private final SustainabilityMetricRepository metricRepository;
    private final ScoringService scoringService;
    private final OrganizationRepository organizationRepository;
    private final SustainabilityStateRepository sustainabilityStateRepository;
    private final SustainabilityHealthIndexRepository shiRepository;
    private final ScenarioSimulationRepository scenarioSimulationRepository;

    public RecommendationService(
            SustainabilityMetricRepository metricRepository,
            ScoringService scoringService,
            OrganizationRepository organizationRepository,
            SustainabilityStateRepository sustainabilityStateRepository,
            SustainabilityHealthIndexRepository shiRepository,
            ScenarioSimulationRepository scenarioSimulationRepository) {

        this.metricRepository = metricRepository;
        this.scoringService = scoringService;
        this.organizationRepository = organizationRepository;
        this.sustainabilityStateRepository = sustainabilityStateRepository;
        this.shiRepository = shiRepository;
        this.scenarioSimulationRepository = scenarioSimulationRepository;
    }

    public RecommendationResponse generateRecommendations(Long metricId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null) {

            throw new RuntimeException(
                    "Authenticated user not found."
            );
        }

        String currentUserEmail =
                authentication.getName();

        SustainabilityMetric metric =
                metricRepository.findById(metricId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Metric not found."
                                ));

        if (metric.getCreatedBy() == null
                || metric.getCreatedBy().getEmail() == null
                || !metric.getCreatedBy()
                        .getEmail()
                        .equalsIgnoreCase(currentUserEmail)) {

            throw new RuntimeException(
                    "You are not authorized to access this metric."
            );
        }

        ScoringResponse score =
                scoringService.calculateScore(metricId);

        RecommendationResponse response =
                new RecommendationResponse();

        response.setMetricId(metricId);
        response.setOverallScore(score.getOverallScore());
        response.setGrade(score.getGrade());

        List<Organization> organizations =
                organizationRepository.findByOrganizationName(
                        metric.getOrganizationName()
                );

        if (!organizations.isEmpty()) {

            Organization organization =
                    selectBestOrganization(
                            organizations,
                            metric.getDepartment()
                    );

            response.setOrganizationId(
                    organization.getId()
            );

            sustainabilityStateRepository
                    .findByOrganization(organization)
                    .ifPresent(state ->
                            response.setSustainabilityStateId(
                                    state.getId()
                            )
                    );

            List<SustainabilityHealthIndex> shiList =
                    shiRepository
                            .findByOrganizationOrderByCalculatedAtDesc(
                                    organization
                            );

            if (!shiList.isEmpty()) {

                SustainabilityHealthIndex shi =
                        shiList.get(0);

                response.setShiScore(
                        shi.getScore()
                );

                response.setShiStatus(
                        shi.getStatus()
                );
            }

            List<ScenarioSimulation> simulations =
                    scenarioSimulationRepository
                            .findByOrganizationOrderBySimulationTimeDesc(
                                    organization
                            );

            if (!simulations.isEmpty()) {

                ScenarioSimulation latest =
                        simulations.get(0);

                response.setEstimatedCostSaving(
                        latest.getEstimatedCostSaving()
                );

                response.setScenarioAvailable(true);

            } else {

                response.setScenarioAvailable(false);
            }

        } else {

            response.setScenarioAvailable(false);
        }

        response.setGeneratedAt(
                LocalDateTime.now()
        );

        List<String> recommendations =
                new ArrayList<>();

        // Always evaluate all six sustainability dimensions.
        // Actions are generated only once per dimension.
        if (metric.getElectricityKwh() > 1000) {
            recommendations.add(
                    "Reduce electricity consumption by using energy-efficient equipment and LED lighting."
            );
        } else {
            recommendations.add(
                    "Maintain electricity efficiency and monitor consumption against the recommended threshold."
            );
        }

        if (metric.getWaterLiters() > 3000) {
            recommendations.add(
                    "Reduce water consumption by fixing leaks and installing water-saving fixtures."
            );
        } else {
            recommendations.add(
                    "Maintain efficient water usage and continue monitoring consumption against the recommended threshold."
            );
        }

        if (metric.getWasteKg() > 100) {
            recommendations.add(
                    "Improve waste segregation and increase recycling initiatives."
            );
        } else {
            recommendations.add(
                    "Maintain current waste-management practices and continue monitoring waste generation."
            );
        }

        if (metric.getCarbonEmission() > 300) {
            recommendations.add(
                    "Lower carbon emissions by optimizing operations and using cleaner energy sources."
            );
        } else {
            recommendations.add(
                    "Maintain current carbon-management practices and continue monitoring emissions."
            );
        }

        if (metric.getRenewableEnergyPercent() < 50) {
            recommendations.add(
                    "Increase renewable energy adoption through solar panels or green energy procurement."
            );
        } else {
            recommendations.add(
                    "Maintain renewable energy adoption and continue evaluating opportunities for clean-energy expansion."
            );
        }

        if (metric.getTransportEmission() > 80) {
            recommendations.add(
                    "Reduce transport emissions by encouraging carpooling, electric vehicles, or remote work."
            );
        } else {
            recommendations.add(
                    "Maintain current transport-efficiency practices and continue monitoring transport emissions."
            );
        }

        response.setRecommendations(
                recommendations
        );

        return response;
    }

    private Organization selectBestOrganization(
            List<Organization> organizations,
            String department) {

        if (organizations.size() == 1) {
            return organizations.get(0);
        }

        if (department != null && !department.isBlank()) {

            String normalizedDepartment =
                    department.trim()
                            .toLowerCase(Locale.ROOT);

            Organization departmentMatch =
                    organizations.stream()
                            .filter(organization ->
                                    organization.getIndustryType() != null
                                            && organization.getIndustryType()
                                            .name()
                                            .toLowerCase(Locale.ROOT)
                                            .equals(normalizedDepartment)
                            )
                            .min(
                                    Comparator.comparing(
                                            Organization::getId
                                    )
                            )
                            .orElse(null);

            if (departmentMatch != null) {
                return departmentMatch;
            }
        }

        return organizations.stream()
                .min(
                        Comparator.comparing(
                                Organization::getId
                        )
                )
                .orElse(organizations.get(0));
    }
}
