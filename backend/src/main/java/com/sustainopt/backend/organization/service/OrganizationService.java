package com.sustainopt.backend.organization.service;

import com.sustainopt.backend.organization.dto.OrganizationRequest;
import com.sustainopt.backend.organization.dto.OrganizationResponse;
import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.organization.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationService(
            OrganizationRepository organizationRepository) {

        this.organizationRepository = organizationRepository;
    }

    // =========================================================
    // CREATE ORGANIZATION
    // =========================================================

    public OrganizationResponse createOrganization(
            OrganizationRequest request) {

        Organization organization = new Organization();

        organization.setOrganizationName(
                request.getOrganizationName()
        );

        organization.setIndustryType(
                request.getIndustryType()
        );

        organization.setEmployeeCount(
                request.getEmployeeCount()
        );

        organization.setFacilityArea(
                request.getFacilityArea()
        );

        organization.setSustainabilityBudget(
                request.getSustainabilityBudget()
        );

        organization.setCountry(
                request.getCountry()
        );

        Organization savedOrganization =
                organizationRepository.save(organization);

        return mapToResponse(savedOrganization);
    }

    // =========================================================
    // GET ALL ORGANIZATIONS
    // =========================================================

    public List<OrganizationResponse> getAllOrganizations() {

        List<Organization> organizations =
                organizationRepository.findAll();

        List<OrganizationResponse> responses =
                new ArrayList<>();

        for (Organization organization : organizations) {

            responses.add(
                    mapToResponse(organization)
            );
        }

        return responses;
    }

    // =========================================================
    // UPDATE ORGANIZATION
    // =========================================================

    public OrganizationResponse updateOrganization(
            Long id,
            OrganizationRequest request) {

        Organization organization =
                organizationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Organization not found with id: " + id
                                )
                        );

        organization.setOrganizationName(
                request.getOrganizationName()
        );

        organization.setIndustryType(
                request.getIndustryType()
        );

        organization.setEmployeeCount(
                request.getEmployeeCount()
        );

        organization.setFacilityArea(
                request.getFacilityArea()
        );

        organization.setSustainabilityBudget(
                request.getSustainabilityBudget()
        );

        organization.setCountry(
                request.getCountry()
        );

        Organization updatedOrganization =
                organizationRepository.save(organization);

        return mapToResponse(updatedOrganization);
    }

    // =========================================================
    // DELETE ORGANIZATION
    // =========================================================

    public void deleteOrganization(Long id) {

        Organization organization =
                organizationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Organization not found with id: " + id
                                )
                        );

        organizationRepository.delete(organization);
    }

    // =========================================================
    // MAP ENTITY TO RESPONSE
    // =========================================================

    private OrganizationResponse mapToResponse(
            Organization organization) {

        OrganizationResponse response =
                new OrganizationResponse();

        response.setId(
                organization.getId()
        );

        response.setOrganizationName(
                organization.getOrganizationName()
        );

        response.setIndustryType(
                organization.getIndustryType()
        );

        response.setEmployeeCount(
                organization.getEmployeeCount()
        );

        response.setFacilityArea(
                organization.getFacilityArea()
        );

        response.setSustainabilityBudget(
                organization.getSustainabilityBudget()
        );

        response.setCountry(
                organization.getCountry()
        );

        response.setCreatedAt(
                organization.getCreatedAt()
        );

        response.setUpdatedAt(
                organization.getUpdatedAt()
        );

        return response;
    }
}