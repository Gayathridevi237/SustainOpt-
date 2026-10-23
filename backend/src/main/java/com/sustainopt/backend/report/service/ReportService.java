package com.sustainopt.backend.report.service;

import com.sustainopt.backend.report.dto.ReportResponse;
import com.sustainopt.backend.report.generator.ExcelReportGenerator;
import com.sustainopt.backend.report.generator.PdfReportGenerator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReportService {

    private final PdfReportGenerator pdfReportGenerator;
    private final ExcelReportGenerator excelReportGenerator;

    public ReportService(
            PdfReportGenerator pdfReportGenerator,
            ExcelReportGenerator excelReportGenerator) {

        this.pdfReportGenerator = pdfReportGenerator;
        this.excelReportGenerator = excelReportGenerator;
    }

    public ReportResponse generatePdfReport() {

        String filePath =
                pdfReportGenerator.generateReport();

        ReportResponse response =
                new ReportResponse();

        response.setReportName(
                "SustainOpt Sustainability Report"
        );

        response.setReportType("PDF");

        response.setGeneratedAt(
                LocalDateTime.now().toString()
        );

        response.setDownloadUrl(filePath);

        return response;
    }

    public ReportResponse generateExcelReport() {

        String filePath =
                excelReportGenerator.generateReport();

        ReportResponse response =
                new ReportResponse();

        response.setReportName(
                "SustainOpt Sustainability Report"
        );

        response.setReportType("Excel");

        response.setGeneratedAt(
                LocalDateTime.now().toString()
        );

        response.setDownloadUrl(filePath);

        return response;
    }
}