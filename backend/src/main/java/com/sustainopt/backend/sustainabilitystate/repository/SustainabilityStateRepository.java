package com.sustainopt.backend.sustainabilitystate.repository;

import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.sustainabilitystate.entity.SustainabilityState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SustainabilityStateRepository
        extends JpaRepository<SustainabilityState, Long> {

    Optional<SustainabilityState> findByOrganization(Organization organization);

}