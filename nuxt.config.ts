import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-21',
  devtools: { enabled: false },
  components: [{ path: '~/components', extensions: ['vue'] }],
  modules: ['@nuxtjs/cloudinary', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  cloudinary: { cloudName: 'demo-article-projects' },
  runtimeConfig: {
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Variant Gallery | Nuxt and Cloudinary',
      meta: [{ name: 'description', content: 'Select a product color and see only its validated Cloudinary images. No substitute photos when a variant is missing.' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
    },
  },
  routeRules: {
    '/api/**': { headers: { 'X-Content-Type-Options': 'nosniff' } },
  },
})
