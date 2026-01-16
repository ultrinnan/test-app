import fetchApi from './api'
import { LoginCredentials, RegisterCredentials, User, AuthResponse } from '../types/auth'

/**
 * Register a new user
 * POST /api/register
 */
export const register = async (
  credentials: RegisterCredentials
): Promise<{ user: User }> => {
  // Validate inputs
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required')
  }

  const response = await fetchApi<{ user: User; message: string }>('/register', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
      first_name: credentials.email.split('@')[0] || 'User',
      last_name: '',
    }),
  })

  if (!response.user) {
    throw new Error('Invalid response from registration')
  }

  return {
    user: response.user,
  }
}

/**
 * User login
 * POST /api/login
 */
export const login = async (
  credentials: LoginCredentials
): Promise<{ user: User }> => {
  // Validate inputs
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required')
  }

  const response = await fetchApi<{ user: User; message: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
    }),
  })

  if (!response.user) {
    throw new Error('Invalid response from login')
  }

  return {
    user: response.user,
  }
}

/**
 * Get user information by ID
 * GET /api/users/:id
 */
export const getUserById = async (id: number): Promise<User> => {
  const response = await fetchApi<{ data: User }>(`/users/${id}`)
  return response.data
}
