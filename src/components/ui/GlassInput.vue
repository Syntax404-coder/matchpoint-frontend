<template>
  <div class="glass-input-wrapper">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-300 mb-1">{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full bg-black/30 text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-gray-500"
        :placeholder="placeholder"
        v-bind="$attrs"
      />
      <div v-if="$slots.icon" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  id: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String
})

defineEmits(['update:modelValue'])
</script>
