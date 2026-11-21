<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { ArrowUpRightIcon, LayersIcon, ShieldCheckIcon } from '@lucide/vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Separator } from '~/components/ui/separator'
import { product } from '~~/shared/catalog'
import type { GalleryManifest } from '~~/shared/types'

const { data: catalog, error, refresh } = await useFetch<GalleryManifest>('/api/catalog', { key: 'saved-catalog' })
const selectedId = shallowRef<string>('arc-forest')
const selected = computed(() => catalog.value?.variants.find(entry => entry.variant.id === selectedId.value))
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="Variant Gallery home"><span class="brand-mark"><LayersIcon aria-hidden="true" /></span><span>Variant Gallery<small>Cloudinary × Nuxt</small></span></a>
      <Badge variant="outline">Saved catalog demo</Badge>
    </header>
    <main id="main-content">
      <div class="intro"><p class="eyebrow">Product media, kept in sync</p><h1>The color you choose.<br>The images you get.</h1><p class="intro-copy">A product gallery with one rule: never show the wrong variant.</p></div>
      <Alert v-if="error || !catalog || !selected" variant="destructive" class="my-8"><AlertTitle>The saved catalog could not be loaded.</AlertTitle><AlertDescription>No replacement images are being shown. <Button variant="outline" @click="refresh()">Try again</Button></AlertDescription></Alert>
      <section v-else class="product-layout" aria-label="Interactive product gallery">
        <ProductGallery :key="selected.variant.id" :entry="selected" :cloud-name="catalog.cloudName" />
        <div class="product-details">
          <div><p class="eyebrow">A quieter kind of workspace</p><div class="product-heading"><h2>{{ product.name }}</h2><span class="price">{{ product.price }}</span></div><p class="product-description">{{ product.description }} A sculptural task lamp in a considered palette, with a warm brass accent.</p></div>
          <Separator />
          <div class="selection-header"><h3>Color <span>{{ selected.variant.label }}</span></h3><code>{{ selected.variant.sku }}</code></div>
          <VariantPicker :variants="catalog.variants" :selected="selectedId" @select="selectedId = $event" />
          <p class="selection-status" role="status" aria-live="polite"><ShieldCheckIcon aria-hidden="true" />{{ selected.status === 'ready' ? `${selected.variant.label}: ${selected.images.length} matching images. No color substitutions.` : `${selected.variant.label}: no approved images. No fallback displayed.` }}</p>
          <MetadataEvidence :entry="selected" :captured-at="catalog.capturedAt" />
          <p class="demo-disclaimer">Try Midnight to see a missing-media case. This is a synthetic catalog demonstration, not a shop.</p>
        </div>
      </section>
      <section class="how-it-works" aria-label="How Cloudinary powers this gallery"><div><span class="step-number">01</span><h3>Describe</h3><p>Cloudinary stores the product, variant, color, role, order, and approval with each image.</p></div><div><span class="step-number">02</span><h3>Match</h3><p>The server checks the stored metadata against the catalog. Incomplete sets stay unavailable.</p></div><div><span class="step-number">03</span><h3>Deliver</h3><p>Cloudinary serves responsive images. Selecting a color never changes the underlying product.</p></div></section>
    </main>
    <footer class="site-footer"><p>A saved, validated Cloudinary result. No management API calls when you switch colors.</p><a href="https://cloudinary.com/documentation/structured_metadata" target="_blank" rel="noreferrer">Explore structured metadata<ArrowUpRightIcon aria-hidden="true" /></a></footer>
  </div>
</template>

<style scoped>
.site-shell { max-width: 1180px; margin: auto; padding: 1.5rem clamp(1rem, 4vw, 3rem); }
.site-header { display: flex; gap: 1rem; justify-content: space-between; align-items: center; padding-block-end: 2.5rem; }
.brand { display: flex; gap: .65rem; align-items: center; font-size: .875rem; font-weight: 600; text-decoration: none; }
.brand-mark { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid var(--border); border-radius: 10px; background: var(--card); }
.brand-mark svg { width: 19px; height: 19px; }
.brand small { display: block; color: var(--muted-foreground); font-weight: 400; font-size: .7rem; margin-top: .15rem; }
.intro { padding-block: .5rem 2.5rem; }
.eyebrow { font-size: .66rem; letter-spacing: .14em; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: .75rem; }
h1 { font-size: clamp(2.2rem, 4.2vw, 3.3rem); font-weight: 500; line-height: 1.1; letter-spacing: -.045em; }
.intro-copy { margin-top: 1rem; color: var(--muted-foreground); font-size: .9rem; }
.product-layout { display: grid; gap: 1.5rem; align-items: start; }
.product-details { display: flex; flex-direction: column; gap: 1.15rem; padding-block: .75rem; }
.product-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
h2 { font-size: 1.8rem; font-weight: 500; letter-spacing: -.035em; }
.price { font-size: 1.1rem; }
.product-description { color: var(--muted-foreground); font-size: .85rem; line-height: 1.8; margin-top: .7rem; max-width: 44ch; }
.selection-header { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.selection-header h3 { font-size: .8rem; font-weight: 500; }
.selection-header h3 span { margin-inline-start: .5rem; color: var(--muted-foreground); font-weight: 400; }
.selection-header code { font-size: .65rem; color: var(--muted-foreground); }
.selection-status { display: flex; align-items: start; gap: .5rem; font-size: .73rem; line-height: 1.6; }
.selection-status svg { width: 15px; height: 15px; flex-shrink: 0; margin-top: .15rem; }
.demo-disclaimer { color: var(--muted-foreground); font-size: .7rem; line-height: 1.7; }
.how-it-works { display: grid; gap: 1.5rem; padding-block: 2rem; border-top: 1px solid var(--border); margin-top: 2rem; }
.step-number { color: var(--muted-foreground); font-size: .65rem; font-family: monospace; }
.how-it-works h3 { display: inline; margin-inline-start: .6rem; font-size: .8rem; font-weight: 600; }
.how-it-works p { color: var(--muted-foreground); font-size: .75rem; line-height: 1.8; margin-top: .6rem; max-width: 38ch; }
.site-footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding-block: 1.5rem .5rem; border-top: 1px solid var(--border); color: var(--muted-foreground); font-size: .65rem; line-height: 1.7; }
.site-footer a { display: flex; gap: .25rem; align-items: center; }
.site-footer svg { width: 12px; height: 12px; }
@media (min-width: 760px) { .product-layout { grid-template-columns: 1.2fr 1fr; gap: clamp(2rem, 5vw, 4rem); } .how-it-works { grid-template-columns: repeat(3, 1fr); } }
</style>
