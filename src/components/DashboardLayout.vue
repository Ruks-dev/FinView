<script setup>
defineProps({ page: String, title: String, menuOpen: Boolean });
defineEmits(["navigate", "toggle-menu"]);
</script>
<template>
  <div class="app-shell">
    <aside :class="{ open: menuOpen }">
      <button class="brand" @click="$emit('navigate', '/dashboard')">
        <span class="brand-mark">F</span> FinView</button>
        <p class="sidebar-label">OVERVIEW</p>
        <button v-for="item in [['dashboard','Dashboard'],['accounts','Accounts'],['transactions','Transactions'],['expenses','Expenses']]" :key="item[0]" :class="['side-link', { active: page === item[0] }]" @click="$emit('navigate', '/' + item[0])">{{ item[1] }}</button>
        <p class="sidebar-label">MANAGE</p>
        <button :class="['side-link', { active: page === 'connect-bank' }]" @click="$emit('navigate', '/connect-bank')">Connect bank <span class="plus">+</span>
        </button>
        <button :class="['side-link', { active: page === 'profile' }]" @click="$emit('navigate', '/profile')">Profile</button>
        <div class="side-bottom">
          <button class="side-link" @click="$emit('navigate', '/')">Log out</button>
          <div class="user-chip"><span class="avatar">RA</span>
          <div>
            <b>Ruks Abdul</b><small>Personal account</small>
            </div>
            </div>
            </div>
            </aside>
            <div class="mobile-bar"><button class="menu-button" @click="$emit('toggle-menu')">☰</button>
            <button class="brand" @click="$emit('navigate', '/dashboard')"><span class="brand-mark">F</span> FinView</button>
            </div><main class="dashboard-main">
              <header class="dash-header">
                <div>
                  <p class="eyebrow">FRIDAY, 28 AUGUST 2026</p>
                  <h1>{{ page === 'dashboard' ? 'Good morning, Ruks' : title }}</h1>
                  <p v-if="page === 'dashboard'" class="muted">Here’s what’s happening across your accounts.</p>
                  </div>
                  <button class="notification">¤</button>
                  </header>
                  <slot />
                  </main>
                  </div>
</template>