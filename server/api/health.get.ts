import catalog from '../data/catalog.json'

export default defineEventHandler(() => {
  const savedCatalogReady = Boolean(catalog.cloudName && catalog.variants.some(variant => variant.status === 'ready'))
  return {
    status: savedCatalogReady ? 'ok' : 'unavailable',
    mode: 'saved-catalog',
    savedCatalogReady,
    managementCredentialsRequired: false,
  }
})
