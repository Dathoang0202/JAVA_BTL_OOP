/* ==========================================================================
   STRING & DATE FORMATTERS UTILITY
   ========================================================================== */

export class Formatters {
    static escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        })[m]);
    }

    static formatDateTime(dateTimeStr) {
        if (!dateTimeStr) return '';
        const d = new Date(dateTimeStr);
        return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    }
}
