<template>
  <svg
    :width="width"
    :height="height"
    :view-box="`0 0 ${width} ${height}`"
    :transform="`translate(0, ${margin.top})`"
  >
    <g
      class="xAxis"
      :transform="`translate(0,${height - margin.bottom - legend.legendSpace})`"
      :font-weight="fontFormat.fontWeightX ? 'bold' : 'normal'"
      :font-style="fontFormat.fontItalicX ? 'italic' : 'normal'"
    />
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
