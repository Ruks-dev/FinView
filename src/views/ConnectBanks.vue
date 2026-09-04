<script setup>
import DashboardLayout from "../components/DashboardLayout.vue";
defineProps({
  page: String,
  title: String,
  menuOpen: Boolean,
  availableBanks: Array,
  connected: Array,
});
defineEmits(["navigate", "toggle-menu", "connect"]);
</script>
<template>
  <DashboardLayout
    :page="page"
    :title="title"
    :menu-open="menuOpen"
    @navigate="$emit('navigate', $event)"
    @toggle-menu="$emit('toggle-menu')"
    ><section class="content-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">SECURE CONNECTIONS</p>
          <h2>Bring your banks together</h2>
          <p class="muted">
            Choose a bank to add a mock account to your FinView.
          </p>
        </div>
      </div>
      <div class="bank-list">
        <article
          v-for="bank in availableBanks"
          :key="bank.bank"
          class="bank-option"
        >
          <span :class="['bank-logo', bank.tone]">{{ bank.short }}</span>
          <div>
            <h3>{{ bank.bank }}</h3>
            <p>{{ bank.description || bank.descrption }}</p>
          </div>
          <button class="button light" @click="$emit('connect', bank)">
            {{ connected.includes(bank.bank) ? "Connected" : "Connect" }}
          </button>
        </article>
      </div>
    </section></DashboardLayout
  >
</template>
