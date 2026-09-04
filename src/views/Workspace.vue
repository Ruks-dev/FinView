```vue
<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiUrl } from "../api.js";
import { getSession } from "../session.js";

import {
  availableBanks,
  expenses,
  naira,
  transactions,
} from "../components/data";

import AccountDetails from "./AccountDetails.vue";
import Accounts from "./Accounts.vue";
import ConnectBanks from "./ConnectBanks.vue";
import Dashboard from "./Dashboard.vue";
import Expenses from "./Expenses.vue";
import LandingPage from "./LandingPage.vue";
import Login from "./Login.vue";
import Profile from "./Profile.vue";
import Signup from "./Signup.vue";
import Transactions from "./Transactions.vue";

const route = useRoute();
const router = useRouter();

const menuOpen = ref(false);
const currentUser = ref(null);
const accounts = ref([]);
const connected = ref([]);

function getSessionUser() {
  return getSession()?.user || null;
}

const page = computed(() =>
  route.params.id ? "account" : route.path.split("/")[1] || "home"
);

const title = computed(
  () =>
    ({
      dashboard: "Dashboard",
      accounts: "Accounts",
      transactions: "Transactions",
      expenses: "Expenses",
      "connect-bank": "Connect bank",
      profile: "Profile",
      account: "Account details",
    })[page.value] || "Welcome to FinView"
);

const view = computed(
  () =>
    ({
      home: LandingPage,
      login: Login,
      signup: Signup,
      dashboard: Dashboard,
      accounts: Accounts,
      transactions: Transactions,
      expenses: Expenses,
      "connect-bank": ConnectBanks,
      profile: Profile,
      account: AccountDetails,
    })[page.value] || Accounts
);

const selectedAccount = computed(() => {
  return (
    accounts.value.find(
      (account) => String(account.account_id) === String(route.params.id)
    ) || accounts.value[0]
  );
});

const totalBalance = computed(() => {
  return accounts.value.reduce((sum, account) => {
    return sum + Number(account.balance?.available_balance || 0);
  }, 0);
});

function go(path) {
  menuOpen.value = false;
  router.push(path);
}

function connect(bank) {
  if (!connected.value.includes(bank.bank)) {
    connected.value.push(bank.bank);
  }

  go("/accounts");
}

function getCurrentUser() {
  return getSessionUser();
}

async function getAccounts() {
  try {
    if (!currentUser.value) {
      return;
    }

    const userId = currentUser.value.user_id;
    const session = getSession();

    const response = await fetch(apiUrl(`/api/bank-accounts?user_id=${userId}`), {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get bank accounts");
    }

    const data = await response.json();

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
            return { ...account, balance: null };
          }

          const balances = await balanceResponse.json();
          return { ...account, balance: balances[0] || null };
        } catch (error) {
          console.error(
            `Error getting balance for account ${account.account_id}:`,
            error
          );

          return { ...account, balance: null };
        }
      })
    );

    accounts.value = accountsWithBalances;
    connected.value = accountsWithBalances.map((account) => account.bank_name);
  } catch (error) {
    console.error("Error loading accounts:", error);
  }
}

onMounted(async () => {
  currentUser.value = getCurrentUser();

  if (currentUser.value) {
    await getAccounts();
  }
});
</script>

<template>
  <component
    :is="view"
    :page="page"
    :title="title"
    :user="currentUser"
    :accounts="accounts"
    :available-banks="availableBanks"
    :expenses="expenses"
    :transactions="transactions"
    :selected-account="selectedAccount"
    :total-balance="totalBalance"
    :connected="connected"
    :naira="naira"
    :menu-open="menuOpen"
    @navigate="go"
    @connect="connect"
    @toggle-menu="menuOpen = !menuOpen"
  />
</template>

 