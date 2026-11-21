import catalog from '../data/catalog.json'
import type { GalleryManifest } from '../../shared/types'

export default defineEventHandler((event): GalleryManifest => {
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600')
  return catalog as GalleryManifest
})
