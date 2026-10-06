/* ==========================================================================
   DASHBOARD & CHARTS UI COMPONENT
   ========================================================================== */

import { DashboardService } from '../services/DashboardService.js';
import { Formatters } from '../utils/Formatters.js';

export class DashboardComponent {
    static courseProgressChartInstance = null;
    static taskStatusChartInstance = null;

    static async load() {
        try {
            const response = await DashboardService.getSummary();
            if (!response || !response.data) return;

            const summary = response.data;
            const totalCoursesEl = document.getElementById('stat-total-courses');
            const completedTasksEl = document.getElementById('stat-completed-tasks');
            const studyHoursEl = document.getElementById('stat-study-hours');
            const overallProgressEl = document.getElementById('stat-overall-progress');

            if (totalCoursesEl) totalCoursesEl.textContent = summary.totalCourses;
            if (completedTasksEl) completedTasksEl.textContent = `${summary.completedTasks} / ${summary.totalTasks}`;
            if (studyHoursEl) studyHoursEl.textContent = `${summary.totalStudyHours}h`;
            if (overallProgressEl) overallProgressEl.textContent = `${summary.overallCompletionRate}%`;

            DashboardComponent.renderCourseProgressChart(summary.recentCourses || []);
            DashboardComponent.renderTaskStatusChart(summary.todoTasks || 0, summary.inProgressTasks || 0, summary.completedTasks || 0);

            DashboardComponent.renderRecentCoursesList(summary.recentCourses || []);
            DashboardComponent.renderUpcomingTasksList(summary.upcomingTasks || []);
        } catch (e) {}
    }

    static renderCourseProgressChart(courses) {
        const canvas = document.getElementById('courseProgressChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (DashboardComponent.courseProgressChartInstance) {
            DashboardComponent.courseProgressChartInstance.destroy();
        }

        const labels = courses.map(c => c.title);
        const data = courses.map(c => c.progressPercentage);
        const colors = courses.map(c => c.color || '#6366f1');

        DashboardComponent.courseProgressChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.length ? labels : ['Chưa có môn học'],
                datasets: [{
                    label: 'Tiến độ hoàn thành (%)',
                    data: data.length ? data : [0],
                    backgroundColor: colors.length ? colors : ['#6366f1'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' } },
                    x: { ticks: { color: '#94a3b8' } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    static renderTaskStatusChart(todo, progress, completed) {
        const canvas = document.getElementById('taskStatusChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (DashboardComponent.taskStatusChartInstance) {
            DashboardComponent.taskStatusChartInstance.destroy();
        }

        DashboardComponent.taskStatusChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Cần Làm', 'Đang Làm', 'Hoàn Thành'],
                datasets: [{
                    data: [todo, progress, completed],
                    backgroundColor: ['#06b6d4', '#f59e0b', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8' } }
                }
            }
        });
    }

    static renderRecentCoursesList(courses) {
        const container = document.getElementById('recent-courses-list');
        if (!container) return;

        if (!courses || courses.length === 0) {
            container.innerHTML = '<p class="text-muted">Chưa có môn học nào. Vào tab Môn Học để thêm môn học đầu tiên.</p>';
            return;
        }

        container.innerHTML = courses.slice(0, 3).map(c => `
            <div class="glass-panel" style="padding: 12px 16px; margin-bottom: 10px; border-left: 4px solid ${c.color}">
                <div class="flex-between">
                    <strong>${Formatters.escapeHtml(c.title)}</strong>
                    <span class="badge" style="background:${c.color}">${c.progressPercentage}%</span>
                </div>
                <div class="progress-bar-container margin-top-sm">
                    <div class="progress-bar-fill" style="width: ${c.progressPercentage}%; background:${c.color}"></div>
                </div>
            </div>
        `).join('');
    }

    static renderUpcomingTasksList(tasks) {
        const container = document.getElementById('upcoming-tasks-list');
        if (!container) return;

        const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED').slice(0, 4);
        if (pendingTasks.length === 0) {
            container.innerHTML = '<p class="text-muted">Không có bài tập nào cần làm!</p>';
            return;
        }

        container.innerHTML = pendingTasks.map(t => `
            <div class="glass-panel" style="padding: 12px 16px; margin-bottom: 10px;">
                <div class="flex-between">
                    <span style="font-weight: 600;">${Formatters.escapeHtml(t.title)}</span>
                    <span class="priority-badge prio-${t.priority.toLowerCase()}">${t.priority}</span>
                </div>
                <small class="text-muted"><i class="fa-regular fa-clock"></i> Deadline: ${t.dueDate || 'Không có'} | Môn: ${Formatters.escapeHtml(t.courseTitle || '')}</small>
            </div>
        `).join('');
    }
}
