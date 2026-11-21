export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  return { status: 'ok', cloudinaryConfigured: Boolean(config.cloudinaryCloudName && config.cloudinaryApiKey && config.cloudinaryApiSecret), mode: 'saved-catalog' }
})
