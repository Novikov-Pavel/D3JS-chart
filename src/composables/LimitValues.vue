<template>
  <svg
    :width="width - margin.left - margin.right"
    :height="height - margin.bottom - legend.legendSpace"
    :transform="`translate(${margin.left}, ${margin.top})`"
  >
    <g stroke="black">
      <defs>
        <marker
          id="arrowStart"
          refX="3"
          refY="3"
          markerWidth="6"
          markerHeight="6"
        >
          <circle cx="3" cy="3" r="2" />
        </marker>
        <marker
          id="arrowEnd"
          refY="5"
          :markerWidth="markerSize"
          :markerHeight="markerSize"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <line
        v-for="limit in limitValue"
        :key="limit"
        :x1="0"
        :y1="y(limit)"
        :x2="width - margin.right - margin.left - markerSize"
        :y2="y(limit)"
        stroke-dasharray="15 5"
        marker-start="url(#arrowStart)"
        marker-end="url(#arrowEnd)"
      />
    </g>
  </svg>
</template>

<script setup>
import { y } from "./helpers";

const props = defineProps({
  width: Number,
  height: Number,
  margin: Object,
  limitValue: Array,
  markerSize: Number,
  legend: Object,
});
</script>
