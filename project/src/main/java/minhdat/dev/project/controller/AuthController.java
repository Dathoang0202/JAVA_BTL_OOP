package minhdat.dev.project.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import minhdat.dev.project.config.AuthInterceptor;
import minhdat.dev.project.dto.ApiResponse;
import minhdat.dev.project.dto.LoginRequest;
import minhdat.dev.project.dto.RegisterRequest;
import minhdat.dev.project.dto.UserResponse;
import minhdat.dev.project.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request, HttpSession session) {
        UserResponse user = authService.register(request);
        session.setAttribute(AuthInterceptor.SESSION_USER_KEY, user);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký tài khoản thành công!", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        UserResponse user = authService.login(request);
        session.setAttribute(AuthInterceptor.SESSION_USER_KEY, user);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công!", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(ApiResponse.success("Đã đăng xuất tài khoản", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        }
        // Refresh user profile from DB
        UserResponse refreshed = authService.getUserProfile(user.getId());
        session.setAttribute(AuthInterceptor.SESSION_USER_KEY, refreshed);
        return ResponseEntity.ok(ApiResponse.success("Thông tin người dùng", refreshed));
    }
}
