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



    <main class="profile-page">

      <div class="page-header">
        <div>
          <p class="brand">FinView</p>
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings.</p>
        </div>

        <button class="back-btn" @click="goDashboard">
          ← Dashboard
        </button>
      </div>


      <div class="profile-grid">


        <div class="profile-card">

          <div class="avatar">
            {{ initials }}
          </div>

          <h2>{{ fullName || 'FinView User' }}</h2>

          <p>{{ email || 'No email added' }}</p>

          <span class="status">
            ● Account Active
          </span>

        </div>


        <div class="details-card">

          <div class="card-title">
            <h2>Personal Information</h2>

            <button @click="toggleEdit">
              {{ editing ? 'Cancel' : 'Edit' }}
            </button>
          </div>


          <div class="form-group">
            <label>Full Name</label>

            <input
              v-model="fullName"
              :disabled="!editing"
              type="text"
            />
          </div>


          <div class="form-group">
            <label>Email Address</label>

            <input
              v-model="email"
              :disabled="!editing"
              type="email"
            />
          </div>


          <div class="form-group">
            <label>Phone Number</label>

            <input
              v-model="phone"
              :disabled="!editing"
              type="tel"
            />
          </div>


          <button
            v-if="editing"
            class="save-btn"
            @click="saveProfile"
          >
            Save Changes
          </button>

        </div>


      
        <div class="security-card">

          <h2>Security</h2>

          <div class="security-item">
            <div>
              <strong>Password</strong>
              <p>Keep your account secure with a strong password.</p>
            </div>

            <button @click="changePassword">
              Change
            </button>
          </div>


          <div class="security-item">
            <div>
              <strong>Bank Connections</strong>
              <p>Manage the banks connected to FinView.</p>
            </div>

            <button @click="goAccounts">
              Manage
            </button>
          </div>

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
const page = 'profile'
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


const fullName = ref('')
const email = ref('')
const phone = ref('')

const editing = ref(false)


onMounted(() => {

  // Sidebar user chip
  const session = getSession()
  user.value = session?.user || null

  // Profile form data
  const savedUser = localStorage.getItem('bankscopeUser')

  if (savedUser) {

    const savedProfile = JSON.parse(savedUser)

    fullName.value = savedProfile.fullName || ''
    email.value = savedProfile.email || ''
    phone.value = savedProfile.phone || ''

  }

})


const initials = computed(() => {

  if (!fullName.value) {
    return 'BS'
  }

  return fullName.value
    .split(' ')
    .map(name => name[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

})


function toggleEdit() {

  editing.value = !editing.value

}


function saveProfile() {

  const user = {
    fullName: fullName.value,
    email: email.value,
    phone: phone.value
  }

  localStorage.setItem(
    'bankscopeUser',
    JSON.stringify(user)
  )

  editing.value = false

  alert('Profile updated successfully!')

}


function changePassword() {

  alert('Password change feature will be connected to authentication later.')

}


function goDashboard() {

  router.push('/dashboard')

}


function goAccounts() {

  router.push('/accounts')

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