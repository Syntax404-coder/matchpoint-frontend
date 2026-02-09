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
    </div>

    <!-- Right Column: Form Side -->
    <div class="w-full md:w-2/5 lg:w-1/3 bg-black/80 backdrop-blur-3xl flex flex-col justify-center items-center px-6 py-8 overflow-y-auto">
      
      <!-- Mobile Logo -->
      <div class="md:hidden flex items-center gap-3 mb-6 flex-shrink-0">
        <img src="/icon.png" alt="MatchPoint" class="w-10 h-10 object-contain rounded-xl" />
        <span class="text-2xl text-white" style="font-family: 'Satisfy', cursive;">MatchPoint</span>
      </div>

      <!-- Card 1: Main Form -->
      <div class="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-6 mb-4 shadow-lg flex-shrink-0">
        <h1 class="text-2xl text-white text-center mb-1" style="font-family: 'Satisfy', cursive;">Create Account</h1>
        <p class="text-gray-400 text-center text-sm mb-5">Join MatchPoint today</p>

        <form @submit.prevent="handleRegister" class="space-y-3">
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-3">
            <input 
              v-model="form.firstName" 
              type="text" 
              placeholder="First Name" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
            />
            <input 
              v-model="form.lastName" 
              type="text" 
              placeholder="Last Name" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
            />
          </div>

          <!-- Email -->
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="Email" 
            required
            class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
          />

          <!-- Password Fields -->
          <div class="grid grid-cols-2 gap-3">
            <div class="relative">
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="Password" 
                required
                class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500 pr-10"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="Confirm" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
              :class="{'border-red-500': passwordMismatch}"
            />
          </div>
          <p v-if="passwordMismatch" class="text-red-400 text-xs">Passwords do not match</p>

          <!-- Birthdate & Gender -->
          <div class="grid grid-cols-2 gap-3">
            <input 
              v-model="form.birthdate" 
              type="date" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <select 
              v-model="form.gender" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="" disabled class="text-gray-500">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Gender Interest & Sexual Orientation -->
          <div class="grid grid-cols-2 gap-3">
            <select 
              v-model="form.genderInterest" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="" disabled>Interested in</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Both">Both</option>
            </select>
            <select 
              v-model="form.sexualOrientation" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="" disabled>Orientation</option>
              <option value="Straight">Straight</option>
              <option value="Bisexual">Bisexual</option>
              <option value="Gay">Gay</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Location: Country, Province, City -->
          <select 
            v-model="form.country" 
            required
            class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="" disabled>Country</option>
            <option value="Philippines">Philippines</option>
          </select>

          <div class="grid grid-cols-2 gap-3">
            <select 
              v-model="form.province" 
              required
              @change="onProvinceChange"
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="" disabled>Province</option>
              <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
            </select>
            <select 
              v-model="form.city" 
              required
              :disabled="!form.province"
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            >
              <option value="" disabled>City/Municipality</option>
              <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>

          <!-- Mobile & School -->
          <div class="grid grid-cols-2 gap-3">
            <input 
              v-model="form.mobile" 
              type="tel" 
              placeholder="Mobile" 
              required
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
            />
            <input 
              v-model="form.school" 
              type="text" 
              placeholder="School (optional)"
              class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
            />
          </div>

          <!-- Bio -->
          <textarea 
            v-model="form.bio" 
            placeholder="Bio (optional)" 
            rows="2"
            class="w-full bg-gray-900 text-white border border-gray-700 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500 resize-none"
          ></textarea>

          <!-- Create Account Button -->
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
            <span v-else>Create Account</span>
          </button>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{{ error }}</span>
          </div>
        </form>
      </div>

      <!-- Card 2: Login Link -->
      <div class="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-5 text-center shadow-lg flex-shrink-0">
        <p class="text-gray-400 text-sm">
          Already have an account? 
          <router-link to="/login" class="text-cyan-400 font-semibold hover:underline">
            Log in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { philippines as provinceCities } from '../data/philippines'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-vue-next'

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthdate: '',
  gender: '',
  genderInterest: '',
  sexualOrientation: '',
  country: '',
  province: '',
  city: '',
  mobile: '',
  school: '',
  bio: ''
})

const showPassword = ref(false)
const error = ref(null)

const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      token
      user { id firstName }
      errors
    }
  }
`

const { mutate: registerUser, loading } = useMutation(REGISTER_USER)

const provinces = Object.keys(provinceCities)

const availableCities = computed(() => {
  if (!form.value.province) return []
  return provinceCities[form.value.province] || []
})

const onProvinceChange = () => {
  form.value.city = ''
}

const passwordMismatch = computed(() => {
  return form.value.confirmPassword.length > 0 && form.value.password !== form.value.confirmPassword
})

const calculateAge = (birthdate) => {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const handleRegister = async () => {
  error.value = null

  // Age validation
  if (form.value.birthdate) {
    const age = calculateAge(form.value.birthdate)
    if (age < 18) {
      error.value = "You must be at least 18 years old to register"
      return
    }
  }

  // Password match
  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match"
    return
  }

  // Mobile validation
  if (!/^\+?\d{10,15}$/.test(form.value.mobile)) {
    error.value = "Mobile number must be 10-15 digits"
    return
  }

  try {
    const { data } = await registerUser({
      input: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        password: form.value.password,
        birthdate: form.value.birthdate,
        gender: form.value.gender,
        genderInterest: form.value.genderInterest,
        country: form.value.country,
        province: form.value.province,
        city: form.value.city,
        bio: form.value.bio,
        mobile: form.value.mobile,
        school: form.value.school,
        sexualOrientation: form.value.sexualOrientation
      }
    })

    if (data.registerUser.errors.length) {
      error.value = data.registerUser.errors.join(', ')
    } else {
      localStorage.setItem('token', data.registerUser.token)
      router.push('/upload-photos')
    }
  } catch (e) {
    error.value = e.message
  }
}
</script>