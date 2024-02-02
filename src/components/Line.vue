<template>
  <svg
    :width="width - marginLeft - marginRight"
    :height="height - marginBottom - legendSpace"
    :transform="`translate(${marginLeft}, ${transform})`"
  >
    <g :transform="`translate(${-marginLeft}, 0)`">
      <g class="brush" />
      <path
        class="line1"
        fill="none"
        stroke-width="2"
        :stroke="colorDataAmount(groupDateAmount[0])"
        :d="line1(newDateAmount)"
      />
      <path
        class="aria1"
        v-if="props.ariaFill"
        :fill="colorDataAmount(groupDateAmount[0])"
        fill-opacity="0.2"
        :d="ariaChart1(newDateAmount)"
      />
      <g
        v-for="(dataSet, i) in newDateAmount"
        :key="x(dataSet[scaleXName])"
        @pointerover="tooltip = i"
        @pointerleave="tooltip = null"
      >
        <circle
          r="3"
          fill="white"
          :stroke="colorDataAmount(groupDateAmount[0])"
          :cx="x(parseTime(dataSet[scaleXName]))"
          :cy="y(dataSet[scaleYName])"
        />
        <text
          :x="x(parseTime(dataSet[scaleXName]))"
          :y="y(dataSet[scaleYName])"
          :text-anchor="textAnchor(props.valuePosition) || 'middle'"
          dominant-baseline="middle"
          :font-weight="fontWeightValues ? 'bold' : 'normal'"
          :font-style="fontItalicValues ? 'italic' : 'normal'"
          :font-size="fontSizeValue"
          :transform="`
            translate(${valuePositionTranslate(props.valuePosition)}),
            rotate(
              ${props.rotateValues},
              ${x(parseTime(dataSet[scaleXName]))},
              ${y(dataSet[scaleYName])})`"
        >
          {{ dataSet[scaleYName] }}
        </text>
        <text
          v-if="tooltip === i"
          :x="x(parseTime(dataSet[scaleXName]))"
          :y="y(dataSet[scaleYName])"
          text-anchor="middle"
        >
          <tspan
            :x="x(parseTime(dataSet[scaleXName]))"
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
  ariaChart1,
  line1,
  y,
  parseTime,
  textAnchor,
  valuePositionTranslate,
} from "./helpers";
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
  transform: Number,
  scaleXName: String,
  scaleYName: String,
});
const colorDataAmount = d3.scaleOrdinal(props.schemeCategory);
const tooltip = ref(null);

</script>
