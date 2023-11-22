<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import LoginButton from '../components/LoginButton.vue';
import LoginInput from '../components/LoginInput.vue';
import { useUserStore } from '@/stores/user';


const username = ref('');
const roomId = ref();
const isEmptyUser = ref(false);
const isEmptyRoom = ref(false);
const roomNotFound = ref(false);
const message = ref('');

const router = useRouter();

const userStore = useUserStore();

watch(username, (newUsername) => {
  if (newUsername.length > 1) {
    isEmptyUser.value = false;
  }
});

watch(roomId, (newRoomId) => {
  if (newRoomId.length > 1) {
    isEmptyRoom.value = false;
  }
});

async function onSubmit() {
  if (!username.value) {
    isEmptyUser.value = true;
  }
  if (!roomId.value) {
    isEmptyRoom.value = true
  }

  let statusCode;
  const url = "http://127.0.0.1:8080/join";
  const res = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({ username: username.value, roomId: roomId.value })
  })
  .then(res => {
    statusCode = res.status;
    return res.json();
  })
  .catch(err => console.log("onSubmit", err));

  if (statusCode == 404) {
    roomNotFound.value = true;
    message.value = res.message;
    return router.push({ name: 'home' });
  }

  if (statusCode == 409) {
    roomNotFound.value = true;
    message.value = res.message;
    return router.push({ name: 'home' });
  }  

  if (statusCode > 300) {
    message.value = res.message;
    return router.push({ name: 'home' });
  }
  console.log("RES", res)
  userStore.setAuth(true);
  userStore.setUser(res.user);
  userStore.setRoom(roomId.value);
  router.push({ name: 'rooms' });
}
</script>

<template>
    <header>

      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <h2 class="join-chatroom">Join Chatroom</h2>
      <div class="wrapper">

      </div>
    </header>
  <main>
    <div style="display: block; margin: 0 auto 2rem">
      <p class="need-attention" v-if="isEmptyUser">username is required!</p>
      <LoginInput placeholder="Username" type="text" name="username" v-model="username"/>
      <p class="need-attention" v-if="isEmptyRoom">roomId is required!</p>
      <p class="need-attention" v-if="roomNotFound">{{ message }}!</p>
      <LoginInput placeholder="RoomID" name="roomId" v-model="roomId"/>
      <LoginButton @onSubmit="onSubmit"/>
    </div>
  </main>
</template>

<style>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.join-chatroom {
  text-align: center; 
  font-weight: 600;
}

.need-attention {
  color:brown;
  margin: 0 14px;
}
</style>