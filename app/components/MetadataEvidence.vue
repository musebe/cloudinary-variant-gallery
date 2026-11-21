<script setup lang="ts">
import { computed } from 'vue'
import { CheckCheckIcon, CircleAlertIcon } from '@lucide/vue'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { product } from '~~/shared/catalog'
import type { VariantManifest } from '~~/shared/types'

const { entry, capturedAt } = defineProps<{ entry: VariantManifest, capturedAt: string }>()
const date = computed(() => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(capturedAt)))
</script>

<template>
  <Card class="gap-0">
    <CardHeader class="pb-3">
      <CardTitle class="flex items-center justify-between gap-2">
        <span class="flex items-center gap-2"><CheckCheckIcon v-if="entry.status === 'ready'" class="size-4" aria-hidden="true" /><CircleAlertIcon v-else class="size-4" aria-hidden="true" />Cloudinary match</span>
        <Badge :variant="entry.status === 'ready' ? 'secondary' : 'outline'">{{ entry.status === 'ready' ? 'Passed' : 'Unavailable' }}</Badge>
      </CardTitle>
      <CardDescription>Saved metadata check · {{ date }}</CardDescription>
    </CardHeader>
    <CardContent>
      <dl class="evidence-grid">
        <div><dt>Product</dt><dd>{{ product.id }}</dd></div>
        <div><dt>Variant ID</dt><dd>{{ entry.variant.id }}</dd></div>
        <div><dt>Color code</dt><dd>{{ entry.variant.color }}</dd></div>
        <div><dt>Approved images</dt><dd>{{ entry.images.length }}</dd></div>
      </dl>
      <details class="mapping-details">
        <summary>Why {{ entry.status === 'ready' ? 'these images?' : 'no images?' }}</summary>
        <template v-if="entry.status === 'ready'">
          <p>Every image matches this product, variant, and color. One hero comes first; each display position is unique.</p>
          <table class="mapping-table"><caption class="sr-only">Validated media roles and display order</caption><thead><tr><th>Role</th><th>Order</th><th>Approval</th></tr></thead>
            <tbody><tr v-for="image in entry.images" :key="image.assetId"><td>{{ image.role }}</td><td>{{ image.order }}</td><td>approved</td></tr></tbody>
          </table>
        </template>
        <p v-else>The saved catalog has no approved image set for this variant. Another variant's image is not an acceptable fallback.</p>
      </details>
    </CardContent>
  </Card>
</template>

<style scoped>
.evidence-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem 1rem; font-size: .75rem; }
.evidence-grid dt { color: var(--muted-foreground); margin-bottom: .2rem; }
.evidence-grid dd { font-weight: 500; overflow-wrap: anywhere; }
.mapping-details { border-top: 1px solid var(--border); margin-top: 1rem; padding-top: .9rem; font-size: .75rem; line-height: 1.7; }
.mapping-details summary { font-weight: 500; cursor: pointer; min-height: 30px; }
.mapping-details p { color: var(--muted-foreground); margin-block: .6rem; }
.mapping-table { width: 100%; margin-top: .6rem; text-align: start; }
.mapping-table th, .mapping-table td { padding: .3rem; text-align: start; }
</style>
