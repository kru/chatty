<script>
import { useUserStore } from '@/stores/user';

export default {
  name: 'ChatView',
  components: {

  },
  data() {
    return {
      websocket: null,
      connection_ready: false,
      connection_error: false,
      messages: [],
      new_message: '',
      username: '',
      roomName: ''
    }
  },
  methods: {
    initWs() {
      const userStore = useUserStore();
      let username = userStore.getUser;
      let roomId = userStore.getRoom;      
      const url = "ws://localhost:8080";
      this.websocket = new WebSocket(`${url}?username=${username}=${roomId}`);
      this.websocket.onmessage = this.onMessage;
      this.websocket.onopen = this.onOpen;
    },
    onMessage(event) {
      const { data } = event;
      this.messages.push(JSON.parse(data));
    },
    onOpen(event) {
      console.log("on open", event);
      this.connection_ready = true;
    },
    sendMessage() {
      if (!this.new_message) {
        return;
      }
      this.websocket.send(this.new_message);
      this.new_message = '';
    },
    async getRoomMessages(roomId) {
      let statusCode;
      const url = "http://localhost:8080/messages";
      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ roomId })
      })
        .then(res => {
          statusCode = res.status;
          return res.json();
        })
        .catch(err => console.log("onSubmit", err));

        if (statusCode == 404 || res == null) {
          return;
        }
        this.roomName = res.room.name;
        const { room: { messages = [] }} = res;
        if (messages.length) {
          this.messages = messages
        }
    },
    async logout() {
      let statusCode;
      const url = "http://localhost:8080/logout";
      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ username: this.username })
      })
        .then(res => {
          statusCode = res.status;
          return res.json();
        })
        .catch(err => console.log("onSubmit", err));

      if (statusCode == 404 || res == null) {
        return;
      }
      const userStore = useUserStore();
      userStore.setAuth(false);
      return this.$router.push({ name: 'home', reload: true });
    }
  },
  mounted() {
    this.initWs();
    const userStore = useUserStore();
    let roomId = userStore.getRoom;
    this.getRoomMessages(roomId);

    this.username = userStore.getUser;
  }
}
</script>

<template>
  <div class="container">
    <div class="chat-header">
      <h1 class="connection_ready exit" @click="logout">Exit</h1>
      <h1>RooM - <span class="connection_ready" v-if="connection_ready">{{ roomName }}</span></h1>
    </div>

    <div class="messages" id="messages">
      <div class="message-container">
        <h1 class="error" v-if="connection_error"> Connection error! </h1>
        <div v-for="(m, idx) in messages" :key="'m-' + idx" style="clear:both">
          <span v-if="m.username != this.username" class="other-user">{{ m.username }}</span>
          <div :class="{ 'msg-from-me': m.username == this.username, 'msg-from-other': m.username != this.username }">
            {{ m.value }}
          </div>
        </div>
      </div>
    </div>

    <div class="send-zone">
      <input class="input-chat" v-model="new_message" type="text" placeholder="Message here..." @keyup.enter="sendMessage" />
      <img alt="send icon" class="send-icon" src="@/assets/send.png" width="34" height="34" @click="sendMessage"/>
    </div>
  </div>
</template>

<style>
body {
  background: #ffffff;
}

.chat-header {
  display: flex;
}

.container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 768px;
  min-height: 60vh;
  position: relative;
}

h1 {
  padding: 0px;
  height: 20px;
  color: white;
  font-size: 20px;
  text-transform: uppercase;
}

.messages {
  height: 80vh;
  overflow-y: scroll;
  margin-top: 16px;
}

.msg-from-me {
  border-radius: 7px;
  max-width: 65%;
  font-size: 16px;
  line-height: 19px;
  color: #f6f6f6;
  background-color: #5DB075;
  padding: 12px 16px;
  margin: 20px 20px 5px 0px;

  float: right;
}

.other-user {
  z-index: 1000; 
  margin-left: 8px; 
  float: left; 
  color:rebeccapurple;
}

.msg-from-other {
  border-radius: 7.5px;
  max-width: 65%;
  font-size: 16px;
  line-height: 19px;
  color: black;
  background-color: #f6f6f6;
  padding: 12px;
  margin: 20px 0 5px -35px;
  float: left;
  /* border: 1px solid red; */
}

.send-zone {
  height: 62px;
  background: #bdbdbd;
  display: flex;
  border-radius: 30px;
  margin: 12px 0;
}

.input-chat {
  padding: 9px 12px 11px;
  margin: 5px 10px;
  border: 1px solid #bebebe;
  background: #bdbdbd;
  border-radius: 30px;
  font-size: 15px;
  flex-grow: 1;
  color: white;
}

.send-icon {
  display: block;
  cursor: pointer;
  position: relative;
  z-index: 1000;
  margin: 12px 8px;
}

.connection_ready {
  color: #5DB075;
}

.exit {
  display: block;
  cursor: pointer;
}
</style>
