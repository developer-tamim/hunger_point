<template>
  <Layout>
    <div class="p-6 space-y-6 max-w-6xl mx-auto">
      <!-- Search / Filter / Add -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by item name or category..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            v-model="selectedCategoryFilter"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            <option
              v-for="c in orderStore.categories"
              :key="c.id"
              :value="c.name"
            >
              {{ c.icon }} {{ c.name }}
            </option>
          </select>
          <button
            @click="openAddModal"
            class="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            + New Order
          </button>
        </div>
      </div>

      <!-- Today’s Orders -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Today’s Orders</h2>
          <div class="text-right">
            <p class="text-sm text-gray-600">
              Total Orders: {{ filteredOrders.length }}
            </p>
            <p class="text-lg font-bold text-green-600">
              {{ dailyTotal.toFixed(2) }} tk
            </p>
          </div>
        </div>

        <!-- NO-ORDER STATE -->
        <div
          v-if="filteredOrders.length === 0"
          class="text-center py-10 text-gray-500"
        >
          <p class="text-lg font-medium">No order added yet</p>
          <p class="text-sm">Click “+ New Order” to create the first one</p>
        </div>

        <!-- TABLE WHEN ORDERS EXIST -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
                  <tr class="border-b">
                    <th class="text-left py-3 px-4">Order #</th>
                    <th class="text-left py-3 px-4">Items</th>
                    <!-- <th class="text-left py-3 px-4">Item</th> -->
                      <th class="text-left py-3 px-4">Price</th>
                <th class="text-left py-3 px-4">Time</th>
                <th class="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-3 px-4 font-medium">#{{ order.id }}</td>
                <td class="py-3 px-4">
                  <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="text-sm"
                  >
                    {{ item.quantity }}× {{ item.name }}
                  </div>
                </td>
                <!-- <td class="py-3 px-4 text-sm text-gray-600">
                  {{ order.subcategory || '-' }}
                </td> -->
                <td class="py-3 px-4 font-semibold">
                  {{ order.total.toFixed(2) }} tk
                </td>
                <td class="py-3 px-4 text-sm text-gray-600">
                  {{ formatTime(order.createdAt) }}
                </td>
                <td class="py-3 px-4">
  <!-- Three-dot menu (floating) -->
  <div class="relative" @click.stop>
    <button
      @click="toggleDropdown(order.id)"
      :id="`drop-btn-${order.id}`"
      class="p-1 rounded hover:bg-gray-100 transition-colors"
    >
      <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </button>

    <!-- FLOATING DROPDOWN (position: fixed) -->
    <div
      v-if="openDropdown === order.id"
      class="fixed z-50 w-32 bg-white rounded-lg shadow-lg border py-1"
      :style="dropdownStyle(order.id)"
    >
      <button
        @click="editOrder(order); openDropdown = null"
        class="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Edit
      </button>
      <button
        @click="deleteOrder(order.id); openDropdown = null"
        class="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        Delete
      </button>
    </div>
  </div>
