<template>
  <aside
    :class="[
      'fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40',
      isCollapsed ? 'w-16' : 'w-64',
    ]"
  >
    <!-- LOGO + TOGGLE -->
    <div class="flex items-center justify-between p-4 border-b">
      <!-- left: logo / brand area (small when collapsed) -->
      <router-link to="/dashboard" class="flex items-center space-x-2">
        <img
          :src="logoUrl"
          alt="Hunger Point"
          class="object-contain w-auto"
          :class="isCollapsed ? 'h-6' : 'h-10'"
        />
      </router-link>

      <!-- right: toggle (always visible) -->
      <button
        @click="toggleSidebar"
        class="p-2 transition-colors rounded-lg hover:bg-gray-100"
        aria-label="Toggle sidebar"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- NAVIGATION -->
    <nav class="p-2">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center p-3 mb-2 transition-colors rounded-lg hover:bg-orange-50"
        active-class="text-orange-600 bg-orange-100"
      >
        <font-awesome-icon :icon="item.icon" class="w-5 h-5 mr-3" />
        <span v-show="!isCollapsed" class="font-medium">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from "vue";
/* ----------  OPTION 1 : LOCAL FILE (Vite / Webpack)  ---------- */
import logoUrl from "../../assets/hunger_point.png";

/* ----------  OPTION 2 : PUBLIC FOLDER  ---------- */
// no import needed – just use "/images/logo.png" in the template

defineProps({
  isCollapsed: { type: Boolean, default: false },
});

const emit = defineEmits(["toggle"]);

const menuItems = [
  { path: "/dashboard", name: "Dashboard", icon: "house" },
  { path: "/orders", name: "Orders", icon: "bell-concierge" },
  { path: "/expenses", name: "Expenses", icon: "shekel-sign" },
  { path: "/recipes", name: "Recipes", icon: "receipt" },
  { path: "/history", name: "History", icon: "clock-rotate-left" },
  { path: "/settings", name: "Settings", icon: "cog" },
];

const toggleSidebar = () => emit("toggle");
</script>
