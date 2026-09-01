/* ==========================================================================
   AUTHENTICATION UI COMPONENT
   ========================================================================== */

import { AuthService } from '../services/AuthService.js';
import { ApiService } from '../services/ApiService.js';
import { Toast } from '../utils/Toast.js';

export class AuthComponent {
    static onAuthSuccessCallback = null;

    static setOnAuthSuccess(callback) {
        AuthComponent.onAuthSuccessCallback = callback;
    }

    static init() {
        AuthComponent.initListeners();
        ApiService.setOnUnauthorized(() => AuthComponent.showAuthModal());
    }

    static initListeners() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');
        const logoutBtn = document.getElementById('logout-btn');

        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
                document.getElementById('auth-title').textContent = 'Đăng Ký Tài Khoản';
                document.getElementById('auth-subtitle').textContent = 'Tạo tài khoản mới để trải nghiệm EduTrack';
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                document.getElementById('auth-title').textContent = 'Chào mừng trở lại!';
                document.getElementById('auth-subtitle').textContent = 'Đăng nhập để tiếp tục theo dõi lộ trình học tập';
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const usernameOrEmail = document.getElementById('login-username').value.trim();
                const password = document.getElementById('login-password').value.trim();

                try {
                    const response = await AuthService.login(usernameOrEmail, password);
                    if (response && response.data) {
                        ApiService.currentUser = response.data;
                        AuthComponent.hideAuthModal();
                        Toast.show(`Chào mừng ${ApiService.currentUser.fullName} trở lại!`, 'success');
                        if (AuthComponent.onAuthSuccessCallback) AuthComponent.onAuthSuccessCallback();
                    }
                } catch (e) {}
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('reg-username').value.trim();
                const email = document.getElementById('reg-email').value.trim();
                const fullName = document.getElementById('reg-fullname').value.trim();
                const password = document.getElementById('reg-password').value.trim();

                try {
                    const response = await AuthService.register(username, email, fullName, password);
                    if (response && response.data) {
                        ApiService.currentUser = response.data;
                        AuthComponent.hideAuthModal();
                        Toast.show('Đăng ký thành công! Hệ thống đã tạo lộ trình cho bạn.', 'success');
                        if (AuthComponent.onAuthSuccessCallback) AuthComponent.onAuthSuccessCallback();
                    }
                } catch (e) {}
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await AuthService.logout();
                ApiService.currentUser = null;
                AuthComponent.showAuthModal();
                Toast.show('Đã đăng xuất tài khoản', 'info');
            });
        }
    }

    static async checkSession() {
        try {
            const response = await AuthService.getCurrentUser();
            if (response && response.data) {
                ApiService.currentUser = response.data;
                AuthComponent.hideAuthModal();
                if (AuthComponent.onAuthSuccessCallback) AuthComponent.onAuthSuccessCallback();
            } else {
                AuthComponent.showAuthModal();
            }
        } catch (err) {
            AuthComponent.showAuthModal();
        }
    }

    static showAuthModal() {
        const modal = document.getElementById('auth-modal');
        const appContainer = document.getElementById('app-container');
        if (modal) modal.classList.add('active');
        if (appContainer) appContainer.classList.add('hidden');
    }

    static hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        const appContainer = document.getElementById('app-container');
        if (modal) modal.classList.remove('active');
        if (appContainer) appContainer.classList.remove('hidden');

        if (ApiService.currentUser) {
            const nameEl = document.getElementById('user-display-name');
            const emailEl = document.getElementById('user-display-email');
            if (nameEl) nameEl.textContent = ApiService.currentUser.fullName;
            if (emailEl) emailEl.textContent = ApiService.currentUser.email;
        }
    }
}
