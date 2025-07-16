<script setup>
import '@/assets/formStyle.css'
import { watch, ref, onMounted } from 'vue'
import { useDoctorStore } from '@/stores/useDoctorStore'
import ListItem from './listItem.vue'

const searchText = ref('')
const store = useDoctorStore()
const newDoctor = ref({ name: '', expertise: '' })
watch(searchText, (val) => {
  store.setSearch(val)
})



onMounted(() => {
  store.fetchDoctors()
})

function addDoctor() {
  if (!newDoctor.value.name || !newDoctor.value.expertise) return
  store.addDoctor({ ...newDoctor.value })
  newDoctor.value.name = ''
  newDoctor.value.expertise = ''
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
      <input v-model="newDoctor.expertise" placeholder="Expertise" />
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
