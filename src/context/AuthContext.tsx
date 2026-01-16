import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { AuthContextType, User, LoginCredentials, RegisterCredentials } from '../types/auth'
import * as authApi from '../services/authApi'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_KEY = 'auth_user'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Load saved session on initialization
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY)

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        // If data is corrupted, clear it
        localStorage.removeItem(USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const { user } = await authApi.login(credentials)
    setSession(user)
  }

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    const { user } = await authApi.register(credentials)
    setSession(user)
  }

  const logout = (): void => {
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }

  // Method to save session (simplified - no token needed)
  const setSession = (newUser: User): void => {
    setUser(newUser)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }

  const value: AuthContextType = {
    user,
    token: null, // No token needed for simplified auth
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
