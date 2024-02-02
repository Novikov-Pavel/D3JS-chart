<template>
  <div class="charts">
    <D3Chart v-bind="config" />
  </div>
</template>

<script setup>
import D3Chart from "./components/d3Chart.vue";
import config from "./components/config";
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
svg {
  display: block;
}

// .charts {
//   display: flex;
//   flex-direction: column;
//   gap: 100px;
// }
</style>
