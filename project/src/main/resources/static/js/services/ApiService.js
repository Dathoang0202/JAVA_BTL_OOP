/* ==========================================================================
   BASE API SERVICE (REST CLIENT WRAPPER)
   ========================================================================== */

import { Toast } from '../utils/Toast.js';

export class ApiService {
    static currentUser = null;
    static onUnauthorizedCallback = null;

    static setOnUnauthorized(callback) {
        ApiService.onUnauthorizedCallback = callback;
    }

    static async fetch(url, options = {}) {
        try {
            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (res.status === 401) {
                if (ApiService.currentUser) {
                    ApiService.currentUser = null;
                    if (ApiService.onUnauthorizedCallback) {
                        ApiService.onUnauthorizedCallback();
                    }
                    Toast.show('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', 'error');
                }
                return null;
            }

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Đã có lỗi xảy ra');
            }
            return data;
        } catch (err) {
            Toast.show(err.message, 'error');
            throw err;
        }
    }
}
