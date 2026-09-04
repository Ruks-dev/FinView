<script setup>
import Authpage from "./AuthPage.vue";
defineEmits(["navigate"]);
</script>
<template>
  <authpage mode="signup" @navigate="$emit('navigate'.$event)" />
</template>
