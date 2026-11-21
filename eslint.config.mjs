// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  { ignores: ['docs/**', '.private/**', 'playwright-report/**', 'test-results/**'] },
  { files: ['app/components/ui/**'], rules: { 'vue/require-default-prop': 'off' } },
)
