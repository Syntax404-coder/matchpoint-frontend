<template>
  <div class="min-h-screen p-6 pb-20 relative z-10">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
            <LayoutDashboard class="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white tracking-wide">Admin Dashboard</h1>
            <p class="text-gray-400 text-sm">Manage users and view statistics</p>
          </div>
        </div>
        <button 
          @click="logout" 
          class="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium group"
        >
          <LogOut class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center p-12">
        <Loader2 class="w-12 h-12 text-white/20 animate-spin" />
      </div>

      <!-- Dashboard Content -->
      <div v-else-if="stats" class="space-y-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard class="relative overflow-hidden group">
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-400 font-medium">Total Users</h3>
                <Users class="w-6 h-6 text-blue-400" />
              </div>
              <p class="text-4xl font-bold text-white mb-1">{{ stats.totalUsers }}</p>
              <span class="text-sm text-gray-500">Registered accounts</span>
            </div>
          </GlassCard>

          <GlassCard class="relative overflow-hidden group">
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/30 transition-colors"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-400 font-medium">Total Matches</h3>
                <Heart class="w-6 h-6 text-green-400" />
              </div>
              <p class="text-4xl font-bold text-white mb-1">{{ stats.totalMatches }}</p>
              <span class="text-sm text-gray-500">Successful matches</span>
            </div>
          </GlassCard>

          <GlassCard class="relative overflow-hidden group">
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-colors"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-400 font-medium">Total Swipes</h3>
                <Activity class="w-6 h-6 text-purple-400" />
              </div>
              <p class="text-4xl font-bold text-white mb-1">{{ stats.totalSwipes }}</p>
              <span class="text-sm text-gray-500">User interactions</span>
            </div>
          </GlassCard>

          <GlassCard class="relative overflow-hidden group">
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-colors"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-400 font-medium">Messages</h3>
                <MessageCircle class="w-6 h-6 text-orange-400" />
              </div>
              <p class="text-4xl font-bold text-white mb-1">{{ stats.totalMessages }}</p>
              <span class="text-sm text-gray-500">Messages sent</span>
            </div>
          </GlassCard>
        </div>

        <!-- Popular Users -->
        <GlassCard>
          <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Star class="w-5 h-5 text-yellow-400 fill-current" />
            Most Popular Users
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-gray-400 text-sm border-b border-white/10">
                  <th class="py-4 px-4 font-medium">User</th>
                  <th class="py-4 px-4 font-medium">Likes Received</th>
                  <th class="py-4 px-4 font-medium">Matches</th>
                </tr>
              </thead>
              <tbody class="text-gray-200">
                <tr v-for="item in stats.popularUsers" :key="item.user.id" class="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td class="py-4 px-4 font-medium text-white">{{ item.user.firstName }}</td>
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-2">
                      <div class="w-full max-w-[100px] h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-pink-500 to-rose-500" :style="{ width: Math.min(item.likesReceived * 2, 100) + '%' }"></div>
                      </div>
                      <span class="text-sm">{{ item.likesReceived }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4">{{ item.matchesCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>

        <!-- All Users Table -->
        <GlassCard>
          <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users class="w-5 h-5 text-cyan-400" />
            User Management
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-gray-400 text-sm border-b border-white/10">
                  <th class="py-4 px-4 font-medium">Name</th>
                  <th class="py-4 px-4 font-medium">Email</th>
                  <th class="py-4 px-4 font-medium">Location</th>
                  <th class="py-4 px-4 font-medium">Matches</th>
                  <th class="py-4 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="text-gray-200">
                <tr v-for="user in users" :key="user.id" class="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td class="py-4 px-4 font-medium text-white">{{ user.firstName }} {{ user.lastName }}</td>
                  <td class="py-4 px-4 text-gray-400">{{ user.email }}</td>
                  <td class="py-4 px-4">{{ user.province }}</td>
                  <td class="py-4 px-4">
                    <span class="px-2 py-1 bg-white/10 rounded-lg text-xs font-bold">{{ user.matchesCount }}</span>
                  </td>
                  <td class="py-4 px-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="viewMatches(user.id)" class="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors" title="View Matches">
                        <Eye class="w-5 h-5" />
                      </button>
                      <button @click="openUpdateModal(user)" class="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit User">
                        <Edit2 class="w-5 h-5" />
                      </button>
                      <button @click="deleteUser(user.id)" class="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete User">
                        <Trash2 class="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <!-- Matches Modal -->
      <transition name="modal">
        <div v-if="showMatchesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click="closeMatchesModal">
          <GlassCard class="w-full max-w-2xl max-h-[80vh] flex flex-col" @click.stop>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">Matches for {{ selectedUserName }}</h2>
              <button @click="closeMatchesModal" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X class="w-6 h-6" />
              </button>
            </div>

            <div v-if="loadingMatches" class="flex justify-center p-8">
              <Loader2 class="w-8 h-8 text-white/20 animate-spin" />
            </div>

            <div v-else-if="userMatches.length === 0" class="text-center p-8 text-gray-400">
              No matches found for this user.
            </div>

            <div v-else class="overflow-y-auto flex-1">
              <table class="w-full text-left">
                <thead class="sticky top-0 bg-gray-900/90 backdrop-blur-sm z-10">
                  <tr class="text-gray-400 text-sm border-b border-white/10">
                    <th class="py-3 px-4">Matched With</th>
                    <th class="py-3 px-4">Email</th>
                    <th class="py-3 px-4">City</th>
                    <th class="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody class="text-gray-200">
                  <tr v-for="match in userMatches" :key="match.id" class="border-b border-white/5">
                    <td class="py-3 px-4 font-medium bg-black/50">{{ getOtherUser(match).firstName }} {{ getOtherUser(match).lastName }}</td>
                    <td class="py-3 px-4 text-sm">{{ getOtherUser(match).email }}</td>
                    <td class="py-3 px-4 text-sm">{{ getOtherUser(match).city }}</td>
                    <td class="py-3 px-4 text-sm whitespace-nowrap">{{ formatDate(match.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </transition>

      <!-- Update User Modal -->
      <transition name="modal">
        <div v-if="showUpdateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click="closeUpdateModal">
          <GlassCard class="w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">Edit User</h2>
              <button @click="closeUpdateModal" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X class="w-6 h-6" />
              </button>
            </div>

            <form @submit.prevent="updateUser" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <GlassInput v-model="updateForm.firstName" label="First Name" required />
                <GlassInput v-model="updateForm.lastName" label="Last Name" required />
              </div>
              
              <GlassInput v-model="updateForm.email" label="Email" type="email" required />
              
              <div class="grid grid-cols-2 gap-4">
                <GlassSelect v-model="updateForm.province" label="Province" required @change="onProvinceChange">
                  <option value="" disabled>Select Province</option>
                  <option v-for="prov in provinces" :key="prov" :value="prov" class="text-black">{{ prov }}</option>
                </GlassSelect>
                <GlassSelect v-model="updateForm.city" label="City" required :disabled="!updateForm.province">
                  <option value="" disabled>City</option>
                  <option v-for="city in availableCities" :key="city" :value="city" class="text-black">{{ city }}</option>
                </GlassSelect>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <GlassInput v-model="updateForm.mobile" label="Mobile" placeholder="09123456789" />
                <GlassInput v-model="updateForm.school" label="School" placeholder="Optional" />
              </div>

              <GlassSelect v-model="updateForm.sexualOrientation" label="Sexual Orientation">
                <option value="" disabled>Select</option>
                <option value="Straight" class="text-black">Straight</option>
                <option value="Bisexual" class="text-black">Bisexual</option>
                <option value="Gay" class="text-black">Gay</option>
                <option value="Other" class="text-black">Other</option>
              </GlassSelect>

              <GlassTextarea v-model="updateForm.bio" label="Bio" placeholder="User bio..." />

              <div v-if="updateError" class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
                {{ updateError }}
              </div>

              <div class="flex gap-3 pt-4">
                <GlassButton type="button" variant="secondary" @click="closeUpdateModal">
                  Cancel
                </GlassButton>
                <GlassButton type="submit" variant="primary" :disabled="updating">
                  <Loader2 v-if="updating" class="w-5 h-5 animate-spin" />
                  <span v-else>Save Changes</span>
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation, useLazyQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { philippines as provinceCities } from '../data/philippines'
import { 
  Loader2, LogOut, LayoutDashboard, Users, Heart, Activity, 
  MessageCircle, Star, Eye, Edit2, Trash2, X 
} from 'lucide-vue-next'
import GlassCard from '../components/ui/GlassCard.vue'
import GlassButton from '../components/ui/GlassButton.vue'
import GlassInput from '../components/ui/GlassInput.vue'
import GlassSelect from '../components/ui/GlassSelect.vue'
import GlassTextarea from '../components/ui/GlassTextarea.vue'

const router = useRouter()

const showMatchesModal = ref(false)
const selectedUserId = ref(null)
const selectedUserName = ref('')

const showUpdateModal = ref(false)
const updating = ref(false)
const updateError = ref(null)
const updateForm = ref({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  city: '',
  province: '',
  bio: '',
  mobile: '',
  school: '',
  sexualOrientation: ''
})

/* ---------------- DATA ---------------- */
const provinces = Object.keys(provinceCities)

const availableCities = computed(() => {
  if (!updateForm.value.province) return []
  return provinceCities[updateForm.value.province] || []
})

const onProvinceChange = () => {
  updateForm.value.city = ''
}

/* ---------------- GRAPHQL ---------------- */

const DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats(popularLimit: 10) {
      totalUsers
      totalMatches
      totalSwipes
      totalMessages
      popularUsers {
        user { id firstName }
        likesReceived
        matchesCount
      }
    }
    allUsers(limit: 50) {
      id
      firstName
      lastName
      email
      city
      province
      bio
      mobile
      school
      sexualOrientation
      matchesCount
    }
  }
`

const USER_MATCHES = gql`
  query UserMatches($userId: ID!) {
    userMatches(userId: $userId) {
      id
      user1 { id firstName lastName email city }
      user2 { id firstName lastName email city }
      createdAt
    }
  }
`

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        firstName
        lastName
        email
        city
        province
        bio
      }
      errors
    }
  }
`

const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      success
      errors
    }
  }
`

const { result, loading, refetch } = useQuery(DASHBOARD_STATS, null, {
  fetchPolicy: 'network-only'
})

const { mutate: deleteUserMutation } = useMutation(DELETE_USER)
const { mutate: updateUserMutation } = useMutation(UPDATE_USER)

const {
  result: matchesResult,
  loading: loadingMatches,
  load: loadUserMatches
} = useLazyQuery(USER_MATCHES)

const stats = computed(() => result.value?.dashboardStats)
const users = computed(() => result.value?.allUsers || [])
const userMatches = computed(() => matchesResult.value?.userMatches || [])

const viewMatches = async (userId) => {
  const user = users.value.find(u => u.id === userId)
  selectedUserId.value = userId
  selectedUserName.value = `${user.firstName} ${user.lastName}`
  showMatchesModal.value = true

  await loadUserMatches(USER_MATCHES, { userId })
}

const getOtherUser = (match) => {
  return match.user1.id === selectedUserId.value ? match.user2 : match.user1
}

const closeMatchesModal = () => {
  showMatchesModal.value = false
  selectedUserId.value = null
  selectedUserName.value = ''
}

const openUpdateModal = async (user) => {
  updateForm.value = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    province: user.province || '',
    city: user.city || '',
    bio: user.bio || '',
    mobile: user.mobile || '',
    school: user.school || '',
    sexualOrientation: user.sexualOrientation || ''
  }
  showUpdateModal.value = true
  updateError.value = null
}

const closeUpdateModal = () => {
  showUpdateModal.value = false
  updateForm.value = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    province: '',
    bio: ''
  }
  updateError.value = null
}

const updateUser = async () => {
  updating.value = true
  updateError.value = null

  if (updateForm.value.mobile && !/^\+?\d{10,15}$/.test(updateForm.value.mobile)) {
    updateError.value = "Mobile number must be 10-15 digits"
    updating.value = false
    return
  }

  try {
    const { data } = await updateUserMutation({
      input: {
        userId: updateForm.value.id,
        firstName: updateForm.value.firstName,
        lastName: updateForm.value.lastName,
        email: updateForm.value.email,
        city: updateForm.value.city,
        province: updateForm.value.province,
        bio: updateForm.value.bio,
        mobile: updateForm.value.mobile,
        school: updateForm.value.school,
        sexualOrientation: updateForm.value.sexualOrientation
      }
    })

    if (data?.updateUser?.errors?.length) {
      updateError.value = data.updateUser.errors.join(', ')
    } else {
      await refetch()
      closeUpdateModal()
    }
  } catch (e) {
    updateError.value = e.message || 'Error updating user'
  } finally {
    updating.value = false
  }
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    await deleteUserMutation({ input: { userId } })
    refetch()
  } catch (e) {
    alert('Error deleting user: ' + e.message)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>