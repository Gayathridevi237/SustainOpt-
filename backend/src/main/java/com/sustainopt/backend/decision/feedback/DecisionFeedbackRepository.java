package com.sustainopt.backend.decision.feedback;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DecisionFeedbackRepository
        extends JpaRepository<DecisionFeedback, Long> {

    List<DecisionFeedback> findByMetricId(Long metricId);
}