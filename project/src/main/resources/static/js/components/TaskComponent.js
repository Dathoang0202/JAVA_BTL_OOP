/* ==========================================================================
   TASK & KANBAN BOARD UI COMPONENT
   ========================================================================== */

import { TaskService } from '../services/TaskService.js';
import { Toast } from '../utils/Toast.js';
import { Formatters } from '../utils/Formatters.js';

export class TaskComponent {
    static allTasks = [];
    static onTaskChangedCallback = null;

    static setOnTaskChanged(callback) {
        TaskComponent.onTaskChangedCallback = callback;
    }

    static init() {
        TaskComponent.initListeners();
        window.changeTaskStatus = (id, status) => TaskComponent.changeTaskStatus(id, status);
        window.deleteTask = (id) => TaskComponent.deleteTask(id);
    }

    static async load() {
        try {
            const filterEl = document.getElementById('task-course-filter');
            const filterCourseId = filterEl ? filterEl.value : '';
            const response = await TaskService.getTasks(filterCourseId);
            if (!response || !response.data) return;

            TaskComponent.allTasks = response.data;
            TaskComponent.renderKanbanBoard(TaskComponent.allTasks);
            TaskComponent.populateTaskLogSelect(TaskComponent.allTasks);
        } catch (e) {}
    }

    static initListeners() {
        const filterEl = document.getElementById('task-course-filter');
        if (filterEl) {
            filterEl.addEventListener('change', () => TaskComponent.load());
        }

        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('task-id').value;
                const courseId = document.getElementById('task-course-id').value;
                const title = document.getElementById('task-title').value.trim();
                const priority = document.getElementById('task-priority').value;
                const status = document.getElementById('task-status').value;
                const estimatedHours = parseFloat(document.getElementById('task-estimated-hours').value) || 1.0;
                const dueDate = document.getElementById('task-due-date').value;

                const payload = { courseId, title, priority, status, estimatedHours, dueDate: dueDate || null };

                try {
                    if (id) {
                        await TaskService.updateTask(id, payload);
                        Toast.show('Đã cập nhật bài tập', 'success');
                    } else {
                        await TaskService.createTask(payload);
                        Toast.show('Đã thêm bài tập mới', 'success');
                    }
                    TaskComponent.closeModal();
                    if (TaskComponent.onTaskChangedCallback) TaskComponent.onTaskChangedCallback();
                } catch (e) {}
            });
        }
    }

    static renderKanbanBoard(tasks) {
        const todoList = document.getElementById('list-todo');
        const progressList = document.getElementById('list-progress');
        const completedList = document.getElementById('list-completed');
        if (!todoList || !progressList || !completedList) return;

        const todos = tasks.filter(t => t.status === 'TODO');
        const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
        const completed = tasks.filter(t => t.status === 'COMPLETED');

        const countTodo = document.getElementById('count-todo');
        const countProgress = document.getElementById('count-progress');
        const countCompleted = document.getElementById('count-completed');

        if (countTodo) countTodo.textContent = todos.length;
        if (countProgress) countProgress.textContent = inProgress.length;
        if (countCompleted) countCompleted.textContent = completed.length;

        todoList.innerHTML = TaskComponent.renderTaskList(todos, 'TODO');
        progressList.innerHTML = TaskComponent.renderTaskList(inProgress, 'IN_PROGRESS');
        completedList.innerHTML = TaskComponent.renderTaskList(completed, 'COMPLETED');
    }

    static renderTaskList(tasks, currentStatus) {
        if (!tasks || tasks.length === 0) {
            return '<p class="text-muted text-center" style="padding: 20px; font-size: 0.85rem;">Không có bài tập</p>';
        }

        return tasks.map(t => `
            <div class="task-card">
                <div class="task-header">
                    <div class="task-title">${Formatters.escapeHtml(t.title)}</div>
                    <span class="priority-badge prio-${t.priority.toLowerCase()}">${t.priority}</span>
                </div>
                <div class="task-course"><i class="fa-solid fa-book-open"></i> ${Formatters.escapeHtml(t.courseTitle || 'Môn học')}</div>
                <div class="task-footer">
                    <span><i class="fa-regular fa-clock"></i> ${t.spentHours}/${t.estimatedHours}h</span>
                    <div class="task-actions">
                        ${currentStatus !== 'TODO' ? `<button class="btn-icon" onclick="changeTaskStatus(${t.id}, 'TODO')" title="Chuyển về TODO"><i class="fa-solid fa-arrow-left"></i></button>` : ''}
                        ${currentStatus !== 'IN_PROGRESS' ? `<button class="btn-icon" onclick="changeTaskStatus(${t.id}, 'IN_PROGRESS')" title="Chuyển sang Đang Làm"><i class="fa-solid fa-spinner"></i></button>` : ''}
                        ${currentStatus !== 'COMPLETED' ? `<button class="btn-icon" onclick="changeTaskStatus(${t.id}, 'COMPLETED')" title="Hoàn thành"><i class="fa-solid fa-check"></i></button>` : ''}
                        <button class="btn-icon" onclick="deleteTask(${t.id})" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    static async changeTaskStatus(id, newStatus) {
        try {
            await TaskService.updateStatus(id, newStatus);
            Toast.show('Đã cập nhật trạng thái nhiệm vụ', 'success');
            if (TaskComponent.onTaskChangedCallback) TaskComponent.onTaskChangedCallback();
        } catch (e) {}
    }

    static openModal(task = null) {
        const form = document.getElementById('task-form');
        if (!form) return;
        form.reset();
        document.getElementById('task-id').value = '';
        if (task) {
            document.getElementById('task-modal-title').textContent = 'Chỉnh Sửa Bài Tập';
            document.getElementById('task-id').value = task.id;
            document.getElementById('task-course-id').value = task.courseId;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-status').value = task.status;
            document.getElementById('task-estimated-hours').value = task.estimatedHours;
            document.getElementById('task-due-date').value = task.dueDate || '';
        } else {
            document.getElementById('task-modal-title').textContent = 'Thêm Bài Tập Mới';
        }
        document.getElementById('task-modal').classList.add('active');
    }

    static closeModal() {
        const modal = document.getElementById('task-modal');
        if (modal) modal.classList.remove('active');
    }

    static async deleteTask(id) {
        if (!confirm('Bạn có chắc chắn muốn xóa bài tập này?')) return;
        try {
            await TaskService.deleteTask(id);
            Toast.show('Đã xóa bài tập', 'success');
            if (TaskComponent.onTaskChangedCallback) TaskComponent.onTaskChangedCallback();
        } catch (e) {}
    }

    static populateTaskLogSelect(tasks) {
        const select = document.getElementById('log-task-id');
        if (!select) return;
        const options = tasks.map(t => `<option value="${t.id}">${Formatters.escapeHtml(t.title)} (${Formatters.escapeHtml(t.courseTitle || '')})</option>`).join('');
        select.innerHTML = '<option value="">-- Tự học / Đọc sách / Không gán task --</option>' + options;
    }
}
