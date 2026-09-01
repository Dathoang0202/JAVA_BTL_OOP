package minhdat.dev.project.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import minhdat.dev.project.dto.UserResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    public static final String SESSION_USER_KEY = "LOGGED_IN_USER";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Allow OPTIONS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute(SESSION_USER_KEY) != null) {
            return true;
        }

        // Return 401 Unauthorized for unauthenticated API access
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"success\":false,\"message\":\"Phiên đăng nhập hết hạn hoặc chưa đăng nhập. Vui lòng đăng nhập lại.\",\"data\":null}");
        return false;
    }

    public static UserResponse getLoggedInUser(HttpSession session) {
        if (session == null) return null;
        Object userObj = session.getAttribute(SESSION_USER_KEY);
        if (userObj instanceof UserResponse) {
            return (UserResponse) userObj;
        }
        return null;
    }
}
