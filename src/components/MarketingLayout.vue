<script setup>
defineEmits(["navigate"]);
</script>
<template>
  <div class="marketing-shell">
    <header class="site-nav">
      <button class="brand" @click="$emit('navigate', '/')">
        <span class="brand-mark">F</span> FinView
      </button>
      <nav>
        <a href="#features">Features</a><a href="#about">About</a
        ><a href="#faq">FAQ</a>
      </nav>
      <div class="nav-actions">
        <button class="button ghost" @click="$emit('navigate', '/login')">
          Log in</button
        ><button class="button dark" @click="$emit('navigate', '/signup')">
          Sign up <span>↗</span>
        </button>
      </div>
    </header>
    <slot />
    <footer class="site-footer">
      <b><span class="brand-mark">F</span> FinView</b
      ><span>Read-only banking, made clearer.</span><span>© 2026 FinView</span>
    </footer>
  </div>
</template>
