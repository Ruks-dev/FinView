<template>
  <div class="accounts-page">
    <div class="page-header">
      <div>
        <p class="brand">FinView</p>
        <h1>My Accounts</h1>
        <p>Manage all your connected bank accounts.</p>
      </div>

      <button @click="connectBank">
        + Connect Bank
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="empty">
      <h2>Loading accounts...</h2>
    </div>

    <!-- Accounts -->
    <div v-else-if="accounts.length" class="accounts-grid">
      <div
        v-for="account in accounts"
        :key="account.account_id"
        class="account-card"
      >
        <div class="account-top">
          <div class="bank-logo">
            {{ getShortName(account.bank_name) }}
          </div>

          <span class="connected">
            ● Connected
          </span>
        </div>

        <h2>{{ account.bank_name }}</h2>

        <p>{{ account.account_type }}</p>

        <!-- Balance -->
        <div class="balance">
          <span>Available Balance</span>

          <strong v-if="account.balance">
            {{ account.balance.currency || account.currency || "₦" }}
            {{ Number(account.balance.available_balance || 0).toLocaleString() }}
          </strong>

          <strong v-else>
            Balance unavailable
          </strong>
        </div>

        <!-- Account Number -->
        <div class="account-number">
          Account Number

          <strong>
            {{ maskAccountNumber(account.account_number) }}
          </strong>
        </div>

        <!-- Disconnect -->
        <button
          class="disconnect"
          @click="
            disconnectAccount(
              account.account_id,
              account.bank_name
            )
          "
        >
          Disconnect
        </button>
      </div>
    </div>

    <!-- No Accounts -->
    <div v-else class="empty">
      <div class="empty-icon">🏦</div>

      <h2>No bank connected</h2>

      <p>
        Connect your bank to see your account information here.
      </p>

      <button @click="connectBank">
        Connect Your First Bank
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { apiUrl } from "../api.js";
import { getSession } from "../session.js";

const router = useRouter();

const accounts = ref([]);
const loading = ref(true);

onMounted(() => {
  getAccounts();
});


// Get the logged-in user's bank accounts
async function getAccounts() {
  try {
    loading.value = true;

    const session = getSession();
    const user = session?.user;

    if (!user) {
      router.push("/login");
      return;
    }

    // Get bank accounts belonging to this user
    const response = await fetch(
      apiUrl(`/api/bank-accounts?user_id=${user.user_id}`),
      {
        headers: {
          Authorization: `Bearer ${session?.token || ""}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get bank accounts");
    }

    const data = await response.json();

    // Get balance for every bank account
    const accountsWithBalances = await Promise.all(
      data.map(async (account) => {
        try {
          const balanceResponse = await fetch(
            apiUrl(`/api/balances?account_id=${account.account_id}`),
            {
              headers: {
                Authorization: `Bearer ${session?.token || ""}`,
              },
            }
          );

          if (!balanceResponse.ok) {
            return {
              ...account,
              balance: null,
            };
          }

          const balances = await balanceResponse.json();

          return {
            ...account,
            balance: balances[0] || null,
          };
        } catch (error) {
          console.error(
            `Error getting balance for account ${account.account_id}:`,
            error
          );

          return {
            ...account,
            balance: null,
          };
        }
      })
    );

    accounts.value = accountsWithBalances;
  } catch (error) {
    console.error(
      "Error loading accounts:",
      error
    );
  } finally {
    loading.value = false;
  }
}


// Go to Connect Bank page
function connectBank() {
  router.push("/connect-bank");
}


// Disconnect a bank account
async function disconnectAccount(id, bankName) {
  const confirmDisconnect = confirm(
    `Disconnect ${bankName} from FinView?`
  );

  if (!confirmDisconnect) {
    return;
  }

  try {
    const response = await fetch(
      apiUrl(`/api/bank-accounts/${id}`),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getSession()?.token || ""}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to disconnect account"
      );
    }

    // Remove the account from the screen
    accounts.value = accounts.value.filter(
      (account) =>
        account.account_id !== id
    );

  } catch (error) {
    console.error(
      "Error disconnecting account:",
      error
    );

    alert("Failed to disconnect account");
  }
}


// Hide most of the account number
function maskAccountNumber(accountNumber) {
  if (!accountNumber) {
    return "****";
  }

  const number = String(accountNumber);

  if (number.length <= 4) {
    return number;
  }

  return `**** ${number.slice(-4)}`;
}


// Create a short bank name for the logo
function getShortName(bankName) {
  if (!bankName) {
    return "B";
  }

  return bankName
    .substring(0, 2)
    .toUpperCase();
}
</script>