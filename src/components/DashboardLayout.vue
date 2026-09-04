<script setup>
import { computed } from "vue";

const props = defineProps({
  page: String,
  title: String,
  menuOpen: Boolean,
  user: Object,
});

defineEmits(["navigate", "toggle-menu"]);


// Get user's initials
const userInitials = computed(() => {
  if (!props.user?.name) {
    return "U";
  }

  return props.user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
});


// Get first name
const firstName = computed(() => {
  if (!props.user?.name) {
    return "User";
  }

  return props.user.name.split(" ")[0];
});


// Get current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toUpperCase();
});
</script>


<template>

  <div class="app-shell">

    <!-- ========================= -->
    <!-- SIDEBAR -->
    <!-- ========================= -->

    <aside :class="{ open: menuOpen }">

      <!-- FinView Logo -->

      <button
        class="brand"
        @click="$emit('navigate', '/dashboard')"
      >

        <span class="brand-mark">
          F
        </span>

        FinView

      </button>


      <!-- OVERVIEW -->

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

        @click="
          $emit(
            'navigate',
            '/' + item[0]
          )
        "
      >

        {{ item[1] }}

      </button>


      <!-- MANAGE -->

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

        @click="
          $emit(
            'navigate',
            '/connect-bank'
          )
        "
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

        @click="
          $emit(
            'navigate',
            '/profile'
          )
        "
      >

        Profile

      </button>


      <!-- ========================= -->
      <!-- BOTTOM USER SECTION -->
      <!-- ========================= -->

      <div class="side-bottom">

        <button
          class="side-link"
          @click="
            $emit(
              'navigate',
              '/'
            )
          "
        >
          Log out
        </button>


        <div class="user-chip">

          <!-- Dynamic Avatar -->

          <span class="avatar">
            {{ userInitials }}
          </span>


          <div>

            <!-- Dynamic Name -->

            <b>
              {{ user?.name || "User" }}
            </b>


            <!-- Dynamic Email -->

            <small>
              {{ user?.email || "Personal account" }}
            </small>

          </div>

        </div>

      </div>

    </aside>


    <!-- ========================= -->
    <!-- MOBILE BAR -->
    <!-- ========================= -->

    <div class="mobile-bar">

      <button
        class="menu-button"
        @click="$emit('toggle-menu')"
      >
        ☰
      </button>


      <button
        class="brand"
        @click="$emit('navigate', '/dashboard')"
      >

        <span class="brand-mark">
          F
        </span>

        FinView

      </button>

    </div>


    <!-- ========================= -->
    <!-- MAIN CONTENT -->
    <!-- ========================= -->

    <main class="dashboard-main">


      <!-- HEADER -->

      <header class="dash-header">

        <div>

          <p class="eyebrow">
            {{ currentDate }}
          </p>


          <h1>

            {{
              page === "dashboard"
                ? `Good morning, ${firstName}`
                : title
            }}

          </h1>


          <p
            v-if="page === 'dashboard'"
            class="muted"
          >
            Here's what's happening across your accounts.
          </p>

        </div>


        <button class="notification">
          ¤
        </button>

      </header>


      <!-- PAGE CONTENT -->

      <slot />

    </main>

  </div>

</template>