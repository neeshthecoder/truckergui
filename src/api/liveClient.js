// src/api/liveClient.js - A mock API client replacing base44Client.js

// 🚨 IMPORTANT: Change this URL to your actual live backend endpoint
// When deployed on Vercel, you can use environment variables (process.env.REACT_APP_API_URL)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/axon/api';

/**
 * Core function to handle authenticated Fetch requests, mimicking the Base44 logic.
 */
async function apiRequest(endpoint, options = {}) {
    // Note: We keep the token logic for future authentication, even if it's not currently used by your pages.
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        // You can add more detailed error handling here later
        const errorBody = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
        throw new Error(`API Error: ${response.status} - ${errorBody.message || 'Unknown Error'}`);
    }

    // Return the JSON response for successful requests
    return response.json();
}

/**
 * Generates the CRUD methods for a given entity (e.g., Operator, Alert).
 * This structure exactly mirrors the createEntityMethods from the original Base44 client.
 */
function createEntityMethods(entityName) {
    // 🚨 NOTE: These endpoints must match the design of your new live API server!
    // They are structured here to match the Base44 API paths provided.
    return {
        // GET /entities/EntityName?sort=-created_date&limit=100
        list: (sort = '-created_date', limit = 100) =>
            apiRequest(`/entities/${entityName}?sort=${sort}&limit=${limit}`),
        
        // POST /entities/EntityName/filter (used by Alerts.js for filtering status)
        filter: (query, sort = '-created_date', limit = 100) =>
            apiRequest(`/entities/${entityName}/filter`, {
                method: 'POST',
                body: JSON.stringify({ query, sort, limit }),
            }),
        
        // POST /entities/EntityName (used by Operators.js for create)
        create: (data) =>
            apiRequest(`/entities/${entityName}`, {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        
        // PUT /entities/EntityName/{id} (used by Operators.js and Alerts.js for update)
        update: (id, data) =>
            apiRequest(`/entities/${entityName}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        
        // DELETE /entities/EntityName/{id} (used by Operators.js for delete)
        delete: (id) =>
            apiRequest(`/entities/${entityName}/${id}`, {
                method: 'DELETE',
            }),

        // Other methods (bulkCreate, schema) are included for structural completeness
        bulkCreate: (items) =>
            apiRequest(`/entities/${entityName}/bulk`, {
                method: 'POST',
                body: JSON.stringify(items),
            }),
        schema: () =>
            apiRequest(`/entities/${entityName}/schema`),
    };
}

/**
 * Exported client object that mirrors the structure of the original Base44 object,
 * allowing your frontend pages to switch seamlessly from mock to live data.
 */
export const liveClient = {
    // Entity Proxy: Allows base44.entities.Operator to resolve to the methods above
    entities: new Proxy({}, {
        get: (target, entityName) => createEntityMethods(entityName),
    }),

    // Auth methods: Kept for structural integrity and future use, even though we mocked 'me' out on the front-end
    auth: {
        me: () => apiRequest('/auth/me'),
        // ... (other auth methods omitted for brevity, but they should be included if you copy the full client)
    },

    // Integrations methods: Crucial replacement for the LLM call
    integrations: {
        Core: {
            // POST /integrations/core/invoke-llm (Used by AIRecommendations.js)
            InvokeLLM: (params) =>
                apiRequest('/integrations/core/invoke-llm', { method: 'POST', body: JSON.stringify(params) }),
            // ... (other integration methods omitted)
        },
    },
};





// IN ALL PAGES

// OLD MOCK IMPORTS:
// import { operatorsMockApi } from "@/api/operatorsMockApi"; 

// NEW LIVE CLIENT IMPORT:
import { liveClient } from "@/api/liveClient"; 

// OLD MOCK QUERY:
// queryFn: operatorsMockApi.list,

// NEW LIVE QUERY:
queryFn: () => liveClient.entities.Operator.list('-created_date');