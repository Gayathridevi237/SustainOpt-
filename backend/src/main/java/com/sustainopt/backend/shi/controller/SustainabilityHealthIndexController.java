package com.sustainopt.backend.shi.controller;

import com.sustainopt.backend.shi.dto.SustainabilityHealthIndexRequest;
import com.sustainopt.backend.shi.dto.SustainabilityHealthIndexResponse;
import com.sustainopt.backend.shi.service.SustainabilityHealthIndexService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sustainability-health-index")
public class SustainabilityHealthIndexController {

    private final SustainabilityHealthIndexService healthIndexService;

    public SustainabilityHealthIndexController(
            SustainabilityHealthIndexService healthIndexService) {
        this.healthIndexService = healthIndexService;
    }

    @PostMapping
    public ResponseEntity<SustainabilityHealthIndexResponse> calculateHealthIndex(
            @RequestBody SustainabilityHealthIndexRequest request) {

        SustainabilityHealthIndexResponse response =
                healthIndexService.calculateHealthIndex(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}