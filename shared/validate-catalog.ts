import { assetPrefix, metadataFields as field, product } from './catalog'
import type { AssetEvidence, GalleryManifest, GalleryImage, MappingIssue, VariantManifest } from './types'

/** Validate exact catalog associations; never infer a SKU from a filename. */
export function validateCatalog(assets: readonly AssetEvidence[], cloudName: string, capturedAt: string): GalleryManifest {
  if (!/^[a-z0-9_-]+$/.test(cloudName) || !Number.isFinite(Date.parse(capturedAt))) {
    throw new Error('Invalid catalog capture context')
  }

  const variants: VariantManifest[] = product.variants.map((variant) => {
    const assigned = assets.filter(asset => asset.metadata?.[field.variant] === variant.id)
    const approved = assigned.filter(asset => asset.metadata?.[field.approval] === 'approved')
    const issues = new Set<MappingIssue>()
    const images: GalleryImage[] = []
    const orders = new Set<number>()
    const ids = new Set<string>()
    if (approved.length === 0) issues.add('no_approved_images')

    for (const asset of approved) {
      const m = asset.metadata ?? {}
      if (Object.values(field).some(key => m[key] === undefined || m[key] === '')) issues.add('missing_metadata')
      if (m[field.product] !== product.id) issues.add('wrong_product')
      if (m[field.color] !== variant.color) issues.add('wrong_color')
      if (asset.resource_type !== 'image' || asset.type !== 'upload'
        || !['png', 'jpg', 'webp'].includes(asset.format)
        || !asset.public_id.startsWith(assetPrefix)
        || !/^[a-zA-Z0-9_/-]+$/.test(asset.public_id)
        || !asset.asset_id || !Number.isSafeInteger(asset.version) || asset.version < 1
        || !Number.isSafeInteger(asset.width) || !Number.isSafeInteger(asset.height)
        || asset.width < 1 || asset.height < 1) issues.add('invalid_media')
      if (ids.has(asset.asset_id) || images.some(image => image.publicId === asset.public_id)
        || assets.filter(item => item.asset_id === asset.asset_id).length > 1
        || assets.filter(item => item.public_id === asset.public_id).length > 1) issues.add('duplicate_asset')
      ids.add(asset.asset_id)
      const order = m[field.order]
      const role = m[field.role]
      if (!Number.isSafeInteger(order) || (order as number) < 0 || (order as number) > 9
        || !['hero', 'detail'].includes(String(role))
        || (role === 'hero' && order !== 0)
        || (role === 'detail' && order === 0)) issues.add('invalid_order')
      if (orders.has(order as number)) issues.add('duplicate_order')
      orders.add(order as number)
      images.push({
        assetId: asset.asset_id, publicId: asset.public_id, version: asset.version,
        width: asset.width, height: asset.height, format: asset.format,
        role: role as 'hero' | 'detail', order: order as number,
        alt: `${product.name} in ${variant.label.toLowerCase()}, ${role === 'hero' ? 'full product view' : 'shade and finish detail'}`,
      })
    }
    const heroCount = images.filter(image => image.role === 'hero').length
    if (approved.length > 0 && heroCount === 0) issues.add('missing_hero')
    if (heroCount > 1) issues.add('multiple_heroes')
    return { variant, status: issues.size ? 'unavailable' : 'ready',
      images: issues.size ? [] : images.sort((a, b) => a.order - b.order), issues: [...issues] }
  })

  return { schemaVersion: 1, source: 'cloudinary-admin-readback', cloudName, capturedAt, productId: product.id, variants }
}
