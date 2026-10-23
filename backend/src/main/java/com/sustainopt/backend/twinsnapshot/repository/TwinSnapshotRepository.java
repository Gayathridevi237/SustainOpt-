package com.sustainopt.backend.twinsnapshot.repository;

import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.twinsnapshot.entity.TwinSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TwinSnapshotRepository extends JpaRepository<TwinSnapshot, Long> {

    List<TwinSnapshot> findByOrganizationOrderBySnapshotTimeDesc(Organization organization);

}