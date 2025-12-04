<template>
  <Layout>
    <div class="p-6 space-y-6 max-w-5xl mx-auto">
      
      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex flex-wrap space-x-1">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeTab === tab.id 
                ? 'bg-orange-600 text-white' 
                : 'hover:bg-gray-100'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="p-6 space-y-6 bg-white shadow-sm rounded-xl">
        <h2 class="text-xl font-semibold">My Profile</h2>
        
        <!-- Display Current Info -->
        <div class="space-y-4">
          <div class="p-4 rounded-lg bg-gray-50">
            <p class="text-sm text-gray-600">Name</p>
            <p class="text-lg font-medium">{{ authStore.user?.name || 'Not set' }}</p>
          </div>
          <div class="p-4 rounded-lg bg-gray-50">
            <p class="text-sm text-gray-600">Email</p>
            <p class="text-lg font-medium">{{ authStore.user?.email || 'Not set' }}</p>
          </div>
        </div>

        <!-- Update Button -->
        <button 
          @click="openProfileModal"
          class="px-6 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
        >
        Update Profile
        </button>

        <!-- Logout Button (MOVED HERE) -->
        <div class="flex items-center justify-between p-6 mt-8 rounded-lg bg-red-50">
          <div>
            <h3 class="font-semibold text-red-800">Logout</h3>
            <p class="text-sm text-red-600">Logout of your account</p>
          </div>
          <button 
            @click="logout"
            class="px-6 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
          Logout
          </button>
        </div>
      </div>

      <!-- Profile Update Modal -->
      <!-- <div v-if="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"> -->
      <div v-if="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="w-full max-w-md bg-white shadow-xl rounded-xl">
          <div class="flex items-center justify-between p-6 border-b">
            <h3 class="text-xl font-semibold">Update Profile</h3>
            <button @click="closeProfileModal" class="text-2xl leading-none text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          
          <form @submit.prevent="updateProfile" class="p-6 space-y-4">
            <div>
              <label class="block mb-1 text-sm font-medium">Name *</label>
              <input 
                v-model="profileForm.name"
                type="text" 
                placeholder="Enter your name"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div class="pt-4 border-t">
              <h4 class="mb-3 font-semibold">Change Password (Optional)</h4>
              <div class="space-y-3">
                <input 
                  v-model="passwordForm.currentPassword"
                  type="password" 
                  placeholder="Current Password"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input 
                  v-model="passwordForm.newPassword"
                  type="password" 
                  placeholder="New Password"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input 
                  v-model="passwordForm.confirmPassword"
                  type="password" 
                  placeholder="Confirm New Password"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div class="flex justify-end pt-4 space-x-3 border-t">
              <button @click="closeProfileModal" type="button"
                class="px-4 py-2 font-medium border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit"
                class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Order Categories Tab -->
      <div v-if="activeTab === 'order-cats'" class="p-6 space-y-4 bg-white shadow-sm rounded-xl">
        <div class="flex items-center justify-between">
          <h2 class="mb-4 text-xl font-semibold">Order Categories</h2>

          <!-- Add Category button placed under the list -->
        <div class="pt-4 flex justify-end">
          <button
            @click="openAddOrderModal"
            class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            Add Category
          </button>
        </div>
        </div>
        
        <div class="space-y-3 overflow-y-auto max-h-80">
          <div 
            v-for="cat in orderStore.categories" 
            :key="cat.id"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div>
              <div class="font-medium">{{ cat.name }}</div>
                <div class="text-sm text-gray-500">
                  <span v-if="cat.subcategories && cat.subcategories.length">Items: {{ cat.subcategories.map(sc => typeof sc === 'string' ? sc : sc.name + (sc.price ? ' (' + Number(sc.price).toFixed(2) + 'tk)' : '')).join(', ') }}</span>
                  <span v-if="typeof cat.price !== 'undefined'"> • Price: {{ cat.price }} tk</span>
                </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="startEdit('order', cat.id)"
                class="text-indigo-600 hover:text-indigo-800"
                title="Edit"
              >
                <font-awesome-icon icon="edit" class="w-4 h-4" />
              </button>
              <button 
                @click="confirmDeleteCategory('order', cat.id)"
                class="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <font-awesome-icon icon="trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Add modal triggered by the Add button (modal layout matches Orders.vue styling) -->
        <div v-if="showAddOrderModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
            <!-- header -->
            <div class="flex items-center justify-between p-6 border-b shrink-0">
              <h3 class="text-lg font-semibold">{{ isOrderEditing ? 'Edit Order Category' : 'Add Order Category' }}</h3>
              <button @click="closeAddOrderModal" class="text-2xl leading-none text-gray-500 hover:text-gray-700">×</button>
            </div>

            <!-- body (scrollable) -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              <form @submit.prevent="submitAddOrderCategory" class="space-y-4">
                <div>
                  <label class="block mb-1 text-sm font-medium">Category</label>
                  <input v-model="addOrderForm.name" type="text" required placeholder="Category name" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block mb-1 text-sm font-medium">Items (optional)</label>
                  <div class="grid grid-cols-2 gap-2">
                    <input v-model="addOrderForm.newItem" type="text" placeholder="Add an item" @keyup.enter.prevent="addItem()" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input v-model.number="addOrderForm.newItemPrice" type="number" step="00" min="0" placeholder="Price" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <div class="col-span-2 flex justify-end">
                      <button type="button" @click="addItem" class="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                    </div>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <template v-for="(it, idx) in addOrderForm.items" :key="idx">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                        <template v-if="editingItemIndex === idx">
                          <input v-model="editingItemDraft.name" class="px-2 py-1 rounded-l-md border focus:outline-none" placeholder="Item" />
                          <input v-model.number="editingItemDraft.price" type="number" class="w-20 px-2 py-1 border focus:outline-none" placeholder="Price" min="0" step="00" />
                          <button type="button" @click="saveItemEdit(idx)" class="ml-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Save</button>
                          <button type="button" @click="cancelItemEdit" class="ml-1 px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        </template>
                        <template v-else>
                          <span class="mr-2">{{ it.name }} <small class="text-xs text-gray-500">{{ it.price ? Number(it.price).toFixed(2) : '00' }} tk</small></span>
                          <button type="button" @click="startItemEdit(idx)" class="text-gray-500 hover:text-gray-700 ml-2">✎</button>
                          <button type="button" @click="removeItem(idx)" class="text-gray-500 hover:text-gray-700 ml-2">×</button>
                        </template>
                      </span>
                    </template>
                  </div>
                </div>
                <!-- <div>
                  <label class="block mb-1 text-sm font-medium">Price (optional)</label>
                  <input v-model.number="addOrderForm.price" type="number" step="00" placeholder="Price" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div> -->
              </form>
            </div>

            <!-- footer (fixed) -->
            <div class="flex justify-end space-x-3 p-6 border-t shrink-0">
              <button type="button" @click="closeAddOrderModal" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="button" @click="submitAddOrderCategory" class="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700">{{ isOrderEditing ? 'Update' : 'Save' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Categories Tab -->
      <div v-if="activeTab === 'expense-cats'" class="p-6 space-y-4 bg-white shadow-sm rounded-xl">
        <h2 class="mb-4 text-xl font-semibold">Expense Categories</h2>
        <form @submit.prevent="addCategory('expense')" class="flex gap-2 pt-4 border-t">
          <input 
            v-model="newExpenseCat"
            type="text" 
            placeholder="Add new category"
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            type="submit"
            class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            Add
          </button>
        </form>
        
        <div class="space-y-3 overflow-y-auto max-h-80">
          <div 
            v-for="cat in expenseStore.expenseCategories" 
            :key="cat"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <span class="font-medium">{{ cat }}</span>
            <div class="flex space-x-2">
              <button 
                @click="startEdit('expense', cat)"
                class="text-indigo-600 hover:text-indigo-800"
                title="Edit"
              >
                <font-awesome-icon icon="edit" class="w-4 h-4" />
              </button>
              <button 
                @click="confirmDeleteCategory('expense', cat)"
                class="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <font-awesome-icon icon="trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Categories Tab -->
      <div v-if="activeTab === 'recipe-cats'" class="p-6 space-y-4 bg-white shadow-sm rounded-xl">
        <h2 class="mb-4 text-xl font-semibold">Recipe Categories</h2>
        <form @submit.prevent="addCategory('recipe')" class="flex gap-2 pt-4 border-t">
          <input 
            v-model="newRecipeCat"
            type="text" 
            placeholder="Add new category"
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            type="submit"
            class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            Add
          </button>
        </form>
        
        <div class="space-y-3 overflow-y-auto max-h-80">
          <div 
            v-for="cat in recipeStore.recipeCategories" 
            :key="cat"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <span class="font-medium">{{ cat }}</span>
            <div class="flex space-x-2">
              <button 
                @click="startEdit('recipe', cat)"
                class="text-indigo-600 hover:text-indigo-800"
                title="Edit"
              >
                <font-awesome-icon icon="edit" class="w-4 h-4" />
              </button>
              <button 
                @click="confirmDeleteCategory('recipe', cat)"
                class="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <font-awesome-icon icon="trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Announcements Tab -->
    <div v-if="activeTab === 'announcements'" class="p-6 space-y-4 bg-white shadow-sm rounded-xl">
      <div class="flex items-center justify-between">
        <h2 class="mb-4 text-xl font-semibold">Notes & Announcements</h2>
        <div class="pt-4 flex justify-end">
          <button @click="openAddAnnouncementModal" class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700">Add Announcement</button>
        </div>
      </div>

      <div class="space-y-3">
        <div v-if="announcementStore.announcements.length === 0" class="text-sm text-gray-500">No announcements yet.</div>
        <div v-for="a in announcementStore.announcements" :key="a.id" class="p-3 border rounded-lg bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="mr-2">
              <div class="font-medium">{{ a.title }} <span v-if="a.pinned" class="text-xs text-orange-600">(Pinned)</span></div>
              <div class="text-sm text-gray-600">{{ a.body }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ new Date(a.createdAt).toLocaleString() }}</div>
            </div>
            <div class="flex items-center space-x-2">
              <button type="button" @click.stop.prevent="openEditAnnouncementModal(a.id)" class="text-indigo-600 hover:text-indigo-800">Edit</button>
              <button type="button" @click.stop.prevent="announcementStore.updateAnnouncement(a.id, { active: !a.active })" class="text-yellow-600 hover:text-yellow-800">{{ a.active ? 'Unpublish' : 'Set Active' }}</button>
              <button type="button" @click.stop.prevent="deleteAnnouncement(a.id)" class="text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Announcement Modal -->
      <div v-if="showAnnModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="w-full max-w-md bg-white shadow-xl rounded-xl">
          <div class="flex items-center justify-between p-6 border-b">
            <h3 class="text-lg font-semibold">{{ isAnnEditing ? 'Edit Announcement' : 'Add Announcement' }}</h3>
            <button @click="showAnnModal = false" class="text-2xl leading-none text-gray-500 hover:text-gray-700">×</button>
          </div>
          <form @submit.prevent="submitAnnouncement" class="p-6 space-y-4">
            <div>
              <label class="block mb-1 text-sm font-medium">Title *</label>
              <input v-model="annForm.title" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">Body *</label>
              <textarea v-model="annForm.body" rows="4" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required></textarea>
            </div>
            <div class="flex items-center space-x-3">
              <label class="flex items-center space-x-2 text-sm">
                <input v-model="annForm.active" type="checkbox" class="rounded" />
                <span>Active (show on dashboard)</span>
              </label>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" @click="showAnnModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" class="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700">{{ isAnnEditing ? 'Update' : 'Save' }}</button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal :visible="showDeleteAnnConfirm" title="Delete Announcement" message="Are you sure you want to delete this announcement? This action cannot be undone." @confirm="confirmDeleteAnnouncement" @cancel="cancelDeleteAnnouncement" />
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useOrderStore } from '../stores/orderStore'
import { useExpenseStore } from '../stores/expenseStore'
import { useRecipeStore } from '../stores/recipeStore'
import { useAnnouncementStore } from '../stores/announcementStore'
import { useRouter } from 'vue-router'
import Layout from '../components/layout/Layout.vue'
import ConfirmModal from '../components/ui/ConfirmModal.vue'

