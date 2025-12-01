<template>
  <div class="flex items-center justify-between p-3 border rounded-lg bg-white">
    <div>
      <div class="text-sm font-medium">{{ title }}</div>
      <div v-if="subtitle" class="text-xs text-gray-500">{{ subtitle }}</div>
    </div>
    <div :class="['text-sm font-semibold', rightColor]">{{ rightText }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  rightText: { type: String, default: '' },
  rightColor: { type: String, default: '' }
})
</script>
