<template>
  <div class="bg-white rounded-xl p-6 max-w-2xl mx-auto">
    <h3 class="text-xl font-semibold mb-6">Add New Order</h3>
    
    <form @submit.prevent="submitOrder">
      <!-- Category Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Category</label>
        <div class="grid grid-cols-3 gap-3">
          <button 
            v-for="category in orderStore.categories" 
            :key="category.id"
            type="button"
            @click="selectedCategory = category.name"
            :class="[
              'p-3 border rounded-lg text-center transition-colors',
              selectedCategory === category.name 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-300 hover:bg-gray-50'
            ]"
          >
            <div class="text-2xl mb-1">{{ category.icon }}</div>
            <div class="text-sm font-medium">{{ category.name }}</div>
          </button>
        </div>
      </div>

      <!-- Item Selection -->
      <div v-if="selectedCategory" class="mb-6">
        <label class="block text-sm font-medium mb-2">Items</label>
        <div class="space-y-3 max-h-60 overflow-y-auto">
          <div 
            v-for="item in availableItems" 
            :key="item.id"
            class="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-gray-600">${{ item.price.toFixed(2) }}</p>
            </div>
            <div class="flex items-center space-x-3">
              <button 
                type="button"
                @click="decreaseQuantity(item)"
                class="w-8 h-8 rounded-full border hover:bg-gray-100 font-semibold"
              >
                -
              </button>
              <span class="w-8 text-center">{{ getItemQuantity(item) }}</span>
              <button 
                type="button"
                @click="increaseQuantity(item)"
                class="w-8 h-8 rounded-full border hover:bg-gray-100 font-semibold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div v-if="selectedItems.length > 0" class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 class="font-medium mb-2">Order Summary</h4>
        <div class="space-y-1">
          <div 
            v-for="item in selectedItems" 
            :key="item.id"
            class="flex justify-between text-sm"
          >
            <span>{{ item.quantity }}x {{ item.name }}</span>
            <span>${{ (item.quantity * item.price).toFixed(2) }}</span>
          </div>
          <div class="border-t pt-2 mt-2">
            <div class="flex justify-between font-semibold">
              <span>Total:</span>
              <span class="text-orange-600">${{ orderTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button 
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
        <button 
          type="submit"
          :disabled="selectedItems.length === 0"
          class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 font-medium"
        >
          Place Order
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '../../stores/orderStore'

const emit = defineEmits(['order-added', 'close'])

const orderStore = useOrderStore()

const selectedCategory = ref('')
const selectedItems = ref([])

const availableItems = computed(() => {
  const category = orderStore.categories.find(c => c.name === selectedCategory.value)
  if (!category) return []
  return orderStore.items.filter(item => item.categoryId === category.id)
})

const orderTotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    return sum + (item.quantity * item.price)
  }, 0)
})

const getItemQuantity = (item) => {
  const selected = selectedItems.value.find(i => i.id === item.id)
  return selected ? selected.quantity : 0
}

const increaseQuantity = (item) => {
  const existing = selectedItems.value.find(i => i.id === item.id)
  if (existing) {
    existing.quantity++
  } else {
    selectedItems.value.push({ ...item, quantity: 1 })
  }
}

const decreaseQuantity = (item) => {
  const existing = selectedItems.value.find(i => i.id === item.id)
  if (existing) {
    if (existing.quantity > 1) {
      existing.quantity--
    } else {
      selectedItems.value = selectedItems.value.filter(i => i.id !== item.id)
    }
  }
}

const submitOrder = () => {
  const order = {
    category: selectedCategory.value,
    items: selectedItems.value,
    total: orderTotal.value
  }
  
  orderStore.addOrder(order)
  emit('order-added')
  
  // Reset form
  selectedCategory.value = ''
  selectedItems.value = []
}
</script>