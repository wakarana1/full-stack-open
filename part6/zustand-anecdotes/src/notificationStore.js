import { create } from 'zustand'

let notificationTimer = null

const useNotificationStore = create((set) => ({
  notification: '',
  actions: {
    setNotification: (message) => {
      clearTimeout(notificationTimer)
      set({ notification: message })
      notificationTimer = setTimeout(() => set({ notification: '' }), 5000)
    },
  },
}))

export default useNotificationStore
export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
