import { v2 as cloudinary } from 'cloudinary'

export function getCloudinary() {
  const cloud_name = process.env.NUXT_CLOUDINARY_CLOUD_NAME
  const api_key = process.env.NUXT_CLOUDINARY_API_KEY
  const api_secret = process.env.NUXT_CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) throw new Error('Fill the server-only Cloudinary variables in .env.local')
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true, timeout: 30000 })
  return { cloudinary, cloudName: cloud_name }
}
