<template>
  <svg
    :opacity="opacity ? 0 : 1"
    :width="width - marginLeft - marginRight"
    :height="height - marginBottom - legendSpace"
    :transform="`translate(${marginLeft}, ${transform})`"
  >
    <g
      :transform="`translate(${-marginLeft}, 0)`"
      class="rects"
      :fill="colorDataAmount(groupDateAmount[0])"
    >
      <g class="brush" />
      <g
        v-for="(dataSet, i) in newDateAmount"
        :key="x(dataSet[scaleXName])"
        @pointerover="tooltip = i"
        @pointerleave="tooltip = null"
      >
        <rect
          :x="x(dataSet[scaleXName])"
          :y="animation ? y(0) : y(dataSet[scaleYName])"
          :height="animation ? 0 : y(0) - y(dataSet[scaleYName])"
          :width="x.bandwidth()"
        />
        <text
          text-anchor="middle"
          :x="x(dataSet[scaleXName]) + x.bandwidth() / 2"
          :y="animation ? y(0) : y(dataSet[scaleYName]) - x.bandwidth() / 10"
          :font-weight="fontWeightValues ? 'bold' : 'normal'"
          :font-style="fontItalicValues ? 'italic' : 'normal'"
          :font-size="fontSizeValue"
        >
          {{ dataSet[scaleYName] }}
        </text>
        <text
          :x="x(dataSet[scaleXName])"
          :y="y(dataSet[scaleYName])"
          v-if="tooltip === i"
        >
          <tspan
            :x="x(dataSet[scaleXName])"
            :dy="-20"
            v-for="itemTooltip in dataSet"
            :key="itemTooltip"
          >
            {{ itemTooltip }}
          </tspan>
        </text>
      </g>
    </g>
  </svg>
</template>

<script setup>
import * as d3 from "d3";
import {
  groupDateAmount,
  newDateAmount,
  x,
  y,
} from "../../../composables/helpers";
import { ref } from "vue";

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
  scaleXName: String,
  scaleYName: String,
  opacity: Boolean,
});

const tooltip = ref(null);
const colorDataAmount = d3.scaleOrdinal(props.schemeCategory);
</script>
