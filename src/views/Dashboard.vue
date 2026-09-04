```vue
<script setup>
import { computed } from "vue";
import DashboardLayout from "../components/DashboardLayout.vue";

const props = defineProps({
  page: String,
  title: String,
  menuOpen: Boolean,
  user: Object,
  accounts: Array,
  transactions: Array,
  totalBalance: Number,
  naira: Function,
});

const monthlySpending = computed(() => {
  const now = new Date();

  return (props.transactions || []).reduce((sum, item) => {
    if (item.incoming) {
      return sum;
    }

    const itemDate = new Date(
      item.date || item.transaction_date || item.created_at || Date.now()
    );
    const isCurrentMonth =
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear();

    return isCurrentMonth ? sum + Number(item.amount || 0) : sum;
  }, 0);
});

const previousMonthSpending = computed(() => {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return (props.transactions || []).reduce((sum, item) => {
    if (item.incoming) {
      return sum;
    }

    const itemDate = new Date(
      item.date || item.transaction_date || item.created_at || Date.now()
    );
    const isPreviousMonth =
      itemDate.getMonth() === previousMonth.getMonth() &&
      itemDate.getFullYear() === previousMonth.getFullYear();

    return isPreviousMonth ? sum + Number(item.amount || 0) : sum;
  }, 0);
});

const monthlyBudget = computed(() => Math.max(240000, monthlySpending.value * 1.5));

const spendingRatio = computed(() => {
  if (!monthlyBudget.value) {
    return 0;
  }

  return Math.min((monthlySpending.value / monthlyBudget.value) * 100, 100);
});

const spendingChange = computed(() => {
  if (!previousMonthSpending.value) {
    return 0;
  }

  return ((monthlySpending.value - previousMonthSpending.value) / previousMonthSpending.value) * 100;
});

const spendingTrendLabel = computed(() => {
  if (!previousMonthSpending.value) {
    return "No prior month data";
  }

  const change = Math.abs(spendingChange.value).toFixed(1);
  return `${spendingChange.value <= 0 ? "↓" : "↑"} ${change}% from last month`;
});

const recentTransactions = computed(() => {
  return (props.transactions || []).slice().sort((a, b) => {
    const first = new Date(a.date || a.transaction_date || a.created_at || Date.now());
    const second = new Date(b.date || b.transaction_date || b.created_at || Date.now());
    return second - first;
  }).slice(0, 4);
});

const spendingCategoriesCount = computed(() => {
  const now = new Date();
  const uniqueCategories = new Set();

  (props.transactions || []).forEach((item) => {
    if (item.incoming) {
      return;
    }

    const itemDate = new Date(
      item.date || item.transaction_date || item.created_at || Date.now()
    );
    const isCurrentMonth =
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear();

    if (isCurrentMonth && item.category) {
      uniqueCategories.add(item.category);
    }
  });

  return uniqueCategories.size;
});

defineEmits(["navigate", "toggle-menu"]);
</script>

<template>
  <DashboardLayout
    :page="page"
    :title="title"
    :menu-open="menuOpen"
    :user="user"
    @navigate="$emit('navigate', $event)"
    @toggle-menu="$emit('toggle-menu')"
  >

    <!-- BALANCE SECTION -->
    <section class="balance-row">

      <!-- TOTAL BALANCE -->
      <div class="balance-card">

        <div class="card-kicker">
          TOTAL BALANCE <span>•••</span>
        </div>

        <strong>
          {{ naira(totalBalance) }}
        </strong>

        <p class="positive">
          ↗ Your connected accounts
          <span>current balance</span>
        </p>

        <div class="balance-bars">

          <i
            v-for="bar in [35, 48, 42, 65, 56, 72, 88, 78, 94]"
            :key="bar"
            :style="{ height: bar + '%' }"
          ></i>

        </div>

      </div>


      <!-- MONTHLY SPENDING -->
      <div class="quick-card">

        <p class="card-kicker">
          MONTHLY SPENDING
        </p>

        <strong>
          {{ props.naira(monthlySpending) }}
        </strong>

        <p class="muted">
          {{ spendingTrendLabel }}
        </p>

        <div class="progress">
          <i :style="{ width: Math.max(0, Math.min(spendingRatio, 100)) + '%' }"></i>
        </div>

        <small>
          {{ Math.round(spendingRatio) }}% of {{ props.naira(monthlyBudget) }} budget
        </small>

      </div>

    </section>


    <!-- CONNECTED ACCOUNTS -->
    <section class="content-section">

      <div class="section-heading">

        <div>

          <p class="eyebrow">
            CONNECTED ACCOUNTS
          </p>

          <h2>
            Your accounts
          </h2>

        </div>


        <button
          class="button dark"
          @click="$emit('navigate', '/connect-bank')"
        >
          + Connect bank
        </button>

      </div>


      <!-- ACCOUNTS EXIST -->
      <div
        v-if="accounts && accounts.length"
        class="account-grid"
      >

        <article
          v-for="account in accounts"
          :key="account.account_id"
          class="account-card"
        >

          <div class="account-top">

            <span class="bank-logo">

              {{
                account.bank_name
                  ? account.bank_name
                      .substring(0, 2)
                      .toUpperCase()
                  : "B"
              }}

            </span>

            <span class="card-menu">
              •••
            </span>

          </div>


          <p>
            {{ account.bank_name }}
          </p>


          <small>

            {{ account.account_type }}

            · ••••
            {{ account.account_number?.slice(-4) }}

          </small>


          <strong v-if="account.balance">

            {{
              account.balance.currency ||
              account.currency ||
              "₦"
            }}

            {{
              Number(
                account.balance.available_balance || 0
              ).toLocaleString()
            }}

          </strong>


          <strong v-else>
            Balance unavailable
          </strong>


          <button
            @click="
              $emit(
                'navigate',
                '/accounts/' + account.account_id
              )
            "
          >

            View details
            <span>↗</span>

          </button>

        </article>

      </div>


      <!-- NO ACCOUNTS -->
      <div
        v-else
        class="empty"
      >

        <div class="empty-icon">
          🏦
        </div>

        <h2>
          No bank connected
        </h2>

        <p>
          Connect your bank to see your account
          information here.
        </p>

        <button
          @click="$emit('navigate', '/connect-bank')"
        >
          Connect Your First Bank
        </button>

      </div>

    </section>


    <!-- LOWER DASHBOARD -->
    <section class="content-section lower-grid">

      <!-- RECENT TRANSACTIONS -->
      <div>

        <div class="section-heading">

          <div>

            <p class="eyebrow">
              LATEST ACTIVITY
            </p>

            <h2>
              Recent transactions
            </h2>

          </div>


          <button
            class="link-button"
            @click="$emit('navigate', '/transactions')"
          >
            View all ↗
          </button>

        </div>


        <div class="activity-list">

          <div
            v-if="recentTransactions && recentTransactions.length"
            v-for="(item, index) in recentTransactions"
            :key="
              item.transaction_id ||
              item.id ||
              index
            "
            class="activity"
          >

            <span
              :class="[
                'activity-icon',
                item.incoming ? 'in' : 'out'
              ]"
            >

              {{ item.incoming ? "↗" : "↘" }}

            </span>


            <div>

              <b>

                {{
                  item.description ||
                  item.transaction_description ||
                  "Transaction"
                }}

              </b>


              <small>

                {{
                  item.bank_name ||
                  item.bank ||
                  "Bank"
                }}

                ·

                {{
                  item.date ||
                  item.transaction_date ||
                  ""
                }}

              </small>

            </div>


            <strong
              :class="item.incoming ? 'positive' : ''"
            >

              {{ item.incoming ? "+" : "-" }}

              {{ naira(item.amount || 0) }}

            </strong>

          </div>


          <!-- NO TRANSACTIONS -->
          <div
            v-else
            class="empty"
          >

            <p>
              No transactions yet.
            </p>

          </div>

        </div>

      </div>


      <!-- SPENDING INSIGHT -->
      <div class="insight">

        <p class="eyebrow">
          SPENDING THIS MONTH
        </p>

        <h2>
          {{ props.naira(monthlySpending) }}
        </h2>


        <div class="donut">

          <span>

            {{ spendingCategoriesCount }}
            <br />

            <small>
              categories
            </small>

          </span>

        </div>


        <p class="muted">

          Your spending

          <b :class="spendingChange <= 0 ? 'positive' : ''">
            {{ spendingChange <= 0 ? 'is down' : 'is up' }}
          </b>

          <b :class="spendingChange <= 0 ? 'positive' : ''">
            {{ Math.abs(spendingChange).toFixed(1) }}%
          </b>

          from last month.

        </p>

      </div>

    </section>

  </DashboardLayout>
</template>
```
