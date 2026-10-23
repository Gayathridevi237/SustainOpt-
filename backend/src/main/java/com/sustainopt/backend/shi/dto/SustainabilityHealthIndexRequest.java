package com.sustainopt.backend.shi.dto;

public class SustainabilityHealthIndexRequest {

    private Long organizationId;

    public SustainabilityHealthIndexRequest() {
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}