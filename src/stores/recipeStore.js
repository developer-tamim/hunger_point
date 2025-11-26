import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipeStore = defineStore('recipes', () => {
  const recipes = ref(JSON.parse(localStorage.getItem('recipes')) || [])
  const recipeCategories = ref(JSON.parse(localStorage.getItem('recipeCategories')) || ['Burger', 'Drinks', 'Snacks', 'Dessert', 'Other'])

  const addRecipe = (recipeData) => {
    const recipe = {
      id: Date.now(),
      ...recipeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    recipes.value.push(recipe)
    localStorage.setItem('recipes', JSON.stringify(recipes.value))
  }

  const updateRecipe = (id, updates) => {
    const index = recipes.value.findIndex(r => r.id === id)
    if (index !== -1) {
      recipes.value[index] = { 
        ...recipes.value[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem('recipes', JSON.stringify(recipes.value))
    }
  }

  const deleteRecipe = (id) => {
    recipes.value = recipes.value.filter(r => r.id !== id)
    localStorage.setItem('recipes', JSON.stringify(recipes.value))
  }

  // Category CRUD
  const addCategory = (name) => {
    recipeCategories.value.push(name)
    localStorage.setItem('recipeCategories', JSON.stringify(recipeCategories.value))
  }

  const updateCategory = (oldName, newName) => {
    const index = recipeCategories.value.indexOf(oldName)
    if (index > -1) {
      recipeCategories.value[index] = newName
      localStorage.setItem('recipeCategories', JSON.stringify(recipeCategories.value))
    }
  }

  const deleteCategory = (name) => {
    recipeCategories.value = recipeCategories.value.filter(c => c !== name)
    localStorage.setItem('recipeCategories', JSON.stringify(recipeCategories.value))
  }

  return {
    recipes,
    recipeCategories,
    addRecipe,
    updateRecipe,
    deleteRecipe
    ,addCategory,updateCategory,deleteCategory
  }
}, { persist: true })