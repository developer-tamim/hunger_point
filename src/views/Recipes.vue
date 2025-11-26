<template>
  <Layout>
    <div class="max-w-6xl p-6 mx-auto space-y-6">
      <!-- Top Stat & Add Button -->
      <div
        class="flex items-center justify-between p-6 bg-white shadow-sm rounded-xl"
      >
        <div class="flex items-center space-x-3">
          <div>
            <!-- <p class="font-medium text-sm text-gray-600">Total Books: {{ recipeStore.recipes.length }}</p> -->
            <p
              class="font-medium text-base md:text-xl lg:text-2xl text-gray-600"
            >
              Total Recipes: {{ recipeStore.recipes.length }}
            </p>
          </div>
        </div>
        <button
          @click="openAddModal"
          class="px-6 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
        >
          + New Recipe
        </button>
      </div>

      <!-- Recipe Grid -->
      <div
        v-if="sortedRecipes.length > 0"
        class="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <div
          v-for="recipe in sortedRecipes"
          :key="recipe.id"
          @click="openDetailsModal(recipe)"
          class="relative p-6 transition-shadow bg-white shadow-sm cursor-pointer rounded-xl hover:shadow-md"
        >
          <div class="flex items-start justify-between">
            <h3 class="flex-1 pr-4 text-lg font-semibold">
              {{ recipe.title }}
            </h3>

            <!-- Three Dot Menu -->
            <div class="relative" @click.stop>
              <button
                @click="toggleMenu(recipe.id)"
                class="p-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showMenu === recipe.id"
                class="absolute right-0 z-10 w-32 py-1 mt-1 bg-white border rounded-lg shadow-lg"
              >
                <button
                  @click="editRecipe(recipe.id)"
                  class="flex items-center w-full px-3 py-2 space-x-2 text-sm text-left hover:bg-gray-100"
                >
                  <span>Edit</span>
                </button>
                <button
                  @click="deleteRecipe(recipe.id)"
                  class="flex items-center w-full px-3 py-2 space-x-2 text-sm text-left text-red-600 hover:bg-gray-100"
                >
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 mt-3">
            <span
              class="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full"
            >
              {{ recipe.category }}
            </span>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                recipe.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600',
              ]"
            >
              {{ recipe.isActive ? "Active" : "Archived" }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="py-12 text-center text-gray-500">
        No recipes yet. Create your first recipe!
      </div>
    </div>

    <!-- Add/Edit Recipe Modal -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div
        class="w-full max-w-2xl max-h-screen overflow-y-auto bg-white shadow-xl rounded-xl"
      >
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-xl font-semibold">
            {{ isEditMode ? "Edit Recipe" : "Add New Recipe" }}
          </h3>
          <button
            @click="closeFormModal"
            class="text-2xl leading-none text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div class="p-6">
          <form @submit.prevent="submitRecipe" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                v-model="form.title"
                type="text"
                placeholder="Recipe Title *"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <select
                v-model="form.category"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Category *</option>
                <option v-for="cat in recipeStore.recipeCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium"
                >Ingredients *</label
              >
              <textarea
                v-model="form.ingredients"
                rows="4"
                placeholder="One ingredient per line..."
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium"
                >Instructions *</label
              >
              <textarea
                v-model="form.steps"
                rows="6"
                placeholder="Step-by-step instructions..."
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>

            <div class="flex items-center justify-end space-x-3">
              <label class="flex items-center space-x-2 text-sm">
                <input
                  v-model="form.isActive"
                  type="checkbox"
                  class="rounded"
                />
                <span>Active Recipe</span>
              </label>
              <button
                type="submit"
                class="px-6 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
              >
                {{ isEditMode ? "Update" : "Save" }} Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Recipe Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div
        class="w-full max-w-3xl max-h-screen overflow-y-auto bg-white shadow-xl rounded-xl"
      >
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-xl font-semibold">{{ selectedRecipe.title }}</h3>
          <button
            @click="closeDetailsModal"
            class="text-2xl leading-none text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="flex items-center space-x-3">
            <span
              class="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full"
            >
              {{ selectedRecipe.category }}
            </span>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                selectedRecipe.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600',
              ]"
            >
              {{ selectedRecipe.isActive ? "Active" : "Archived" }}
            </span>
          </div>

          <div>
            <h4 class="mb-2 font-semibold text-gray-700">Ingredients:</h4>
            <p
              class="p-4 text-gray-600 whitespace-pre-line rounded-lg bg-gray-50"
            >
              {{ selectedRecipe.ingredients }}
            </p>
          </div>

          <div>
            <h4 class="mb-2 font-semibold text-gray-700">Instructions:</h4>
            <p
              class="p-4 text-gray-600 whitespace-pre-line rounded-lg bg-gray-50"
            >
              {{ selectedRecipe.steps }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Layout from "../components/layout/Layout.vue";
import { useRecipeStore } from "../stores/recipeStore";

const recipeStore = useRecipeStore();

// State
const form = ref({
  title: "",
  category: "",
  ingredients: "",
  steps: "",
  isActive: true,
});
const isEditMode = ref(false);
const editingId = ref(null);
const showFormModal = ref(false);
const showDetailsModal = ref(false);
const selectedRecipe = ref(null);
const showMenu = ref(null);

// Computed
const sortedRecipes = computed(() => {
  return [...recipeStore.recipes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
});

// Methods
const toggleMenu = (id) => {
  showMenu.value = showMenu.value === id ? null : id;
};

const openAddModal = () => {
  isEditMode.value = false;
  editingId.value = null;
  form.value = {
    title: "",
    category: "",
    ingredients: "",
    steps: "",
    isActive: true,
  };
  showFormModal.value = true;
};

const openDetailsModal = (recipe) => {
  selectedRecipe.value = recipe;
  showDetailsModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  resetForm();
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedRecipe.value = null;
};

const editRecipe = (id) => {
  const recipe = recipeStore.recipes.find((r) => r.id === id);
  if (recipe) {
    isEditMode.value = true;
    editingId.value = id;
    form.value = { ...recipe };
    showFormModal.value = true;
    showMenu.value = null;
  }
};

const deleteRecipe = (id) => {
  if (confirm("Delete this recipe?")) {
    recipeStore.deleteRecipe(id);
    showMenu.value = null;
  }
};

const submitRecipe = () => {
  if (isEditMode.value) {
    recipeStore.updateRecipe(editingId.value, form.value);
  } else {
    recipeStore.addRecipe(form.value);
  }
  closeFormModal();
};

const resetForm = () => {
  form.value = {
    title: "",
    category: "",
    ingredients: "",
    steps: "",
    isActive: true,
  };
  isEditMode.value = false;
  editingId.value = null;
};

// Sample data
onMounted(() => {
  if (recipeStore.recipes.length === 0) {
    recipeStore.addRecipe({
      title: "Classic Beef Burger",
      category: "Burger",
      ingredients:
        "• Ground beef 500g\n• Burger buns 4\n• Lettuce\n• Tomato\n• Onion\n• Cheese slices\n• Salt & Pepper",
      steps:
        "1. Form beef into 4 patties\n2. Season both sides\n3. Grill 4 mins each side\n4. Toast buns\n5. Assemble with toppings",
      isActive: true,
    });
  }
});
</script>
