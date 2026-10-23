package com.sustainopt.backend.sustainabilitystate.controller;

import com.sustainopt.backend.sustainabilitystate.dto.SustainabilityStateRequest;
import com.sustainopt.backend.sustainabilitystate.dto.SustainabilityStateResponse;
import com.sustainopt.backend.sustainabilitystate.service.SustainabilityStateService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sustainability-state")
public class SustainabilityStateController {

    private final SustainabilityStateService sustainabilityStateService;

    public SustainabilityStateController(
            SustainabilityStateService sustainabilityStateService) {

        this.sustainabilityStateService = sustainabilityStateService;
    }

    // =========================================================
    // CREATE SUSTAINABILITY STATE
    // =========================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SustainabilityStateResponse createState(
            @RequestBody SustainabilityStateRequest request) {

        return sustainabilityStateService.createState(request);
    }

    // =========================================================
    // GET SUSTAINABILITY STATE
    // =========================================================

    @GetMapping("/{organizationId}")
    public SustainabilityStateResponse getState(
            @PathVariable Long organizationId) {

        return sustainabilityStateService.getState(organizationId);
    }

    // =========================================================
    // UPDATE SUSTAINABILITY STATE
    // =========================================================

    @PutMapping("/{organizationId}")
    public SustainabilityStateResponse updateState(
            @PathVariable Long organizationId,
            @RequestBody SustainabilityStateRequest request) {

        return sustainabilityStateService.updateState(
                organizationId,
                request
        );
    }

    // =========================================================
    // DELETE SUSTAINABILITY STATE
    // =========================================================

    @DeleteMapping("/{organizationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteState(
            @PathVariable Long organizationId) {

        sustainabilityStateService.deleteState(organizationId);
    }
}