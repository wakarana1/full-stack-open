import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (message === null) return null

  return (
    <Alert
      severity={message.type === 'success' ? 'success' : 'error'}
      sx={{ mb: 2 }}
    >
      {message.message}
    </Alert>
  )
}

export default Notification
