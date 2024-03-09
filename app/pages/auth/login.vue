<script setup lang="ts">
import { startAuthentication } from "@simplewebauthn/browser";
import crypto from "../../utils/crypto";

const email = ref("");

const onSubmit = async () => {
  try {
    if (!email.value) return;

    const options = await $fetch("/api/login/options", {
      query: { email: email.value },
    });

    const authenticationResponse = await startAuthentication(options);
    const verified = await $fetch("/api/login", {
      method: "POST",
      body: authenticationResponse,
      query: {
        email: email.value,
      },
    });

    if (verified) {
      const {
        response: { userHandle },
      } = authenticationResponse;

      const mn = crypto.generateMnemonicPhrase();
      const seed = await crypto.generateSeed(mn, userHandle);
      const key = await crypto.generateJwk(seed, userHandle);

      console.info(mn);
      console.info(key);
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <h1>Login</h1>
  <form @submit.prevent="onSubmit">
    <input v-model="email" placeholder="Enter your email address..." />
    <button type="submit" :disabled="!email">Submit</button>
  </form>
</template>
