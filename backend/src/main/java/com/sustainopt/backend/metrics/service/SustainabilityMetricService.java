package com.sustainopt.backend.metrics.service;

import com.sustainopt.backend.auth.entity.User;
import com.sustainopt.backend.auth.repository.UserRepository;
import com.sustainopt.backend.common.util.SecurityUtils;
import com.sustainopt.backend.metrics.dto.SustainabilityMetricRequest;
import com.sustainopt.backend.metrics.dto.SustainabilityMetricResponse;
import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import com.sustainopt.backend.metrics.repository.SustainabilityMetricRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SustainabilityMetricService {

    private final SustainabilityMetricRepository metricRepository;
    private final UserRepository userRepository;

    public SustainabilityMetricService(
            SustainabilityMetricRepository metricRepository,
            UserRepository userRepository) {

        this.metricRepository = metricRepository;
        this.userRepository = userRepository;
    }

    // ===========================
    // Save Sustainability Metric
    // ===========================
    public SustainabilityMetricResponse saveMetric(
            SustainabilityMetricRequest request) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        SustainabilityMetric metric = new SustainabilityMetric();

        // Always bind the metric to the authenticated user's organization.
        // This prevents report/dashboard organization mismatches when a client
        // submits a stale or different organization name.
        metric.setOrganizationName(user.getOrganizationName());
        metric.setDepartment(request.getDepartment());
        metric.setReportingMonth(request.getReportingMonth());
        metric.setElectricityKwh(request.getElectricityKwh());
        metric.setWaterLiters(request.getWaterLiters());
        metric.setWasteKg(request.getWasteKg());
        metric.setCarbonEmission(request.getCarbonEmission());
        metric.setRenewableEnergyPercent(request.getRenewableEnergyPercent());
        metric.setTransportEmission(request.getTransportEmission());
        metric.setCreatedBy(user);

        SustainabilityMetric savedMetric = metricRepository.save(metric);

        SustainabilityMetricResponse response = mapToResponse(savedMetric, user);

        return response;
    }

    // ===========================
    // Get Logged-in User Metrics
    // ===========================
    public List<SustainabilityMetricResponse> getMyMetrics() {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        List<SustainabilityMetric> metrics =
                metricRepository.findByCreatedBy(user);

        List<SustainabilityMetricResponse> responseList =
                new ArrayList<>();

        for (SustainabilityMetric metric : metrics) {
            responseList.add(mapToResponse(metric, user));
        }

        return responseList;
    }

    // ===========================
    // Get Metric By ID
    // ===========================
    public SustainabilityMetricResponse getMetricById(Long id) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        SustainabilityMetric metric = metricRepository
                .findByIdAndCreatedBy(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Metric not found."));

        return mapToResponse(metric, user);
    }

    // ===========================
    // Update Sustainability Metric
    // ===========================
    public SustainabilityMetricResponse updateMetric(
            Long id,
            SustainabilityMetricRequest request) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        SustainabilityMetric metric = metricRepository
                .findByIdAndCreatedBy(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Metric not found."));

        // Keep the metric organization consistent with its owner.
        metric.setOrganizationName(user.getOrganizationName());
        metric.setDepartment(request.getDepartment());
        metric.setReportingMonth(request.getReportingMonth());
        metric.setElectricityKwh(request.getElectricityKwh());
        metric.setWaterLiters(request.getWaterLiters());
        metric.setWasteKg(request.getWasteKg());
        metric.setCarbonEmission(request.getCarbonEmission());
        metric.setRenewableEnergyPercent(request.getRenewableEnergyPercent());
        metric.setTransportEmission(request.getTransportEmission());

        SustainabilityMetric updatedMetric = metricRepository.save(metric);

        return mapToResponse(updatedMetric, user);
    }

    // ===========================
    // Delete Sustainability Metric
    // ===========================
    public void deleteMetric(Long id) {

        String email = SecurityUtils.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        SustainabilityMetric metric = metricRepository
                .findByIdAndCreatedBy(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Metric not found."));

        metricRepository.delete(metric);
    }

    // ===========================
    // Helper Method
    // ===========================
    private SustainabilityMetricResponse mapToResponse(
            SustainabilityMetric metric,
            User user) {

        SustainabilityMetricResponse response =
                new SustainabilityMetricResponse();

        response.setId(metric.getId());
        response.setOrganizationName(metric.getOrganizationName());
        response.setDepartment(metric.getDepartment());
        response.setReportingMonth(metric.getReportingMonth());
        response.setElectricityKwh(metric.getElectricityKwh());
        response.setWaterLiters(metric.getWaterLiters());
        response.setWasteKg(metric.getWasteKg());
        response.setCarbonEmission(metric.getCarbonEmission());
        response.setRenewableEnergyPercent(metric.getRenewableEnergyPercent());
        response.setTransportEmission(metric.getTransportEmission());
        response.setCreatedBy(
                user.getFirstName() + " " + user.getLastName()
        );

        return response;
    }
}