<template>
  <nav class="bg-white shadow-sm border-b sticky top-0 z-30">
    <div class="flex items-center justify-between px-6 py-3">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-semibold text-gray-800">{{ currentPageTitle }}</h1>
      </div>

      <div class="flex items-center space-x-4">

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              {{ userInitial }}
            </div>
            <span class="hidden md:block text-sm font-medium text-gray-700">{{ userName }}</span>
            <font-awesome-icon icon="chevron-down" class="text-xs text-gray-500" />
          </button>

          <!-- Dropdown -->
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-40"
            >
              <!-- SETTINGS -->
              <router-link
                to="/settings"
                @click="showUserMenu = false"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
              >
                <font-awesome-icon icon="cog" class="mr-2 text-gray-500" />
                Settings
              </router-link>

              <!-- LOGOUT -->
              <button
                @click="logout"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
              >
                <font-awesome-icon icon="sign-out-alt" class="mr-2 text-gray-500" />
                Logout
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'

defineProps({
  currentPageTitle: { type: String, default: 'Dashboard' }
})

const authStore    = useAuthStore()
const router       = useRouter()
const showUserMenu = ref(false)
const dateFilter   = ref('today')
const searchQuery  = ref('')

const userName   = computed(() => authStore.user?.name || 'User')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const toggleUserMenu = () => (showUserMenu.value = !showUserMenu.value)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>