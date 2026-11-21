export const product = {
  id: 'arc-lamp',
  name: 'Arc task lamp',
  description: 'A little focus. A softer light.',
  price: '$98',
  variants: [
    { id: 'arc-forest', sku: 'ARC-FOREST', label: 'Forest', color: 'forest', hex: '#344e45' },
    { id: 'arc-clay', sku: 'ARC-CLAY', label: 'Clay', color: 'clay', hex: '#bd7157' },
    { id: 'arc-cream', sku: 'ARC-CREAM', label: 'Cream', color: 'cream', hex: '#d8c9ad' },
    { id: 'arc-midnight', sku: 'ARC-MIDNIGHT', label: 'Midnight', color: 'midnight', hex: '#303949' },
  ],
} as const

export type VariantId = (typeof product.variants)[number]['id']
export type CatalogVariant = (typeof product.variants)[number]

export const metadataFields = {
  product: 'vg_product',
  variant: 'vg_variant',
  color: 'vg_color',
  role: 'vg_role',
  order: 'vg_order',
  approval: 'vg_approval',
} as const

export const assetPrefix = 'variant-gallery/v1/'
