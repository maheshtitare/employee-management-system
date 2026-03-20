package com.emp.management.dto;

import lombok.*;
import java.util.List;

/**
 * PageResponse - wrapper for paginated results.
 * Generic type T so it can work with Employee or any other entity.
 *
 * Example response:
 * {
 *   "content": [...employees...],
 *   "currentPage": 0,
 *   "totalPages": 3,
 *   "totalElements": 15
 * }
 */
@Data
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;       // The actual data for this page
    private int currentPage;        // Which page we are on (0-indexed)
    private int totalPages;         // Total number of pages
    private long totalElements;     // Total records in database
}
