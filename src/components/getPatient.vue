<script setup>
import '@/assets/formStyle.css'
import { watch, ref, onMounted } from 'vue'
import { usePatientStore } from '@/stores/usePatientStore'
import ListItem from './listItem.vue'

const searchText = ref('')
const store = usePatientStore()
const errors = ref({ patientName: '', diagnosis: '', doctorId: '' })

watch(searchText, (val) => {
  store.setSearch(val)
})
onMounted(() => {
  store.fetchPatients()
})
const newPatient = ref({ patientName: '', diagnosis: '', doctorId: '' })

function validateStringField(value, fieldName, min = 2, max = 30) {
  if (!value) return `${fieldName} is required.`
  if (/\d/.test(value)) return `${fieldName} should not contain numbers.`
  if (value.length < min) return `${fieldName} must be at least ${min} characters.`
  if (value.length > max) return `${fieldName} must be at most ${max} characters.`
  return ''
}

function validateDoctorId(value) {
  if (!value) return 'Doctor ID is required.'
  if (!/^\d+$/.test(value)) return 'Doctor ID must be a number.'
  return ''
}

onMounted(() => {
  store.fetchPatients()
})

function addPatient() {
  errors.value.patientName = validateStringField(newPatient.value.patientName, 'Patient Name')
  errors.value.diagnosis = validateStringField(newPatient.value.diagnosis, 'Diagnosis')
  errors.value.doctorId = validateDoctorId(newPatient.value.doctorId)
  if (errors.value.patientName || errors.value.diagnosis || errors.value.doctorId) return
  store.addPatient({ ...newPatient.value })
  newPatient.value.patientName = ''
  newPatient.value.diagnosis = ''
  newPatient.value.doctorId = ''
  errors.value.patientName = ''
  errors.value.diagnosis = ''
  errors.value.doctorId = ''
}

const columns = ['patientName', 'diagnosis', 'doctorId']
</script>

<template>
  <div>
    <h2>Patient List</h2>
    <input v-model="searchText" @input="() => store.setSearch(searchText)" placeholder="Search..." />
    <form @submit.prevent="addPatient" style="margin-bottom: 20px;">
      <input v-model="newPatient.patientName" placeholder="Patient Name" />
      <span v-if="errors.patientName" class="error">{{ errors.patientName }}</span>
      <input v-model="newPatient.diagnosis" placeholder="Diagnosis" />
      <span v-if="errors.diagnosis" class="error">{{ errors.diagnosis }}</span>
      <input v-model="newPatient.doctorId" placeholder="Doctor ID" />
      <span v-if="errors.doctorId" class="error">{{ errors.doctorId }}</span>
      <button type="submit">Add Patient</button>
    </form>
    <ListItem
      :columns="columns"
      :items="store.filteredItems"
      :onDeleteItem="store.deletePatient"
      :onSaveUpdate="(item) => store.updatePatient(item.id, item)"
      @sort="store.setSort"
    />
  </div>
</template>

<style>
.error {
  color: red;
  font-size: 0.9em;
  margin-left: 10px;
}
</style>
