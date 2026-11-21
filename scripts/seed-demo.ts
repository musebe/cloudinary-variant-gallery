import sharp from 'sharp'
import { product, metadataFields as field, assetPrefix } from '../shared/catalog.ts'
import { getCloudinary } from './lib/cloudinary.ts'
import { lampSvg } from './lib/lamp-svg.ts'
import { captureCatalog } from './lib/capture.ts'

const definitions = [
  { external_id: field.product, label: 'Variant Gallery: Product', type: 'string' },
  { external_id: field.variant, label: 'Variant Gallery: Variant', type: 'string' },
  { external_id: field.color, label: 'Variant Gallery: Color', type: 'string' },
  { external_id: field.role, label: 'Variant Gallery: Role', type: 'enum', datasource: { values: [{ external_id: 'hero', value: 'Hero' }, { external_id: 'detail', value: 'Detail' }] } },
  { external_id: field.order, label: 'Variant Gallery: Display order', type: 'integer' },
  { external_id: field.approval, label: 'Variant Gallery: Approval', type: 'enum', datasource: { values: [{ external_id: 'approved', value: 'Approved' }, { external_id: 'pending', value: 'Pending' }] } },
] as const

async function seed() {
  const { cloudinary } = getCloudinary()
  const fields = await cloudinary.api.list_metadata_fields()
  for (const definition of definitions) {
    const existing = fields.metadata_fields.find(item => item.external_id === definition.external_id)
    if (existing) {
      if (existing.type !== definition.type || existing.label !== definition.label) throw new Error('Conflicting metadata field; preserved existing schema')
    } else {
      await cloudinary.api.add_metadata_field({ ...definition, mandatory: false })
    }
  }
  console.log('Six dedicated metadata definitions ready. Existing definitions preserved.')

  for (const variant of product.variants.slice(0, 3)) {
    for (const [index, role] of (['hero', 'detail'] as const).entries()) {
      const publicId = `${assetPrefix}${variant.id}-${role}`
      const bytes = await sharp(Buffer.from(lampSvg(variant.hex, role === 'detail'))).png().toBuffer()
      await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ public_id: publicId, resource_type: 'image', type: 'upload',
          overwrite: false, asset_folder: 'article-demos/variant-gallery', tags: ['variant-gallery-v1', 'synthetic-catalog'],
          metadata: { [field.product]: product.id, [field.variant]: variant.id, [field.color]: variant.color,
            [field.role]: role, [field.order]: index, [field.approval]: 'approved' },
        }, (error, result) => error ? reject(error) : resolve(result)).end(bytes)
      })
      console.log(`Catalog fixture ready: ${variant.sku}, ${role}.`)
    }
  }
  await captureCatalog()
}

try {
  await seed()
} catch {
  console.error('Catalog setup failed. No credentials or upstream response are logged. Existing assets were not overwritten.')
  process.exitCode = 1
}
