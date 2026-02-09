<template>
  <div class="flex flex-col h-screen relative z-10 overflow-hidden bg-black/20">
    <!-- Header -->
    <div class="flex items-center gap-4 px-4 py-3 bg-white/10 backdrop-blur-xl border-b border-white/10 z-20 shadow-lg">
      <router-link to="/matches" class="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors">
        <ArrowLeft class="w-6 h-6" />
      </router-link>
      
      <div v-if="otherUserDetails" class="flex items-center gap-3">
        <div class="relative">
          <img 
            :src="otherUserDetails.photoUrl || (otherUserDetails.gender === 'Female' ? '/girl.png' : '/boy.png')" 
            class="w-10 h-10 rounded-full object-cover border border-white/20 bg-black/20"
          />
          <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
        <div>
          <h2 class="text-white font-bold leading-tight">{{ otherUserDetails.fullName }}</h2>
          <p class="text-xs text-green-400 font-medium">Online</p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref="messagesContainer">
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        class="flex w-full"
        :class="msg.sender.id === currentUserId ? 'justify-end' : 'justify-start'"
      >
        <div 
          class="max-w-[75%] px-4 py-3 rounded-2xl shadow-sm relative group break-words text-sm md:text-base"
          :class="[
            msg.sender.id === currentUserId 
              ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm' 
              : 'bg-white/10 backdrop-blur-md border border-white/10 text-gray-100 rounded-tl-sm'
          ]"
        >
          <p>{{ msg.content }}</p>
          <span 
            class="text-[10px] mt-1 block opacity-60"
            :class="msg.sender.id === currentUserId ? 'text-blue-100 text-right' : 'text-gray-400 text-left'"
          >
            {{ formatTime(msg.createdAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-white/5 backdrop-blur-xl border-t border-white/10 z-20 pb-safe">
      <form @submit.prevent="sendMessage" class="max-w-4xl mx-auto relative flex items-center gap-2">
        <input 
          v-model="newMessage" 
          placeholder="Type a message..." 
          class="w-full bg-black/40 text-white border border-white/10 rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-gray-500"
          :disabled="sending"
        />
        
        <button 
          type="submit" 
          :disabled="!newMessage.trim() || sending"
          class="absolute right-2 p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
        >
          <Send class="w-5 h-5 ml-0.5" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { ArrowLeft, Send } from 'lucide-vue-next'

const route = useRoute()
const newMessage = ref('')
const sending = ref(false)
const messagesContainer = ref(null)
const currentUserId = ref(null)
let pollingInterval = null

const matchId = route.params.matchId
const otherUserId = route.query.userId
const otherUserName = route.query.name

/* ---------------- GRAPHQL ---------------- */

const CONVERSATION_MESSAGES = gql`
  query ConversationMessages($matchId: ID!) {
    conversationMessages(matchId: $matchId) {
      id
      content
      sender { id firstName lastName gender primaryPhotoUrl }
      receiver { id firstName lastName gender primaryPhotoUrl }
      read
      createdAt
    }
    currentUser { id }
  }
`

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      message { id content createdAt }
      errors
    }
  }
`

const MARK_AS_READ = gql`
  mutation MarkAsRead($input: MarkAsReadInput!) {
    markAsRead(input: $input) { 
      message { id read } 
      errors 
    }
  }
`

/* ---------------- QUERIES & MUTATIONS ---------------- */
const otherUserDetails = computed(() => {
  // Use query params as base or fallback to message data
  if (!messages.value.length) return {
    fullName: otherUserName || 'Unknown',
    photoUrl: null,
    gender: 'Male' // default fallback
  }

  const msg = messages.value[0]
  // Use otherUserId from route query - convert to string for safe comparison
  // If sender is the other user, use sender; otherwise use receiver
  const user = String(msg.sender.id) === String(otherUserId) ? msg.sender : msg.receiver

  return {
    fullName: `${user.firstName} ${user.lastName}`,
    photoUrl: user.primaryPhotoUrl,
    gender: user.gender
  }
})



const { result, refetch } = useQuery(
  CONVERSATION_MESSAGES, 
  { matchId },
  { fetchPolicy: 'network-only' }
)

const { mutate: sendMessageMutation } = useMutation(SEND_MESSAGE)
const { mutate: markAsReadMutation } = useMutation(MARK_AS_READ)

const messages = computed(() => result.value?.conversationMessages || [])

/* ---------------- FUNCTIONS ---------------- */
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  sending.value = true

  try {
    const { data } = await sendMessageMutation({
      input: {
        matchId: matchId,
        receiverId: otherUserId,
        content: newMessage.value
      }
    })

    if (!data.sendMessage.errors.length) {
      newMessage.value = ''
      await refetch()
      scrollToBottom()
    }
  } catch (e) {
    console.error('Send error:', e)
  } finally {
    sending.value = false
  }
}

const markUnreadMessages = async () => {
  if (!currentUserId.value) return
  
  const unreadMessages = messages.value.filter(
    msg => !msg.read && msg.receiver.id === currentUserId.value
  )

  for (const msg of unreadMessages) {
    try {
      await markAsReadMutation({ input: { messageId: msg.id } })
    } catch (e) {
      console.error('Mark as read error:', e)
    }
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

/* ---------------- LIFECYCLE ---------------- */
watch(result, (val) => {
  if (val?.currentUser) {
    currentUserId.value = val.currentUser.id
    markUnreadMessages()
    scrollToBottom()
  }
})

onMounted(() => {
  scrollToBottom()
  console.log('[ChatView] Starting message polling...')
  // Start polling for new messages every 3 seconds
  pollingInterval = setInterval(async () => {
    const previousCount = messages.value.length
    console.log('[ChatView] Polling for new messages...')
    await refetch()
    // Scroll to bottom only if new messages arrived
    if (messages.value.length > previousCount) {
      console.log('[ChatView] New messages received!')
      scrollToBottom()
    }
  }, 3000)
})

onUnmounted(() => {
  // Clean up polling interval when leaving the chat
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
})
</script>
