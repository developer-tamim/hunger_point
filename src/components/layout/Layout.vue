<template>
  <div class="flex">
    <SideBar :is-collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
    
    <div :class="[
      'flex-1 transition-all duration-300',
      sidebarCollapsed ? 'ml-16' : 'ml-64'
    ]">
      <NavBar :current-page-title="currentPageTitle" />
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from './SideBar.vue'
import NavBar from './NavBar.vue'

const route = useRoute()
const sidebarCollapsed = ref(false)

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/orders': 'Orders',
  '/expenses': 'Expenses',
  '/recipes': 'Recipes',
  '/settings': 'Settings'
}

const currentPageTitle = computed(() => {
  return pageTitles[route.path] || 'Dashboard'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>