package com.sustainopt.backend.metrics.controller;

import com.sustainopt.backend.common.dto.ApiResponse;
import com.sustainopt.backend.metrics.dto.SustainabilityMetricRequest;
import com.sustainopt.backend.metrics.dto.SustainabilityMetricResponse;
import com.sustainopt.backend.metrics.service.SustainabilityMetricService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/metrics")
public class SustainabilityMetricController {

    private final SustainabilityMetricService metricService;

    public SustainabilityMetricController(
            SustainabilityMetricService metricService) {

        this.metricService = metricService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SustainabilityMetricResponse> saveMetric(
            @Valid @RequestBody SustainabilityMetricRequest request) {

        SustainabilityMetricResponse response =
                metricService.saveMetric(request);

        return new ApiResponse<>(
                true,
                "Sustainability metric saved successfully.",
                response
        );
    }

    @GetMapping
    public ApiResponse<List<SustainabilityMetricResponse>> getMyMetrics() {

        List<SustainabilityMetricResponse> response =
                metricService.getMyMetrics();

        return new ApiResponse<>(
                true,
                "Metrics retrieved successfully.",
                response
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<SustainabilityMetricResponse> getMetricById(
            @PathVariable Long id) {

        SustainabilityMetricResponse response =
                metricService.getMetricById(id);

        return new ApiResponse<>(
                true,
                "Metric retrieved successfully.",
                response
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<SustainabilityMetricResponse> updateMetric(
            @PathVariable Long id,
            @Valid @RequestBody SustainabilityMetricRequest request) {

        SustainabilityMetricResponse response =
                metricService.updateMetric(id, request);

        return new ApiResponse<>(
                true,
                "Sustainability metric updated successfully.",
                response
        );
    }

    @RequestMapping(
            value = "/{id}",
            method = RequestMethod.DELETE
    )
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMetric(
            @PathVariable Long id) {

        metricService.deleteMetric(id);
    }
}