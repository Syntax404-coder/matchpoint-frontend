<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
    <!-- Logo -->
    <div class="mb-8 p-4 bg-white/5 rounded-full backdrop-blur-md border border-white/10 shadow-lg animate-pulse">
      <img src="/icon.png" alt="MatchPoint Logo" class="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
    </div>

    <!-- Card -->
    <GlassCard class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-white text-center mb-2 tracking-wide">Welcome Back</h1>
      <p class="text-gray-400 text-center mb-8">Sign in to continue to MatchPoint</p>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <GlassInput
          v-model="email"
          label="Email"
          id="email"
          type="email"
          placeholder="Enter your email"
          required
        >
          <template #icon>
            <MailIcon class="w-5 h-5" />
          </template>
        </GlassInput>

        <!-- Password -->
        <GlassInput
          v-model="password"
          label="Password"
          id="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          required
        >
          <template #icon>
            <button type="button" @click="showPassword = !showPassword" class="focus:outline-none hover:text-white transition-colors cursor-pointer">
              <component :is="showPassword ? Eye : EyeOff" class="w-5 h-5" />
            </button>
          </template>
        </GlassInput>

        <!-- Submit -->
        <GlassButton type="submit" :disabled="loading" variant="primary">
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span v-else>Sign In</span>
        </GlassButton>

        <!-- Error -->
        <div v-if="error" class="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{{ error }}</span>
        </div>
      </form>

      <!-- Register Link -->
      <div class="mt-8 text-center text-gray-400 text-sm">
        Don't have an account? 
        <router-link to="/register" class="text-white font-semibold hover:text-cyan-400 transition-colors">
          Create an account
        </router-link>
      </div>
    </GlassCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { Eye, EyeOff, Mail as MailIcon, Loader2, AlertCircle } from 'lucide-vue-next'
import GlassCard from '../components/ui/GlassCard.vue'
import GlassInput from '../components/ui/GlassInput.vue'
import GlassButton from '../components/ui/GlassButton.vue'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref(null)

const LOGIN_USER = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user { id firstName role }
      errors
    }
  }
`

const { mutate: loginUser, loading } = useMutation(LOGIN_USER)

const handleLogin = async () => {
  error.value = null

  try {
    const { data } = await loginUser({
      input: { email: email.value, password: password.value }
    })

    if (data.loginUser.errors.length) {
      error.value = data.loginUser.errors.join(', ')
    } else {
      localStorage.setItem('token', data.loginUser.token)
      const userRole = data.loginUser.user?.role
      if (userRole === 'admin') {
        router.push('/admin')
      } else {
        const redirect = route.query.redirect || '/deck'
        router.push(redirect)
      }
    }
  } catch (e) {
    error.value = e.message
  }
}
</script>
