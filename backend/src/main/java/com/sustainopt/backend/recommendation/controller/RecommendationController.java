package com.sustainopt.backend.recommendation.controller;

import com.sustainopt.backend.common.dto.ApiResponse;
import com.sustainopt.backend.recommendation.dto.RecommendationResponse;
import com.sustainopt.backend.recommendation.service.RecommendationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService = recommendationService;
    }

    @GetMapping("/{metricId}")
    public ApiResponse<RecommendationResponse> getRecommendations(
            @PathVariable Long metricId) {

        RecommendationResponse response =
                recommendationService.generateRecommendations(metricId);

        return new ApiResponse<>(
                true,
                "Recommendations generated successfully.",
                response
        );
    }
}