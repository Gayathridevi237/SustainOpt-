package com.sustainopt.backend.scenariosimulation.controller;

import com.sustainopt.backend.scenariosimulation.dto.ScenarioSimulationRequest;
import com.sustainopt.backend.scenariosimulation.dto.ScenarioSimulationResponse;
import com.sustainopt.backend.scenariosimulation.service.ScenarioSimulationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/scenario-simulations")
public class ScenarioSimulationController {

    private final ScenarioSimulationService scenarioSimulationService;

    public ScenarioSimulationController(
            ScenarioSimulationService scenarioSimulationService) {
        this.scenarioSimulationService = scenarioSimulationService;
    }

    @PostMapping
    public ResponseEntity<ScenarioSimulationResponse> simulateScenario(
            @RequestBody ScenarioSimulationRequest request) {

        ScenarioSimulationResponse response =
                scenarioSimulationService.simulateScenario(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}