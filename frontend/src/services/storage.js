/**
 * LocalStorage Service
 * Handles client-side persistence for MoodLogs and Journal Entries.
 * Replaces the need for a backend server for these features.
 */

const STORAGE_KEYS = {
    MOOD_LOGS: 'healio_mood_logs',
    USER_PREFS: 'healio_user_prefs'
};

export const storageService = {
    // === MOOD LOGS ===

    /**
     * Save a new mood log
     * @param {Object} logEntry - { mood, note, transcript, signals, timestamp }
     */
    saveMoodLog: (logEntry) => {
        try {
            const currentLogs = storageService.getMoodLogs();

            // Add ID and verify timestamp
            const newLog = {
                id: crypto.randomUUID(), // Generates unique ID
                timestamp: new Date().toISOString(),
                ...logEntry
            };

            const updatedLogs = [newLog, ...currentLogs];
            localStorage.setItem(STORAGE_KEYS.MOOD_LOGS, JSON.stringify(updatedLogs));
            return newLog;
        } catch (error) {
            console.error("Storage Save Error:", error);
            throw new Error("Failed to save to local storage");
        }
    },

    /**
     * Get all mood logs
     * @returns {Array} List of mood logs
     */
    getMoodLogs: () => {
        try {
            const logs = localStorage.getItem(STORAGE_KEYS.MOOD_LOGS);
            return logs ? JSON.parse(logs) : [];
        } catch (error) {
            console.error("Storage Read Error:", error);
            return [];
        }
    },

    /**
     * Get recent journals (formatted for Dashboard)
     * @param {number} limit 
     */
    getRecentJournals: (limit = 10) => {
        const logs = storageService.getMoodLogs();

        // Transform MoodLog -> JournalEntry format
        return logs.slice(0, limit).map(log => {
            // Determine preview text
            const content = log.note || log.transcript || "No content";
            const preview = (content.length > 60) ? content.substring(0, 60) + "..." : content;

            return {
                id: log.id,
                date: log.timestamp || log.created_at,
                preview: preview,
                content: content,
                mood: log.mood,
                tags: log.transcript ? ["Voice Log"] : ["Check-in"],
                hasDistress: false // logical placeholder
            };
        });
    }
};
