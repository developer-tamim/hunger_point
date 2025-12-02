import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnnouncementStore = defineStore('announcements', () => {
  const announcements = ref(JSON.parse(localStorage.getItem('announcements')) || [
    // sample announcement
    { id: Date.now(), title: 'Welcome to Hunger Point', body: 'This is a sample announcement.', pinned: true, active: true, createdAt: new Date().toISOString() }
  ])

  const addAnnouncement = (payload) => {
    // ensure only one is active if this payload declares active
    if (payload && payload.active) {
      announcements.value = announcements.value.map(a => ({ ...a, active: false }))
    }
    const ann = { id: Date.now(), ...payload, active: !!payload.active, createdAt: new Date().toISOString() }
    announcements.value.unshift(ann)
    localStorage.setItem('announcements', JSON.stringify(announcements.value))
    return ann
  }

  const updateAnnouncement = (id, updates) => {
    const idx = announcements.value.findIndex(a => a.id === id)
    if (idx === -1) return
    // if setting active true, unset others
    if (updates && updates.active) {
      announcements.value = announcements.value.map(a => ({ ...a, active: false }))
    }
    announcements.value[idx] = { ...announcements.value[idx], ...updates, active: updates && typeof updates.active !== 'undefined' ? !!updates.active : announcements.value[idx].active, updatedAt: new Date().toISOString() }
    localStorage.setItem('announcements', JSON.stringify(announcements.value))
  }

  const deleteAnnouncement = (id) => {
    announcements.value = announcements.value.filter(a => a.id !== id)
    localStorage.setItem('announcements', JSON.stringify(announcements.value))
  }

  const resetData = () => {
    announcements.value = []
    localStorage.removeItem('announcements')
  }

  return { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, resetData }
}, { persist: true })
