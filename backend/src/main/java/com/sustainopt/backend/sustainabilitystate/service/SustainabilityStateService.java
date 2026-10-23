package com.sustainopt.backend.sustainabilitystate.service;

import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.organization.repository.OrganizationRepository;
import com.sustainopt.backend.sustainabilitystate.dto.SustainabilityStateRequest;
import com.sustainopt.backend.sustainabilitystate.dto.SustainabilityStateResponse;
import com.sustainopt.backend.sustainabilitystate.entity.SustainabilityState;
import com.sustainopt.backend.sustainabilitystate.repository.SustainabilityStateRepository;
import com.sustainopt.backend.twinsnapshot.service.TwinSnapshotService;
import org.springframework.stereotype.Service;

@Service
public class SustainabilityStateService {

    private final SustainabilityStateRepository sustainabilityStateRepository;
    private final OrganizationRepository organizationRepository;
    private final TwinSnapshotService twinSnapshotService;

    public SustainabilityStateService(
            SustainabilityStateRepository sustainabilityStateRepository,
            OrganizationRepository organizationRepository,
            TwinSnapshotService twinSnapshotService) {

        this.sustainabilityStateRepository = sustainabilityStateRepository;
        this.organizationRepository = organizationRepository;
        this.twinSnapshotService = twinSnapshotService;
    }

    // =========================================================
    // CREATE SUSTAINABILITY STATE
    // =========================================================

    public SustainabilityStateResponse createState(
            SustainabilityStateRequest request) {

        Organization organization = organizationRepository.findById(
                request.getOrganizationId()
        ).orElseThrow(() ->
                new RuntimeException("Organization not found")
        );

        if (sustainabilityStateRepository
                .findByOrganization(organization)
                .isPresent()) {

            throw new RuntimeException(
                    "Sustainability state already exists for this organization."
            );
        }

        SustainabilityState state = new SustainabilityState();

        state.setOrganization(organization);
        state.setElectricityConsumption(
                request.getElectricityConsumption()
        );
        state.setWaterConsumption(
                request.getWaterConsumption()
        );
        state.setCarbonEmission(
                request.getCarbonEmission()
        );
        state.setWasteGenerated(
                request.getWasteGenerated()
        );
        state.setRenewableEnergyUsage(
                request.getRenewableEnergyUsage()
        );
        state.setRecyclingRate(
                request.getRecyclingRate()
        );
        state.setGreenTransportationUsage(
                request.getGreenTransportationUsage()
        );

        SustainabilityState saved =
                sustainabilityStateRepository.save(state);

        // Automatically create a Digital Twin snapshot
        twinSnapshotService.createSnapshotAutomatically(
                organization.getId()
        );

        return mapToResponse(saved);
    }

    // =========================================================
    // GET SUSTAINABILITY STATE
    // =========================================================

    public SustainabilityStateResponse getState(
            Long organizationId) {

        Organization organization = organizationRepository.findById(
                organizationId
        ).orElseThrow(() ->
                new RuntimeException("Organization not found")
        );

        SustainabilityState state =
                sustainabilityStateRepository
                        .findByOrganization(organization)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sustainability state not found."
                                )
                        );

        return mapToResponse(state);
    }

    // =========================================================
    // UPDATE SUSTAINABILITY STATE
    // =========================================================

    public SustainabilityStateResponse updateState(
            Long organizationId,
            SustainabilityStateRequest request) {

        Organization organization = organizationRepository.findById(
                organizationId
        ).orElseThrow(() ->
                new RuntimeException("Organization not found")
        );

        SustainabilityState state =
                sustainabilityStateRepository
                        .findByOrganization(organization)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sustainability state not found."
                                )
                        );

        state.setElectricityConsumption(
                request.getElectricityConsumption()
        );
        state.setWaterConsumption(
                request.getWaterConsumption()
        );
        state.setCarbonEmission(
                request.getCarbonEmission()
        );
        state.setWasteGenerated(
                request.getWasteGenerated()
        );
        state.setRenewableEnergyUsage(
                request.getRenewableEnergyUsage()
        );
        state.setRecyclingRate(
                request.getRecyclingRate()
        );
        state.setGreenTransportationUsage(
                request.getGreenTransportationUsage()
        );

        SustainabilityState updated =
                sustainabilityStateRepository.save(state);

        // Refresh the Digital Twin snapshot after state changes
        twinSnapshotService.createSnapshotAutomatically(
                organization.getId()
        );

        return mapToResponse(updated);
    }

    // =========================================================
    // DELETE SUSTAINABILITY STATE
    // =========================================================

    public void deleteState(Long organizationId) {

        Organization organization = organizationRepository.findById(
                organizationId
        ).orElseThrow(() ->
                new RuntimeException("Organization not found")
        );

        SustainabilityState state =
                sustainabilityStateRepository
                        .findByOrganization(organization)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sustainability state not found."
                                )
                        );

        sustainabilityStateRepository.delete(state);
    }

    // =========================================================
    // MAP ENTITY → RESPONSE
    // =========================================================

    private SustainabilityStateResponse mapToResponse(
            SustainabilityState state) {

        SustainabilityStateResponse response =
                new SustainabilityStateResponse();

        response.setId(state.getId());
        response.setOrganizationId(
                state.getOrganization().getId()
        );
        response.setElectricityConsumption(
                state.getElectricityConsumption()
        );
        response.setWaterConsumption(
                state.getWaterConsumption()
        );
        response.setCarbonEmission(
                state.getCarbonEmission()
        );
        response.setWasteGenerated(
                state.getWasteGenerated()
        );
        response.setRenewableEnergyUsage(
                state.getRenewableEnergyUsage()
        );
        response.setRecyclingRate(
                state.getRecyclingRate()
        );
        response.setGreenTransportationUsage(
                state.getGreenTransportationUsage()
        );
        response.setCreatedAt(
                state.getCreatedAt()
        );
        response.setUpdatedAt(
                state.getUpdatedAt()
        );

        return response;
    }
}