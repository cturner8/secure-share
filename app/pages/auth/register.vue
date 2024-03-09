<script setup lang="ts">
import { startRegistration } from "@simplewebauthn/browser";

const email = ref("");

const onSubmit = async () => {
  try {
    if (!email.value) return;

    const options = await $fetch("/api/register/options", {
      query: {
        email: email.value,
      },
    });

    const registrationResponse = await startRegistration(options);
    const verified = await $fetch("/api/register", {
      method: "POST",
      body: registrationResponse,
      query: {
        email: email.value,
      },
    });

    console.info(verified);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <h1>Register</h1>
  <form @submit.prevent="onSubmit">
    <input v-model="email" placeholder="Enter your email address..." />
    <button type="submit" :disabled="!email">Submit</button>
  </form>
</template>
