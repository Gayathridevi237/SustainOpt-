
package com.sustainopt.backend.decision.feedback;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DecisionFeedbackService {

    private final DecisionFeedbackRepository feedbackRepository;

    public DecisionFeedbackService(
            DecisionFeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public DecisionFeedback saveFeedback(
            DecisionFeedback feedback) {

        if (feedback == null) {
            throw new IllegalArgumentException(
                    "Feedback data is required."
            );
        }

        if (feedback.getMetricId() == null) {
            throw new IllegalArgumentException(
                    "Metric ID is required."
            );
        }

        if (feedback.getActionName() == null
                || feedback.getActionName().isBlank()) {
            throw new IllegalArgumentException(
                    "Action name is required."
            );
        }

        if (feedback.getImplementationStatus() == null
                || feedback.getImplementationStatus().isBlank()) {
            throw new IllegalArgumentException(
                    "Implementation status is required."
            );
        }

        if (feedback.getSuccessScore() == null) {
            throw new IllegalArgumentException(
                    "Success score is required."
            );
        }

        if (feedback.getSuccessScore() < 0
                || feedback.getSuccessScore() > 100) {
            throw new IllegalArgumentException(
                    "Success score must be between 0 and 100."
            );
        }

        if (feedback.getComments() != null) {
            feedback.setComments(feedback.getComments().trim());
        }

        return feedbackRepository.save(feedback);
    }

    public List<DecisionFeedback> getFeedbackByMetric(
            Long metricId) {
        return feedbackRepository.findByMetricId(metricId);
    }

    /**
     * Reinforcement-Based Adaptive Feedback Refinement (RB-AFR).
     *
     * For each feedback record matching the action:
     *
     * AFR Adjustment = sum((Success Score - 50) * 0.2)
     *
     * A score of 50 is neutral.
     * Scores above 50 provide positive reinforcement.
     * Scores below 50 provide negative reinforcement.
     */
    public double calculateFeedbackAdjustment(
            Long metricId,
            String actionName) {

        if (metricId == null
                || actionName == null
                || actionName.isBlank()) {
            return 0.0;
        }

        List<DecisionFeedback> feedbackList =
                feedbackRepository.findByMetricId(metricId);

        if (feedbackList == null || feedbackList.isEmpty()) {
            return 0.0;
        }

        double adjustment = 0.0;

        for (DecisionFeedback feedback : feedbackList) {

            if (feedback == null
                    || feedback.getSuccessScore() == null
                    || feedback.getActionName() == null) {
                continue;
            }

            if (!feedback.getActionName()
                    .equalsIgnoreCase(actionName)) {
                continue;
            }

            int successScore = feedback.getSuccessScore();

            // Ignore invalid historical records defensively.
            if (successScore < 0 || successScore > 100) {
                continue;
            }

            adjustment += (successScore - 50.0) * 0.2;
        }

        return Math.round(adjustment * 100.0) / 100.0;
    }

    /**
     * Backward-compatible calculation across all actions
     * associated with the metric.
     */
    public double calculateFeedbackAdjustment(Long metricId) {

        if (metricId == null) {
            return 0.0;
        }

        List<DecisionFeedback> feedbackList =
                feedbackRepository.findByMetricId(metricId);

        if (feedbackList == null || feedbackList.isEmpty()) {
            return 0.0;
        }

        double adjustment = 0.0;

        for (DecisionFeedback feedback : feedbackList) {

            if (feedback == null
                    || feedback.getSuccessScore() == null) {
                continue;
            }

            int successScore = feedback.getSuccessScore();

            if (successScore < 0 || successScore > 100) {
                continue;
            }

            adjustment += (successScore - 50.0) * 0.2;
        }

        return Math.round(adjustment * 100.0) / 100.0;
    }
}
