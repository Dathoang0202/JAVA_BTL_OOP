/* ==========================================================================
   CLASSROOM MANAGEMENT UI COMPONENT
   ========================================================================== */

import { ClassroomService } from '../services/ClassroomService.js';
import { Toast } from '../utils/Toast.js';
import { Formatters } from '../utils/Formatters.js';

export class ClassroomComponent {
    static allClassrooms = [];
    static onClassroomChangedCallback = null;

    static setOnClassroomChanged(callback) {
        ClassroomComponent.onClassroomChangedCallback = callback;
    }

    static init() {
        ClassroomComponent.initFormListeners();
        window.openClassroomModal = () => ClassroomComponent.openModal();
        window.closeClassroomModal = () => ClassroomComponent.closeModal();
        window.editClassroom = (id) => ClassroomComponent.editClassroom(id);
        window.deleteClassroom = (id) => ClassroomComponent.deleteClassroom(id);
    }

    static async load() {
        try {
            const response = await ClassroomService.getAllClassrooms();
            if (!response || !response.data) return;

            ClassroomComponent.allClassrooms = response.data;
            ClassroomComponent.renderClassroomsGrid(ClassroomComponent.allClassrooms);
        } catch (e) {}
    }

    static renderClassroomsGrid(classrooms) {
        const grid = document.getElementById('classrooms-grid');
        if (!grid) return;

        if (!classrooms || classrooms.length === 0) {
            grid.innerHTML = '<div class="glass-panel text-center" style="grid-column: 1/-1; padding: 40px;"><i class="fa-solid fa-users-rectangle" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 16px;"></i><p>Chưa có lớp học nào. Hãy khởi tạo lớp học đầu tiên!</p></div>';
            return;
        }

        grid.innerHTML = classrooms.map(c => `
            <div class="course-card glass-panel" style="border-top: 4px solid #06b6d4">
                <div>
                    <span class="course-badge" style="background:#06b6d4">${Formatters.escapeHtml(c.classCode)}</span>
                    <h3 class="course-card-title">${Formatters.escapeHtml(c.name)}</h3>
                    <p class="course-card-desc">${Formatters.escapeHtml(c.description || 'Không có mô tả')}</p>
                </div>
                <div>
                    <div class="flex-between margin-top-sm" style="font-size: 0.85rem; color: var(--text-muted);">
                        <span><i class="fa-solid fa-chalkboard-user"></i> GV: ${Formatters.escapeHtml(c.teacherName || 'Chưa phân công')}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${Formatters.escapeHtml(c.roomNumber || 'A2-501')}</span>
                    </div>
                    <div class="flex-between margin-top-md">
                        <small class="text-muted"><i class="fa-regular fa-calendar"></i> ${Formatters.escapeHtml(c.semester)}</small>
                        <div>
                            <button class="btn-icon" onclick="editClassroom(${c.id})" title="Chỉnh sửa"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn-icon" onclick="deleteClassroom(${c.id})" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    static initFormListeners() {
        document.addEventListener('submit', async (e) => {
            if (e.target && e.target.id === 'classroom-form') {
                e.preventDefault();
                const id = document.getElementById('classroom-id').value;
                const name = document.getElementById('classroom-name').value.trim();
                const classCode = document.getElementById('classroom-code').value.trim();
                const roomNumber = document.getElementById('classroom-room').value.trim();
                const teacherName = document.getElementById('classroom-teacher').value.trim();
                const semester = document.getElementById('classroom-semester').value.trim();
                const description = document.getElementById('classroom-description').value.trim();

                const payload = { name, classCode, roomNumber, teacherName, semester, description };

                try {
                    if (id) {
                        await ClassroomService.updateClassroom(id, payload);
                        Toast.show('Đã cập nhật thông tin lớp học', 'success');
                    } else {
                        await ClassroomService.createClassroom(payload);
                        Toast.show('Đã tạo lớp học mới', 'success');
                    }
                    ClassroomComponent.closeModal();
                    ClassroomComponent.load();
                } catch (err) {}
            }
        });
    }

    static openModal(classroom = null) {
        const form = document.getElementById('classroom-form');
        if (!form) return;
        form.reset();
        document.getElementById('classroom-id').value = '';
        if (classroom) {
            document.getElementById('classroom-modal-title').textContent = 'Chỉnh Sửa Lớp Học';
            document.getElementById('classroom-id').value = classroom.id;
            document.getElementById('classroom-name').value = classroom.name;
            document.getElementById('classroom-code').value = classroom.classCode;
            document.getElementById('classroom-room').value = classroom.roomNumber || '';
            document.getElementById('classroom-teacher').value = classroom.teacherName || '';
            document.getElementById('classroom-semester').value = classroom.semester || 'HK1 - 2026';
            document.getElementById('classroom-description').value = classroom.description || '';
        } else {
            document.getElementById('classroom-modal-title').textContent = 'Thêm Lớp Học Mới';
        }
        document.getElementById('classroom-modal').classList.add('active');
    }

    static closeModal() {
        const modal = document.getElementById('classroom-modal');
        if (modal) modal.classList.remove('active');
    }

    static editClassroom(id) {
        const classroom = ClassroomComponent.allClassrooms.find(c => c.id === id);
        if (classroom) ClassroomComponent.openModal(classroom);
    }

    static async deleteClassroom(id) {
        if (!confirm('Bạn có chắc chắn muốn xóa lớp học này?')) return;
        try {
            await ClassroomService.deleteClassroom(id);
            Toast.show('Đã xóa lớp học thành công', 'success');
            ClassroomComponent.load();
        } catch (e) {}
    }
}
