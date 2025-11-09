<template>
  <nav class="bg-white shadow-sm border-b sticky top-0 z-30">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-semibold text-gray-800">{{ currentPageTitle }}</h1>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Date Filter -->
        <select 
          v-model="dateFilter"
          class="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <!-- Search -->
        <div class="relative">
          <input 
            type="text" 
            placeholder="Search orders..."
            class="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            v-model="searchQuery"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <button 
            @click="toggleUserMenu"
            class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              {{ userInitial }}
            </div>
            <span class="hidden md:block text-sm font-medium">{{ userName }}</span>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2"
          >
            <button 
              @click="logout"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  currentPageTitle: {
    type: String,
    default: 'Dashboard'
  }
})

const authStore = useAuthStore()
const router = useRouter()

const showUserMenu = ref(false)
const dateFilter = ref('today')
const searchQuery = ref('')

const userName = computed(() => authStore.user?.name || 'User')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>