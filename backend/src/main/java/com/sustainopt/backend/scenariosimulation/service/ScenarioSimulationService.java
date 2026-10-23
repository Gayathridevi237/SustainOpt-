package com.sustainopt.backend.scenariosimulation.service;

import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.organization.repository.OrganizationRepository;
import com.sustainopt.backend.scenariosimulation.dto.ScenarioSimulationRequest;
import com.sustainopt.backend.scenariosimulation.dto.ScenarioSimulationResponse;
import com.sustainopt.backend.scenariosimulation.entity.ScenarioSimulation;
import com.sustainopt.backend.scenariosimulation.repository.ScenarioSimulationRepository;
import com.sustainopt.backend.sustainabilitystate.entity.SustainabilityState;
import com.sustainopt.backend.sustainabilitystate.repository.SustainabilityStateRepository;
import org.springframework.stereotype.Service;

@Service
public class ScenarioSimulationService {

    private static final double ELECTRICITY_COST_RATE = 0.15;

    public static final double CARBON_ELECTRICITY_WEIGHT = 0.70;
    public static final double CARBON_RENEWABLE_WEIGHT = 0.30;

    private final ScenarioSimulationRepository scenarioSimulationRepository;
    private final OrganizationRepository organizationRepository;
    private final SustainabilityStateRepository sustainabilityStateRepository;

    public ScenarioSimulationService(
            ScenarioSimulationRepository scenarioSimulationRepository,
            OrganizationRepository organizationRepository,
            SustainabilityStateRepository sustainabilityStateRepository) {

        this.scenarioSimulationRepository = scenarioSimulationRepository;
        this.organizationRepository = organizationRepository;
        this.sustainabilityStateRepository = sustainabilityStateRepository;
    }

    public ScenarioSimulationResponse simulateScenario(
            ScenarioSimulationRequest request) {

        if (request == null || request.getOrganizationId() == null) {
            throw new IllegalArgumentException(
                    "Organization ID is required."
            );
        }

        double electricityReduction =
                validatePercentage(
                        request.getElectricityReductionPercentage(),
                        "Electricity reduction"
                );

        double waterReduction =
                validatePercentage(
                        request.getWaterReductionPercentage(),
                        "Water reduction"
                );

        double wasteReduction =
                validatePercentage(
                        request.getWasteReductionPercentage(),
                        "Waste reduction"
                );

        double renewableIncrease =
                validatePercentage(
                        request.getRenewableEnergyIncreasePercentage(),
                        "Renewable energy increase"
                );

        Organization organization =
                organizationRepository.findById(
                        request.getOrganizationId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Organization not found."
                        ));

