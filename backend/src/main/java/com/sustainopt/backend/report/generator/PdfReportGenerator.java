package com.sustainopt.backend.report.generator;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.sustainopt.backend.auth.entity.User;
import com.sustainopt.backend.auth.repository.UserRepository;
import com.sustainopt.backend.common.util.SecurityUtils;
import com.sustainopt.backend.decision.dto.DecisionResponse;
import com.sustainopt.backend.decision.model.DecisionAction;
import com.sustainopt.backend.decision.service.DecisionService;
import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import com.sustainopt.backend.metrics.repository.SustainabilityMetricRepository;
import com.sustainopt.backend.recommendation.dto.RecommendationResponse;
import com.sustainopt.backend.recommendation.service.RecommendationService;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class PdfReportGenerator {

    private static final String REPORT_DIRECTORY = "reports";

    private final SustainabilityMetricRepository metricRepository;
    private final RecommendationService recommendationService;
    private final DecisionService decisionService;
    private final UserRepository userRepository;

    public PdfReportGenerator(
            SustainabilityMetricRepository metricRepository,
            RecommendationService recommendationService,
            DecisionService decisionService,
            UserRepository userRepository) {

        this.metricRepository = metricRepository;
        this.recommendationService = recommendationService;
        this.decisionService = decisionService;
        this.userRepository = userRepository;
    }

    public String generateReport() {

        try {

            String email =
                    SecurityUtils.getCurrentUserEmail();

            if (email == null) {
                throw new RuntimeException(
                        "Authenticated user not found."
                );
            }

            User user =
                    userRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found."
                                    ));

            String organizationName =
                    user.getOrganizationName();

            // Resolve metrics through the authenticated owner, matching the
            // /api/v1/metrics endpoint used by the dashboard and decision pages.
            List<SustainabilityMetric> metrics =
                    metricRepository.findByCreatedBy(user);

            metrics.sort((a, b) -> {
                if (a.getCreatedAt() == null && b.getCreatedAt() == null) {
                    return Long.compare(
                            b.getId() == null ? 0L : b.getId(),
                            a.getId() == null ? 0L : a.getId()
                    );
                }
                if (a.getCreatedAt() == null) {
                    return 1;
                }
                if (b.getCreatedAt() == null) {
                    return -1;
                }
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });

            if (metrics.isEmpty()) {
                throw new RuntimeException(
                        "No sustainability metrics are available for the logged-in user."
                );
            }

            SustainabilityMetric latestMetric =
                    metrics.get(0);

            long totalMetrics = metrics.size();
            double totalElectricity = metrics.stream()
                    .mapToDouble(m -> value(m.getElectricityKwh()))
                    .sum();
            double totalWater = metrics.stream()
                    .mapToDouble(m -> value(m.getWaterLiters()))
                    .sum();
            double totalWaste = metrics.stream()
                    .mapToDouble(m -> value(m.getWasteKg()))
                    .sum();
            double totalCarbon = metrics.stream()
                    .mapToDouble(m -> value(m.getCarbonEmission()))
                    .sum();
            double averageRenewable = metrics.stream()
                    .mapToDouble(m -> value(m.getRenewableEnergyPercent()))
                    .average()
                    .orElse(0.0);
            double averageTransport = metrics.stream()
                    .mapToDouble(m -> value(m.getTransportEmission()))
                    .average()
                    .orElse(0.0);

            Long metricId =
                    latestMetric.getId();

            RecommendationResponse recommendation =
                    recommendationService
                            .generateRecommendations(metricId);

            DecisionResponse decision =
                    decisionService
                            .optimizeDecision(metricId);

            File dir =
                    new File(REPORT_DIRECTORY);

            if (!dir.exists() && !dir.mkdirs()) {
                throw new RuntimeException(
                        "Unable to create report directory."
                );
            }

            String filePath =
                    REPORT_DIRECTORY
                            + File.separator
                            + "sustainability-report.pdf";

            Document document =
                    new Document(PageSize.A4);

            PdfWriter.getInstance(
                    document,
                    new FileOutputStream(filePath)
            );

            document.open();

            Font title =
                    new Font(
                            Font.HELVETICA,
                            20,
                            Font.BOLD
                    );

            Font heading =
                    new Font(
                            Font.HELVETICA,
                            14,
                            Font.BOLD
                    );

            Font normal =
                    new Font(
                            Font.HELVETICA,
                            11
                    );

            Paragraph titleParagraph =
                    new Paragraph(
                            "SustainOpt Sustainability Report",
                            title
                    );

            titleParagraph.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(titleParagraph);

            document.add(
                    new Paragraph(
                            "Organization: "
                                    + organizationName,
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Generated: "
                                    + LocalDateTime.now(),
                            normal
                    )
            );

            document.add(Chunk.NEWLINE);

            // ==========================================
            // Dashboard Summary
            // ==========================================

            document.add(
                    new Paragraph(
                            "Dashboard Summary",
                            heading
                    )
            );

            document.add(
                    new Paragraph(
                            "Total Metrics: "
                                    + totalMetrics,
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Electricity: "
                                    + totalElectricity,
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Water: "
                                    + totalWater,
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Waste: "
                                    + totalWaste,
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Carbon: "
                                    + totalCarbon,
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Average Renewable Energy: "
                                    + averageRenewable,
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Average Transport Emission: "
                                    + averageTransport,
                            normal
                    )
            );

            document.add(Chunk.NEWLINE);

            // ==========================================
            // Sustainability Assessment
            // ==========================================

            document.add(
                    new Paragraph(
                            "Sustainability Assessment",
                            heading
                    )
            );

            document.add(
                    new Paragraph(
                            "Overall Score: "
                                    + recommendation.getOverallScore(),
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Grade: "
                                    + recommendation.getGrade(),
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "SHI Score: "
                                    + recommendation.getShiScore(),
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "SHI Status: "
                                    + recommendation.getShiStatus(),
                            normal
                    )
            );

            document.add(
                    new Paragraph(
                            "Estimated Cost Saving: "
                                    + recommendation.getEstimatedCostSaving(),
                            normal
                    )
            );

            document.add(Chunk.NEWLINE);

            // ==========================================
            // Recommendations
            // ==========================================

            document.add(
                    new Paragraph(
                            "Recommendations",
                            heading
                    )
            );

            for (String recommendationText :
                    recommendation.getRecommendations()) {

                document.add(
                        new Paragraph(
                                "• " + recommendationText,
                                normal
                        )
                );
            }

            document.add(Chunk.NEWLINE);

            // ==========================================
            // AMSDOA Decision Engine
            // ==========================================

            document.add(
                    new Paragraph(
                            "AMSDOA Decision Engine",
                            heading
                    )
            );

            for (DecisionAction action :
                    decision.getPrioritizedActions()) {

                document.add(
                        new Paragraph(
                                "Action: "
                                        + action.getActionName(),
                                normal
                        )
                );

                document.add(
                        new Paragraph(
                                "Priority: "
                                        + action.getPriorityScore(),
                                normal
                        )
                );

                document.add(
                        new Paragraph(
                                "Impact: "
                                        + action.getExpectedImpact(),
                                normal
                        )
                );

                document.add(
                        new Paragraph(
                                "Cost: "
                                        + action.getImplementationCost(),
                                normal
                        )
                );

                document.add(
                        new Paragraph(
                                "Urgency: "
                                        + action.getUrgency(),
                                normal
                        )
                );

                document.add(
                        new Paragraph(
                                "Explanation: "
                                        + action.getExplanation(),
                                normal
                        )
                );

                document.add(Chunk.NEWLINE);
            }

            document.add(
                    new Paragraph(
                            "Generated by SustainOpt © 2026",
                            heading
                    )
            );

            document.close();

            return filePath;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate PDF report.",
                    e
            );
        }
    }

    private double value(Double number) {
        return number == null ? 0.0 : number;
    }

}