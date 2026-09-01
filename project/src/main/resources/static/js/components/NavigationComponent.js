/* ==========================================================================
   NAVIGATION & THEME UI COMPONENT
   ========================================================================== */

export class NavigationComponent {
    static openCourseModalHandler = null;
    static openTaskModalHandler = null;

    static setModalHandlers(openCourseModal, openTaskModal) {
        NavigationComponent.openCourseModalHandler = openCourseModal;
        NavigationComponent.openTaskModalHandler = openTaskModal;
    }

    static init() {
        NavigationComponent.initNavigationListeners();
        NavigationComponent.initThemeToggle();
    }

    static initNavigationListeners() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = item.getAttribute('data-tab');
                NavigationComponent.switchTab(tabName);
            });
        });

        const quickAddCourseBtn = document.getElementById('quick-add-course-btn');
        if (quickAddCourseBtn) {
            quickAddCourseBtn.addEventListener('click', () => {
                if (NavigationComponent.openCourseModalHandler) NavigationComponent.openCourseModalHandler();
            });
        }

        const quickAddTaskBtn = document.getElementById('quick-add-task-btn');
        if (quickAddTaskBtn) {
            quickAddTaskBtn.addEventListener('click', () => {
                if (NavigationComponent.openTaskModalHandler) NavigationComponent.openTaskModalHandler();
            });
        }

        document.querySelectorAll('.switch-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('data-target');
                NavigationComponent.switchTab(target);
            });
        });
    }

    static switchTab(tabName) {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
        if (activeNav) activeNav.classList.add('active');

        document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));
        const activePage = document.getElementById(`tab-${tabName}`);
        if (activePage) activePage.classList.add('active');

        const pageTitles = {
            'dashboard': ['Dashboard Tổng Quan', 'Thống kê tiến độ học tập real-time'],
            'classrooms': ['Quản Lý Lớp Học', 'Danh sách các lớp học, giảng viên và phòng học'],
            'courses': ['Quản Lý Môn Học', 'Danh sách các khóa học & mục tiêu hoàn thành'],
            'tasks': ['Quản Lý Bài Tập & Kanban', 'Kế hoạch công việc chi tiết dạng bảng'],
            'studylogs': ['Pomodoro & Nhật Ký Học', 'Rèn luyện sự tập trung và lưu ghi chú học tập']
        };
        if (pageTitles[tabName]) {
            const headingEl = document.getElementById('current-page-heading');
            const subEl = document.getElementById('current-page-sub');
            if (headingEl) headingEl.textContent = pageTitles[tabName][0];
            if (subEl) subEl.textContent = pageTitles[tabName][1];
        }
    }

    static initThemeToggle() {
        const btn = document.getElementById('theme-toggle-btn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            const label = btn.querySelector('span');
            const icon = btn.querySelector('i');
            if (label) label.textContent = isLight ? 'Giao diện sáng' : 'Giao diện tối';
            if (icon) icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        });
    }
}
