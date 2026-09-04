<template>
  <div class="accounts-page">
    <div class="page-header">
      <div>
        <p class="brand">FinView</p>
        <h1>My Accounts</h1>
        <p>Manage all your connected bank accounts.</p>
      </div>

      <button @click="connectBank">+ Connect Bank</button>
    </div>

    <div v-if="accounts.length" class="accounts-grid">
      <div v-for="account in accounts" :key="account.name" class="account-card">
        <div class="account-top">
          <div class="bank-logo">
            {{ account.shortName }}
          </div>

          <span class="connected"> ● Connected </span>
        </div>

        <h2>{{ account.name }}</h2>

        <p>{{ account.type }}</p>

        <div class="balance">
          <span>Available Balance</span>
          <strong> ₦{{ account.balance.toLocaleString() }}.00 </strong>
        </div>

        <div class="account-number">
          Account Number
          <strong>{{ account.number }}</strong>
        </div>

        <button class="disconnect" @click="disconnectAccount(account.name)">
          Disconnect
        </button>
      </div>
    </div>

    <div v-else class="empty">
      <div class="empty-icon">🏦</div>

      <h2>No bank connected</h2>

      <p>Connect your bank to see your account information here.</p>

      <button @click="connectBank">Connect Your First Bank</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const accounts = ref([]);

onMounted(() => {
  const savedBank = localStorage.getItem("connectedBank");

  if (savedBank) {
    const bank = JSON.parse(savedBank);

    accounts.value = [
      {
        name: bank.name,
        shortName: bank.shortName,
        type: bank.type,
        balance: 2450000,
        number: "**** 4821",
      },
    ];
  }
});

function connectBank() {
  router.push("/connect-bank");
}

function disconnectAccount(name) {
  const confirmDisconnect = confirm(`Disconnect ${name} from FinView?`);

  if (!confirmDisconnect) {
    return;
  }

  localStorage.removeItem("connectedBank");

  accounts.value = [];
}
</script>

