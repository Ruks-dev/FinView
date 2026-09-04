<script setup>
import Authpage from "./AuthPage.vue";

defineEmits(["navigate"]);
</script>

<template>
  <Authpage
    mode="signup"
    @navigate="$emit('navigate', $event)"
  />
</template>