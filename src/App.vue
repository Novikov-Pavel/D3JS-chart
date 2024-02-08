<template>
  <div class="charts">
    <D3Chart
      v-bind="config"
      @isActive1="(notActive1) => setOpacity1(notActive1)"
      @isActive2="(notActive2) => setOpacity2(notActive2)"
      :notActive1="isActive1"
      :notActive2="isActive2"
    />
  </div>
</template>

<script setup>
import D3Chart from "./components/d3Chart.vue";
import config from "./config";
import { ref } from "vue";

const isActive1 = ref(false);
const isActive2 = ref(false);
const setOpacity1 = (par) => {
  isActive1.value = par.value;
};
const setOpacity2 = (par) => {
  isActive2.value = par.value;
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
