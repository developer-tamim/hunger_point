import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref(JSON.parse(localStorage.getItem('expenses')) || [])
  
  const expenseCategories = ref(JSON.parse(localStorage.getItem('expenseCategories')) || [
    'Ingredients', 'Gas', 'Rent', 'Utilities', 'Other'
  ])

  const totalExpenses = computed(() => {
    return expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
  })

  const todayExpenses = computed(() => {
    const today = new Date().toDateString()
    return [...expenses.value]
      .filter(expense => new Date(expense.date).toDateString() === today)
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
  })

  const addExpense = (expenseData) => {
    const expense = {
      id: Date.now(),
      ...expenseData,
      // keep the provided date (YYYY-MM-DD) for display/filtering, but
      // always attach a full timestamp for ordering and uniqueness
      date: expenseData.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    expenses.value.push(expense)
    localStorage.setItem('expenses', JSON.stringify(expenses.value))
  }

  const updateExpense = (id, updates) => {
    const index = expenses.value.findIndex(e => e.id === id)
    if (index !== -1) {
      expenses.value[index] = { ...expenses.value[index], ...updates }
      localStorage.setItem('expenses', JSON.stringify(expenses.value))
    }
  }

  const deleteExpense = (id) => {
    expenses.value = expenses.value.filter(e => e.id !== id)
    localStorage.setItem('expenses', JSON.stringify(expenses.value))
  }

  // Category CRUD
  const addCategory = (name) => {
    expenseCategories.value.push(name)
    localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories.value))
  }

  const updateCategory = (oldName, newName) => {
    const index = expenseCategories.value.indexOf(oldName)
    if (index > -1) {
      expenseCategories.value[index] = newName
      localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories.value))
    }
  }

  const deleteCategory = (name) => {
    expenseCategories.value = expenseCategories.value.filter(c => c !== name)
    localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories.value))
  }

  const getExpensesByDateRange = (startDate, endDate) => {
    return expenses.value.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
    })
  }

  return {
    expenses,
    expenseCategories,
    totalExpenses,
    todayExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    getExpensesByDateRange
  }
}, { persist: true })