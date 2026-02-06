<template>
  <div class="register">
    <h1>Create Account</h1>

    <form @submit.prevent="handleRegister">
      <input v-model="form.firstName" placeholder="First Name" required />
      <input v-model="form.lastName" placeholder="Last Name" required />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model="form.password" type="password" placeholder="Password" required />

      <input v-model="form.birthdate" type="date" required />

      <select v-model="form.gender" required>
        <option value="" disabled hidden>Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <select v-model="form.genderInterest" required>
        <option value="" disabled hidden>Interested in</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Both">Both</option>
      </select>

      <select v-model="form.country" disabled>
        <option value="Philippines">Philippines</option>
      </select>
      <select v-model="form.province" required @change="onProvinceChange">
        <option value="" disabled hidden>Select Province</option>
        <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
      </select>

      <select v-model="form.city" required :disabled="!form.province">
        <option value="" disabled hidden>Select City</option>
        <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
      </select>
      <input v-model="form.mobile" type="tel" placeholder="Mobile Number" required />

      <input v-model="form.school" placeholder="School (optional)" />

      <select v-model="form.sexualOrientation" required>
        <option value="" disabled hidden>Sexual Orientation</option>
        <option value="Straight">Straight</option>
        <option value="Bisexual">Bisexual</option>
        <option value="Gay">Gay</option>
        <option value="Other">Other</option>
      </select>
      <textarea v-model="form.bio" placeholder="Bio (optional)"></textarea>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Register' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>

    <p>Already have an account? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  country: 'Philippines',
  password: '',
  birthdate: '',
  gender: '',
  genderInterest: '',
  province: '',
  city: '',
  bio: '',
  mobile: '',               
  school: '',               
  sexualOrientation: ''     
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

// Province to Cities mapping
const provinceCities = {
  'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong', 'San Juan', 'Pasay', 'Paranaque', 'Las Pinas', 'Muntinlupa', 'Caloocan', 'Malabon', 'Navotas', 'Valenzuela', 'Marikina'],
  'Cebu': ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Danao', 'Carcar', 'Toledo'],
  'Davao del Sur': ['Davao City', 'Digos', 'Bansalan', 'Hagonoy', 'Magsaysay'],
  'Bukidnon': ['Malaybalay', 'Valencia', 'Maramag', 'Don Carlos', 'Quezon'],
  'Pampanga': ['San Fernando', 'Angeles City', 'Mabalacat', 'Porac', 'Guagua'],
  'Laguna': ['Santa Rosa', 'Calamba', 'San Pedro', 'Binan', 'Cabuyao', 'Los Banos'],
  'Batangas': ['Batangas City', 'Lipa', 'Tanauan', 'Santo Tomas', 'Nasugbu'],
  'Cavite': ['Bacoor', 'Imus', 'Dasmarinas', 'General Trias', 'Cavite City', 'Tagaytay'],
  'Rizal': ['Antipolo', 'Cainta', 'Taytay', 'Angono', 'Binangonan'],
  'Bulacan': ['Malolos', 'Meycauayan', 'San Jose del Monte', 'Marilao', 'Bocaue'],
  'Iloilo': ['Iloilo City', 'Oton', 'Pavia', 'Santa Barbara', 'Leganes'],
  'Negros Occidental': ['Bacolod', 'Silay', 'Talisay', 'Victorias', 'Sagay']
}

const provinces = Object.keys(provinceCities)

const availableCities = computed(() => {
  if (!form.value.province) return []
  return provinceCities[form.value.province] || []
})

const onProvinceChange = () => {
  form.value.city = ''
}

// Calculate age from birthdate
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
        city: `${form.value.city}, ${form.value.province}`,
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
      if (data.registerUser.errors.length) {
        error.value = data.registerUser.errors.join(', ')
      } else {
        localStorage.setItem('token', data.registerUser.token)
        router.push('/upload-photos')  // ← Changed from '/deck'
      }
    }
  } catch (e) {
    error.value = e.message
  }
}
</script>

<style scoped>
.register {
  max-width: 480px;
  margin: 60px auto;
  padding: 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

h1 {
  margin: 0 0 32px 0;
  font-size: 32px;
  font-weight: 700;
  color: #3B82F6;
  text-align: center;
  letter-spacing: -0.5px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

input,
select,
textarea {
  padding: 14px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  color: #1a1a1a;
  transition: all 0.2s ease;
  font-family: inherit;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3B82F6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input::placeholder,
textarea::placeholder {
  color: #9e9e9e;
}

select {
  padding: 14px 44px 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
  background-size: 10px 6px;
  cursor: pointer;
}

textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

button {
  padding: 14px 24px;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 8px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

button:hover:not(:disabled) {
  background: #2563EB;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
}

button:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.error {
  color: #EF4444;
  background: #FEF2F2;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin: 0;
  border-left: 4px solid #EF4444;
}

.register>p {
  margin-top: 24px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.register>p a {
  color: #3B82F6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.register>p a:hover {
  color: #2563EB;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register {
    margin: 20px;
    padding: 32px 24px;
    border-radius: 12px;
  }

  h1 {
    font-size: 28px;
    margin-bottom: 24px;
  }

  form {
    gap: 14px;
  }
}
</style>