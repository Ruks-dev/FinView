<template>
  <div class="profile-page">

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

      <!-- Profile card -->
      <div class="profile-card">

        <div class="avatar">
          {{ initials }}
        </div>

        <h2>{{ fullName || 'BankScope User' }}</h2>

        <p>{{ email || 'No email added' }}</p>

        <span class="status">
          ● Account Active
        </span>

      </div>


      <!-- Personal information -->
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


      <!-- Security -->
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

  </div>
</template>


<script setup>

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const phone = ref('')

const editing = ref(false)


onMounted(() => {

  const savedUser = localStorage.getItem('bankscopeUser')

  if (savedUser) {

    const user = JSON.parse(savedUser)

    fullName.value = user.fullName || ''
    email.value = user.email || ''
    phone.value = user.phone || ''

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

