<!-- eslint-disable -->
<script setup lang="ts">
const props = defineProps({
  connector: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <div class="connector" @click="$emit('connect', props.connector.type)">
    <div class="connector__img">
      <img :src="props.connector.icon" :alt="props.connector.type" />
    </div>
    <div class="connector__name">{{ props.connector.name }}</div>
    <div class="connector__desc">{{ props.connector.description }}</div>
  </div>
</template>
