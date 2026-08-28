<script setup>
import MarketingLayout from "../components/MarketingLayout.vue";
const props = defineProps({ mode: { type: String, required: true } });
defineEmits(["navigate"]);
</script>
<template>
  <MarketingLayout @navigate="$emit('navigate', $event)"
    ><main class="auth-page">
      <div class="auth-panel">
        <button class="brand" @click="$emit('navigate', '/')">
          <span class="brand-mark">F</span> FinView
        </button>
        <p class="eyebrow">
          {{
            props.mode === "login" ? "WELCOME BACK" : "START YOUR CLEARER VIEW"
          }}
        </p>
        <h1>
          {{
            props.mode === "login"
              ? "Good to see you."
              : "Make money make sense."
          }}
        </h1>
        <p class="muted">
          {{
            props.mode === "login"
              ? "Log in to your financial overview."
              : "Create an account. It only takes a minute."
          }}
        </p>
        <label v-if="props.mode === 'signup'"
          >Full name<input placeholder="Ruks Abdul" /></label
        ><label>Email<input type="email" placeholder="you@email.com" /></label
        ><label>Password<input type="password" placeholder="••••••••" /></label
        ><label v-if="props.mode === 'signup'"
          >Confirm password<input
            type="password"
            placeholder="••••••••" /></label
        ><label v-if="props.mode === 'signup'" class="check"
          ><input type="checkbox" /> I agree to the terms and privacy
          policy</label
        >
        <div v-else class="form-row">
          <label class="check"><input type="checkbox" /> Remember me</label
          ><a href="#">Forgot password?</a>
        </div>
        <button
          class="button dark full"
          @click="$emit('navigate', '/dashboard')"
        >
          {{ props.mode === "login" ? "Log in" : "Create account" }}
          <span>↗</span>
        </button>
        <p class="auth-switch">
          {{
            props.mode === "login"
              ? "New to FinView?"
              : "Already have an account?"
          }}
          <button
            @click="
              $emit('navigate', props.mode === 'login' ? '/signup' : '/login')
            "
          >
            {{ props.mode === "login" ? "Sign up" : "Log in" }}
          </button>
        </p>
      </div>
    </main></MarketingLayout
  >
</template>
