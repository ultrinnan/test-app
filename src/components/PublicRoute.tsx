import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Box, CircularProgress } from '@mui/material'

interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  // If user is authenticated, redirect to welcome page
  if (isAuthenticated) {
    return <Navigate to="/welcome" replace />
  }

  return <>{children}</>
}

export default PublicRoute
