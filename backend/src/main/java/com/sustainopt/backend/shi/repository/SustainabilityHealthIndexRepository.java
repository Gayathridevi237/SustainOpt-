package com.sustainopt.backend.shi.repository;

import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.shi.entity.SustainabilityHealthIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SustainabilityHealthIndexRepository
        extends JpaRepository<SustainabilityHealthIndex, Long> {

    List<SustainabilityHealthIndex> findByOrganizationOrderByCalculatedAtDesc(
            Organization organization
    );

}