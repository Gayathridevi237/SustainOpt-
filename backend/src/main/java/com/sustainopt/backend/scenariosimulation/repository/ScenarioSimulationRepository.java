package com.sustainopt.backend.scenariosimulation.repository;

import com.sustainopt.backend.organization.entity.Organization;
import com.sustainopt.backend.scenariosimulation.entity.ScenarioSimulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScenarioSimulationRepository extends JpaRepository<ScenarioSimulation, Long> {

    List<ScenarioSimulation> findByOrganizationOrderBySimulationTimeDesc(
            Organization organization
    );

}