<script setup>
import AuthPage from "./AuthPage.vue";
defineEmits(["navigate"]);
</script>
<template>
  <AuthPage mode="login" @navigate="$emit('navigate', $event)" />
</template>
