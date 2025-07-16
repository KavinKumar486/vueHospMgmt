import { defineStore } from 'pinia'
import axios from 'axios'
const baseURL = import.meta.env.VITE_API_BASE_URL

export const usePatientStore = defineStore('patient', {
  state: () => ({
    patients: [],
    loading: false,
    searchText: '',
    sortKey: '',
    sortAsc: true,
  }),
  getters: {
    filteredItems: (state) => {
      let result = [...state.patients]
      if (state.searchText.trim()) {
        const text = state.searchText.trim().toLowerCase()
        result = result.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(text)
          )
        )
      }
      if (state.sortKey) {
        result.sort((a, b) => {
          const valA = a[state.sortKey]
          const valB = b[state.sortKey]
          if (typeof valA === 'number' && typeof valB === 'number') {
            return state.sortAsc ? valA - valB : valB - valA
          }
          return state.sortAsc
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA))
        })
      }
      return result
    },
  },
  actions: {
    setSearch(text) {
      this.searchText = text
    },
    setSort(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc
      } else {
        this.sortKey = key
        this.sortAsc = true
      }
    },
    async fetchPatients() {
      this.loading = true
      try {
        const res = await axios.get(`${baseURL}/patient/getPatient`)
        this.patients = res.data.data
      } finally {
        this.loading = false
      }
    },
    async addPatient(patient) {
      await axios.post(`${baseURL}/patient/add`, patient)
      this.fetchPatients()
    },
    async updatePatient(id, updatedData) {
      await axios.put(`${baseURL}/patient/patch/${id}`, updatedData)
      this.fetchPatients()
    },
    async deletePatient(id) {
      await axios.delete(`${baseURL}/patient/${id}`)
      this.fetchPatients()
    },
  },
})
