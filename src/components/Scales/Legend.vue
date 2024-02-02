<template>
  <svg
    :width="width"
    :height="height"
    :view-box="`0 0 ${width} ${height}`"
    :transform="`translate(0, ${transform})`"
  >
    <g
      v-if="legendSpace"
      v-for="(rect, i) in groupDateAmount"
      :key="rect[i]"
      :fill="colorDataAmount(groupDateAmount[0])"
    >
      <rect
        class="rectLegend"
        :x="marginLeft"
        :y="height - legendSpace / 2 + i * sizeLegend"
        :width="sizeLegend"
        :height="sizeLegend"
      />
      <text
        class="labelLegend"
        :x="marginLeft + sizeLegend * 1.5"
        :y="height - legendSpace / 2 + i * sizeLegend"
        alignment-baseline="before-edge"
      >
        {{ rect[i] }}
      </text>
    </g>
  </svg>
</template>

<script setup>
import * as d3 from "d3";

import { groupDateAmount } from "../helpers";

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
const colorDataAmount = d3.scaleOrdinal(props.schemeCategory);
</script>
