import {
  defineNuxtModule,
  addImports,
  createResolver,
  addComponent,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    meta: {
      name: "nuxt-web3-wallets",
      configKey: "nuxt-web3-wallets",
      compatibility: {
        nuxt: "^3.1.0",
      },
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    // From the runtime directory
    addComponent({
      name: "ConnectWalletModal", // name of the component to be used in vue templates
      filePath: resolver.resolve("runtime/components/ConnectWalletModal.vue"),
    });
    addImports({
      name: "useWallet", // name of the composable to be used
      as: "useWallet",
      from: resolver.resolve("runtime/composables/useWallet"), // path of composable
    });
  },
});
