import { createContext, useContext } from 'react'

const NotificationContext = createContext()

export const useNotificationValue = () => useContext(NotificationContext).notification
export const useNotify = () => useContext(NotificationContext).notify

export default NotificationContext
