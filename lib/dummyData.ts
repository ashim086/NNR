// ─── Helper Functions ─────────────────────────────────────────────────────────

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
    });
};
