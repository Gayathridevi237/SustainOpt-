package com.sustainopt.backend.twinsnapshot.controller;

import com.sustainopt.backend.twinsnapshot.dto.TwinSnapshotResponse;
import com.sustainopt.backend.twinsnapshot.service.TwinSnapshotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/twin-snapshots")
public class TwinSnapshotController {

    private final TwinSnapshotService twinSnapshotService;

    public TwinSnapshotController(TwinSnapshotService twinSnapshotService) {
        this.twinSnapshotService = twinSnapshotService;
    }

    @PostMapping("/{organizationId}")
    public ResponseEntity<TwinSnapshotResponse> createSnapshot(
            @PathVariable Long organizationId) {

        TwinSnapshotResponse response =
                twinSnapshotService.createSnapshot(organizationId);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{organizationId}")
    public ResponseEntity<TwinSnapshotResponse> getLatestSnapshot(
            @PathVariable Long organizationId) {

        TwinSnapshotResponse response =
                twinSnapshotService.getLatestSnapshot(organizationId);

        return ResponseEntity.ok(response);
    }
}