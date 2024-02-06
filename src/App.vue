<template>
  <div class="charts">
    <D3Chart
      v-bind="config"
      @isActive="(notActive) => setOpacity(notActive)"
      :notActive="isActive"
    />
  </div>
</template>

<script setup>
import D3Chart from "./components/d3Chart.vue";
import config from "./config";
import { ref } from "vue";

const isActive = ref(false);
const setOpacity = (par) => {
  isActive.value = par.value;
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
svg {
  display: block;
  position: absolute;
}
</style>
