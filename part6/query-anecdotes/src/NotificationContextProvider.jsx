import { useReducer, useRef } from 'react'
import NotificationContext from './NotificationContext'

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET': return action.message
    case 'CLEAR': return null
    default: return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(reducer, null)
  const timerRef = useRef(null)

  const notify = (message) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    dispatch({ type: 'SET', message })
    timerRef.current = setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContextProvider
