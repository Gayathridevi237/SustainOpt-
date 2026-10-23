package com.sustainopt.backend.scoring.controller;

import com.sustainopt.backend.common.dto.ApiResponse;
import com.sustainopt.backend.scoring.dto.ScoringResponse;
import com.sustainopt.backend.scoring.service.ScoringService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/scoring")
public class ScoringController {

    private final ScoringService scoringService;

    public ScoringController(ScoringService scoringService) {
        this.scoringService = scoringService;
    }

    @GetMapping("/{metricId}")
    public ApiResponse<ScoringResponse> calculateScore(
            @PathVariable Long metricId) {

        ScoringResponse response =
                scoringService.calculateScore(metricId);

        return new ApiResponse<>(
                true,
                "Sustainability score calculated successfully.",
                response
        );
    }
}