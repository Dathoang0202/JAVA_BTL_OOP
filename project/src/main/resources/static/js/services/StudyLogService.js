/* ==========================================================================
   STUDY LOG API SERVICE
   ========================================================================== */

import { ApiService } from './ApiService.js';

export class StudyLogService {
    static async getStudyLogs() {
        return await ApiService.fetch('/api/studylogs');
    }

    static async createStudyLog(payload) {
        return await ApiService.fetch('/api/studylogs', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }
}
