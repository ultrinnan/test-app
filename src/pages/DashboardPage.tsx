import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material'
import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/ThemeContext'
import * as usersApi from '../services/usersApi'
import { User } from '../types/auth'
import UserDialog from '../components/UserDialog'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user: currentUser, logout } = useAuth()
  const { mode, toggleTheme } = useTheme()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchUsers = async (pageNum: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await usersApi.getUsers(pageNum)
      setUsers(response.data)
      setTotalPages(response.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(page)
  }, [page])

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const handleDelete = async (id: number) => {
    // Prevent users from deleting themselves
    if (currentUser && id === currentUser.id) {
      setError('You cannot delete your own account')
      return
    }

    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await usersApi.deleteUser(id)
      // Update local state - remove deleted user
      setUsers(users.filter((user) => user.id !== id))
      // If current page becomes empty and not first page, go to previous page
      if (users.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        // Refresh the current page
        fetchUsers(page)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const handleCreate = () => {
    setSelectedUser(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleSaveUser = async (userData: { email: string; first_name: string; last_name: string }) => {
    if (dialogMode === 'create') {
      const newUser = await usersApi.createUser(userData)
      // Update local state - add new user
      setUsers([...users, newUser])
      // If we're on the last page and it's not full, stay on current page
      // Otherwise, refresh to get updated pagination
      fetchUsers(page)
    } else if (selectedUser) {
      const updatedUser = await usersApi.updateUser(selectedUser.id, userData)
      // Update local state - replace updated user
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    }
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Hello, {currentUser?.first_name}!
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Users
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
              Add User
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading && users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            No users found. Create your first user by clicking "Add User" button.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => {
                        const isCurrentUser = currentUser && user.id === currentUser.id
                        return (
                          <TableRow
                            key={user.id}
                            hover
                            sx={{
                              backgroundColor: isCurrentUser ? 'action.selected' : 'inherit',
                            }}
                          >
                            <TableCell>
                              <Avatar>
                                {user.first_name[0]}{user.last_name[0]}
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              {user.id}
                              {isCurrentUser && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold' }}
                                >
                                  (You)
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.first_name} {user.last_name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell align="right">
                              <IconButton color="primary" onClick={() => handleEdit(user)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(user.id)}
                                disabled={isCurrentUser}
                                title={isCurrentUser ? 'You cannot delete your own account' : 'Delete user'}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                </Box>
              )}
            </>
          )}
        </Paper>
      </Container>

      <UserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={dialogMode}
      />
    </Box>
  )
}

export default DashboardPage
