/* ==========================================================================
   TASK & KANBAN API SERVICE
   ========================================================================== */

import { ApiService } from './ApiService.js';

export class TaskService {
    static async getTasks(courseId = null) {
        const url = courseId ? `/api/tasks?courseId=${courseId}` : '/api/tasks';
        return await ApiService.fetch(url);
    }

    static async createTask(payload) {
        return await ApiService.fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    static async updateTask(id, payload) {
        return await ApiService.fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    }

    static async updateStatus(id, newStatus) {
        return await ApiService.fetch(`/api/tasks/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
        });
    }

    static async deleteTask(id) {
        return await ApiService.fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });
    }
}
