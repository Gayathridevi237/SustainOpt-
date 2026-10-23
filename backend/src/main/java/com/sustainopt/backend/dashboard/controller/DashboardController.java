package com.sustainopt.backend.dashboard.controller;

import com.sustainopt.backend.common.dto.ApiResponse;
import com.sustainopt.backend.dashboard.dto.DashboardSummaryResponse;
import com.sustainopt.backend.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // ===========================
    // Dashboard Summary
    // ===========================
    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryResponse> getDashboardSummary() {

        DashboardSummaryResponse response =
                dashboardService.getDashboardSummary();

        return new ApiResponse<>(
                true,
                "Dashboard summary retrieved successfully.",
                response
        );
    }
}