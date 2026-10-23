package com.sustainopt.backend.decision.controller;

import com.sustainopt.backend.common.dto.ApiResponse;
import com.sustainopt.backend.decision.dto.DecisionResponse;
import com.sustainopt.backend.decision.service.DecisionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/decision")
public class DecisionController {

    private final DecisionService decisionService;

    public DecisionController(DecisionService decisionService) {
        this.decisionService = decisionService;
    }

    @GetMapping("/{metricId}")
    public ApiResponse<DecisionResponse> optimizeDecision(
            @PathVariable Long metricId) {

        DecisionResponse response =
                decisionService.optimizeDecision(metricId);

        return new ApiResponse<>(
                true,
                "Decision optimization completed successfully.",
                response
        );
    }
}