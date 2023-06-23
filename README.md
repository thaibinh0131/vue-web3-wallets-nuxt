<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# Nuxt Web3 Wallets

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[thaibinh0131][nuxt-href]

Nuxt Web3 Wallets for connect dApp with wallets.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
  <!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
  <!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Quick Setup

1. Add `nuxt-web3-wallets` dependency to your project

```bash
# Using pnpm
pnpm add nuxt-web3-wallets -D

# Using yarn
yarn add nuxt-web3-wallets --dev

# Using npm
npm install nuxt-web3-wallets --save-dev
```

2. Add `nuxt-web3-wallets` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["nuxt-web3-wallets"],
});
```

That's it! You can now use nuxt-web-wallets in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-web3-wallets/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://www.npmjs.com/package/nuxt-web3-wallets
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-web3-wallets.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-web3-wallets
[license-src]: https://img.shields.io/npm/l/nuxt-web3-wallets.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-web3-wallets
[nuxt-src]: https://thaibinh0131-me.onrender.com/avatar.jpg
[nuxt-href]: https://thaibinh0131-me.onrender.com/