const authStore = useAuthStore()
const orderStore = useOrderStore()
const expenseStore = useExpenseStore()
const recipeStore = useRecipeStore()
const announcementStore = useAnnouncementStore()
const router = useRouter()

const activeTab = ref('profile')
const showProfileModal = ref(false)

const tabs = [
  { id: 'profile', name: 'Profile' },
  { id: 'order-cats', name: 'Order Categories' },
  { id: 'expense-cats', name: 'Expense Categories' },
  { id: 'recipe-cats', name: 'Recipe Categories' }
  ,{ id: 'announcements', name: 'Notes & Announcements' }
]

// Profile Modal State
const profileForm = ref({
  name: authStore.user?.name || ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const openProfileModal = () => {
  profileForm.value.name = authStore.user?.name || ''
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showProfileModal.value = true
}

const closeProfileModal = () => {
  showProfileModal.value = false
}

const updateProfile = () => {
  // Update name
  if (profileForm.value.name.trim()) {
    authStore.user.name = profileForm.value.name
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === authStore.user.id)
    if (userIndex > -1) {
      users[userIndex].name = profileForm.value.name
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }
  }

  // Update password
  if (passwordForm.value.currentPassword || passwordForm.value.newPassword) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.id === authStore.user.id)
    
    if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
      alert('Please fill all password fields')
      return
    }
    
    if (passwordForm.value.currentPassword !== user.password) {
      alert('Current password is incorrect')
      return
    }
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    
    user.password = passwordForm.value.newPassword
    localStorage.setItem('users', JSON.stringify(users))
    alert('Password updated successfully!')
  }

  alert('Profile updated successfully!')
  closeProfileModal()
}

