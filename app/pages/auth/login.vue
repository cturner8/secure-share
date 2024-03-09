<script setup lang="ts">
import { startAuthentication } from "@simplewebauthn/browser";

const email = ref("");

const onSubmit = async () => {
  try {
    if (!email.value) return;

    const options = await $fetch("/api/login/options", {
      query: { email: email.value },
    });

    const authenticationResponse = await startAuthentication(options);
    const verifyResponse = await $fetch("/api/login", {
      method: "POST",
      body: authenticationResponse,
      query: {
        email: email.value,
      },
    });

    console.info(verifyResponse);
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
