// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  devServer: {
    https: {
      cert: "./certs/localhost.pem",
      key: "./certs/localhost-key.pem",
    },
  },
  runtimeConfig: {
    // Human-readable title for your website
    rpName: "",
    // A unique identifier for your website
    rpID: "",
    // The URL at which registrations and authentications should occur
    origin: "",
    // database
    dbHost: "",
    dbName: "",
    dbUser: "",
    dbPasswordFile: "",
  },
});
