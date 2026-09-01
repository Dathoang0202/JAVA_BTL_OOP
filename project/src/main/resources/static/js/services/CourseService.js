/* ==========================================================================
   COURSE MANAGEMENT API SERVICE
   ========================================================================== */

import { ApiService } from './ApiService.js';

export class CourseService {
    static async getAllCourses() {
        return await ApiService.fetch('/api/courses');
    }

    static async createCourse(payload) {
        return await ApiService.fetch('/api/courses', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    static async updateCourse(id, payload) {
        return await ApiService.fetch(`/api/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    }

    static async deleteCourse(id) {
        return await ApiService.fetch(`/api/courses/${id}`, {
            method: 'DELETE'
        });
    }
}
