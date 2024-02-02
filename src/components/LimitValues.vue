<template>
  <svg
    :width="width - marginLeft - marginRight"
    :height="60"
    :transform="`translate(${marginLeft}, ${transform})`"
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
        :transform="`translate(0, ${-430 + marginTop + marginBottom})`"
        v-for="limit in limitValue"
        :key="limit"
        :x1="0"
        :y1="y(limit)"
        :x2="width - marginRight - marginLeft - markerSize"
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
  transform: Number,
});


</script>
