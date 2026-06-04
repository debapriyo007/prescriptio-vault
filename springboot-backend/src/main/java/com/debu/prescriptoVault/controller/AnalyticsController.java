package com.debu.prescriptoVault.controller;

import com.debu.prescriptoVault.dto.response.AnalyticsResponse;
import com.debu.prescriptoVault.service.AnalyticsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller class for handling analytics-related HTTP requests.
 * Provides endpoints for retrieving system-wide metrics and trends.
 */
@RestController
@AllArgsConstructor
@CrossOrigin
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Retrieves the analytics summary, including total counts, monthly metrics,
     * weekly daily trends, and top active patients.
     *
     * @return ResponseEntity containing the AnalyticsResponse or an error message.
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getAnalytics() {
        try {
            AnalyticsResponse analyticsResponse = analyticsService.getAnalytics();
            return ResponseEntity.ok(analyticsResponse);
        } catch (Exception e) {
            // Log the error for internal tracking
            System.err.println("Error fetching analytics summary: " + e.getMessage());
            // Return appropriate error response with internal server error status
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve analytics summary: " + e.getMessage());
        }
    }
}