// Categories
// old inline category input removed in favor of modal
const newExpenseCat = ref('')
const newRecipeCat = ref('')

// Add Order Modal state
const showAddOrderModal = ref(false)
const addOrderForm = ref({ name: '', items: [], newItem: '', newItemPrice: null, price: null })
const isOrderEditing = ref(false)
const editingOrderId = ref(null)

// Inline item editing state
const editingItemIndex = ref(null)
const editingItemDraft = ref({ name: '', price: null })

// Using recipe categories from recipeStore now
// const recipeCategories = ref(JSON.parse(localStorage.getItem('recipeCategories')) || ['Burger', 'Drinks', 'Snacks', 'Dessert', 'Other'])

const addCategory = (type) => {
  const value = type === 'expense' ? newExpenseCat.value : newRecipeCat.value
  
  if (!value || !value.trim()) return
  if (type === 'expense') {
    expenseStore.addCategory(value)
    newExpenseCat.value = ''
  } else if (type === 'recipe') {
    recipeStore.addCategory(value)
    newRecipeCat.value = ''
  }
}

const openAddOrderModal = () => {
  isOrderEditing.value = false
  editingOrderId.value = null
  addOrderForm.value = { name: '', items: [], newItem: '', newItemPrice: null, price: null }
  editingItemIndex.value = null
  editingItemDraft.value = { name: '', price: null }
  showAddOrderModal.value = true
}

