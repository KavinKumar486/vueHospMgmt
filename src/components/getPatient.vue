<script setup>
import '@/assets/formStyle.css'
import { watch, ref, onMounted } from 'vue'
import { usePatientStore } from '@/stores/usePatientStore'
import { useDoctorStore } from '@/stores/useDoctorStore'
import ListItem from './listItem.vue'
import { useEntityStore } from '@/stores/entityStore'
const searchText = ref('')
const store = usePatientStore()
const doctorStore = useDoctorStore()
const errors = ref({ patientName: '', diagnosis: '', doctorId: '' })
const globalStore  = useEntityStore()
const newPatient = ref({ patientName: '', diagnosis: '', doctorId: '' })

watch(searchText, (val) => {
  store.setSearch(val)
})

onMounted(() => {
  store.fetchPatients()
  doctorStore.fetchDoctors()
})

function validateStringField(value, fieldName, min = 2, max = 30) {
  if (!value) return `${fieldName} is required.`
  if (/\d/.test(value)) return `${fieldName} should not contain numbers.`
  if (value.length < min) return `${fieldName} must be at least ${min} characters.`
  if (value.length > max) return `${fieldName} must be at most ${max} characters.`
  return ''
}

function validateDoctorId(value) {
  if (!value) return 'Doctor ID is required.'
  if (!doctorStore.doctors.find(doc => doc.id == value)) return 'Select a valid doctor.'
  return ''
}

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

// For editing doctorId in ListItem
function handleSaveUpdate(item) {
  // Validate before saving
  const nameErr = validateStringField(item.patientName, 'Patient Name')
  const diagErr = validateStringField(item.diagnosis, 'Diagnosis')
  const docErr = validateDoctorId(item.doctorId)
  if (nameErr || diagErr || docErr) {
    // Optionally show error (could emit event or use a global error)
    return
  }
  store.updatePatient(item.id, item)
}

</script>

<template>
  <nav class="navBar">
<router-link to="/doc"> Doctor</router-link> |
<router-link to='/patient'>Patient</router-link>
</nav> 
  <div>
    <h2>Patient List</h2>
    <input v-model="searchText" @input="() => store.setSearch(searchText)" placeholder="Search..." />
    <form @submit.prevent="addPatient" style="margin-bottom: 20px;">
      <input v-model="newPatient.patientName" placeholder="Patient Name" />
      <span v-if="errors.patientName" class="error">{{ errors.patientName }}</span>
      <input v-model="newPatient.diagnosis" placeholder="Diagnosis" />
      <span v-if="errors.diagnosis" class="error">{{ errors.diagnosis }}</span>
      <select v-model="newPatient.doctorId">
        <option value="">Select Doctor</option>
        <option v-for="doc in doctorStore.doctors" :key="doc.id" :value="doc.id">
          {{ doc.id }} - {{ doc.name }}
        </option>
      </select>
      <span v-if="errors.doctorId" class="error">{{ errors.doctorId }}</span>
      <button type="submit">Add Patient</button>
    </form>
    <ListItem
      :columns="columns"
      :items="store.filteredItems"
      :onDeleteItem="store.deletePatient"
      :onSaveUpdate="handleSaveUpdate"
      @sort="store.setSort"
      v-slot="{ item, columns }"
    >
      <template v-for="col in columns" :key="col">
        <template v-if="item.isEditing && col === 'doctorId'">
          <select v-model="item.doctorId">
            <option value="">Select Doctor</option>
            <option v-for="doc in doctorStore.doctors" :key="doc.id" :value="doc.id">
              {{ doc.id }} - {{ doc.name }}
            </option>
          </select>
        </template>
        <template v-else-if="col === 'doctorId'">
          <span> 
            {{ (doctorStore.doctors.find(doc => doc.id == item.doctorId) ? doctorStore.doctors.find(doc => doc.id == item.doctorId).name : item.doctorId) }}
          </span>
        </template>
      </template>
    </ListItem>
  </div>
</template>

<style>
.error {
  color: red;
  font-size: 0.9em;
  margin-left: 10px;
}
</style>
