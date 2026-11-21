# Variant Gallery

A focused Nuxt storefront that keeps a product's selected color and SKU matched to its Cloudinary images. Missing or ambiguous media produces an unavailable state, never a photo from another color.

## Run locally

Use Node.js 24 and pnpm 10.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3006. The included catalog works without API credentials. It uses six synthetic product illustrations stored in Cloudinary, not customer photographs.

Select Forest, Clay, or Cream to switch between two matching views. Select Midnight to test missing media. The gallery clears the previous color instead of showing a fallback.

## Cloudinary setup

To use your own Cloudinary environment, copy `.env.example` to `.env.local` and fill the server-only credentials. Run `pnpm demo:seed` once to create six demo assets and their typed metadata fields. Existing assets are never overwritten. `pnpm demo:refresh` reads and validates them again after metadata changes.

These local commands use standard Cloudinary account quota; no AI add-on is needed. The public application cannot modify the catalog or access management credentials. A saved catalog represents a dated readback, not current approval state. Refresh the manifest and redeploy to publish metadata changes. A failed mapping becomes unavailable.

## Checks

```bash
pnpm check
pnpm test:e2e
```

The checks include 43 mapping tests and eight browser checks across desktop and mobile layouts. They cover ambiguous mappings, approval state, missing heroes, duplicate ordering, rapid switching, and unavailable media.

Cloudinary provides typed asset metadata and responsive delivery through Nuxt Cloudinary. The application validates associations against its catalog. Metadata cannot establish that the pixels depict the correct product; a wrongly labeled image still needs human correction.