const openOrderEditModal = (id) => {
  const cat = orderStore.categories.find(c => c.id === id)
  if (!cat) return
  isOrderEditing.value = true
  editingOrderId.value = id
  addOrderForm.value = { name: cat.name, items: cat.subcategories ? cat.subcategories.map(sc => (typeof sc === 'string' ? { name: sc, price: null } : { ...sc })) : [], newItem: '', newItemPrice: null, price: cat.price || null }
  editingItemIndex.value = null
  editingItemDraft.value = { name: '', price: null }
  showAddOrderModal.value = true
}

const closeAddOrderModal = () => {
  showAddOrderModal.value = false
  editingItemIndex.value = null
  editingItemDraft.value = { name: '', price: null }
}

const submitAddOrderCategory = () => {
  if (!addOrderForm.value.name || !addOrderForm.value.name.trim()) return
  const name = addOrderForm.value.name.trim()
  const items = (addOrderForm.value.items || []).map(it => ({ name: it.name, price: it.price !== undefined ? Number(it.price) : 0 }))
  const price = addOrderForm.value.price || 0
  if (isOrderEditing.value && editingOrderId.value) {
    orderStore.updateCategory(editingOrderId.value, { name, subcategories: items, price })
  } else {
    const newCat = orderStore.addCategory(name, '🍔', items, price)
    // make sure store items are synced inside addCategory
  }
  closeAddOrderModal()
}

const addItem = () => {
  if (editingItemIndex.value !== null) {
    alert('Please save or cancel the current edit first')
    return
  }
  const v = (addOrderForm.value.newItem || '').trim()
  const p = addOrderForm.value.newItemPrice !== null && addOrderForm.value.newItemPrice !== undefined ? Number(addOrderForm.value.newItemPrice) : 0
  if (!v) return
  // prevent duplicates by name
  if (!addOrderForm.value.items.some(it => it.name.toLowerCase() === v.toLowerCase())) {
    addOrderForm.value.items.push({ name: v, price: p })
  }
  addOrderForm.value.newItem = ''
  addOrderForm.value.newItemPrice = null
}

const removeItem = (idx) => {
  addOrderForm.value.items.splice(idx, 1)
  // adjust editing index if needed
  if (editingItemIndex.value === idx) {
    editingItemIndex.value = null
    editingItemDraft.value = { name: '', price: null }
  } else if (editingItemIndex.value > idx) {
    editingItemIndex.value = editingItemIndex.value - 1
  }
}

const startItemEdit = (idx) => {
  if (editingItemIndex.value !== null && editingItemIndex.value !== idx) {
    // require the user to save/cancel the other edit first
    alert('Please save or cancel your current edit first')
    return
  }
  const target = addOrderForm.value.items[idx]
  if (!target) return
  editingItemIndex.value = idx
  // clone the item to edit
  editingItemDraft.value = { name: target.name, price: target.price }
}

