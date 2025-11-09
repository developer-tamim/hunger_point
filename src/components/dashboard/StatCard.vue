<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600 mb-1">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-800">{{ value }}</p>
      </div>
      <div :class="['p-3 rounded-lg', color]">
        <span class="text-2xl">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String,
  color: String
})
</script>