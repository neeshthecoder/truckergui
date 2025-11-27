// src/api/liveClient.js - A lightweight live API client shim

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/axon/api';

async function apiRequest(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
        throw new Error(`API Error: ${response.status} - ${errorBody.message || 'Unknown Error'}`);
    }

    return response.json();
}

function createEntityMethods(entityName) {
    return {
        list: (sort = '-created_date', limit = 100) =>
            apiRequest(`/entities/${entityName}?sort=${sort}&limit=${limit}`),
        filter: (query, sort = '-created_date', limit = 100) =>
            apiRequest(`/entities/${entityName}/filter`, {
                method: 'POST',
                body: JSON.stringify({ query, sort, limit }),
            }),
        create: (data) =>
            apiRequest(`/entities/${entityName}`, {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        update: (id, data) =>
            apiRequest(`/entities/${entityName}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        delete: (id) =>
            apiRequest(`/entities/${entityName}/${id}`, {
                method: 'DELETE',
            }),
        bulkCreate: (items) =>
            apiRequest(`/entities/${entityName}/bulk`, {
                method: 'POST',
                body: JSON.stringify(items),
            }),
        schema: () => apiRequest(`/entities/${entityName}/schema`),
    };
}

export const liveClient = {
    entities: new Proxy({}, {
        get: (target, entityName) => createEntityMethods(entityName),
    }),
    auth: {
        me: () => apiRequest('/auth/me'),
    },
    integrations: {
        Core: {
            InvokeLLM: (params) => apiRequest('/integrations/core/invoke-llm', { method: 'POST', body: JSON.stringify(params) }),
        },
    },
};

// Usage: import { liveClient } from './liveClient';
// Example: queryFn: () => liveClient.entities.Operator.list('-created_date');