<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import type { VariantManifest } from '~~/shared/types'

defineProps<{ variants: VariantManifest[], selected: string }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <RadioGroup
:model-value="selected" class="grid grid-cols-4 gap-2" aria-label="Product color"
    @update:model-value="value => value && emit('select', String(value))">
    <label v-for="entry in variants" :key="entry.variant.id" :for="entry.variant.id" class="variant-option">
      <RadioGroupItem
:id="entry.variant.id" :value="entry.variant.id" :aria-label="entry.variant.label"
        class="variant-swatch" :style="{ backgroundColor: entry.variant.hex }" />
      <span class="variant-name">{{ entry.variant.label }}</span>
      <span v-if="entry.status === 'unavailable'" class="variant-hint">No images</span>
    </label>
  </RadioGroup>
</template>

<style scoped>
.variant-option { display: flex; min-height: 92px; align-items: center; flex-direction: column; gap: .5rem; padding: .65rem .25rem; border: 1px solid transparent; border-radius: .6rem; cursor: pointer; }
.variant-option:has([data-state='checked']) { border-color: var(--foreground); background: var(--secondary); }
.variant-swatch { width: 32px; height: 32px; border: 3px solid var(--card); box-shadow: 0 0 0 1px var(--border); color: var(--card); }
.variant-name { font-size: .8rem; font-weight: 500; }
.variant-hint { font-size: .65rem; color: var(--muted-foreground); margin-top: -.3rem; }
</style>
