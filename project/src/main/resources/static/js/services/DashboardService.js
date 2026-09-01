/* ==========================================================================
   DASHBOARD ANALYTICS API SERVICE
   ========================================================================== */

import { ApiService } from './ApiService.js';

export class DashboardService {
    static async getSummary() {
        return await ApiService.fetch('/api/dashboard/summary');
    }
}
