<template>
  <div class="glass-textarea-wrapper">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-300 mb-1">{{ label }}</label>
    <textarea
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full bg-black/30 text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-gray-500 resize-y min-h-[100px]"
      :placeholder="placeholder"
      v-bind="$attrs"
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  id: String,
  placeholder: String
})

defineEmits(['update:modelValue'])
</script>
