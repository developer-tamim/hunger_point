<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
      <div class="mb-8 flex justify-center items-center">
        <img :src="logoUrl" alt="Hunger Point" class="object-contain w-auto h-[100px] mx-auto" />
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" v-if="authMode === 'login'">
        <div class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium">Email</label>
            <input 
              v-model="loginForm.email"
              type="email" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="admin@hungerpoint.com"
              required
            />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Password</label>
            <input 
              v-model="loginForm.password"
              type="password" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="admin123"
              required
            />
          </div>
        </div>
        
        <button 
          type="submit"
          class="w-full py-2 mt-6 font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
        >
          Sign In
        </button>

        <p class="mt-4 text-sm text-center text-gray-600">
          Don't have an account? 
          <button @click="authMode = 'signup'" class="text-orange-600 hover:underline">
            Sign Up
          </button>
        </p>
      </form>

      <!-- Signup Form -->
      <form @submit.prevent="handleSignup" v-else>
        <div class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium">Name</label>
            <input 
              v-model="signupForm.name"
              type="text" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Email</label>
            <input 
              v-model="signupForm.email"
              type="email" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Password</label>
            <input 
              v-model="signupForm.password"
              type="password" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
        </div>
        
        <button 
          type="submit"
          class="w-full py-2 mt-6 font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
        >
          Sign Up
        </button>

        <p class="mt-4 text-sm text-center text-gray-600">
          Already have an account? 
          <button @click="authMode = 'login'" class="text-orange-600 hover:underline">
            Sign In
          </button>
        </p>
      </form>

      <div v-if="errorMessage" class="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import logoUrl from '../assets/hunger_point.png' 

const authStore = useAuthStore()
const router = useRouter()

const authMode = ref('login')
const errorMessage = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  name: '',
  email: '',
  password: ''
})

const handleLogin = async () => {
  const success = await authStore.login(loginForm.value.email, loginForm.value.password)
  if (success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = 'Invalid credentials. Try admin@hungerpoint.com / admin123'
  }
}

const handleSignup = async () => {
  await authStore.signup(signupForm.value)
  authMode.value = 'login'
  loginForm.value.email = signupForm.value.email
  loginForm.value.password = ''
}
</script>