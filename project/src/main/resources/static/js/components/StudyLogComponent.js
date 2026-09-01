/* ==========================================================================
   POMODORO & STUDY LOG UI COMPONENT
   ========================================================================== */

import { StudyLogService } from '../services/StudyLogService.js';
import { Toast } from '../utils/Toast.js';
import { Formatters } from '../utils/Formatters.js';

export class StudyLogComponent {
    static pomodoroTimer = null;
    static pomodoroSecondsLeft = 25 * 60;
    static pomodoroIsRunning = false;
    static onLogSavedCallback = null;

    static setOnLogSaved(callback) {
        StudyLogComponent.onLogSavedCallback = callback;
    }

    static init() {
        StudyLogComponent.initPomodoroListeners();
    }

    static async load() {
        try {
            const response = await StudyLogService.getStudyLogs();
            if (!response || !response.data) return;

            const logs = response.data;
            const tbody = document.getElementById('studylogs-table-body');
            if (!tbody) return;

            if (logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Chưa có nhật ký học tập nào được lưu</td></tr>';
                return;
            }

            tbody.innerHTML = logs.map(l => `
                <tr>
                    <td>${Formatters.formatDateTime(l.logDate)}</td>
                    <td><strong>${Formatters.escapeHtml(l.taskTitle || 'Tự học')}</strong></td>
                    <td><span class="badge" style="background:var(--primary);">${l.durationMinutes} phút</span></td>
                    <td>${Formatters.escapeHtml(l.notes || '-')}</td>
                </tr>
            `).join('');
        } catch (e) {}
    }

    static initPomodoroListeners() {
        const startBtn = document.getElementById('pomo-start-btn');
        const pauseBtn = document.getElementById('pomo-pause-btn');
        const resetBtn = document.getElementById('pomo-reset-btn');
        const logForm = document.getElementById('log-session-form');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (!StudyLogComponent.pomodoroIsRunning) {
                    StudyLogComponent.pomodoroIsRunning = true;
                    startBtn.disabled = true;
                    if (pauseBtn) pauseBtn.disabled = false;
                    StudyLogComponent.pomodoroTimer = setInterval(() => StudyLogComponent.updatePomodoroTimer(), 1000);
                }
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (StudyLogComponent.pomodoroIsRunning) {
                    StudyLogComponent.pomodoroIsRunning = false;
                    if (startBtn) startBtn.disabled = false;
                    pauseBtn.disabled = true;
                    clearInterval(StudyLogComponent.pomodoroTimer);
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                StudyLogComponent.pomodoroIsRunning = false;
                clearInterval(StudyLogComponent.pomodoroTimer);
                if (startBtn) startBtn.disabled = false;
                if (pauseBtn) pauseBtn.disabled = true;
                StudyLogComponent.pomodoroSecondsLeft = 25 * 60;
                StudyLogComponent.renderPomodoroDisplay();
            });
        }

        if (logForm) {
            logForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const taskId = document.getElementById('log-task-id').value;
                const durationMinutes = parseInt(document.getElementById('log-duration').value) || 25;
                const notes = document.getElementById('log-notes').value.trim();

                const payload = { taskId: taskId ? parseInt(taskId) : null, durationMinutes, notes };

                try {
                    await StudyLogService.createStudyLog(payload);
                    Toast.show(`Đã lưu ${durationMinutes} phút học tập vào nhật ký!`, 'success');
                    const notesEl = document.getElementById('log-notes');
                    if (notesEl) notesEl.value = '';
                    if (StudyLogComponent.onLogSavedCallback) StudyLogComponent.onLogSavedCallback();
                } catch (e) {}
            });
        }
    }

    static updatePomodoroTimer() {
        if (StudyLogComponent.pomodoroSecondsLeft > 0) {
            StudyLogComponent.pomodoroSecondsLeft--;
            StudyLogComponent.renderPomodoroDisplay();
        } else {
            clearInterval(StudyLogComponent.pomodoroTimer);
            StudyLogComponent.pomodoroIsRunning = false;
            const startBtn = document.getElementById('pomo-start-btn');
            const pauseBtn = document.getElementById('pomo-pause-btn');
            if (startBtn) startBtn.disabled = false;
            if (pauseBtn) pauseBtn.disabled = true;
            Toast.show('Chúc mừng! Bạn đã hoàn thành 1 phiên Pomodoro 25 phút!', 'success');
            try { new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(); } catch(e){}
        }
    }

    static renderPomodoroDisplay() {
        const timerEl = document.getElementById('pomodoro-timer');
        if (!timerEl) return;
        const mins = Math.floor(StudyLogComponent.pomodoroSecondsLeft / 60);
        const secs = StudyLogComponent.pomodoroSecondsLeft % 60;
        timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
}
