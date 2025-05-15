package com.hicham.annotationplatformproject1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class StatisticsDTO {
    private List<StatItem> stats;
    private List<ActivityItem> activities;
    private List<DatasetProgress> datasetsProgress;
    private List<TopAnnotator> topAnnotators;
    private List<AnnotationTrend> annotationTrend; // New field for line chart

    @Data
    @AllArgsConstructor

    public static class StatItem {
        private String title;
        private String value;
        private String change;
        private String icon;
    }

    @Data
    @AllArgsConstructor

    public static class ActivityItem {
        private String message;
        private String time;
        private String type;
    }

    @Data
    @AllArgsConstructor
    public static class DatasetProgress {
        private String name;
        private int completed;
        private int pending;
    }

    @Data
    @AllArgsConstructor

    public static class TopAnnotator {
        private String name;
        private int completion;
    }

    @Data
    @AllArgsConstructor

    public static class AnnotationTrend {
        private String date; // Format: "YYYY-MM-DD"
        private long count;  // Number of annotations on that day
    }
}