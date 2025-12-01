<template>
  <span :class="['px-2 py-1 rounded-full text-xs font-medium', color]">{{ text }}</span>
</template>

<script setup>
const props = defineProps({
  text: { type: String, default: '' },
  color: { type: String, default: 'bg-gray-100 text-gray-700' }
})
</script>
