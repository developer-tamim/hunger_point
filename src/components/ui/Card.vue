<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <router-link v-if="linkTo && linkText" :to="linkTo" class="text-sm text-orange-600 hover:underline">
        {{ linkText }}
      </router-link>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  linkText: { type: String, default: '' },
  linkTo: { type: String, default: '' }
})
</script>
