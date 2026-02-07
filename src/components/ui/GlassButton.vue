<template>
  <button
    :class="[
      'w-full py-3 px-6 rounded-xl font-bold tracking-wide transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2',
      variantClasses
    ]"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'secondary', 'ghost'].includes(value)
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]'
    case 'danger':
      return 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
    case 'secondary':
      return 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'
    case 'ghost':
      return 'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white'
    default:
      return 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
  }
})
</script>
