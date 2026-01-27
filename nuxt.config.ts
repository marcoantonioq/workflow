
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    port: 8080,
    host: '0.0.0.0'
  },
  build: {
    transpile: ["quasar"],
  },
  modules: ["nuxt-quasar-ui"],
  css: [],
  quasar: {
    config: {
      brand: {
        primary: "#32a041", // Verde IFG
        secondary: "#2f3e4e", // Cinza Azulado Escuro
        accent: "#c0392b", // Vermelho (usado em alertas/ícones)
        dark: "#1d1d1d",

        positive: "#21BA45",
        negative: "#c0392b",
        info: "#31CCEC",
        warning: "#F2C037",
      },
    },
    plugins: ["Dialog", "Notify", "Loading"],
    components: {
      defaults: {
        QBtn: {
          dense: true,
          flat: true,
        },
        QInput: {
          dense: true,
        },
      },
    },
  },
});
