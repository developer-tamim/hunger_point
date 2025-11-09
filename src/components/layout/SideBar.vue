<template>
  <aside :class="[
    'fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40',
    isCollapsed ? 'w-16' : 'w-64'
  ]">
    <div class="flex items-center justify-between p-4 border-b">
      <div v-show="!isCollapsed" class="flex items-center space-x-2">
        <div class="text-2xl">🍔</div>
        <span class="text-xl font-bold text-orange-600">Hunger Point</span>
      </div>
      <button 
        @click="toggleSidebar"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <nav class="p-2">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center p-3 rounded-lg mb-2 transition-colors hover:bg-orange-50"
        active-class="bg-orange-100 text-orange-600"
      >
        <span class="text-xl mr-3">{{ item.icon }}</span>
        <span v-show="!isCollapsed" class="font-medium">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const menuItems = [
  { path: '/dashboard', name: 'Dashboard', icon: '📊' },
  { path: '/orders', name: 'Orders', icon: '📋' },
  { path: '/expenses', name: 'Expenses', icon: '💸' },
  { path: '/recipes', name: 'Recipes', icon: '📖' },
  { path: '/settings', name: 'Settings', icon: '⚙️' }
]

const toggleSidebar = () => {
  emit('toggle')
}
</script>