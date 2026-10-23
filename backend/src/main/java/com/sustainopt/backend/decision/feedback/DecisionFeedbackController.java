package com.sustainopt.backend.decision.feedback;

import com.sustainopt.backend.common.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feedback")
public class DecisionFeedbackController {

    private final DecisionFeedbackService feedbackService;

    public DecisionFeedbackController(
            DecisionFeedbackService feedbackService) {

        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ApiResponse<DecisionFeedback> submitFeedback(
            @RequestBody DecisionFeedback feedback) {

        DecisionFeedback saved =
                feedbackService.saveFeedback(feedback);

        return new ApiResponse<>(
                true,
                "Feedback submitted successfully.",
                saved
        );
    }

    @GetMapping("/{metricId}")
    public ApiResponse<List<DecisionFeedback>> getFeedback(
            @PathVariable Long metricId) {

        return new ApiResponse<>(
                true,
                "Feedback retrieved successfully.",
                feedbackService.getFeedbackByMetric(metricId)
        );
    }
}