<template>
  <div class="glass-select-wrapper">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-300 mb-1">{{ label }}</label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full bg-black/30 text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors appearance-none cursor-pointer"
        v-bind="$attrs"
      >
        <slot></slot>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
        <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  id: String
})

defineEmits(['update:modelValue'])
</script>
