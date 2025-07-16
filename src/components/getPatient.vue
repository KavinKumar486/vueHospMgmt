<script setup>
import '@/assets/formStyle.css'
import { watch, ref, onMounted } from 'vue'
import { usePatientStore } from '@/stores/usePatientStore'
import ListItem from './listItem.vue'

const searchText = ref('')
const store = usePatientStore()

watch(searchText, (val) => {
  store.setSearch(val)
})

const newPatient = ref({ patientName: '', diagnosis: '', doctorId: '' })

onMounted(() => {
  store.fetchPatients()
})

function addPatient() {
  if (!newPatient.value.patientName || !newPatient.value.diagnosis || !newPatient.value.doctorId) return
  store.addPatient({ ...newPatient.value })
  newPatient.value.patientName = ''
  newPatient.value.diagnosis = ''
  newPatient.value.doctorId = ''
}

const columns = ['patientName', 'diagnosis', 'doctorId']
</script>

<template>
  <div>
    <h2>Patient List</h2>
    <input v-model="searchText" @input="() => store.setSearch(searchText)" placeholder="Search..." />
    <form @submit.prevent="addPatient" style="margin-bottom: 20px;">
      <input v-model="newPatient.patientName" placeholder="Patient Name" />
      <input v-model="newPatient.diagnosis" placeholder="Diagnosis" />
      <input v-model="newPatient.doctorId" placeholder="Doctor ID" />
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
