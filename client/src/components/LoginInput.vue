<script setup>
defineProps(['type', 'placeholder', 'name', 'modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input class="login-input" 
    :type="type" 
    :placeholder="placeholder" 
    :name="name"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style>
.login-input {
  background-color: #DBDBDB;
  width: 343px;
  height: 50px;
  top: 194px;
  left: 16px;
  margin: 12px 12px 16px 0;
  padding: 12px;
  border: 1px solid;
  border-radius: 12px;
}
</style>