<script setup>
defineProps(['onSubmit']);
</script>

<template>
  <button class="green-button" @click="$emit('onSubmit')">JOIN</button>
</template>

<style>
.green-button {
  background-color: #5DB075;
  color: white;
  font-weight: bold;
  width: 343px;
  height: 51px;
  margin: 12px 12px 12px 0;
  padding: 16px, 32px, 16px, 32px;
  gap: 12px;
  border: 1px none;
  border-radius: 100px;
  top: 411px;
  left: 14px;
  cursor: pointer;
}
</style>