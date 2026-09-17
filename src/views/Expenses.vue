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



    <main class="expenses-page">

      <div class="page-header">
        <div>
          <p class="brand">FinView</p>
          <h1>Expenses</h1>
          <p>Track where your money is going.</p>
        </div>

        <button class="back-btn" @click="goDashboard">
          ← Dashboard
        </button>
      </div>


      <div class="summary">

        <div class="summary-card">
          <span>Total Expenses</span>
          <strong>₦320,500</strong>
          <small>This month</small>
        </div>

        <div class="summary-card">
          <span>Average Daily</span>
          <strong>₦10,683</strong>
          <small>Based on this month</small>
        </div>

        <div class="summary-card">
          <span>Largest Expense</span>
          <strong>₦75,000</strong>
          <small>Transfer</small>
        </div>

      </div>


    
      <div class="top-section">

        <div>
          <h2>Expense Overview</h2>
          <p>Monitor your spending by category.</p>
        </div>

        <button class="add-btn" @click="showForm = !showForm">
          + Add Expense
        </button>

      </div>


    
      <div v-if="showForm" class="expense-form">

        <h2>Add New Expense</h2>

        <input
          v-model="newExpense.description"
          type="text"
          placeholder="Expense description"
        />

        <input
          v-model.number="newExpense.amount"
          type="number"
          placeholder="Amount"
        />

        <select v-model="newExpense.category">
          <option disabled value="">Select category</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>

        <button class="save-btn" @click="addExpense">
          Save Expense
        </button>

      </div>

      <div class="categories">

        <div
          v-for="category in categories"
          :key="category.name"
          class="category-card"
        >

          <div class="category-icon">
            {{ category.icon }}
          </div>

          <div>
            <strong>{{ category.name }}</strong>

            <p>
              ₦{{ category.amount.toLocaleString() }}
            </p>
          </div>

        </div>

      </div>


      <div class="expenses-card">

        <div class="card-header">
          <h2>Recent Expenses</h2>

          <select v-model="categoryFilter">
            <option value="All">All Categories</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Bills</option>
            <option>Shopping</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
        </div>


        <div
          v-for="expense in filteredExpenses"
          :key="expense.id"
          class="expense-row"
        >

          <div class="expense-icon">
            {{ expense.icon }}
          </div>

          <div class="expense-info">
            <strong>{{ expense.description }}</strong>
            <span>
              {{ expense.date }} · {{ expense.category }}
            </span>
          </div>

          <strong class="amount">
            -₦{{ expense.amount.toLocaleString() }}
          </strong>

        </div>


        <div
          v-if="filteredExpenses.length === 0"
          class="empty"
        >
          No expenses found.
        </div>

      </div>

    </main>

  </div>
</template>


<script setup>

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSession, clearSession } from '../session.js'

const router = useRouter()

// Sidebar state
const menuOpen = ref(false)
const page = 'expenses'
const user = ref(null)

const userInitials = computed(() => {
  const name = user.value?.name
  if (!name) return 'U'

  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

function navigate(path) {
  menuOpen.value = false
  router.push(path)
}

function logout() {
  clearSession?.()
  router.push('/')
}

onMounted(() => {
  const session = getSession()
  user.value = session?.user || null
})


const showForm = ref(false)

const categoryFilter = ref('All')

const newExpense = ref({
  description: '',
  amount: null,
  category: ''
})


const expenses = ref([
  {
    id: 1,
    description: 'Transfer to John',
    amount: 75000,
    category: 'Other',
    date: '26 Aug 2026',
    icon: '↙️'
  },
  {
    id: 2,
    description: 'Electricity Bill',
    amount: 25000,
    category: 'Bills',
    date: '23 Aug 2026',
    icon: '⚡'
  },
  {
    id: 3,
    description: 'Netflix Subscription',
    amount: 8500,
    category: 'Entertainment',
    date: '22 Aug 2026',
    icon: '🎬'
  },
  {
    id: 4,
    description: 'Airtime Purchase',
    amount: 5000,
    category: 'Bills',
    date: '20 Aug 2026',
    icon: '📱'
  },
  {
    id: 5,
    description: 'Groceries',
    amount: 45000,
    category: 'Food',
    date: '18 Aug 2026',
    icon: '🛒'
  },
  {
    id: 6,
    description: 'Transport',
    amount: 12000,
    category: 'Transport',
    date: '17 Aug 2026',
    icon: '🚗'
  }
])


const filteredExpenses = computed(() => {

  if (categoryFilter.value === 'All') {
    return expenses.value
  }

  return expenses.value.filter(
    expense => expense.category === categoryFilter.value
  )

})


const categories = computed(() => {

  const categoryNames = [
    {
      name: 'Food',
      icon: '🍔'
    },
    {
      name: 'Transport',
      icon: '🚗'
    },
    {
      name: 'Bills',
      icon: '💡'
    },
    {
      name: 'Shopping',
      icon: '🛍️'
    }
  ]

  return categoryNames.map(category => {

    const total = expenses.value
      .filter(expense => expense.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0)

    return {
      ...category,
      amount: total
    }

  })

})


function addExpense() {

  if (
    !newExpense.value.description ||
    !newExpense.value.amount ||
    !newExpense.value.category
  ) {

    alert('Please fill in all expense details.')

    return

  }


  expenses.value.unshift({

    id: Date.now(),

    description: newExpense.value.description,

    amount: Number(newExpense.value.amount),

    category: newExpense.value.category,

    date: new Date().toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ),

    icon: '💳'

  })


  newExpense.value = {
    description: '',
    amount: null,
    category: ''
  }

  showForm.value = false

}


function goDashboard() {

  router.push('/dashboard')

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