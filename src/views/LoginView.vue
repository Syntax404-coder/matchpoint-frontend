<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Left Column: Gradient Background with Logo -->
    <div class="hidden md:flex md:w-3/5 lg:w-2/3 relative bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <!-- Logo - Top Left -->
      <div class="absolute top-8 left-12 flex items-center gap-3">
        <img src="/icon.png" alt="MatchPoint" class="w-12 h-12 object-contain drop-shadow-lg rounded-xl" />
        <span class="text-3xl text-white" style="font-family: 'Satisfy', cursive;">MatchPoint</span>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <!-- Phone Mockup -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src="/phone-mockup.png" alt="" class="w-[400px] h-auto drop-shadow-2xl opacity-90 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500" />
      </div>
    </div>

    <!-- Right Column: Form Side -->
    <div class="w-full md:w-2/5 lg:w-1/3 bg-black/80 backdrop-blur-3xl flex flex-col justify-center items-center px-8">
      
      <!-- Mobile Logo (shown only on small screens) -->
      <div class="md:hidden flex items-center gap-3 mb-8">
        <img src="/icon.png" alt="MatchPoint" class="w-10 h-10 object-contain rounded-xl" />
        <span class="text-2xl text-white" style="font-family: 'Satisfy', cursive;">MatchPoint</span>
      </div>

      <!-- Card 1: Main Form -->
      <div class="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-8 mb-4 shadow-lg">
        <h1 class="text-3xl text-white text-center mb-2" style="font-family: 'Satisfy', cursive;">Welcome Back</h1>
        <p class="text-gray-400 text-center text-sm mb-6">Sign in to continue</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <input 
              v-model="email" 
              type="email" 
              placeholder="Email" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
            />
          </div>

          <!-- Password -->
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Password" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500 pr-12"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>

          <!-- Sign In Button -->
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
            <span v-else>Sign In</span>
          </button>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{{ error }}</span>
          </div>
        </form>
      </div>

      <!-- Card 2: Sign Up Link -->
      <div class="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-6 text-center shadow-lg">
        <p class="text-gray-400 text-sm">
          Don't have an account? 
          <router-link to="/register" class="text-cyan-400 font-semibold hover:underline" style="font-family: 'Satisfy', cursive;">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-vue-next'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref(null)

const LOGIN_USER = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user { id role firstName }
      errors
    }
  }
`

const { mutate: loginUser, loading } = useMutation(LOGIN_USER)

const handleLogin = async () => {
  error.value = null

  try {
    const { data } = await loginUser({
      input: {
        email: email.value,
        password: password.value
      }
    })

    if (data.loginUser.errors.length) {
      error.value = data.loginUser.errors.join(', ')
    } else {
      localStorage.setItem('token', data.loginUser.token)
      
      if (data.loginUser.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/deck')
      }
    }
  } catch (e) {
    error.value = e.message
  }
}
</script>
