<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden pb-safe">
    <!-- Header -->
    <header class="flex justify-between items-center px-6 py-4 z-20 sticky top-0">
      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-lg">
        <img src="/icon.png" alt="MatchPoint Logo" class="w-10 h-10 object-contain drop-shadow-md" />
      </div>
      
      <div class="flex items-center gap-3">
        <router-link to="/matches" class="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg group">
          <MessageCircle class="w-6 h-6 group-hover:scale-110 transition-transform" />
        </router-link>
        <button @click="logout" class="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all shadow-lg group">
          <LogOut class="w-5 h-5 group-hover:scale-110 transition-transform" />
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { useAuth } from '@/composables/useAuth'
import { MessageCircle, LogOut, X, Heart, MapPin, Loader2, Users } from 'lucide-vue-next'

/* ---------------- ROUTER & AUTH ---------------- */
const router = useRouter()
const { currentUser: authUser } = useAuth()

/* ---------------- STATE ---------------- */
const currentIndex = ref(0)
const photoIndex = ref(0)
const showMatchModal = ref(false)
const matchedUser = ref(null)

const startX = ref(0)
const currentX = ref(0)
const dragging = ref(false)

/* ---------------- GRAPHQL ---------------- */
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