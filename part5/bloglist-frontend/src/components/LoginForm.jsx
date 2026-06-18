import { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mt: 4 }}>
      <Typography variant="h4" gutterBottom>Log in to application</Typography>
      <TextField
        fullWidth
        variant="standard"
        placeholder="username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        variant="standard"
        type="password"
        placeholder="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        sx={{ mb: 3 }}
      />
      <Button type="submit" variant="contained">login</Button>
    </Box>
  )
}

export default LoginForm
