import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const users = ref(JSON.parse(localStorage.getItem('users')) || [
    { id: 1, email: 'admin@hungerpoint.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { id: 2, email: 'staff@hungerpoint.com', password: 'staff123', role: 'user', name: 'Staff User' }
  ])

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const login = async (email, password) => {
    const foundUser = users.value.find(u => u.email === email && u.password === password)
    if (foundUser) {
      user.value = { ...foundUser, password: undefined }
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const signup = async (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'user' // Default role
    }
    users.value.push(newUser)
    localStorage.setItem('users', JSON.stringify(users.value))
    return true
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const addUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      password: userData.password || 'default123'
    }
    users.value.push(newUser)
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  const updateUser = (id, updates) => {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates }
      localStorage.setItem('users', JSON.stringify(users.value))
    }
  }

  const deleteUser = (id) => {
    users.value = users.value.filter(u => u.id !== id)
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    users,
    login,
    signup,
    logout,
    addUser,
    updateUser,
    deleteUser
  }
}, {
  persist: true
})