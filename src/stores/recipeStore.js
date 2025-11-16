import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipeStore = defineStore('recipes', () => {
  const recipes = ref(JSON.parse(localStorage.getItem('recipes')) || [])

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

  return {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe
  }
}, { persist: true })