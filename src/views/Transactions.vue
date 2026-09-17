<template>
  <div class="layout">


    <aside :class="{ open: menuOpen }">

      

      <button
        class="brand"
        @click="navigate('/dashboard')"
      >

        <span class="brand-mark">
          F
        </span>

        FinView

      </button>


      

      <p class="sidebar-label">
        OVERVIEW
      </p>


      <button
        v-for="item in [
          ['dashboard', 'Dashboard'],
          ['accounts', 'Accounts'],
          ['transactions', 'Transactions'],
          ['expenses', 'Expenses']
        ]"
        :key="item[0]"

        :class="[
          'side-link',
          {
            active: page === item[0]
          }
        ]"

        @click="navigate('/' + item[0])"
      >

        {{ item[1] }}

      </button>


      

      <p class="sidebar-label">
        MANAGE
      </p>


      <button
        :class="[
          'side-link',
          {
            active: page === 'connect-bank'
          }
        ]"

        @click="navigate('/connect-bank')"
      >

        Connect bank

        <span class="plus">
          +
        </span>

      </button>


      <button
        :class="[
          'side-link',
          {
            active: page === 'profile'
          }
        ]"

        @click="navigate('/profile')"
      >

        Profile

      </button>



      <div class="side-bottom">

        <button
          class="side-link"
          @click="logout"
        >
          Log out
        </button>


        <div class="user-chip">


          <span class="avatar">
            {{ userInitials }}
          </span>


          <div>


            <b>
              {{ user?.name || "User" }}
            </b>



            <small>
              {{ user?.email || "Personal account" }}
            </small>

          </div>

        </div>

      </div>

    </aside>

    <div class="mobile-bar">

      <button
        class="menu-button"
        @click="menuOpen = !menuOpen"
      >
        ☰
      </button>


      <button
        class="brand"
        @click="navigate('/dashboard')"
      >

        <span class="brand-mark">
          F
        </span>

        FinView

      </button>

    </div>



    <main class="transactions-page">
      <div class="page-header">
        <div>
          <p class="welcome">FinView</p>
          <h1>Transactions</h1>
          <p class="subtitle">View and manage your recent banking activity.</p>
        </div>

        <button class="back-btn" @click="goDashboard">← Dashboard</button>
      </div>

      <div class="summary">
        <div class="summary-card">
          <span>Total Income</span>
          <strong>₦850,000</strong>
        </div>

        <div class="summary-card">
          <span>Total Expenses</span>
          <strong>₦320,500</strong>
        </div>

        <div class="summary-card">
          <span>Transactions</span>
          <strong>{{ filteredTransactions.length }}</strong>
        </div>
      </div>

      <div class="filters">
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Search transactions..."
        />

        <select v-model="typeFilter">
          <option value="All">All Transactions</option>
          <option value="Income">Income</option>
          <option value="Expense">Expenses</option>
        </select>
      </div>
      <div class="transaction-card">
        <div class="transaction-header">
          <h2>Recent Transactions</h2>
          <span>{{ filteredTransactions.length }} records</span>
        </div>

        <div
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="transaction"
        >
          <div class="transaction-icon">
            {{ transaction.icon }}
          </div>

          <div class="transaction-info">
            <strong>{{ transaction.description }}</strong>
            <span> {{ transaction.date }} · {{ transaction.bank }} </span>
          </div>

          <div class="transaction-amount" :class="transaction.type.toLowerCase()">
            {{ transaction.type === "Income" ? "+" : "-" }}
            ₦{{ transaction.amount.toLocaleString() }}
          </div>
        </div>

        <div v-if="filteredTransactions.length === 0" class="empty">
          No transactions found.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getSession, clearSession } from "../session.js";

const router = useRouter();

// Sidebar state
const menuOpen = ref(false);
const page = "transactions";
const user = ref(null);

const userInitials = computed(() => {
  const name = user.value?.name;
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

function navigate(path) {
  menuOpen.value = false;
  router.push(path);
}

function logout() {
  clearSession?.();
  router.push("/");
}

onMounted(() => {
  const session = getSession();
  user.value = session?.user || null;
});


const search = ref("");
const typeFilter = ref("All");

const transactions = ref([
  {
    id: 1,
    description: "Transfer from Ahmed",
    date: "26 Aug 2026",
    bank: "Moniepoint",
    type: "Income",
    amount: 50000,
    icon: "↗️",
  },
  {
    id: 2,
    description: "Netflix Subscription",
    date: "25 Aug 2026",
    bank: "Moniepoint",
    type: "Expense",
    amount: 8500,
    icon: "🎬",
  },
  {
    id: 3,
    description: "Salary Payment",
    date: "24 Aug 2026",
    bank: "Moniepoint",
    type: "Income",
    amount: 300000,
    icon: "💰",
  },
  {
    id: 4,
    description: "Electricity Bill",
    date: "23 Aug 2026",
    bank: "Moniepoint",
    type: "Expense",
    amount: 25000,
    icon: "⚡",
  },
  {
    id: 5,
    description: "Transfer to John",
    date: "22 Aug 2026",
    bank: "Moniepoint",
    type: "Expense",
    amount: 75000,
    icon: "↙️",
  },
  {
    id: 6,
    description: "Cashback",
    date: "21 Aug 2026",
    bank: "Moniepoint",
    type: "Income",
    amount: 15000,
    icon: "🎁",
  },
  {
    id: 7,
    description: "Airtime Purchase",
    date: "20 Aug 2026",
    bank: "Moniepoint",
    type: "Expense",
    amount: 5000,
    icon: "📱",
  },
  {
    id: 8,
    description: "Salary recieved",
    date:"24 Aug 2026",
    bank:"GT Bank",
    type:"Income",
    amount:"300,000",
    icon:"💰",
  },
   {
    id: 8,
    description: "Grocery shopping",
    date:"23 Aug 2026",
    bank:"Access Bank",
    type:"Expenses",
    amount:"-28,500",
    icon:"",
  },

   {
    id: 8,
    description: "Internet subscription",
    date:"21 Aug 2026",
    bank:"GT Bank",
    type:"",
    amount:"18000",
    icon:"⚡",
  },
   
]);

const filteredTransactions = computed(() => {
  return transactions.value.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(search.value.toLowerCase());

    const matchesType =
      typeFilter.value === "All" || transaction.type === typeFilter.value;

    return matchesSearch && matchesType;
  });
});

function goDashboard() {
  router.push("/dashboard");
}
</script>

<style scoped>

.layout {
  display: flex;
  min-height: 100vh;
}

aside {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.layout main {
  flex: 1;
  min-width: 0;
  padding: 2rem;
}

.mobile-bar {
  display: none;
}

@media (max-width: 900px) {

  .layout {
    display: block;
  }

  aside {
    position: fixed;
    left: -260px;
    top: 0;
    height: 100vh;
    transition: left 0.2s ease;
    z-index: 50;
  }

  aside.open {
    left: 0;
  }

  .mobile-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
  }

}

</style>