        SustainabilityState state =
                sustainabilityStateRepository.findByOrganization(
                        organization
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Sustainability State not found."
                        ));

        double currentElectricity =
                safeValue(state.getElectricityConsumption());

        double currentWater =
                safeValue(state.getWaterConsumption());

        double currentWaste =
                safeValue(state.getWasteGenerated());

        double currentCarbon =
                safeValue(state.getCarbonEmission());

        double currentRenewable =
                safeValue(state.getRenewableEnergyUsage());

        double currentRecycling =
                safeValue(state.getRecyclingRate());

        /*
         * Scenario projection model
         *
         * Electricity:
         *   P(E) = E × (1 - rE / 100)
         *
         * Water:
         *   P(W) = W × (1 - rW / 100)
         *
         * Waste:
         *   P(Waste) = Waste × (1 - rWaste / 100)
         *
         * Renewable:
         *   P(R) = min(100, R + renewable increase)
         *
         * Carbon:
         *   Carbon reduction combines the electricity intervention
         *   and renewable-energy intervention:
         *
         *   rCarbon =
         *       0.70 × rElectricity
         *       + 0.30 × rRenewable
         *
         *   P(Carbon) =
         *       Carbon × (1 - rCarbon / 100)
         *
         * The 70/30 carbon attribution is an explicit scenario-model
         * assumption used by SustainOpt for what-if comparison.
         */

        double predictedElectricity =
                currentElectricity *
                        (1 - electricityReduction / 100.0);

        double predictedWater =
                currentWater *
                        (1 - waterReduction / 100.0);

        double predictedWaste =
                currentWaste *
                        (1 - wasteReduction / 100.0);

        double predictedRenewable =
                Math.min(
                        100.0,
                        currentRenewable + renewableIncrease
                );

        double carbonReductionPercentage =
                Math.min(
                        100.0,
                        (CARBON_ELECTRICITY_WEIGHT *
                                electricityReduction)
                                +
                                (CARBON_RENEWABLE_WEIGHT *
                                        renewableIncrease)
                );

        double predictedCarbon =
                currentCarbon *
                        (1 - carbonReductionPercentage / 100.0);

        /*
         * Projected SHI follows the existing backend SHI formula.
         *
         * Electricity score:
         *   max(0, 100 - electricity / 200)
         *
         * Water score:
         *   max(0, 100 - water / 100)
         *
         * Carbon score:
         *   max(0, 100 - carbon / 50)
         *
         * Waste score:
         *   max(0, 100 - waste / 20)
         *
         * Renewable score:
         *   renewable percentage
         *
         * Recycling score:
         *   current recycling rate
         *
         * SHI:
         *   0.25E + 0.20W + 0.20C
         *   + 0.15Waste + 0.10R + 0.10Recycling
         */

        double projectedElectricityScore =
                Math.max(
                        0,
                        100 - (predictedElectricity / 200.0)
                );

        double projectedWaterScore =
                Math.max(
                        0,
                        100 - (predictedWater / 100.0)
                );

        double projectedCarbonScore =
                Math.max(
                        0,
                        100 - (predictedCarbon / 50.0)
                );

        double projectedWasteScore =
                Math.max(
                        0,
                        100 - (predictedWaste / 20.0)
                );

        double projectedRenewableScore =
                Math.min(100, predictedRenewable);

        double projectedRecyclingScore =
                Math.min(100, Math.max(0, currentRecycling));

        double projectedShi =
                (projectedElectricityScore * 0.25)
                        + (projectedWaterScore * 0.20)
                        + (projectedCarbonScore * 0.20)
                        + (projectedWasteScore * 0.15)
                        + (projectedRenewableScore * 0.10)
                        + (projectedRecyclingScore * 0.10);

        projectedShi =
                round(projectedShi);

        String shiStatus =
                determineShiStatus(projectedShi);

        double estimatedCostSaving =
                Math.max(
                        0,
                        (currentElectricity - predictedElectricity)
                                * ELECTRICITY_COST_RATE
                );

        estimatedCostSaving =
                round(estimatedCostSaving);

        ScenarioSimulation simulation =
                new ScenarioSimulation();

        simulation.setOrganization(organization);

        simulation.setElectricityReductionPercentage(
                electricityReduction
        );

        simulation.setWaterReductionPercentage(
                waterReduction
        );

        simulation.setWasteReductionPercentage(
                wasteReduction
        );

        simulation.setRenewableEnergyIncreasePercentage(
                renewableIncrease
        );

        simulation.setPredictedElectricityConsumption(
                round(predictedElectricity)
        );

        simulation.setPredictedWaterConsumption(
                round(predictedWater)
        );

        simulation.setPredictedWasteGenerated(
                round(predictedWaste)
        );

        simulation.setPredictedCarbonEmission(
                round(predictedCarbon)
        );

        simulation.setEstimatedCostSaving(
                estimatedCostSaving
        );

        ScenarioSimulation saved =
                scenarioSimulationRepository.save(simulation);

        ScenarioSimulationResponse response =
                new ScenarioSimulationResponse();

        response.setId(saved.getId());
        response.setOrganizationId(organization.getId());

        response.setBaselineElectricityConsumption(
                round(currentElectricity)
        );

        response.setBaselineWaterConsumption(
                round(currentWater)
        );

        response.setBaselineCarbonEmission(
                round(currentCarbon)
        );

        response.setBaselineWasteGenerated(
                round(currentWaste)
        );

        response.setBaselineRenewableEnergyUsage(
                round(currentRenewable)
        );

        response.setBaselineRecyclingRate(
                round(currentRecycling)
        );

        response.setPredictedElectricityConsumption(
                saved.getPredictedElectricityConsumption()
        );

        response.setPredictedWaterConsumption(
                saved.getPredictedWaterConsumption()
        );

        response.setPredictedCarbonEmission(
                saved.getPredictedCarbonEmission()
        );

        response.setPredictedWasteGenerated(
                saved.getPredictedWasteGenerated()
        );

        response.setPredictedRenewableEnergyUsage(
                round(predictedRenewable)
        );

        response.setProjectedShiScore(
                projectedShi
        );

        response.setShiStatus(
                shiStatus
        );

        response.setCarbonReductionPercentage(
                round(carbonReductionPercentage)
        );

        response.setElectricityReductionPercentage(
                electricityReduction
        );

        response.setWaterReductionPercentage(
                waterReduction
        );

        response.setWasteReductionPercentage(
                wasteReduction
        );

        response.setRenewableEnergyIncreasePercentage(
                renewableIncrease
        );

        response.setEstimatedCostSaving(
                saved.getEstimatedCostSaving()
        );

        response.setSimulationTime(
                saved.getSimulationTime()
        );

        response.setCarbonModel(
                "70% electricity intervention + 30% renewable-energy intervention"
        );

        return response;
    }

    private double validatePercentage(
            Double value,
            String fieldName) {

        if (value == null) {
            return 0.0;
        }

        if (value < 0 || value > 100) {
            throw new IllegalArgumentException(
                    fieldName +
                            " percentage must be between 0 and 100."
            );
        }

        return value;
    }

    private double safeValue(Double value) {
        return value == null ? 0.0 : Math.max(0.0, value);
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private String determineShiStatus(double score) {

        if (score >= 90) {
            return "Excellent";
        }

        if (score >= 75) {
            return "Good";
        }

        if (score >= 60) {
            return "Moderate";
        }

        if (score >= 40) {
            return "Needs Improvement";
        }

        return "Critical";
    }
}
