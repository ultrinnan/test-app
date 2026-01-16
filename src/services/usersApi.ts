import fetchApi from './api'
import { User } from '../types/auth'

export interface UsersResponse {
  data: User[]
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface UserResponse {
  data: User
}

/**
 * Get all users with pagination
 * GET /api/users?page=1
 */
export const getUsers = async (page: number = 1): Promise<UsersResponse> => {
  const response = await fetchApi<UsersResponse>(`/users?page=${page}`)
  return response
}

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = async (id: number): Promise<User> => {
  const response = await fetchApi<UserResponse>(`/users/${id}`)
  return response.data
}

/**
 * Create a new user
 * POST /api/users
 */
export const createUser = async (userData: {
  email: string
  first_name: string
  last_name: string
}): Promise<User> => {
  const response = await fetchApi<UserResponse>('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
  return response.data
}

/**
 * Update user
 * PUT /api/users/:id
 */
export const updateUser = async (
  id: number,
  userData: {
    email: string
    first_name: string
    last_name: string
  }
): Promise<User> => {
  const response = await fetchApi<UserResponse>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  })
  return response.data
}

/**
 * Delete user
 * DELETE /api/users/:id
 */
export const deleteUser = async (id: number): Promise<void> => {
  await fetchApi<{ message: string }>(`/users/${id}`, {
    method: 'DELETE',
  })
}
