import api from "./api.js";

export const workflowService = {
    async sendReminders(subscriptionId) {
        const response = await api.post('/workflows/subscription/reminder', { subscriptionId });
        return response.data;
    },
}
