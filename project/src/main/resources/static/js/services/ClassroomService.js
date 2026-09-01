/* ==========================================================================
   CLASSROOM MANAGEMENT API SERVICE
   ========================================================================== */

import { ApiService } from './ApiService.js';

export class ClassroomService {
    static async getAllClassrooms() {
        return await ApiService.fetch('/api/classrooms');
    }

    static async createClassroom(payload) {
        return await ApiService.fetch('/api/classrooms', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    static async updateClassroom(id, payload) {
        return await ApiService.fetch(`/api/classrooms/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    }

    static async deleteClassroom(id) {
        return await ApiService.fetch(`/api/classrooms/${id}`, {
            method: 'DELETE'
        });
    }
}
