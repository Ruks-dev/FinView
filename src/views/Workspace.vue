<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  accounts,
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
const connected = ref(accounts.map((account) => account.bank));
const page = computed(() =>
  route.params.id ? "account" : route.path.split("/")[1] || "home",
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
    })[page.value] || "Welcome to FinView",
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
    })[page.value] || Accounts,
);
const selectedAccount = computed(
  () =>
    accounts.find((account) => account.id === route.params.id) || accounts[0],
);
const totalBalance = computed(() =>
  accounts.reduce((sum, account) => sum + account.balance, 0),
);
const go = (path) => {
  menuOpen.value = false;
  router.push(path);
};
const connect = (bank) => {
  if (!connected.value.includes(bank.bank)) connected.value.push(bank.bank);
  go("/accounts");
};

onMounted(() => {
  fetch("/api/finances")
    .then((response) => {
      if (!response.ok) throw new Error("Unable to load FinView data");
      return response.json();
    })
    .then((data) => {
      accounts.splice(0, accounts.length, ...data.accounts);
      availableBanks.splice(0, availableBanks.length, ...data.availableBanks);
      expenses.splice(0, expenses.length, ...data.expenses);
      transactions.splice(0, transactions.length, ...data.transactions);
    })
    .catch(() => {});
});
</script>

<template>
  <component
    :is="view"
    :page="page"
    :title="title"
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
