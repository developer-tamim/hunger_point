<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p class="text-sm text-gray-600 mt-2">{{ message }}</p>

      <div class="flex justify-end space-x-2 mt-6">
        <button @click="onCancel" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
        <button @click="onConfirm" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: 'Confirm' },
  message: { type: String, default: '' }
})
const emits = defineEmits(['confirm', 'cancel'])

const onConfirm = () => emits('confirm')
const onCancel = () => emits('cancel')
</script>