export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

export interface AuthResponse {
  token: string
  id?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  token: string | null // Kept for compatibility, but not used
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  setSession: (user: User) => void
}
