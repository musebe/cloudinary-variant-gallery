import { captureCatalog } from './lib/capture.ts'

try {
  await captureCatalog()
} catch {
  console.error('Cloudinary catalog refresh failed. Check credentials, the demo assets, and their metadata. No credentials or upstream response are logged.')
  process.exitCode = 1
}
