# Variant Gallery

A focused Nuxt storefront that keeps a product's selected color and SKU matched to its Cloudinary images. Missing or ambiguous media produces an unavailable state, never a photo from another color.

## Run locally

Use Node.js 24 and pnpm 10.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3006. The saved catalog will work without API credentials once provisioned. It uses synthetic product illustrations, not customer photographs.

## Cloudinary setup

Copy `.env.example` to `.env.local` and fill the server-only credentials. Then run `pnpm demo:seed` once to create the dedicated demo assets and metadata. `pnpm demo:refresh` reads and validates them again after metadata changes.

These local commands use standard Cloudinary account quota. The public application cannot modify the catalog or access management credentials. A saved catalog represents the last successful readback, not current approval state.

## Checks

```bash
pnpm check
pnpm test:e2e
```

The implementation and tests are in progress. Verified results will be recorded as each checkpoint is completed.
