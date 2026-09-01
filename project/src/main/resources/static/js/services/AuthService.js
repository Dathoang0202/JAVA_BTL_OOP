/* ==========================================================================
   AUTHENTICATION API SERVICE
   ========================================================================== */

import { ApiService } from './ApiService.js';

export class AuthService {
    static async login(usernameOrEmail, password) {
        return await ApiService.fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ usernameOrEmail, password })
        });
    }

    static async register(username, email, fullName, password) {
        return await ApiService.fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, fullName, password })
        });
    }

    static async logout() {
        return await ApiService.fetch('/api/auth/logout', { method: 'POST' });
    }

    static async getCurrentUser() {
        return await ApiService.fetch('/api/auth/me');
    }
}
