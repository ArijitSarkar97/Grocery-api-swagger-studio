// API Configuration
// This will automatically use the correct URL based on environment

export const API_CONFIG = {
    // Get base URL from environment variable, fallback to localhost
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',

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
