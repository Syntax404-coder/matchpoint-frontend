<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 py-12">
    <!-- Card -->
    <GlassCard class="w-full max-w-2xl">
      <h1 class="text-3xl font-bold text-white text-center mb-2 tracking-wide">Create Account</h1>
      <p class="text-gray-400 text-center mb-8">Join MatchPoint today</p>

      <form @submit.prevent="handleRegister" class="space-y-6">
        
        <!-- Name Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput v-model="form.firstName" label="First Name" placeholder="First Name" required />
          <GlassInput v-model="form.lastName" label="Last Name" placeholder="Last Name" required />
        </div>

        <GlassInput v-model="form.email" label="Email" type="email" placeholder="Email Address" required />

        <!-- Password Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput v-model="form.password" label="Password" type="password" placeholder="Password" required />
          <GlassInput v-model="form.confirmPassword" label="Confirm Password" type="password" placeholder="Confirm Password" required :class="{'ring-2 ring-red-500/50': passwordMismatch}" />
        </div>
        <p v-if="passwordMismatch" class="text-red-400 text-xs mt-1">Passwords do not match</p>

        <!-- Birthdate & Gender -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput v-model="form.birthdate" label="Birthdate" type="date" required />
          <GlassSelect v-model="form.gender" label="Gender" required>
            <option value="" disabled class="text-gray-500">Select Gender</option>
            <option value="Male" class="text-black">Male</option>
            <option value="Female" class="text-black">Female</option>
            <option value="Other" class="text-black">Other</option>
          </GlassSelect>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassSelect v-model="form.genderInterest" label="Interested in" required>
            <option value="" disabled>Interested in</option>
            <option value="Male" class="text-black">Male</option>
            <option value="Female" class="text-black">Female</option>
            <option value="Both" class="text-black">Both</option>
          </GlassSelect>
          <GlassSelect v-model="form.sexualOrientation" label="Sexual Orientation" required>
            <option value="" disabled>Sexual Orientation</option>
            <option value="Straight" class="text-black">Straight</option>
            <option value="Bisexual" class="text-black">Bisexual</option>
            <option value="Gay" class="text-black">Gay</option>
            <option value="Other" class="text-black">Other</option>
          </GlassSelect>
        </div>

        <!-- Location -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassSelect v-model="form.country" label="Country" required>
            <option value="" disabled>Country</option>
            <option value="Philippines" class="text-black">Philippines</option>
          </GlassSelect>
          <GlassSelect v-model="form.province" label="Province" required @change="onProvinceChange">
            <option value="" disabled>Select Province</option>
            <option v-for="prov in provinces" :key="prov" :value="prov" class="text-black">{{ prov }}</option>
          </GlassSelect>
          <GlassSelect v-model="form.city" label="City" required :disabled="!form.province">
            <option value="" disabled>City / Municipality</option>
            <option v-for="city in availableCities" :key="city" :value="city" class="text-black">{{ city }}</option>
          </GlassSelect>
        </div>

        <!-- Contact & School -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput v-model="form.mobile" label="Mobile Number" type="tel" placeholder="+63 900 000 0000" required />
          <GlassInput v-model="form.school" label="School" placeholder="School (optional)" />
        </div>

        <GlassTextarea v-model="form.bio" label="Bio" placeholder="Tell us about yourself..." />

        <!-- Submit -->
        <GlassButton type="submit" :disabled="loading" variant="primary">
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span v-else>Create Account</span>
        </GlassButton>

        <!-- Error -->
        <div v-if="error" class="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{{ error }}</span>
        </div>
      </form>

      <!-- Login Link -->
      <div class="mt-8 text-center text-gray-400 text-sm">
        Already have an account? 
        <router-link to="/login" class="text-white font-semibold hover:text-cyan-400 transition-colors">
          Log in
        </router-link>
      </div>
    </GlassCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { philippines as provinceCities } from '../data/philippines'
import { Loader2, AlertCircle } from 'lucide-vue-next'
import GlassCard from '../components/ui/GlassCard.vue'
import GlassInput from '../components/ui/GlassInput.vue'
import GlassSelect from '../components/ui/GlassSelect.vue'
import GlassTextarea from '../components/ui/GlassTextarea.vue'
import GlassButton from '../components/ui/GlassButton.vue'

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  password: '',
  birthdate: '',
  gender: '',
  genderInterest: '',
  province: '',
  city: '',
  bio: '',
  mobile: '',               
  school: '',               
  sexualOrientation: '',
  confirmPassword: ''     
})

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

  // Age validation - must be 18 or older
  if (form.value.birthdate) {
    const age = calculateAge(form.value.birthdate)
    if (age < 18) {
      error.value = "You must be at least 18 years old to register"
      return
    }
  }

  // Password match validation
  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match"
    return
  }

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