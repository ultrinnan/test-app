import React from 'react'
import { Container, Typography, Box, Button, Paper } from '@mui/material'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'

const WelcomePage: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
          <Typography component="h1" variant="h3" gutterBottom>
            Hello {user?.first_name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Welcome to the User Management System
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

export default WelcomePage
