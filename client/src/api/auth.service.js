import api from "./api.js";

export const authService = {
    async signup(userData) {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },
    async signin(userData) {
        const response = await api.post('/auth/signin', userData);
        return response.data;
    },
    async signout() {
        const response = await api.post('/auth/signout');
        return response.data;
    },
}
