package com.sustainopt.backend.twinsnapshot.dto;

public class TwinSnapshotRequest {

    private Long organizationId;

    public TwinSnapshotRequest() {
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}