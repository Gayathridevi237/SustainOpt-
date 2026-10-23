package com.sustainopt.backend.organization.repository;

import com.sustainopt.backend.organization.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository
        extends JpaRepository<Organization, Long> {

    /*
     * Returns all organizations having the supplied name.
     *
     * This is intentionally a List because organization names
     * may currently exist more than once in the database.
     */
    List<Organization> findByOrganizationName(String organizationName);

    /*
     * Safely returns one organization when duplicate organization
     * names exist.
     *
     * The lowest ID is selected deterministically.
     *
     * This prevents:
     *
     * "Query did not return a unique result"
     *
     * from breaking Decision Analysis.
     */
    Optional<Organization> findFirstByOrganizationNameOrderByIdAsc(
            String organizationName
    );
}