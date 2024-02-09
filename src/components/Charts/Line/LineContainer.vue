<template>
  <svg
    :width="width - margin.left - margin.right"
    :height="height - margin.bottom - legend.legendSpace"
    :transform="`translate(${margin.left}, 0)`"
  >
    <Line
      v-bind="props"
      v-for="(serie, idx) in seriee"
      :key="idx"
      :serie="serie"
    />
  </svg>
</template>

<script setup>
import { Line } from "../";
import { seriee } from "../../../composables/helpers";

const props = defineProps({
  width: Number,
  height: Number,
  margin: Object,
  animation: Boolean,
  legend: Object,
  valuePosition: String,
  rotateFormat: Object,
  fontFormat: Object,
  limitValue: Array,
  labelY: String,
  schemeCategory: Object,
  typeChart: String,
  ariaFill: Boolean,
  markerSize: Number,
  scale: Object,
  regression: Object,
  seriesName: Array,
  notActive1: Boolean,
  notActive2: Boolean,
});

if (props.notActive1) seriee.value.slice(1)
console.log(seriee.value);
</script>
