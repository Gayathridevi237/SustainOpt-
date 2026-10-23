package com.sustainopt.backend.report.generator;

import com.sustainopt.backend.auth.entity.User;
import com.sustainopt.backend.auth.repository.UserRepository;
import com.sustainopt.backend.common.util.SecurityUtils;
import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import com.sustainopt.backend.metrics.repository.SustainabilityMetricRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

@Component
public class ExcelReportGenerator {

    private static final String REPORT_DIRECTORY = "reports";

    private final SustainabilityMetricRepository metricRepository;
    private final UserRepository userRepository;

    public ExcelReportGenerator(
            SustainabilityMetricRepository metricRepository,
            UserRepository userRepository) {

        this.metricRepository = metricRepository;
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

            // Use the authenticated user's metric list, matching the
            // dashboard/decision metric ownership model.
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

            File directory =
                    new File(REPORT_DIRECTORY);

            if (!directory.exists() &&
                    !directory.mkdirs()) {

                throw new RuntimeException(
                        "Unable to create report directory."
                );
            }

            String filePath =
                    REPORT_DIRECTORY
                            + File.separator
                            + "sustainability-report.xlsx";

            try (Workbook workbook =
                         new XSSFWorkbook()) {

                Sheet sheet =
                        workbook.createSheet(
                                "Sustainability Report"
                        );

                // ==========================
                // Header
                // ==========================

                Row titleRow =
                        sheet.createRow(0);

                Cell titleCell =
                        titleRow.createCell(0);

                titleCell.setCellValue(
                        "SustainOpt Sustainability Report"
                );

                CellStyle titleStyle =
                        workbook.createCellStyle();

                Font titleFont =
                        workbook.createFont();

                titleFont.setBold(true);
                titleFont.setFontHeightInPoints((short) 16);

                titleStyle.setFont(titleFont);

                titleCell.setCellStyle(titleStyle);


                Row organizationRow =
                        sheet.createRow(1);

                organizationRow
                        .createCell(0)
                        .setCellValue(
                                "Organization"
                        );

                organizationRow
                        .createCell(1)
                        .setCellValue(
                                organizationName
                        );


                // ==========================
                // Metric table
                // ==========================

                Row headerRow =
                        sheet.createRow(3);

                String[] headers = {
                        "Reporting Month",
                        "Department",
                        "Electricity (kWh)",
                        "Water (Liters)",
                        "Waste (kg)",
                        "Carbon Emission",
                        "Renewable Energy (%)",
                        "Transport Emission"
                };

                CellStyle headerStyle =
                        workbook.createCellStyle();

                Font headerFont =
                        workbook.createFont();

                headerFont.setBold(true);
                headerStyle.setFont(headerFont);

                for (int i = 0;
                     i < headers.length;
                     i++) {

                    Cell cell =
                            headerRow.createCell(i);

                    cell.setCellValue(headers[i]);
                    cell.setCellStyle(headerStyle);
                }


                int rowIndex = 4;

                for (SustainabilityMetric metric :
                        metrics) {

                    Row row =
                            sheet.createRow(rowIndex++);

                    row.createCell(0)
                            .setCellValue(
                                    metric.getReportingMonth()
                            );

                    row.createCell(1)
                            .setCellValue(
                                    metric.getDepartment()
                            );

                    row.createCell(2)
                            .setCellValue(
                                    metric.getElectricityKwh()
                            );

                    row.createCell(3)
                            .setCellValue(
                                    metric.getWaterLiters()
                            );

                    row.createCell(4)
                            .setCellValue(
                                    metric.getWasteKg()
                            );

                    row.createCell(5)
                            .setCellValue(
                                    metric.getCarbonEmission()
                            );

                    row.createCell(6)
                            .setCellValue(
                                    metric.getRenewableEnergyPercent()
                            );

                    row.createCell(7)
                            .setCellValue(
                                    metric.getTransportEmission()
                            );
                }


                // ==========================
                // Formatting
                // ==========================

                for (int i = 0;
                     i < headers.length;
                     i++) {

                    sheet.autoSizeColumn(i);
                }


                try (FileOutputStream outputStream =
                             new FileOutputStream(filePath)) {

                    workbook.write(outputStream);
                }
            }

            return filePath;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate Excel report.",
                    e
            );
        }
    }
}