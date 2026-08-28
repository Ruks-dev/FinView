<script setup>
import MarketingLayout from "../components/MarketingLayout.vue";
defineEmits(["navigate"]);
</script>
<template>
  <MarketingLayout @navigate="$emit('navigate', $event)"
    ><main>
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">OPEN BANKING, MADE SIMPLE</p>
          <h1>All your banks.<br /><em>One clear view.</em></h1>
          <p class="hero-text">
            Connect your bank accounts and see your balances, transactions and
            expenses in one simple dashboard.
          </p>
          <div class="hero-actions">
            <button
              class="button dark large"
              @click="$emit('navigate', '/dashboard')"
            >
              Get started <span>↗</span></button
            ><a class="text-link" href="#features"
              >See how it works <span>↓</span></a
            >
          </div>
        </div>
        <div class="hero-art">
          <div class="art-label">YOUR MONEY, IN FOCUS</div>
          <div class="preview-card">
            <div class="preview-top"><span>Total balance</span><b>•••</b></div>
            <strong>₦2,520,000</strong>
            <div class="chart"><i v-for="bar in 7" :key="bar"></i></div>
            <small>+8.4% <span>this month</span></small>
          </div>
          <div class="floating-note">
            <span class="mini-icon green">↗</span>
            <div><b>₦300,000</b><small>Salary received</small></div>
          </div>
          <div class="art-circle">₦</div>
        </div>
      </section>
      <section id="features" class="section">
        <p class="eyebrow">EVERYTHING IN ONE PLACE</p>
        <h2>Clarity for every naira.</h2>
        <div class="feature-grid">
          <article
            v-for="feature in [
              'Multiple bank accounts',
              'Account balances',
              'Transaction history',
              'Expense tracking',
              'Financial overview',
              'Secure account management',
            ]"
            :key="feature"
          >
            <span class="feature-icon">✦</span>
            <h3>{{ feature }}</h3>
            <p>
              Keep your financial picture clear, current and easy to understand.
            </p>
          </article>
        </div>
      </section>
      <section id="about" class="steps section">
        <div>
          <p class="eyebrow">HOW IT WORKS</p>
          <h2>From scattered to sorted.</h2>
        </div>
        <div class="step-list">
          <div
            v-for="(step, index) in [
              'Create your account',
              'Connect your banks',
              'View your finances',
            ]"
            :key="step"
            class="step"
          >
            <span>0{{ index + 1 }}</span>
            <div>
              <h3>{{ step }}</h3>
              <p>Set up your secure view in less than five minutes.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="faq" class="faq section">
        <p class="eyebrow">QUESTIONS, ANSWERED</p>
        <h2>A clearer way to look at money.</h2>
        <details open>
          <summary>Can FinView move my money?</summary>
          <p>
            No. FinView is strictly read-only and never transfers, pays,
            withdraws or deposits money.
          </p>
        </details>
        <details>
          <summary>Is my banking information secure?</summary>
          <p>
            FinView uses mock accounts for this student project and never
            requests real banking credentials.
          </p>
        </details>
        <details>
          <summary>Can I connect more than one bank?</summary>
          <p>
            Yes. Add as many mock accounts as you need to see the bigger
            picture.
          </p>
        </details>
      </section>
    </main></MarketingLayout
  >
</template>
