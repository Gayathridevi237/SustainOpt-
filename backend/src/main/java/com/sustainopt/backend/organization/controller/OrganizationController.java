package com.sustainopt.backend.organization.controller;

import com.sustainopt.backend.organization.dto.OrganizationRequest;
import com.sustainopt.backend.organization.dto.OrganizationResponse;
import com.sustainopt.backend.organization.service.OrganizationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(
            OrganizationService organizationService) {

        this.organizationService = organizationService;
    }

    // =========================================================
    // CREATE ORGANIZATION
    // =========================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrganizationResponse createOrganization(
            @RequestBody OrganizationRequest request) {

        return organizationService.createOrganization(request);
    }

    // =========================================================
    // GET ALL ORGANIZATIONS
    // =========================================================

    @GetMapping
    public List<OrganizationResponse> getAllOrganizations() {

        return organizationService.getAllOrganizations();
    }

    // =========================================================
    // UPDATE ORGANIZATION
    // =========================================================

    @PutMapping("/{id}")
    public OrganizationResponse updateOrganization(
            @PathVariable Long id,
            @RequestBody OrganizationRequest request) {

        return organizationService.updateOrganization(
                id,
                request
        );
    }

    // =========================================================
    // DELETE ORGANIZATION
    // =========================================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganization(
            @PathVariable Long id) {

        organizationService.deleteOrganization(id);
    }
}