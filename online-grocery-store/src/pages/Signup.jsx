import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert
} from '@mui/material'

function Signup() {
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setError('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: activeTab === 0 ? 'user' : 'admin',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', data.user.role)
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        navigate(activeTab === 0 ? '/store' : '/admin')
      } else {
        setError(data.message || 'Error registering user')
      }
    } catch (error) {
      setError('Error connecting to the server')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/image.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
              Fresh Cart
            </Typography>
            <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
              <Tab label="User Signup" />
              <Tab label="Admin Signup" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </form>

            <Typography align="center">
              Already have an account?{' '}
              <Link to="/">
                Login
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default Signup 