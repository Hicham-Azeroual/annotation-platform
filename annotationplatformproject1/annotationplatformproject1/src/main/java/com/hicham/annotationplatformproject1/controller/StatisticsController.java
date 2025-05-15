package com.hicham.annotationplatformproject1.controller;

import com.hicham.annotationplatformproject1.dto.ApiResponse;
import com.hicham.annotationplatformproject1.dto.StatisticsDTO;
import com.hicham.annotationplatformproject1.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Autowired
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<StatisticsDTO>> getStatistics() {
        ApiResponse<StatisticsDTO> response = statisticsService.getStatistics();
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(500).body(response);
        }
    }
}