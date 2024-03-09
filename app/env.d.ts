declare namespace NodeJS {
  export interface ProcessEnv {
    NUXT_DB_HOST: string;
    NUXT_DB_NAME: string;
    NUXT_DB_USER: string;
    NUXT_DB_PASSWORD_FILE: string;
  }
}
