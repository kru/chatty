import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      isAuthenticated: false,
      username: '',
      userId: 0,
      roomId: 0
    }
  },
  getters: {
    auth: (state) => state.isAuthenticated,
    getRoom: (state) => state.roomId,
    getUser: (state) => state.username
  },
  actions: {
    setAuth(val) {
      this.isAuthenticated = val
    },
    setUser(user) {
      this.username = user.username
      this.userId = user._id
    },
    setRoom(roomId) {
      this.roomId = roomId
    }
  }
})