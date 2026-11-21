import { describe, it, expect } from 'vitest'
import { validateCatalog } from '../shared/validate-catalog'
import type { AssetEvidence, MappingIssue } from '../shared/types'
import saved from '../server/data/catalog.json'

function asset(role: 'hero' | 'detail' = 'hero'): AssetEvidence {
  return { asset_id: `id-${role}`, public_id: `variant-gallery/v1/forest-${role}`, resource_type: 'image', type: 'upload', version: 1, width: 1200, height: 1200, format: 'png',
    metadata: { vg_product: 'arc-lamp', vg_variant: 'arc-forest', vg_color: 'forest', vg_role: role, vg_order: role === 'hero' ? 0 : 1, vg_approval: 'approved' } }
}
function check(assets: AssetEvidence[]) {
  return validateCatalog(assets, 'demo-article-projects', '2026-11-21T00:00:00Z').variants[0]!
}

describe('exact variant mapping', () => {
  it('accepts the approved hero and detail, sorted by stored order', () => {
    expect(check([asset('detail'), asset()]).images.map(image => image.role)).toEqual(['hero', 'detail'])
  })
  it.each(['png', 'jpg', 'webp'])('accepts supported raster format %s', (format) => {
    expect(check([{ ...asset(), format }]).status).toBe('ready')
  })
  it('allows a hero-only set without inventing a detail image', () => {
    expect(check([asset()]).images).toHaveLength(1)
  })
  it('keeps unrelated variants unavailable', () => {
    const result = validateCatalog([asset()], 'demo', '2026-11-21')
    expect(result.variants.slice(1).every(v => v.status === 'unavailable' && v.images.length === 0)).toBe(true)
  })

  const invalid: [string, Partial<AssetEvidence>, Record<string, unknown>, MappingIssue][] = [
    ['wrong product', {}, { vg_product: 'other-product' }, 'wrong_product'],
    ['missing product', {}, { vg_product: undefined }, 'missing_metadata'],
    ['wrong color', {}, { vg_color: 'clay' }, 'wrong_color'],
    ['missing color', {}, { vg_color: '' }, 'missing_metadata'],
    ['unknown role', {}, { vg_role: 'lifestyle' }, 'invalid_order'],
    ['missing role', {}, { vg_role: undefined }, 'missing_metadata'],
    ['hero not first', {}, { vg_order: 1 }, 'invalid_order'],
    ['negative order', {}, { vg_order: -1 }, 'invalid_order'],
    ['fractional order', {}, { vg_order: 0.5 }, 'invalid_order'],
    ['string order', {}, { vg_order: '0' }, 'invalid_order'],
    ['unbounded order', {}, { vg_order: 10 }, 'invalid_order'],
    ['missing order', {}, { vg_order: undefined }, 'missing_metadata'],
    ['pending approval', {}, { vg_approval: 'pending' }, 'no_approved_images'],
    ['missing approval', {}, { vg_approval: undefined }, 'no_approved_images'],
    ['unknown approval', {}, { vg_approval: 'yes' }, 'no_approved_images'],
    ['video asset', { resource_type: 'video' }, {}, 'invalid_media'],
    ['restricted asset', { type: 'authenticated' }, {}, 'invalid_media'],
    ['SVG asset', { format: 'svg' }, {}, 'invalid_media'],
    ['missing immutable ID', { asset_id: '' }, {}, 'invalid_media'],
    ['version zero', { version: 0 }, {}, 'invalid_media'],
    ['fractional version', { version: 1.5 }, {}, 'invalid_media'],
    ['zero width', { width: 0 }, {}, 'invalid_media'],
    ['negative height', { height: -1 }, {}, 'invalid_media'],
    ['fractional width', { width: 20.5 }, {}, 'invalid_media'],
    ['wrong namespace', { public_id: 'somebody-elses/photo' }, {}, 'invalid_media'],
    ['remote URL as public ID', { public_id: 'https://example.com/image' }, {}, 'invalid_media'],
    ['unsafe public ID', { public_id: 'variant-gallery/v1/../photo' }, {}, 'invalid_media'],
  ]
  it.each(invalid)('blocks %s without substituting an image', (_label, changes, metadata, issue) => {
    const original = asset()
    const result = check([{ ...original, ...changes, metadata: { ...original.metadata, ...metadata } }])
    expect(result.status).toBe('unavailable')
    expect(result.issues).toContain(issue)
    expect(result.images).toEqual([])
  })
  it('blocks a set without a hero', () => { expect(check([asset('detail')]).issues).toContain('missing_hero') })
  it('blocks multiple hero assignments', () => { expect(check([asset(), { ...asset(), asset_id: 'other', public_id: 'variant-gallery/v1/other' }]).issues).toContain('multiple_heroes') })
  it('blocks duplicate display positions', () => { expect(check([asset(), asset('detail'), { ...asset('detail'), asset_id: 'other', public_id: 'variant-gallery/v1/other' }]).issues).toContain('duplicate_order') })
  it('blocks duplicate immutable IDs', () => { expect(check([asset(), { ...asset('detail'), asset_id: 'id-hero' }]).issues).toContain('duplicate_asset') })
  it('blocks duplicate public IDs', () => { expect(check([asset(), { ...asset('detail'), public_id: asset().public_id }]).issues).toContain('duplicate_asset') })
  it('does not borrow another SKU when the requested variant has no assets', () => { expect(check([{ ...asset(), metadata: { ...asset().metadata, vg_variant: 'arc-unknown' } }]).images).toEqual([]) })
  it('does not trust one asset assigned to two different variants', () => {
    const duplicate = { ...asset(), metadata: { ...asset().metadata, vg_variant: 'arc-clay', vg_color: 'clay' } }
    expect(check([asset(), duplicate]).issues).toContain('duplicate_asset')
  })
  it('rejects an invalid cloud-name context', () => { expect(() => validateCatalog([], '../demo', '2026-11-21')).toThrow() })
  it('rejects an invalid capture date', () => { expect(() => validateCatalog([], 'demo', 'not-a-date')).toThrow() })
  it('ships six real read-back assets and an explicit unavailable variant', () => {
    expect(saved.source).toBe('cloudinary-admin-readback')
    expect(saved.variants.slice(0, 3).every(v => v.status === 'ready' && v.images.length === 2)).toBe(true)
    expect(saved.variants[3]?.images).toEqual([])
    expect(saved.variants[3]?.status).toBe('unavailable')
  })
})
