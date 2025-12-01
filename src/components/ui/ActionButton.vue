<template>
  <router-link :to="to" class="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium">
    <span class="text-lg">{{ icon }}</span>
    <span>{{ text }}</span>
  </router-link>
</template>

<script setup>
const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, default: '' },
  text: { type: String, required: true }
})
</script>
