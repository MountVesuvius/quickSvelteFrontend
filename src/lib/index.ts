// place files you want to import through the `$lib` alias in this folder.
// this is not how you would usually do things, but i needed to get this done really fast

import { goto } from '$app/navigation';
import axios from 'axios';

// Set your jwt tokens for access and refresh
export function setTokens(accessToken: string, refreshToken: string): void {
    console.log('setting tokens:', accessToken, refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
}

// get your access token
export function getAccessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
}

// get your access token
export function getRefreshToken(): string {
    return localStorage.getItem('refreshToken') ?? '';
}

// remove tokens from local storage
export function clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

// routing calls to the backend to ensure the tokens work
const baseURL = 'http://localhost:8080/api/v1/';

const apiClient = axios.create({
    baseURL: baseURL,
})

apiClient.interceptors.request.use(config => {
    const token = getAccessToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config
})

apiClient.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        // will mostlikely error due to access token having expired
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();
            // try to refresh the access token and do the request again
            if (refreshToken) {
                try {
                    const { data } = await axios.post(baseURL+'auth/refresh', { token: refreshToken });
                    setTokens(data.accessToken, data.refreshToken);
                    originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    return apiClient(originalRequest);
                } catch (err) {
                    clearTokens();
                    goto('/login');
                }
            }
        }
        return Promise.reject(error);
    }
);

export interface ITokenPair {
    access: string,
    refresh: string,
}

export async function login(email: string, password: string): Promise<string> {
    const response = await apiClient.post('user/login', {
        email: email,
        password: password,
    });
    return response.data;
}

export async function getUserById(userId: number) {
    const response = await apiClient.get(`user?id=${userId}`);
    return response.data;
}
