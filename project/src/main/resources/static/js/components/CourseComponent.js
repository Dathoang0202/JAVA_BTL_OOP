/* ==========================================================================
   COURSE MANAGEMENT UI COMPONENT
   ========================================================================== */

import { CourseService } from '../services/CourseService.js';
import { Toast } from '../utils/Toast.js';
import { Formatters } from '../utils/Formatters.js';

export class CourseComponent {
    static allCourses = [];
    static onCourseChangedCallback = null;

    static setOnCourseChanged(callback) {
        CourseComponent.onCourseChangedCallback = callback;
    }

    static init() {
        CourseComponent.initFormListeners();
        window.openCourseModal = () => CourseComponent.openModal();
        window.closeCourseModal = () => CourseComponent.closeModal();
        window.editCourse = (id) => CourseComponent.editCourse(id);
        window.deleteCourse = (id) => CourseComponent.deleteCourse(id);
    }

    static async load() {
        try {
            const response = await CourseService.getAllCourses();
            if (!response || !response.data) return;

            CourseComponent.allCourses = response.data;
            CourseComponent.renderCoursesGrid(CourseComponent.allCourses);
            CourseComponent.populateCourseSelects(CourseComponent.allCourses);
        } catch (e) {}
    }

    static renderCoursesGrid(courses) {
        const grid = document.getElementById('courses-grid');
        if (!grid) return;

        if (!courses || courses.length === 0) {
            grid.innerHTML = '<div class="glass-panel text-center" style="grid-column: 1/-1; padding: 40px;"><i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i><p>Chưa có môn học nào. Hãy khởi tạo môn học đầu tiên của bạn!</p></div>';
            return;
        }

        grid.innerHTML = courses.map(c => `
            <div class="course-card glass-panel" style="border-top: 4px solid ${c.color}">
                <div>
                    <span class="course-badge" style="background:${c.color}">${Formatters.escapeHtml(c.category)}</span>
                    <h3 class="course-card-title">${Formatters.escapeHtml(c.title)}</h3>
                    <p class="course-card-desc">${Formatters.escapeHtml(c.description || 'Không có mô tả')}</p>
                </div>
                <div>
                    <div class="flex-between margin-top-sm" style="font-size: 0.85rem; color: var(--text-muted);">
                        <span>Tiến độ học</span>
                        <strong>${c.progressPercentage}% (${c.completedTasks}/${c.totalTasks} bài)</strong>
                    </div>
                    <div class="progress-bar-container margin-top-sm">
                        <div class="progress-bar-fill" style="width: ${c.progressPercentage}%; background:${c.color}"></div>
                    </div>
                    <div class="flex-between margin-top-md">
                        <small class="text-muted"><i class="fa-regular fa-calendar"></i> Hạn: ${c.targetDate || 'Tự do'}</small>
                        <div>
                            <button class="btn-icon" onclick="editCourse(${c.id})" title="Chỉnh sửa"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn-icon" onclick="deleteCourse(${c.id})" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    static populateCourseSelects(courses) {
        const taskCourseFilter = document.getElementById('task-course-filter');
        const taskCourseIdSelect = document.getElementById('task-course-id');
        if (!taskCourseFilter || !taskCourseIdSelect) return;

        const selectedFilter = taskCourseFilter.value;
        const options = courses.map(c => `<option value="${c.id}">${Formatters.escapeHtml(c.title)}</option>`).join('');
        taskCourseFilter.innerHTML = '<option value="">-- Tất cả môn học --</option>' + options;
        if (courses.some(c => String(c.id) === selectedFilter)) taskCourseFilter.value = selectedFilter;
        taskCourseIdSelect.innerHTML = '<option value="" disabled selected>-- Chọn môn học --</option>' + options;
    }

    static initFormListeners() {
        const courseForm = document.getElementById('course-form');
        if (!courseForm) return;

        courseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('course-id').value;
            const title = document.getElementById('course-title').value.trim();
            const category = document.getElementById('course-category').value.trim();
            const description = document.getElementById('course-description').value.trim();
            const targetDate = document.getElementById('course-target-date').value;
            const color = document.getElementById('course-color').value;

            const payload = { title, category, description, targetDate: targetDate || null, color };

            try {
                if (id) {
                    await CourseService.updateCourse(id, payload);
                    Toast.show('Đã cập nhật thông tin môn học', 'success');
                } else {
                    await CourseService.createCourse(payload);
                    Toast.show('Đã tạo môn học mới', 'success');
                }
                CourseComponent.closeModal();
                if (CourseComponent.onCourseChangedCallback) CourseComponent.onCourseChangedCallback();
            } catch (e) {}
        });
    }

    static openModal(course = null) {
        const form = document.getElementById('course-form');
        if (!form) return;
        form.reset();
        document.getElementById('course-id').value = '';
        if (course) {
            document.getElementById('course-modal-title').textContent = 'Chỉnh Sửa Môn Học';
            document.getElementById('course-id').value = course.id;
            document.getElementById('course-title').value = course.title;
            document.getElementById('course-category').value = course.category;
            document.getElementById('course-description').value = course.description || '';
            document.getElementById('course-target-date').value = course.targetDate || '';
            document.getElementById('course-color').value = course.color || '#6366f1';
        } else {
            document.getElementById('course-modal-title').textContent = 'Thêm Môn Học Mới';
        }
        document.getElementById('course-modal').classList.add('active');
    }

    static closeModal() {
        const modal = document.getElementById('course-modal');
        if (modal) modal.classList.remove('active');
    }

    static editCourse(id) {
        const course = CourseComponent.allCourses.find(c => c.id === id);
        if (course) CourseComponent.openModal(course);
    }

    static async deleteCourse(id) {
        if (!confirm('Bạn có chắc chắn muốn xóa môn học này? Toàn bộ bài tập liên quan sẽ bị xóa!')) return;
        try {
            await CourseService.deleteCourse(id);
            Toast.show('Đã xóa môn học thành công', 'success');
            if (CourseComponent.onCourseChangedCallback) CourseComponent.onCourseChangedCallback();
        } catch (e) {}
    }
}
