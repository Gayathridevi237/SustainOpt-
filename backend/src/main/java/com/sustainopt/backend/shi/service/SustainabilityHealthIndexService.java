package com.sustainopt.backend.shi.service;

import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.organization.repository.OrganizationRepository;
import com.sustainopt.backend.shi.dto.SustainabilityHealthIndexRequest;
import com.sustainopt.backend.shi.dto.SustainabilityHealthIndexResponse;
import com.sustainopt.backend.shi.entity.SustainabilityHealthIndex;
import com.sustainopt.backend.shi.repository.SustainabilityHealthIndexRepository;
import com.sustainopt.backend.sustainabilitystate.entity.SustainabilityState;
import com.sustainopt.backend.sustainabilitystate.repository.SustainabilityStateRepository;
import org.springframework.stereotype.Service;

@Service
public class SustainabilityHealthIndexService {

    private final SustainabilityHealthIndexRepository shiRepository;
    private final OrganizationRepository organizationRepository;
    private final SustainabilityStateRepository sustainabilityStateRepository;

    public SustainabilityHealthIndexService(
            SustainabilityHealthIndexRepository shiRepository,
            OrganizationRepository organizationRepository,
            SustainabilityStateRepository sustainabilityStateRepository) {

        this.shiRepository = shiRepository;
        this.organizationRepository = organizationRepository;
        this.sustainabilityStateRepository = sustainabilityStateRepository;
    }

    public SustainabilityHealthIndexResponse calculateHealthIndex(
            SustainabilityHealthIndexRequest request) {

        Organization organization = organizationRepository
                .findById(request.getOrganizationId())
                .orElseThrow(() ->
                        new RuntimeException("Organization not found"));

        SustainabilityState state = sustainabilityStateRepository
                .findByOrganization(organization)
                .orElseThrow(() ->
                        new RuntimeException("Sustainability State not found"));

        SustainabilityHealthIndex healthIndex = new SustainabilityHealthIndex();
        healthIndex.setOrganization(organization);

        // -------- Normalize metrics (0-100) --------

        double electricityScore =
                Math.max(0, 100 - (state.getElectricityConsumption() / 200.0));

        double waterScore =
                Math.max(0, 100 - (state.getWaterConsumption() / 100.0));

        double carbonScore =
                Math.max(0, 100 - (state.getCarbonEmission() / 50.0));

        double wasteScore =
                Math.max(0, 100 - (state.getWasteGenerated() / 20.0));

        double renewableScore =
                state.getRenewableEnergyUsage();

        double recyclingScore =
                state.getRecyclingRate();

        // -------- Weighted SHI --------

        double score =
                (electricityScore * 0.25)
                        + (waterScore * 0.20)
                        + (carbonScore * 0.20)
                        + (wasteScore * 0.15)
                        + (renewableScore * 0.10)
                        + (recyclingScore * 0.10);

        score = Math.round(score * 100.0) / 100.0;

        healthIndex.setScore(score);

        String status;

        if (score >= 90)
            status = "Excellent";
        else if (score >= 75)
            status = "Good";
        else if (score >= 60)
            status = "Moderate";
        else if (score >= 40)
            status = "Needs Improvement";
        else
            status = "Critical";

        healthIndex.setStatus(status);

        SustainabilityHealthIndex saved = shiRepository.save(healthIndex);

        SustainabilityHealthIndexResponse response =
                new SustainabilityHealthIndexResponse();

        response.setId(saved.getId());
        response.setOrganizationId(organization.getId());
        response.setScore(saved.getScore());
        response.setStatus(saved.getStatus());
        response.setCalculatedAt(saved.getCalculatedAt());

        return response;
    }
}