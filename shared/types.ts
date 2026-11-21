import type { CatalogVariant } from './catalog'

export interface AssetEvidence {
  asset_id: string
  public_id: string
  resource_type: string
  type: string
  version: number
  width: number
  height: number
  format: string
  metadata?: Record<string, unknown>
}

export interface GalleryImage {
  assetId: string
  publicId: string
  version: number
  width: number
  height: number
  format: string
  role: 'hero' | 'detail'
  order: number
  alt: string
}

export type MappingIssue =
  | 'no_approved_images'
  | 'missing_metadata'
  | 'wrong_product'
  | 'wrong_color'
  | 'invalid_media'
  | 'duplicate_asset'
  | 'duplicate_order'
  | 'missing_hero'
  | 'multiple_heroes'
  | 'invalid_order'

export interface VariantManifest {
  variant: CatalogVariant
  status: 'ready' | 'unavailable'
  images: GalleryImage[]
  issues: MappingIssue[]
}

export interface GalleryManifest {
  schemaVersion: 1
  source: 'cloudinary-admin-readback'
  cloudName: string
  capturedAt: string
  productId: string
  variants: VariantManifest[]
}
