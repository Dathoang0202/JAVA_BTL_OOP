package minhdat.dev.project.controller;

import jakarta.servlet.http.HttpSession;
import minhdat.dev.project.config.AuthInterceptor;
import minhdat.dev.project.dto.ApiResponse;
import minhdat.dev.project.dto.DashboardSummaryDto;
import minhdat.dev.project.dto.UserResponse;
import minhdat.dev.project.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getSummary(HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        DashboardSummaryDto summary = dashboardService.getDashboardSummary(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Tổng quan tiến độ học tập", summary));
    }
}
