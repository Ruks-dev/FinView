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



    <main class="accounts-page">
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

      <div v-if="loading" class="empty">
        <h2>Loading accounts...</h2>
      </div>

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

          <div class="account-number">
            Account Number

            <strong>
              {{ maskAccountNumber(account.account_number) }}
            </strong>
          </div>

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
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { apiUrl } from "../api.js";
import { getSession, clearSession } from "../session.js";

const router = useRouter();

const accounts = ref([]);
const loading = ref(true);

// Sidebar state
const menuOpen = ref(false);
const page = "accounts";
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

  getAccounts();
});


// Get the logged-in user's bank accounts
async function getAccounts() {
  try {
    loading.value = true;

    const session = getSession();
    const currentUser = session?.user;

    if (!currentUser) {
      router.push("/login");
      return;
    }

    // Get bank accounts belonging to this user
    const response = await fetch(
      apiUrl(`/api/bank-accounts?user_id=${currentUser.user_id}`),
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
  navigate("/connect-bank");
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