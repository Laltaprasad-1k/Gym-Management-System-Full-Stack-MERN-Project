
// api.ts
import { getAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Utility to remove empty strings or undefined values from payloads
function sanitizePayload(payload: Record<string, any>) {
  const sanitized: Record<string, any> = {};
  Object.keys(payload).forEach(key => {
    const value = payload[key];
    if (value !== '' && value !== undefined && value !== null) {
      sanitized[key] = value;
    }
  });
  return sanitized;
}

// Core API call
export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new Error('Network error or server unreachable');
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = { message: 'Unknown error' };
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

// HTTP helpers
export const get = <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' });
export const post = <T>(endpoint: string, data?: Record<string, any>) =>
  apiCall<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(sanitizePayload(data)) : undefined });
export const put = <T>(endpoint: string, data?: Record<string, any>) =>
  apiCall<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(sanitizePayload(data)) : undefined });
export const patch = <T>(endpoint: string, data?: Record<string, any>) =>
  apiCall<T>(endpoint, { method: 'PATCH', body: data ? JSON.stringify(sanitizePayload(data)) : undefined });
export const del = <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'DELETE' });

// Auth APIs
export const login = (email: string, password: string) =>
  post<{ token: string; message?: string }>('/auth/login', { email, password });

export const register = (name: string, email: string, password: string, gender: string, role: string) =>
  post<{ message: string }>('/auth/register', { name, email, password, gender, role });

export const forgotPassword = (email: string) =>
  post<{ message: string }>('/auth/forgot-password', { email });

export const verifyOTP = (email: string, otp: string, newPassword: string) =>
  post<{ message: string }>('/auth/verify-otp', { email, otp, newPassword });

// Member APIs
export const getMembers = (page = 1, limit = 10) => get(`/members?page=${page}&limit=${limit}`);
export const getMember = (id: string) => get(`/members/${id}`);
export const createMember = (data: Record<string, any>) => post(`/members`, data);
export const updateMember = (id: string, data: Record<string, any>) => put(`/members/${id}`, data);
export const deleteMember = (id: string) => del(`/members/${id}`);
export const renewMembership = (id: string, data: Record<string, any>) =>
  put(`/members/${id}/renew`, data);

// Workout Plans
export const getWorkoutPlans = () => get('/workout-plans');
export const getWorkoutPlan = (id: string) => get(`/workout-plans/${id}`);
export const createWorkoutPlan = (data: Record<string, any>) => post('/workout-plans', data);
export const updateWorkoutPlan = (id: string, data: Record<string, any>) => put(`/workout-plans/${id}`, data);
export const deleteWorkoutPlan = (id: string) => del(`/workout-plans/${id}`);

// Membership Plans
export const getMembershipPlans = () => get('/membership-plans');
export const getMembershipPlan = (id: string) => get(`/membership-plans/${id}`);
export const createMembershipPlan = (data: Record<string, any>) => post('/membership-plans', data);
export const updateMembershipPlan = (id: string, data: Record<string, any>) => put(`/membership-plans/${id}`, data);
export const deleteMembershipPlan = (id: string) => del(`/membership-plans/${id}`);

// Payments
export const createPaymentOrder = (data: Record<string, any>) => post('/payments/create-order', data);
export const verifyPayment = (data: Record<string, any>) => post('/payments/verify', data);
export const getPaymentHistory = (page = 1, limit = 10) => get(`/payments/history?page=${page}&limit=${limit}`);