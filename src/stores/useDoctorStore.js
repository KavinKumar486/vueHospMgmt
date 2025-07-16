
import { defineStore } from 'pinia'
import axios from 'axios'
const baseURL = import.meta.env.VITE_API_BASE_URL
export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    doctors: [],
    loading: false,
    searchText:'',
    sortKey:'',
    sortAsc : true,

  }),
getters: {
  filteredItems: (state) => {
    let result = [...state.doctors]
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
        return state.sortAsc ? String(valA).localeCompare(String(valB)):String(valB).localeCompare(String(valA))
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
    async fetchDoctors() {
      this.loading = true
      try {
        const res = await axios.get(`${baseURL}/doctor/getDoctor`)
        this.doctors = res.data.data
      } finally {
        this.loading = false
      }
    },
    async addDoctor(doctor) {
      const res = await axios.post(`${baseURL}/doctor/add`, doctor)
      this.fetchDoctors()
    },
    async updateDoctor(id, updatedData) {
      await axios.patch(`${baseURL}/doctor/update/${id}`, updatedData)
      this.fetchDoctors()
    },
    async deleteDoctor(id) {
      await axios.delete(`${baseURL}/doctor/delete/${id}`)
      this.fetchDoctors()
    },
  },
})
