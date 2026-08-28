<script setup>
import DashboardLayout from "../components/DashboardLayout.vue";
defineProps({
  page: String,
  title: String,
  menuOpen: Boolean,
  accounts: Array,
  transactions: Array,
  totalBalance: Number,
  naira: Function,
});
defineEmits(["navigate", "toggle-menu"]);
</script>
<template>
  <DashboardLayout
    :page="page"
    :title="title"
    :menu-open="menuOpen"
    @navigate="$emit('navigate', $event)"
    @toggle-menu="$emit('toggle-menu')"
    ><section class="balance-row">
      <div class="balance-card">
        <div class="card-kicker">TOTAL BALANCE <span>•••</span></div>
        <strong>{{ naira(totalBalance) }}</strong>
        <p class="positive">↗ ₦195,000 <span>this month</span></p>
        <div class="balance-bars">
          <i
            v-for="bar in [35, 48, 42, 65, 56, 72, 88, 78, 94]"
            :key="bar"
            :style="{ height: bar + '%' }"
          ></i>
        </div>
      </div>
      <div class="quick-card">
        <p class="card-kicker">MONTHLY SPENDING</p>
        <strong>₦163,500</strong>
        <p class="muted">↓ 12.8% from last month</p>
        <div class="progress"><i style="width: 68%"></i></div>
        <small>68% of ₦240,000 budget</small>
      </div>
    </section>
    <section class="content-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">CONNECTED ACCOUNTS</p>
          <h2>Your accounts</h2>
        </div>
        <button class="button dark" @click="$emit('navigate', '/connect-bank')">
          + Connect bank
        </button>
      </div>
      <div class="account-grid">
        <article
          v-for="account in accounts"
          :key="account.id"
          :class="['account-card', account.tone]"
        >
          <div class="account-top">
            <span class="bank-logo">{{ account.short }}</span
            ><span class="card-menu">•••</span>
          </div>
          <p>{{ account.bank }}</p>
          <small>{{ account.type }} · •••• {{ account.number }}</small
          ><strong>{{ naira(account.balance) }}</strong
          ><button @click="$emit('navigate', '/accounts/' + account.id)">
            View details <span>↗</span>
          </button>
        </article>
      </div>
    </section>
    <section class="content-section lower-grid">
      <div>
        <div class="section-heading">
          <div>
            <p class="eyebrow">LATEST ACTIVITY</p>
            <h2>Recent transactions</h2>
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
            v-for="item in transactions.slice(0, 4)"
            :key="item.description"
            class="activity"
          >
            <span :class="['activity-icon', item.incoming ? 'in' : 'out']">{{
              item.incoming ? "↗" : "↘"
            }}</span>
            <div>
              <b>{{ item.description }}</b
              ><small>{{ item.bank }} · {{ item.date }}</small>
            </div>
            <strong :class="item.incoming ? 'positive' : ''"
              >{{ item.incoming ? "+" : "-" }}{{ naira(item.amount) }}</strong
            >
          </div>
        </div>
      </div>
      <div class="insight">
        <p class="eyebrow">SPENDING THIS MONTH</p>
        <h2>₦163,500</h2>
        <div class="donut">
          <span>5<br /><small>categories</small></span>
        </div>
        <p class="muted">
          Your spending is down <b class="positive">12.8%</b> from last month.
        </p>
      </div>
    </section></DashboardLayout
  >
</template>
