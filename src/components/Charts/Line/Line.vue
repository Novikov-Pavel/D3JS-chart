<template>
  <svg
    :opacity="opacity ? 0 : 1"
    :width="width - margin.left - margin.right"
    :height="height - margin.bottom - legend.legendSpace"
    :transform="`translate(${margin.left}, 0)`"
  >
    <g :transform="`translate(${-margin.left}, 0)`">
      <path
        class="line1"
        fill="none"
        stroke-width="2"
        :stroke="colorDataAmount(groupDateAmount[0])"
        :d="line1(newDateAmount)"
      />
      <path
        v-if="regression.poly"
        class="line1"
        fill="none"
        stroke-width="2"
        :stroke="colorDataAmount(groupDateAmount[0])"
        :d="lineGenerator(poly)"
      />
      <path
        v-if="regression.logaritm"
        class="line1"
        fill="none"
        stroke-width="2"
        :stroke="colorDataAmount(groupDateAmount[0])"
        :d="lineGenerator(logaritm)"
      />
      <path
        v-if="props.ariaFill"
        class="aria1"
        :fill="colorDataAmount(groupDateAmount[0])"
        fill-opacity="0.2"
        :d="ariaChart1(newDateAmount)"
      />
      <g class="brush" />
      <g
        v-for="(dataSet, i) in newDateAmount"
        :key="x(dataSet[scale.scaleXName])"
        @pointerover="tooltip = i"
        @pointerleave="tooltip = null"
      >
        <circle
          r="3"
          fill="white"
          :stroke="colorDataAmount(groupDateAmount[0])"
          :cx="x(parseTime(dataSet[scale.scaleXName]))"
          :cy="y(dataSet[scale.scaleYName])"
        />
        <text
          :x="x(parseTime(dataSet[scale.scaleXName]))"
          :y="y(dataSet[scale.scaleYName])"
          :text-anchor="textAnchor(props.valuePosition) || 'middle'"
          dominant-baseline="middle"
          :font-weight="fontFormat.fontWeightValues ? 'bold' : 'normal'"
          :font-style="fontFormat.fontItalicValues ? 'italic' : 'normal'"
          :font-size="fontFormat.fontSizeValue"
          :transform="`
            translate(${valuePositionTranslate(props.valuePosition)}),
            rotate(
              ${props.rotateFormat.rotateValues},
              ${x(parseTime(dataSet[scale.scaleXName]))},
              ${y(dataSet[scale.scaleYName])})`"
        >
          {{ dataSet[scale.scaleYName] }}
        </text>
        <text
          v-if="tooltip === i"
          :x="x(parseTime(dataSet[scale.scaleXName]))"
          :y="y(dataSet[scale.scaleYName])"
          text-anchor="middle"
        >
          <tspan
            :x="x(parseTime(dataSet[scale.scaleXName]))"
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
  lineGenerator,
  logaritm,
  poly,
  y,
  parseTime,
  textAnchor,
  valuePositionTranslate,
} from "../../../composables/helpers";
import { ref } from "vue";

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
  scale: Object,
  opacity: Boolean,
  regression: Object,
});
const colorDataAmount = d3.scaleOrdinal(props.schemeCategory);
const tooltip = ref(null);
</script>
