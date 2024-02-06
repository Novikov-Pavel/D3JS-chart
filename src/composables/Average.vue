<template>
  <svg
    :width="width - margin.left - margin.right"
    :height="height - margin.top - margin.bottom - legend.legendSpace"
    :transform="`translate(${margin.left}, ${margin.top})`"
  >
    <line 
      :x1="0" :y1="y(isMean ? mean : median)"
      :x2="width - margin.right - margin.left - markerSize" 
      :y2="y(isMean ? mean: median)" 
      stroke="black" stroke-dasharray="15 5"
      marker-start="url(#arrowStart)" marker-end="url(#arrowEnd)"
    />
  </svg>
</template>

<script setup>
import { y } from "../composables/helpers";
import { mean, median } from "./helpers/Coords";

const props = defineProps({
  markerSize: Number,
  margin: Object,
  width: Number,
  height: Number,
  legend: Object,
  isMean: Boolean,
  isMedian: Boolean,
});
</script>
