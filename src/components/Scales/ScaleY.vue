<template>
  <svg
    :width="width"
    :height="height"
    :view-box="`0 0 ${width} ${height}`"
    :transform="`translate(0, ${margin.top})`"
  >
    <g
      class="yAxis"
      :transform="`translate(${margin.left}, 0)`"
      :font-weight="fontFormat.fontWeightY ? 'bold' : 'normal'"
      :font-style="fontFormat.fontItalicY ? 'italic' : 'normal'"
    >
      <text fill="currentColor" text-anchor="end" :y="margin.top / 2">
        {{ labelY }}
      </text>
    </g>
    
  </svg>
</template>

<script setup>
const props = defineProps({
  data: Array,
  width: Number,
  height: Number,
  margin: Object,
  animation: Boolean,
  valuePosition: String,
  rotateFormat: Object,
  fontFormat: Object,
  limitValue: Array,
  labelY: String,
  legend: Object,
  schemeCategory: Object,
  typeChart: String,
  ariaFill: Boolean,
  markerSize: Number,
});
</script>
