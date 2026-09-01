/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */

export class Toast {
    static show(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'circle-exclamation' : 'info-circle');
        toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> ${message}`;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
}
