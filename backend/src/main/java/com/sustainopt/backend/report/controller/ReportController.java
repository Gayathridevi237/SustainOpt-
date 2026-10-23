package com.sustainopt.backend.report.controller;

import com.sustainopt.backend.report.dto.ReportResponse;
import com.sustainopt.backend.report.service.ReportService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/v1/report")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/pdf")
    public ResponseEntity<?> generatePdfReport() {
        try {
            ReportResponse report = reportService.generatePdfReport();
            File file = resolveGeneratedFile(report.getDownloadUrl());

            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("PDF report was generated, but the file was not found: " + file.getAbsolutePath());
            }

            Resource resource = new FileSystemResource(file);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(file.length());
            headers.setContentDisposition(
                    ContentDisposition.attachment()
                            .filename("SustainOpt-Sustainability-Report.pdf")
                            .build()
            );

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("PDF report generation failed: " + rootMessage(e));
        }
    }

    @GetMapping("/excel")
    public ResponseEntity<?> generateExcelReport() {
        try {
            ReportResponse report = reportService.generateExcelReport();
            File file = resolveGeneratedFile(report.getDownloadUrl());

            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Excel report was generated, but the file was not found: " + file.getAbsolutePath());
            }

            Resource resource = new FileSystemResource(file);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    )
            );
            headers.setContentLength(file.length());
            headers.setContentDisposition(
                    ContentDisposition.attachment()
                            .filename("SustainOpt-Sustainability-Report.xlsx")
                            .build()
            );

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Excel report generation failed: " + rootMessage(e));
        }
    }

    private File resolveGeneratedFile(String downloadUrl) {
        if (downloadUrl == null || downloadUrl.isBlank()) {
            throw new IllegalStateException("Report generator returned an empty file path.");
        }

        Path path = Paths.get(downloadUrl);

        if (!path.isAbsolute()) {
            path = Paths.get(System.getProperty("user.dir"), downloadUrl);
        }

        return path.normalize().toFile();
    }

    private String rootMessage(Exception exception) {
        Throwable current = exception;
        while (current.getCause() != null) {
            current = current.getCause();
        }

        String message = current.getMessage();
        return message == null || message.isBlank()
                ? current.getClass().getSimpleName()
                : message;
    }
}
