package com.sustainopt.backend.twinsnapshot.service;

import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.organization.repository.OrganizationRepository;
import com.sustainopt.backend.sustainabilitystate.entity.SustainabilityState;
import com.sustainopt.backend.sustainabilitystate.repository.SustainabilityStateRepository;
import com.sustainopt.backend.twinsnapshot.dto.TwinSnapshotResponse;
import com.sustainopt.backend.twinsnapshot.entity.TwinSnapshot;
import com.sustainopt.backend.twinsnapshot.repository.TwinSnapshotRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TwinSnapshotService {

    private final TwinSnapshotRepository twinSnapshotRepository;
    private final SustainabilityStateRepository sustainabilityStateRepository;
    private final OrganizationRepository organizationRepository;

    public TwinSnapshotService(
            TwinSnapshotRepository twinSnapshotRepository,
            SustainabilityStateRepository sustainabilityStateRepository,
            OrganizationRepository organizationRepository) {

        this.twinSnapshotRepository = twinSnapshotRepository;
        this.sustainabilityStateRepository = sustainabilityStateRepository;
        this.organizationRepository = organizationRepository;
    }

    public TwinSnapshotResponse createSnapshot(Long organizationId) {

        Organization organization = organizationRepository
                .findById(organizationId)
                .orElseThrow(() ->
                        new RuntimeException("Organization not found"));

        SustainabilityState state = sustainabilityStateRepository
                .findByOrganization(organization)
                .orElseThrow(() ->
                        new RuntimeException("Sustainability State not found"));

        TwinSnapshot snapshot = new TwinSnapshot();

        snapshot.setOrganization(organization);
        snapshot.setElectricityConsumption(
                state.getElectricityConsumption());
        snapshot.setWaterConsumption(
                state.getWaterConsumption());
        snapshot.setCarbonEmission(
                state.getCarbonEmission());
        snapshot.setWasteGenerated(
                state.getWasteGenerated());
        snapshot.setRenewableEnergyUsage(
                state.getRenewableEnergyUsage());
        snapshot.setRecyclingRate(
                state.getRecyclingRate());
        snapshot.setGreenTransportationUsage(
                state.getGreenTransportationUsage());

        TwinSnapshot savedSnapshot =
                twinSnapshotRepository.save(snapshot);

        return mapToResponse(savedSnapshot);
    }

    public TwinSnapshotResponse getLatestSnapshot(Long organizationId) {

        Organization organization = organizationRepository
                .findById(organizationId)
                .orElseThrow(() ->
                        new RuntimeException("Organization not found"));

        List<TwinSnapshot> snapshots =
                twinSnapshotRepository
                        .findByOrganizationOrderBySnapshotTimeDesc(
                                organization);

        if (snapshots.isEmpty()) {
            throw new RuntimeException(
                    "Digital Twin snapshot not found");
        }

        return mapToResponse(snapshots.get(0));
    }

    /**
     * Used internally by other services.
     */
    public void createSnapshotAutomatically(Long organizationId) {
        createSnapshot(organizationId);
    }

    private TwinSnapshotResponse mapToResponse(
            TwinSnapshot snapshot) {

        TwinSnapshotResponse response =
                new TwinSnapshotResponse();

        response.setId(snapshot.getId());

        response.setOrganizationId(
                snapshot.getOrganization().getId());

        response.setElectricityConsumption(
                snapshot.getElectricityConsumption());

        response.setWaterConsumption(
                snapshot.getWaterConsumption());

        response.setCarbonEmission(
                snapshot.getCarbonEmission());

        response.setWasteGenerated(
                snapshot.getWasteGenerated());

        response.setRenewableEnergyUsage(
                snapshot.getRenewableEnergyUsage());

        response.setRecyclingRate(
                snapshot.getRecyclingRate());

        response.setGreenTransportationUsage(
                snapshot.getGreenTransportationUsage());

        response.setSnapshotTime(
                snapshot.getSnapshotTime());

        return response;
    }
}