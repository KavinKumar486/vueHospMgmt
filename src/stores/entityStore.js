
import { defineStore } from 'pinia'

export const useEntityStore = defineStore('entity', {
  state: () => ({
    items: [],
    originalItems: [],
    sortOrder: 1,
    sortBy: '',
  }),
  actions: {
    setItems(data) {
      this.items = [...data]
      this.originalItems = [...data]
    },

    addItem(item) {
      this.items.push(item)
      this.originalItems.push(item)
    },

    updateItem(index, updated) {
      this.items[index] = { ...updated }
      this.originalItems[index] = { ...updated }
    },

    deleteItem(index) {
      this.items.splice(index, 1)
      this.originalItems.splice(index, 1)
    },

    sort(col) {
      if (this.sortBy === col) {
        this.sortOrder *= -1
      } else {
        this.sortBy = col
        this.sortOrder = 1
      }

      this.items.sort((a, b) => {
        const valA = a[col]
        const valB = b[col]
        return valA > valB ? this.sortOrder : valA < valB ? -this.sortOrder : 0
      })
    },

    search(term) {
      if (!term) {
        this.items = [...this.originalItems]
        return
      }

      const lower = term.toLowerCase()
      this.items = this.originalItems.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(lower)
        )
      )
    },
  },
})
