<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden pb-safe">
    <!-- Header -->
    <header class="flex justify-between items-center px-6 py-4 z-20 sticky top-0">
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-lg">
        <img src="/icon.png" alt="MatchPoint Logo" class="w-10 h-10 object-contain drop-shadow-md" />
      </div>
      
      <div class="nav">
        <button @click="showEditProfileModal = true" class="icon-btn" title="Edit Profile">
          <Edit :size="24" />
        </button>
        <router-link to="/matches" class="icon-btn" title="Messages">
          <MessageCircle :size="24" />
        </router-link>
        <button @click="logout" class="icon-btn" title="Logout">
          <LogOut :size="24" />
        </button>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center text-white/50 animate-pulse">
      <Loader2 class="w-10 h-10 animate-spin" />
    </div>

    <!-- Swipe Deck -->
    <div v-else-if="deckUser" class="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto relative px-4 py-4">
      <div
        class="w-full relative aspect-[3/4] max-h-[70vh] rounded-3xl cursor-grab active:cursor-grabbing shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 select-none overflow-hidden touch-none"
        :style="cardStyle"
        @mousedown="onStart"
        @mousemove="onMove"
        @mouseup="onEnd"
        @mouseleave="dragging && onEnd()"
        @touchstart="onStart"
        @touchmove="onMove"
        @touchend="onEnd"
      >
        <!-- Photo -->
        <div class="absolute inset-0 bg-black/50" @click="nextPhoto">
          <img 
            :src="deckUser.photos[photoIndex]" 
            class="w-full h-full object-cover pointer-events-none"
            draggable="false"
          />
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

          <!-- Photo Dots -->
          <div class="absolute top-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
            <div 
              v-for="(_, i) in deckUser.photos" 
              :key="i"
              class="h-1 rounded-full transition-all duration-300 shadow-sm"
              :class="i === photoIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'"
            ></div>
          </div>
        </div>

        <!-- Info Overlay -->
        <div class="absolute bottom-0 inset-x-0 p-6 pointer-events-none">
          <div class="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-5 shadow-inner">
            <h2 class="text-3xl font-bold text-white drop-shadow-md mb-1">{{ deckUser.firstName }}, {{ deckUser.age }}</h2>
            <div class="flex items-center text-gray-200 text-sm mb-3">
              <MapPin class="w-4 h-4 mr-1 opacity-80" />
              {{ deckUser.city }}, {{ deckUser.province }}
            </div>
            
            <p v-if="deckUser.bio" class="text-gray-300 text-sm line-clamp-3 leading-relaxed">
              {{ deckUser.bio }}
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-center gap-8 mt-8">
        <button 
          @click="swipe('dislike')" 
          class="w-16 h-16 rounded-full flex items-center justify-center bg-black/40 border border-red-500/30 text-red-500 shadow-lg hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          <X class="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>
        
        <button 
          @click="swipe('like')" 
          class="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <Heart class="w-8 h-8 fill-current animate-pulse-slow" />
        </button>
      </div>
    </div>

    <!-- No more users -->
    <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Users class="w-10 h-10 text-white/20" />
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">No more users</h2>
      <p class="text-gray-400">Check back later for new matches!</p>
    </div>

    <!-- Match Modal -->
    <transition name="modal">
      <div v-if="showMatchModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click="closeModal">
        <div class="w-full max-w-sm bg-gray-900/90 border border-white/10 rounded-3xl p-8 text-center shadow-2xl transform transition-all" @click.stop>
          <div class="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Heart class="w-10 h-10 text-white fill-white" />
          </div>
          
          <h2 class="text-3xl font-bold text-white mb-2 tracking-wide">It's a Match!</h2>
          <p class="text-gray-400 mb-8">You and {{ matchedUser?.firstName }} liked each other!</p>
          
          <div class="space-y-3">
            <button @click="goToMessages" class="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold tracking-wide shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Send Message
            </button>
            <button @click="closeModal" class="w-full py-3.5 bg-white/10 border border-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors">
              Keep Swiping
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfileModal" class="modal" @click="showEditProfileModal = false">
      <div class="modal-content profile-modal" @click.stop>
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="profileForm.firstName" placeholder="First Name" required />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="profileForm.lastName" placeholder="Last Name" required />
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea v-model="profileForm.bio" placeholder="Tell us about yourself"></textarea>
          </div>
          <div class="form-group">
            <label>City</label>
            <input v-model="profileForm.city" placeholder="City" required />
          </div>

          <!-- Photos Section -->
          <div class="form-group">
            <label>Photos</label>
            <div class="photo-grid">
              <div v-for="photo in authUser?.photos || []" :key="photo.id" class="photo-item group">
                <img :src="getPhotoUrl(photo.url)" />
                <button 
                  type="button" 
                  @click.stop="deletePhoto(photo.id)" 
                  class="delete-photo-btn"
                  title="Delete Photo"
                >
                  <X :size="14" />
                </button>
              </div>
              
              <label 
                v-if="canUpload"
                class="photo-upload-btn" 
                :class="{ 'uploading': uploadingPhoto }"
              >
                <Loader2 v-if="uploadingPhoto" class="w-6 h-6 animate-spin text-cyan-500" />
                <UploadCloud v-else class="w-6 h-6 text-gray-400" />
                <input type="file" class="hidden" accept="image/*" @change="onFileChange" :disabled="uploadingPhoto" />
              </label>
            </div>
            <p v-if="photoError" class="error text-xs">{{ photoError }}</p>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showEditProfileModal = false" class="cancel-btn">Cancel</button>
            <button type="submit" :disabled="updating">Save Changes</button>
          </div>
          <p v-if="updateError" class="error">{{ updateError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { useAuth } from '@/composables/useAuth'
import { MessageCircle, LogOut, X, Heart, MapPin, Loader2, Users, Edit, UploadCloud, Image as ImageIcon } from 'lucide-vue-next'

/* ---------------- ROUTER & AUTH ---------------- */
const router = useRouter()
const { currentUser: authUser } = useAuth()

/* ---------------- STATE ---------------- */
const currentIndex = ref(0)
const photoIndex = ref(0)
const MAX_PHOTOS = 5
const showMatchModal = ref(false)
const matchedUser = ref(null)

const startX = ref(0)
const currentX = ref(0)
const dragging = ref(false)

// Edit Profile State
const showEditProfileModal = ref(false)
const profileForm = reactive({
  firstName: '',
  lastName: '',
  bio: '',
  city: ''
})
const updateError = ref('')
const uploadingPhoto = ref(false)
const photoError = ref('')

// Initialize form when modal opens
watch(showEditProfileModal, (newVal) => {
  if (newVal && authUser.value) {
    profileForm.firstName = authUser.value.firstName || ''
    profileForm.lastName = authUser.value.lastName || ''
    profileForm.bio = authUser.value.bio || ''
    profileForm.city = authUser.value.city || ''
  }
})

/* ---------------- GRAPHQL ---------------- */
const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      user {
        id
        firstName
        lastName
        bio
        city
      }
      errors
    }
  }
