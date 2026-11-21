<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { ImageOffIcon } from '@lucide/vue'
import { Badge } from '~/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '~/components/ui/empty'
import type { VariantManifest } from '~~/shared/types'

const { entry, cloudName } = defineProps<{ entry: VariantManifest, cloudName: string }>()
const selectedOrder = shallowRef(0)
const selectedImage = computed(() => entry.images.find(image => image.order === selectedOrder.value) ?? entry.images[0])
</script>

<template>
  <section :aria-label="`${entry.variant.label} product images`" class="gallery">
    <div class="image-stage">
      <template v-if="entry.status === 'ready' && selectedImage">
        <CatalogImage :key="selectedImage.publicId" :image="selectedImage" :cloud-name="cloudName" />
        <Badge variant="secondary" class="stage-label">{{ selectedImage.role === 'hero' ? 'Studio view' : 'Finish detail' }}</Badge>
      </template>
      <Empty v-else class="unavailable-stage">
        <EmptyHeader>
          <EmptyMedia variant="icon"><ImageOffIcon aria-hidden="true" /></EmptyMedia>
          <EmptyTitle>Images not available for {{ entry.variant.label }}</EmptyTitle>
          <EmptyDescription>No approved images match this variant. We won't show a different color instead.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
    <div v-if="entry.status === 'ready'" class="thumbnail-row" aria-label="Product views">
      <button
v-for="image in entry.images" :key="image.assetId" type="button" class="thumbnail"
        :aria-label="`${entry.variant.label} ${image.role === 'hero' ? 'studio view' : 'finish detail'}`"
        :aria-pressed="selectedOrder === image.order" @click="selectedOrder = image.order">
        <CatalogImage :image="image" :cloud-name="cloudName" compact />
      </button>
      <p class="gallery-note">{{ entry.images.length }} approved views<br><span>Matched to {{ entry.variant.sku }}</span></p>
    </div>
    <div v-else class="thumbnail-row"><p class="gallery-note">Select Forest, Clay, or Cream to see a complete image set.</p></div>
  </section>
</template>

<style scoped>
.gallery { min-width: 0; }
.image-stage { position: relative; overflow: hidden; border-radius: .8rem; border: 1px solid var(--border); aspect-ratio: 1; background: var(--secondary); }
.stage-label { position: absolute; top: 1rem; left: 1rem; }
.unavailable-stage { height: 100%; min-height: 100%; padding: 1.5rem; }
.thumbnail-row { display: flex; gap: .7rem; align-items: center; padding-block: 1rem; min-height: 110px; }
.thumbnail { width: 76px; overflow: hidden; border: 2px solid transparent; border-radius: .5rem; cursor: pointer; }
.thumbnail[aria-pressed='true'] { border-color: var(--foreground); }
.thumbnail:focus-visible { outline: 3px solid var(--ring); outline-offset: 3px; }
.gallery-note { padding-inline-start: .3rem; font-size: .75rem; line-height: 1.7; }
.gallery-note span { color: var(--muted-foreground); }
</style>