const saveItemEdit = (idx) => {
  const name = (editingItemDraft.value.name || '').trim()
  if (!name) {
    alert('Item name cannot be empty')
    return
  }
  const price = editingItemDraft.value.price !== undefined && editingItemDraft.value.price !== null ? Number(editingItemDraft.value.price) : 0
  if (isNaN(price) || price < 0) {
    alert('Price must be a positive number')
    return
  }
  // prevent duplicates (case-insensitive) except for current item
  const isDup = addOrderForm.value.items.some((it, i) => i !== idx && it.name.toLowerCase() === name.toLowerCase())
  if (isDup) {
    alert('An item with that name already exists')
    return
  }
  addOrderForm.value.items.splice(idx, 1, { name, price })
  editingItemIndex.value = null
  editingItemDraft.value = { name: '', price: null }
}

const cancelItemEdit = () => {
  editingItemIndex.value = null
  editingItemDraft.value = { name: '', price: null }
}

const startEdit = (type, id) => {
  if (type === 'order') {
    return openOrderEditModal(id)
  }
  const newName = prompt('Edit category name:')
  if (newName && newName.trim()) {
    if (type === 'expense') {
      expenseStore.updateCategory(id, newName)
    } else {
      recipeStore.updateCategory(id, newName)
    }
  }
}

const showDeleteCatConfirm = ref(false)
const deleteCatTarget = ref(null) // { type, id }

const confirmDeleteCategory = (type, id) => {
  deleteCatTarget.value = { type, id }
  showDeleteCatConfirm.value = true
}

const handleDeleteCategory = () => {
  if (!deleteCatTarget.value) return
  const { type, id } = deleteCatTarget.value
  if (type === 'order')
    orderStore.deleteCategory(id)
  else if (type === 'expense')
    expenseStore.deleteCategory(id)
  else if (type === 'recipe')
    recipeStore.deleteCategory(id)
  deleteCatTarget.value = null
  showDeleteCatConfirm.value = false
}

const logout = () => {
  if (confirm('Logout?')) {
    authStore.logout()
    router.push('/login')
  }
}

// Announcements state
const showAnnModal = ref(false)
const isAnnEditing = ref(false)
const editingAnnId = ref(null)
const annForm = ref({ title: '', body: '', pinned: false, active: false })
const showDeleteAnnConfirm = ref(false)
const pendingDeleteAnnId = ref(null)

const openAddAnnouncementModal = () => {
  isAnnEditing.value = false
  editingAnnId.value = null
  annForm.value = { title: '', body: '', pinned: false, active: false }
  showAnnModal.value = true
}

const openEditAnnouncementModal = (id) => {
  const a = announcementStore.announcements.find(s => s.id === id)
  if (!a) return
  isAnnEditing.value = true
  editingAnnId.value = id
  annForm.value = { title: a.title, body: a.body, pinned: !!a.pinned, active: !!a.active }
  showAnnModal.value = true
}

const submitAnnouncement = () => {
  const title = (annForm.value.title || '').trim()
  const body = (annForm.value.body || '').trim()
  if (!title || !body) return alert('Title and body are required')
  if (isAnnEditing.value && editingAnnId.value) {
    announcementStore.updateAnnouncement(editingAnnId.value, { title, body, pinned: !!annForm.value.pinned, active: !!annForm.value.active })
  } else {
    announcementStore.addAnnouncement({ title, body, pinned: !!annForm.value.pinned, active: !!annForm.value.active })
  }
  showAnnModal.value = false
}

const deleteAnnouncement = (id) => {
  pendingDeleteAnnId.value = id
  showDeleteAnnConfirm.value = true
}

const confirmDeleteAnnouncement = () => {
  
  if (!pendingDeleteAnnId.value) return
  announcementStore.deleteAnnouncement(pendingDeleteAnnId.value)
  pendingDeleteAnnId.value = null
  showDeleteAnnConfirm.value = false
}

const cancelDeleteAnnouncement = () => {
  pendingDeleteAnnId.value = null
  showDeleteAnnConfirm.value = false
}
</script>

      <ConfirmModal :visible="showDeleteAnnConfirm" title="Delete Announcement" message="Are you sure you want to delete this announcement? This action cannot be undone." @confirm="confirmDeleteAnnouncement" @cancel="cancelDeleteAnnouncement" />
      <ConfirmModal :visible="showDeleteCatConfirm" title="Delete Category" message="Are you sure you want to delete this category? This action cannot be undone." @confirm="handleDeleteCategory" @cancel="showDeleteCatConfirm = false" />