</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!--  SCROLLABLE  ORDER  FORM  MODAL  -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <div
          class="w-full max-w-2xl bg-white shadow-xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <!-- header (fixed) -->
          <div class="flex items-center justify-between p-6 border-b shrink-0">
            <h3 class="text-xl font-semibold">
              {{ editingOrder ? "Edit Order" : "Add New Order" }}
            </h3>
            <button
              @click="closeModal"
              class="text-2xl leading-none text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <!-- scrollable body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- category picker -->
            <div>
              <label class="block text-sm font-medium mb-2">Category</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="c in orderStore.categories"
                  :key="c.id"
                  type="button"
                  @click="selectModalCategory(c)"
                  :class="[
                    'p-3 border rounded-lg text-center transition-colors',
                    selectedCategory === c.name
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:bg-gray-50',
                  ]"
                >
                  <div class="text-2xl mb-1">{{ c.icon }}</div>
                  <div class="text-sm font-medium">{{ c.name }}</div>
                </button>
              </div>
            </div>

            <!-- item picker -->
            <!-- <div v-if="selectedCategory && orderStore.categories.find(c => c.name === selectedCategory)?.subcategories?.length" class="pt-4">
              <label class="block text-sm font-medium mb-2">Item</label>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="sc in orderStore.categories.find(c => c.name === selectedCategory).subcategories"
                  :key="typeof sc === 'string' ? sc : sc.name"
                  type="button"
                  @click="selectedItem = typeof sc === 'string' ? sc : sc.name"
                  :class="[
                    'px-3 py-1 border rounded-lg text-sm transition-colors',
                    selectedItem === (typeof sc === 'string' ? sc : sc.name) ? 'bg-orange-50 border-orange-500' : 'border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ typeof sc === 'string' ? sc : (sc.name + (sc.price ? ' (' + sc.price.toFixed(2) + 'tk)' : '')) }}
                </button>
              </div>
            </div> -->

            <!-- items (scrollable sub-section) -->
            <div v-if="selectedCategory">
              <label class="block text-sm font-medium mb-2">Items</label>
              <div class="space-y-3 max-h-[40vh] overflow-y-auto">
                <div
                  v-for="item in availableItems"
                  :key="item.id"
                  class="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p class="font-medium">{{ item.name }}</p>
                    <p class="text-sm text-gray-600">
                      {{ item.price.toFixed(2) }} tk
                    </p>
                  </div>
                  <div class="flex items-center space-x-3">
                    <button
                      type="button"
                      @click="decQty(item)"
                      class="w-8 h-8 rounded-full border hover:bg-gray-100 font-semibold"
                    >
                      -
                    </button>
                    <span class="w-8 text-center">{{ getQty(item) }}</span>
                    <button
                      type="button"
                      @click="incQty(item)"
                      class="w-8 h-8 rounded-full border hover:bg-gray-100 font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- summary -->
            <div v-if="selectedItems.length" class="p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium mb-2">Order Summary</h4>
              <div class="space-y-1 text-sm">
                <div
                  v-for="it in selectedItems"
                  :key="it.id"
                  class="flex justify-between"
                >
                  <span>{{ it.quantity }}× {{ it.name }}</span>
                  <span>{{ (it.quantity * it.price).toFixed(2) }} tk</span>
                </div>
                <div
                  class="border-t pt-2 mt-2 flex justify-between font-semibold"
                >
                  <span>Total:</span>
                  <span class="text-orange-600"
                    >{{ orderTotal.toFixed(2) }} tk</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- fixed footer -->
          <div class="flex justify-end space-x-3 p-6 border-t shrink-0">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!selectedItems.length"
              @click="editingOrder ? updateOrder() : submitOrder()"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 font-medium"
            >
              {{ editingOrder ? "Update Order" : "Place Order" }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Layout from "../components/layout/Layout.vue";
import { useOrderStore } from "../stores/orderStore";

/* ---------- Reactive State ---------- */
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedItem = ref("");
const showModal = ref(false);
const selectedDate = ref(null);
const selectedCategoryFilter = ref(""); // Added new filter variable

/* ---------- Edit State ---------- */
const editingOrder = ref(null);
const selectedEditId = ref(null);

/* ---------- Dropdown State ---------- */
const openDropdown = ref(null); // which row menu is open

const toggleDropdown = (orderId) => {
  openDropdown.value = openDropdown.value === orderId ? null : orderId;
};

// Close dropdown when clicking outside
document.addEventListener("click", () => {
  openDropdown.value = null;
});

const dropdownStyle = (orderId) => {
  if (openDropdown.value !== orderId) return {}
  const btn = document.getElementById(`drop-btn-${orderId}`)
  if (!btn) return {}
  const rect = btn.getBoundingClientRect()
  return {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`
  }
}
/* ---------- Store ---------- */
const orderStore = useOrderStore();

/* ---------- Computed ---------- */
const filteredOrders = computed(() => {
  let list = orderStore.todayOrders;
  if (searchQuery.value) list = orderStore.searchOrders(searchQuery.value);
  if (selectedCategoryFilter.value) // Updated to use selectedCategoryFilter
    list = list.filter((o) => o.category === selectedCategoryFilter.value);
  return list;
});

const dailyTotal = computed(() =>
  filteredOrders.value.reduce((sum, o) => sum + o.total, 0)
);

const availableItems = computed(() => {
  const cat = orderStore.categories.find((c) => c.name === selectedCategory.value); // Keep reading from modal selectedCategory
  if (!cat) return [];
  let list = orderStore.items.filter((i) => i.categoryId === cat.id);
  if (selectedItem.value) {
    list = list.filter((i) => i.subcategory === selectedItem.value);
  }
  return list;
});

// Watch for changes in items list and ensure selected item exists; if not, reset
watch(() => orderStore.items, () => {
  if (!selectedCategory.value) return
  const cat = orderStore.categories.find(c => c.name === selectedCategory.value)
  if (!cat) return
  const exists = orderStore.items.some(i => i.categoryId === cat.id && i.subcategory === selectedItem.value)
  if (!exists) {
    selectedItem.value = ''
  }
}, { deep: true })

const selectModalCategory = (cat) => {
  selectedCategory.value = cat.name
  // reset subcategory when switching categories
  selectedItem.value = ''
}

const selectedItems = ref([]);

const getQty = (item) =>
  selectedItems.value.find((i) => i.id === item.id)?.quantity || 0;

const incQty = (item) => {
  const existing = selectedItems.value.find((i) => i.id === item.id);
  if (existing) existing.quantity++;
  else selectedItems.value.push({ ...item, quantity: 1 });
};

const decQty = (item) => {
  const existing = selectedItems.value.find((i) => i.id === item.id);
  if (!existing) return;
  if (existing.quantity > 1) existing.quantity--;
  else
    selectedItems.value = selectedItems.value.filter((i) => i.id !== item.id);
};

const orderTotal = computed(() =>
  selectedItems.value.reduce((sum, it) => sum + it.quantity * it.price, 0)
);

/* ---------- Modal Functions ---------- */
const openAddModal = () => {
  editingOrder.value = null;
  selectedEditId.value = null;
  selectedCategoryFilter.value = ""; // Reset the filter variable
  selectedItem.value = "";
  selectedItems.value = [];
  showModal.value = true;
};

const editOrder = (order) => {
  selectedCategory.value = order.category;
  selectedItem.value = order.subcategory || '';
  selectedItems.value = order.items.map((it) => ({ ...it }));
  editingOrder.value = order;
  selectedEditId.value = order.id;
  showModal.value = true;
};

const updateOrder = () => {
  if (!selectedItems.value.length) return;
  const idx = orderStore.orders.findIndex((o) => o.id === selectedEditId.value);
  if (idx === -1) return;

  orderStore.orders[idx] = {
    ...editingOrder.value,
    category: selectedCategory.value,
    subcategory: selectedItem.value || null,
    items: selectedItems.value,
    total: orderTotal.value,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem("orders", JSON.stringify(orderStore.orders));
  closeModal();
};

const submitOrder = () => {
  if (!selectedItems.value.length) return;
  orderStore.addOrder({
    category: selectedCategory.value,
    subcategory: selectedItem.value || null,
    items: selectedItems.value,
    total: orderTotal.value,
  });
  closeModal();
};

const closeModal = () => {
  showModal.value = false;
  selectedCategoryFilter.value = ""; // Reset the filter variable
  selectedItems.value = [];
  editingOrder.value = null;
  selectedEditId.value = null;
};

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const deleteOrder = (id) => {
  if (confirm("Delete this order?")) {
    orderStore.orders = orderStore.orders.filter((o) => o.id !== id);
    localStorage.setItem("orders", JSON.stringify(orderStore.orders));
  }
};

const selectDate = (d) => {
  if (d) selectedDate.value = d;
};

/* ---------- Demo ---------- */
onMounted(() => {
  if (orderStore.orders.length === 0) {
    orderStore.addOrder({
      category: "Burger",
      items: [{ id: 1, name: "Classic Burger", quantity: 2, price: 5.99 }],
      total: 11.98,
    });
  }
});
</script>
