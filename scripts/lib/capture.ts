import { mkdir, writeFile, rename } from 'node:fs/promises'
import { product, assetPrefix } from '../../shared/catalog.ts'
import { validateCatalog } from '../../shared/validate-catalog.ts'
import type { AssetEvidence } from '../../shared/types.ts'
import { getCloudinary } from './cloudinary.ts'

export async function captureCatalog() {
  const { cloudinary, cloudName } = getCloudinary()
  // Read back the exact stored assets, without depending on Search indexing or Tier 2.
  const assets: AssetEvidence[] = []
  for (const variant of product.variants.slice(0, 3)) {
    for (const role of ['hero', 'detail']) {
      const result = await cloudinary.api.resource(`${assetPrefix}${variant.id}-${role}`, { resource_type: 'image', type: 'upload', metadata: true })
      assets.push({ asset_id: result.asset_id, public_id: result.public_id, resource_type: result.resource_type,
        type: result.type, version: result.version, width: result.width, height: result.height,
        format: result.format, metadata: result.metadata })
    }
  }
  const manifest = validateCatalog(assets, cloudName, new Date().toISOString())
  const text = JSON.stringify(manifest, null, 2) + '\n'
  // Generated data, saved atomically only after the full readback passes.
  await mkdir(new URL('../../server/data/', import.meta.url), { recursive: true })
  const destination = new URL('../../server/data/catalog.json', import.meta.url)
  const temporary = new URL('../../server/data/catalog.next.json', import.meta.url)
  await writeFile(temporary, text, { mode: 0o644 })
  await rename(temporary, destination)
  const ready = manifest.variants.filter(variant => variant.status === 'ready').length
  console.log(`Saved catalog: ${assets.length} Cloudinary assets, ${ready} ready colors, ${manifest.variants.length - ready} unavailable variants.`)
  return manifest
}
