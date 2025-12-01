<template>
  <div class="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between space-x-4">
    <div>
      <p class="text-sm text-gray-600">{{ title }}</p>
      <p class="text-2xl font-bold text-gray-800">{{ value }}</p>
      <p v-if="caption" class="text-xs text-gray-500 mt-1">{{ caption }}</p>
    </div>
    <div class="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-2xl" :class="bgClass">
      {{ icon }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: '📊' },
  color: { type: String, default: 'bg-gray-100 text-gray-700' },
  caption: { type: String, default: '' }
})

const bgClass = props.color
</script>
