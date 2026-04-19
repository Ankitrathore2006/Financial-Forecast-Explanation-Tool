import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    try {
        const response = await axios.post(`${API_URL}/auth/token`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('fullName', response.data.full_name || 'User');
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Login failed';
    }
};

export const register = async (email, password, fullName) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            email, password, full_name: fullName
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Registration failed';
    }
};

export const getForecast = async (stockName) => {
    try {
        const response = await axios.post(`${API_URL}/forecast`, 
        { stock_name: stockName, timeframe: '1mo' },
        { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message || 'An error occurred while fetching the forecast.';
    }
};

export const getHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/history`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to fetch history';
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
};
