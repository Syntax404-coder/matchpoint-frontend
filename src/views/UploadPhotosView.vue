<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 py-12">
    <GlassCard class="w-full max-w-lg text-center">
      <!-- Logo -->
      <div class="mb-6 inline-block p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
        <img src="/icon.png" alt="MatchPoint Logo" class="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-xl" />
      </div>

      <h1 class="text-3xl font-bold text-white mb-2 tracking-wide">Upload Photos</h1>
      <p class="text-gray-400 mb-8">Add at least 1 photo to continue (max 5)</p>

      <!-- Upload Area -->
      <div class="mb-8">
        <label 
          class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-cyan-500 hover:bg-white/5 transition-all group"
          :class="{'border-cyan-500 bg-cyan-500/10': selectedFile}"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud v-if="!selectedFile" class="w-10 h-10 mb-3 text-gray-400 group-hover:text-cyan-400 transition-colors" />
            <Image v-else class="w-10 h-10 mb-3 text-cyan-400" />
            
            <p v-if="!selectedFile" class="mb-2 text-sm text-gray-400 group-hover:text-gray-300">
              <span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p v-else class="text-sm text-cyan-400 font-semibold truncate max-w-[200px]">
              {{ selectedFile.name }}
            </p>
          </div>
          <input type="file" class="hidden" accept="image/*" @change="onFileChange" />
        </label>
      </div>

      <!-- Action Button -->
      <div class="mb-8">
        <GlassButton 
          @click="uploadPhoto" 
          :disabled="!selectedFile || uploading"
          variant="primary"
        >
          <Loader2 v-if="uploading" class="w-5 h-5 animate-spin" />
          <span v-else>Upload Photo</span>
        </GlassButton>
        
        <p v-if="error" class="mt-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 inline-block">
          {{ error }}
        </p>
      </div>

      <!-- Gallery -->
      <div v-if="photos.length" class="border-t border-white/10 pt-6">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
          Your Photos <span class="bg-white/10 text-xs px-2 py-0.5 rounded-full text-gray-300">{{ photos.length }}/5</span>
        </h3>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div v-for="photo in photos" :key="photo.id" class="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
            <img :src="photo.url" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            
            <div v-if="photo.isPrimary" class="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
              <Star class="w-3 h-3 fill-current" /> Primary
            </div>
            
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
          </div>
        </div>

        <GlassButton 
          @click="goToDeck" 
          :disabled="photos.length === 0"
          variant="secondary"
          class="w-full"
        >
          Continue to Swipe Deck
        </GlassButton>
      </div>
    </GlassCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { UploadCloud, Image, Loader2, Star } from 'lucide-vue-next'
import GlassCard from '../components/ui/GlassCard.vue'
import GlassButton from '../components/ui/GlassButton.vue'

const router = useRouter()

const selectedFile = ref(null)
const uploading = ref(false)
const error = ref(null)

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

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      photos {
        id
        url
        position
        isPrimary
      }
    }
  }
`

const { result, refetch } = useQuery(CURRENT_USER, null, {
  fetchPolicy: 'network-only'
})

const { mutate: uploadPhotoMutation } = useMutation(UPLOAD_PHOTO)

const photos = computed(() => result.value?.currentUser?.photos || [])

const onFileChange = (e) => {
  selectedFile.value = e.target.files[0] || null
}

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.readAsDataURL(file)
  })

const uploadPhoto = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  error.value = null

  try {
    const base64 = await fileToBase64(selectedFile.value)
    const isFirstUpload = photos.value.length === 0

    const { data } = await uploadPhotoMutation({
      input: {
        image: base64,
        isPrimary: isFirstUpload
      }
    })

    if (data.uploadPhoto.errors.length) {
      error.value = data.uploadPhoto.errors.join(', ')
    } else {
      await refetch()
      selectedFile.value = null
      // Reset file input via DOM (Vue way would be better with key or ref but this works for now)
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''
    }
  } catch (e) {
    error.value = e.message
  } finally {
    uploading.value = false
  }
}

const goToDeck = () => {
  if (photos.value.length > 0) {
    router.push('/deck')
  }
}
</script>