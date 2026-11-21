<script setup lang="ts">
import { shallowRef } from 'vue'
import { ImageOffIcon } from '@lucide/vue'
import { Skeleton } from '~/components/ui/skeleton'
import type { GalleryImage } from '~~/shared/types'

const { image, cloudName, compact = false } = defineProps<{ image: GalleryImage, cloudName: string, compact?: boolean }>()
const loaded = shallowRef(false)
const failed = shallowRef(false)
</script>

<template>
  <div class="catalog-image" :aria-busy="!loaded && !failed">
    <Skeleton v-if="!loaded && !failed" class="absolute inset-0 rounded-none" aria-label="Loading selected image" />
    <CldImage
v-if="!failed" :src="image.publicId" :version="image.version"
      :config="{ cloud: { cloudName } }" :alt="image.alt" :width="compact ? 180 : 1000"
      :height="compact ? 180 : 1000" crop="fit" format="auto" quality="auto" loading="eager"
      :priority="!compact" :fetch-priority="compact ? 'auto' : 'high'" class="product-image"
      @load="loaded = true" @error="failed = true" />
    <div v-else class="image-error" role="status">
      <ImageOffIcon aria-hidden="true" />
      <p>{{ compact ? 'Unavailable' : 'This image could not be loaded.' }}</p>
      <p v-if="!compact" class="error-note">No other color has been substituted. Try reloading the page.</p>
    </div>
  </div>
</template>

<style scoped>
.catalog-image { position: relative; width: 100%; aspect-ratio: 1; overflow: hidden; background: var(--secondary); }
.product-image { width: 100%; height: 100%; object-fit: contain; position: relative; }
.image-error { display: flex; height: 100%; align-items: center; justify-content: center; text-align: center; flex-direction: column; gap: .7rem; padding: 1rem; color: var(--muted-foreground); font-size: .875rem; }
.error-note { max-width: 25ch; font-size: .75rem; }
</style>
