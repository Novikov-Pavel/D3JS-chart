<template>
  <svg
    :width="width"
    :height="height"
    :view-box="`0 0 ${width} ${height}`"
    :transform="`translate(0, ${marginTop})`"
  >
    <g
      class="yAxis"
      :transform="`translate(${marginLeft}, 0)`"
      :font-weight="fontWeightY ? 'bold' : 'normal'"
      :font-style="fontItalicY ? 'italic' : 'normal'"
    >
      <text fill="currentColor" text-anchor="end" :y="marginTop / 2">
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
  marginTop: Number,
  marginRight: Number,
  marginBottom: Number,
  marginLeft: Number,
  animation: Boolean,
  valuePosition: String,
  fontWeightValues: Boolean,
  fontItalicValues: Boolean,
  fontSizeValue: Number,
  rotateXText: Number,
  rotateYText: Number,
  rotateValues: Number,
  fontWeightX: Boolean,
  fontWeightY: Boolean,
  fontWeightValues: Boolean,
  fontItalicValues: Boolean,
  fontSizeValue: Number,
  fontItalicX: Boolean,
  fontSizeX: Number,
  fontItalicY: Boolean,
  fontSizeY: Number,
  limitValue: Array,
  labelY: String,
  legendSpace: Number,
  sizeLegend: Number,
  schemeCategory: Object,
  typeChart: String,
  ariaFill: Boolean,
  markerSize: Number,
});
</script>
