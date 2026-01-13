// API Configuration
// This will automatically use the correct URL based on environment

// Helper to get the base URL
export const getBaseUrl = () => {
    // In production, we prioritize the environment variable
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    // Default to production URL if not set (fallback)
    return 'https://groceryswagger-production.up.railway.app';
};

export const API_CONFIG = {
    // Get base URL from environment variable, fallback to production URL
    get BASE_URL() {
        return getBaseUrl();
    },

    // API endpoints prefix
    API_PREFIX: '/api/v1',

    // Full API URL
    get API_URL() {
        return `${this.BASE_URL}${this.API_PREFIX}`;
    },

    // Helper to get full endpoint URL
    getEndpointUrl(path: string): string {
        return `${this.BASE_URL}${path}`;
    },

    // Check if running in production
    get isProduction() {
        return import.meta.env.PROD;
    },

    // Get environment name
    get environment() {
        return import.meta.env.MODE || 'development';
    }
};

// Export base URL for components
export const getBaseUrl = () => API_CONFIG.BASE_URL;
