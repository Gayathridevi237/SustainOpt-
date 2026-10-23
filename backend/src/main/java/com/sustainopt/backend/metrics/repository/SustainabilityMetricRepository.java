package com.sustainopt.backend.metrics.repository;

import com.sustainopt.backend.auth.entity.User;
import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SustainabilityMetricRepository
        extends JpaRepository<SustainabilityMetric, Long> {

    List<SustainabilityMetric> findByCreatedBy(User user);

    Optional<SustainabilityMetric> findByIdAndCreatedBy(
            Long id,
            User user
    );
}