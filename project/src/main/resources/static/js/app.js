/* ==========================================================================
   EDUTRACK FRONTEND MAIN ENTRY POINT (ES6 MODULE)
   ========================================================================== */

import { ComponentLoader } from './utils/ComponentLoader.js';
import { AuthComponent } from './components/AuthComponent.js';
import { NavigationComponent } from './components/NavigationComponent.js';
import { DashboardComponent } from './components/DashboardComponent.js';
import { ClassroomComponent } from './components/ClassroomComponent.js';
import { CourseComponent } from './components/CourseComponent.js';
import { TaskComponent } from './components/TaskComponent.js';
import { StudyLogComponent } from './components/StudyLogComponent.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Nạp các tab HTML động
    await ComponentLoader.loadAll();

    // 2. Khởi tạo UI Component Listeners
    AuthComponent.init();
    NavigationComponent.init();
    ClassroomComponent.init();
    CourseComponent.init();
    TaskComponent.init();
    StudyLogComponent.init();

    const refreshAllData = async () => {
        await CourseComponent.load();
        await Promise.all([
            DashboardComponent.load(),
            ClassroomComponent.load(),
            TaskComponent.load(),
            StudyLogComponent.load()
        ]);
    };

    AuthComponent.setOnAuthSuccess(refreshAllData);
    CourseComponent.setOnCourseChanged(refreshAllData);
    TaskComponent.setOnTaskChanged(refreshAllData);
    StudyLogComponent.setOnLogSaved(refreshAllData);

    // Kiểm tra phiên đăng nhập người dùng
    await AuthComponent.checkSession();
});