`

const UPLOAD_PHOTO = gql`
  mutation UploadPhoto($input: UploadPhotoInput!) {
    uploadPhoto(input: $input) {
      photo {
        id
        url
        position
        isPrimary
      }
      errors
    }
  }
`

const DELETE_PHOTO = gql`
  mutation DeletePhoto($input: DeletePhotoInput!) {
    deletePhoto(input: $input) {
      user {
        id
        photos {
          id
          url
          position
        }
      }
      errors
    }
  }
`

const SWIPE_DECK = gql`
  query SwipeDeck($limit: Int!) {
    swipeDeck(limit: $limit) {
      id
      firstName
      lastName
      city
      province
      age
      bio
      gender
      role
      photos {
        id
        url
        position
        isPrimary
      }
    }
  }
`

const CREATE_SWIPE = gql`
  mutation CreateSwipe($input: CreateSwipeInput!) {
    createSwipe(input: $input) {
      matched
      match {
        user1 { id firstName }
        user2 { id firstName }
      }
    }
  }
`

/* ---------------- APOLLO ---------------- */
const { result, loading, refetch } = useQuery(
  SWIPE_DECK,
  { limit: 20 },
  {
    enabled: computed(() => !!authUser.value),
    fetchPolicy: 'network-only'
  }
)

const { mutate: createSwipe } = useMutation(CREATE_SWIPE)
const { mutate: updateProfile, loading: updating } = useMutation(UPDATE_PROFILE)
const { mutate: uploadPhotoMutation } = useMutation(UPLOAD_PHOTO)
const { mutate: deletePhotoMutation } = useMutation(DELETE_PHOTO)

/* ------ SWIPE FUNCTION --------- */
const onStart = (e) => {
  dragging.value = true
  startX.value = e.touches ? e.touches[0].clientX : e.clientX
}

const onMove = (e) => {
  if (!dragging.value) return
  currentX.value = (e.touches ? e.touches[0].clientX : e.clientX) - startX.value
}

const onEnd = async () => {
  dragging.value = false

  if (currentX.value > 120) {
    await swipe('like')
  } else if (currentX.value < -120) {
    await swipe('dislike')
  }

  currentX.value = 0
}

const cardStyle = computed(() => {
  const rotate = currentX.value / 12
  return {
    transform: `translateX(${currentX.value}px) rotate(${rotate}deg)`,
    transition: dragging.value ? 'none' : 'transform 0.3s ease'
  }
})


/* ---------------- COMPUTED ---------------- */
const users = computed(() => {
  const allUsers = result.value?.swipeDeck ?? []
  // Filter to only show users with role "user"
  return allUsers.filter(user => user.role === 'user')
})

const deckUser = computed(() => {
  const user = users.value[currentIndex.value]
  if (!user) return null

  const defaultPhoto =
    user.gender === 'Female' ? '/girl.png' : '/boy.png'

  const photos =
    user.photos?.length
      ? user.photos
          .slice()
          .sort((a, b) => a.position - b.position)
          .map(p => p.url)
      : [defaultPhoto]

  return {
    ...user,
    photos,
    age: user.age || '',
    province: user.province || ''
  }
})

// Check if user can upload more photos
const canUpload = computed(() => {
  return (authUser.value?.photos || []).length < MAX_PHOTOS
})

/* Reset gallery when user changes */
watch(deckUser, () => {
  photoIndex.value = 0
})

/* ---------------- ACTIONS ---------------- */
const nextPhoto = () => {
  if (!deckUser.value) return
  photoIndex.value =
    (photoIndex.value + 1) % deckUser.value.photos.length
}

const swipe = async (action) => {
  if (!deckUser.value?.id || !authUser.value?.id) return

  try {
    const { data } = await createSwipe({
      input: {
        swipedId: deckUser.value.id,
        action
      }
    })

    if (data?.createSwipe?.matched) {
      matchedUser.value =
        data.createSwipe.match.user1.id === authUser.value.id
          ? data.createSwipe.match.user2
          : data.createSwipe.match.user1
      showMatchModal.value = true
    }

    currentIndex.value++
    photoIndex.value = 0

    if (currentIndex.value >= users.value.length) {
      await refetch()
      currentIndex.value = 0
    }
  } catch (e) {
    console.error('Swipe error:', e)
    currentIndex.value++
    photoIndex.value = 0
  }
}

const closeModal = () => {
  showMatchModal.value = false
  matchedUser.value = null
}

const goToMessages = () => {
  closeModal()
  router.push('/matches')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const saveProfile = async () => {
  updateError.value = ''
  try {
    const { data } = await updateProfile({
      input: {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        bio: profileForm.bio,
        city: profileForm.city
      }
    })
    if (data?.updateProfile?.errors?.length > 0) {
      updateError.value = data.updateProfile.errors.join(', ')
    } else {
      showEditProfileModal.value = false
      window.location.reload() // Simple reload to reflect changes
    }
  } catch (e) {
    console.error('Update error:', e)
    updateError.value = 'Failed to update profile'
  }
}

/* ---------------- PHOTO UPLOAD ---------------- */
const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.readAsDataURL(file)
  })

const onFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  uploadingPhoto.value = true
  photoError.value = ''

  try {
    const base64 = await fileToBase64(file)
    // Check if it's the first photo to set as primary
    const isFirstUpload = (authUser.value?.photos || []).length === 0

    const { data } = await uploadPhotoMutation({
      input: {
        image: base64,
        isPrimary: isFirstUpload
      }
    })

    if (data?.uploadPhoto?.errors?.length) {
      console.error('Upload GraphQL errors:', data.uploadPhoto.errors)
      photoError.value = data.uploadPhoto.errors.join(', ')
    } else {
      console.log('Upload success:', data.uploadPhoto)
      // Success - refetch auth user to update photos list
      const { useAuth } = await import('@/composables/useAuth')
      const { refetch } = useAuth()
      await refetch()
    }
  } catch (e) {
    console.error('Upload error:', e)
    photoError.value = 'Failed to upload photo'
  } finally {
    uploadingPhoto.value = false
    // Reset input
    e.target.value = ''
  }
}

const getPhotoUrl = (url) => {
  if (!url) {
    console.warn('getPhotoUrl called with empty url')
    return ''
  }
  if (url.startsWith('http')) return url
  // Get base URL from VITE_API_URL (remove /graphql)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/graphql'
  const baseUrl = apiUrl.replace(/\/graphql\/?$/, '')
  const fullUrl = `${baseUrl}${url}`
  console.log('getPhotoUrl transformed:', { original: url, full: fullUrl })
  return fullUrl
}

const deletePhoto = async (photoId) => {
  if (!confirm('Are you sure you want to delete this photo?')) return

  try {
    const { data } = await deletePhotoMutation({ 
      input: { photoId: photoId } 
    })
    
    if (data?.deletePhoto?.errors?.length) {
      console.error('Delete GraphQL errors:', data.deletePhoto.errors)
      photoError.value = data.deletePhoto.errors.join(', ')
    } else {
      console.log('Delete success:', data.deletePhoto)
      // Update local state immediately if needed, or rely on refetch
      // The backend returns the updated user, so we could update authUser directly
      // but refetch is safer for consistency across the app
      const { useAuth } = await import('@/composables/useAuth')
      const { refetch } = useAuth()
      await refetch()
    }
  } catch (e) {
    console.error('Delete error:', e)
    photoError.value = 'Failed to delete photo'
  }
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

/* Glassmorphism Icon Buttons */
.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3B82F6;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}
.icon-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  color: #2563EB;
  transform: translateY(-2px);
}
.nav {
  display: flex;
  gap: 12px;
  align-items: center;
}
/* Modal Stying */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}
.modal-content {
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  text-align: left;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  color: #333;
}
.profile-modal {
  width: 90%;
  max-width: 500px;
  text-align: left;
}
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-weight: 600;
  color: #444;
}
.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
}
.form-group textarea {
  min-height: 80px;
  resize: vertical;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}
.cancel-btn {
  background: #f0f0f0 !important;
  color: #666 !important;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.modal-actions button[type="submit"] {
  background: #000;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.error {
  color: #d32f2f;
  margin-top: 10px;
  font-size: 14px;
}

/* Photo Grid Styles */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 8px;
}
.photo-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: #f0f0f0;
}
.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-upload-btn {
  aspect-ratio: 1;
  border-radius: 12px;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.photo-upload-btn:hover {
  border-color: #3B82F6;
  background: #f0f9ff;
}
.photo-upload-btn.uploading {
  cursor: not-allowed;
  opacity: 0.7;
}

.delete-photo-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
}
.photo-item:hover .delete-photo-btn {
  opacity: 1;
}
.delete-photo-btn:hover {
  background: #ef4444;
  transform: scale(1.1);
}
</style>