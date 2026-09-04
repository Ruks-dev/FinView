<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MarketingLayout from "../components/MarketingLayout.vue";
import { apiUrl } from "../api.js";
import { saveSession } from "../session.js";

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
});
const router = useRouter();

const emit = defineEmits(["navigate"]);

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!email.value || !password.value) {
    errorMessage.value = "Email and password are required.";
    return;
  }

  if (props.mode === "signup") {
    if (!name.value) {
      errorMessage.value = "Name is required.";
      return;
    }

    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Passwords do not match.";
      return;
    }
  }

  try {
    loading.value = true;

    const url =
      props.mode === "login"
        ? apiUrl("/api/users/login")
        : apiUrl("/api/users");

    const body =
      props.mode === "login"
        ? {
            email: email.value,
            password: password.value,
          }
        : {
            name: name.value,
            email: email.value,
            password: password.value,
          };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    if (props.mode === "login") {
      const session = {
        user: data.user,
        token: data.token || "",
      };

      saveSession(session);
      router.push("/dashboard");
    } else {
      successMessage.value = "Account created successfully.";

      // Move user to login after signup
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <MarketingLayout @navigate="$emit('navigate', $event)">
    <main class="auth-page">
      <div class="auth-panel">
        <button class="brand" @click="$emit('navigate', '/')">
          <span class="brand-mark">F</span> FinView
        </button>

        <p class="eyebrow">
          {{
            props.mode === "login"
              ? "WELCOME BACK"
              : "START YOUR CLEARER VIEW"
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

        <form @submit.prevent="handleSubmit">
          <label v-if="props.mode === 'signup'">
            Full name
            <input
              v-model="name"
              placeholder="Ruks Abdul"
              type="text"
            />
          </label>

          <label>
            Email
            <input
              v-model="email"
              type="email"
              placeholder="you@email.com"
            />
          </label>

          <label>
            Password
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
            />
          </label>

          <label v-if="props.mode === 'signup'">
            Confirm password
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
            />
          </label>

          <label v-if="props.mode === 'signup'" class="check">
            <input type="checkbox" />
            I agree to the terms and privacy policy
          </label>

          <div v-else class="form-row">
            <label class="check">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#">Forgot password?</a>
          </div>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>

          <button
            type="submit"
            class="button dark full"
            :disabled="loading"
          >
            {{
              loading
                ? "Please wait..."
                : props.mode === "login"
                ? "Log in"
                : "Create account"
            }}

            <span>↗</span>
          </button>
        </form>

        <p class="auth-switch">
          {{
            props.mode === "login"
              ? "New to FinView?"
              : "Already have an account?"
          }}

          <button
            @click="
              $emit(
                'navigate',
                props.mode === 'login' ? '/signup' : '/login'
              )
            "
          >
            {{ props.mode === "login" ? "Sign up" : "Log in" }}
          </button>
        </p>
      </div>
    </main>
  </MarketingLayout>
</template>