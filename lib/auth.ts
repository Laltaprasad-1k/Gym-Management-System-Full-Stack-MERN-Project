
export type Role = 'admin' | 'trainer' | 'member';
export type Gender = 'male' | 'female' | 'other';

export interface User {
  _id: string;       // frontend id
  email: string;
  name: string;
  gender: Gender;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  role: Role;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Check if user has specific role
export function hasRole(role: Role): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

export function isAdmin(): boolean {
  return hasRole('admin');
}

export function isTrainer(): boolean {
  return hasRole('trainer');
}

export function isMember(): boolean {
  return hasRole('member');
}

// Logout user
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}

// Store auth data
export function setAuthData(user: User, token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
}

// Get userId for backend
export function getUserId(): string | null {
  const user = getCurrentUser();
  return user?._id ?? null;// <-- use this when sending payloads
}