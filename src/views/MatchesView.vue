<template>
  <div class="min-h-screen flex flex-col p-4 relative z-10 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <router-link to="/deck" class="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg group">
        <ArrowLeft class="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </router-link>
      <h1 class="text-3xl text-white tracking-wide" style="font-family: 'Satisfy', cursive;">Messages</h1>
    </div>
    
    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center text-white/50 animate-pulse">
      <Loader2 class="w-8 h-8 animate-spin" />
    </div>
    
    <!-- Empty State -->
    <div v-else-if="inbox.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
      <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
        <MessageCircle class="w-10 h-10 text-white/20" />
      </div>
      <h2 class="text-xl font-bold text-white mb-2">No matches yet</h2>
      <p class="text-gray-400">Keep swiping to find your match!</p>
      <router-link to="/deck" class="mt-6 px-6 py-3 bg-white/10 border border-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors">
        Go to Deck
      </router-link>
    </div>
    
    <!-- Match List -->
    <div v-else class="space-y-3">
      <div 
        v-for="item in inbox" 
        :key="item.match.id"
        class="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02] shadow-lg relative"
        @click="openChat(item.match.id, item.otherUser)"
      >
        <!-- Avatar -->
        <div class="relative">
          <img 
            :src="item.otherUser.primaryPhotoUrl || (item.otherUser.gender === 'Female' ? '/girl.png' : '/boy.png')" 
            class="w-16 h-16 rounded-full object-cover border-2 border-white/20 group-hover:border-cyan-500 transition-colors bg-black/20"
          />
          <div v-if="item.unreadCount > 0" class="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full px-1.5 shadow-md border border-black/20">
            {{ item.unreadCount }}
          </div>
        </div>
        
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="text-lg font-bold text-white truncate pr-2">{{ item.otherUser.firstName }} {{ item.otherUser.lastName }}</h3>
            <span v-if="item.latestMessage" class="text-xs text-gray-500 flex-shrink-0">
              {{ formatTime(item.latestMessage.createdAt) }}
            </span>
          </div>
          <p class="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors" :class="{'font-semibold text-white': item.unreadCount > 0}">
            {{ item.latestMessage?.content || 'Say hi! 👋' }}
          </p>
        </div>

        <!-- Chevron -->
        <ChevronRight class="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors group-hover:translate-x-1 transform" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { ArrowLeft, Loader2, MessageCircle, ChevronRight } from 'lucide-vue-next'

const router = useRouter()

/* ---------------- GRAPHQL ---------------- */
const MY_INBOX = gql`
  query MyInbox {
    myInbox {
      match { id }
      otherUser { id firstName lastName gender primaryPhotoUrl }
      latestMessage { content createdAt }
      unreadCount
    }
  }
`

const { result, loading } = useQuery(MY_INBOX, null, {
  fetchPolicy: 'network-only'
})
const inbox = computed(() => result.value?.myInbox || [])

/* ---------------- OPEN CHAT ---------------- */
const openChat = (matchId, otherUser) => {
  router.push({
    name: 'chat',
    params: { matchId },
    query: { userId: otherUser.id, name: otherUser.firstName }
  })
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}
</script>