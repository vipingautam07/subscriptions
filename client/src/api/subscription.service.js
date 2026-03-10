import api from "./api.js";

export const subscriptionService = {
    async getAllSubscription() {
        const response = await api.get('/subscriptions');
        return response.data;
    },
    async createSubscription(subscriptionData) {
        const response = await api.post('/subscriptions', subscriptionData);
        return response.data;
    },
    async getUserSubscription(id) {
        const response = await api.get(`/subscriptions/${id}`);
        return response.data;
    },
    async updateUserSubscription({ id, data }) {
        const response = await api.put(`/subscriptions/${id}`, data);
        return response.data;
    },
    async deleteSubscription(id) {
        const response = await api.delete(`/subscriptions/${id}`);
        return response.data;
    },
    async cancelSubscription(id) {
        const response = await api.put(`/subscriptions/${id}/cancel`);
        return response.data;
    },
    async resumeSubscription(id) {
        const response = await api.put(`/subscriptions/${id}/resume`);
        return response.data;
    },
    async getUpcomingRenewals() {
        const response = await api.get(`/subscriptions/upcoming-renewals`);
        return response.data;
    },
}
