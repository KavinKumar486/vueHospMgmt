<script setup>
import '@/assets/formStyle.css'
import { watch, ref, onMounted } from 'vue'
import { useDoctorStore } from '@/stores/useDoctorStore'
import ListItem from './listItem.vue'

const searchText = ref('')
const store = useDoctorStore()
const newDoctor = ref({ name: '', expertise: '' })
const errors = ref({ name: '', expertise: '' })

watch(searchText, (val) => {
  store.setSearch(val)
})
onMounted(() => {
  store.fetchDoctors()
})
function validateStringField(value, fieldName, min = 2, max = 30) {
  if (!value) return `${fieldName} is required.`
  if (/\d/.test(value)) return `${fieldName} should not contain numbers.`
  if (value.length < min) return `${fieldName} must be at least ${min} characters.`
  if (value.length > max) return `${fieldName} must be at most ${max} characters.`
  return ''
}

function addDoctor() {
  errors.value.name = validateStringField(newDoctor.value.name, 'Name')
  errors.value.expertise = validateStringField(newDoctor.value.expertise, 'Expertise')
  if (errors.value.name || errors.value.expertise) return
  store.addDoctor({ ...newDoctor.value })
  newDoctor.value.name = ''
  newDoctor.value.expertise = ''
  errors.value.name = ''
  errors.value.expertise = ''
}
const startSearch = () => {
  store.setSearch(searchText.value)
}
const columns = ['name', 'expertise']
</script>

<template>
  <div>
    <h2>Doctor List</h2>
    <input v-model="searchText" @input="startSearch" placeholder="Search..." />
    <form @submit.prevent="addDoctor" style="margin-bottom: 20px;">
      <input v-model="newDoctor.name" placeholder="Name" />
      <span v-if="errors.name" class="error">{{ errors.name }}</span>
      <input v-model="newDoctor.expertise" placeholder="Expertise" />
      <span v-if="errors.expertise" class="error">{{ errors.expertise }}</span>
      <button type="submit">Add Doctor</button>
    </form>
    <ListItem
      :columns="columns"
      :items="store.filteredItems"
      :onDeleteItem="store.deleteDoctor"
      :onSaveUpdate="(item) => store.updateDoctor(item.id, item)"
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
