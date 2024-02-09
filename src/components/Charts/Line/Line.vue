<template>
  <g :transform="`translate(${-margin.left}, 0)`">
    <g
      
    >
      <g class="brush" />
      <path
        fill="none"
        stroke-width="2"
        :stroke="colorDataAmount(serie)"
        :d="line1(serie)"
      />
      <path
        v-if="ariaFill"
        :fill="colorDataAmount(serie)"
        fill-opacity="0.2"
        :d="ariaChart1(serie)"
      />
      <g
        v-for="(dataSet, i) in serie"
        :key="y(dataSet[1])"
        @pointerover="tooltip = i"
        @pointerleave="tooltip = null"
      >
        <circle
          :r="tooltip === i ? 4 : 3"
          fill="white"
          :stroke="colorDataAmount(serie)"
          :cx="x(parseTime(dataSet.data[0]))"
          :cy="y(dataSet[1])"
        />
        <text
          :x="x(parseTime(dataSet.data[0]))"
          :y="y(dataSet[1])"
          :text-anchor="textAnchor(valuePosition) || 'middle'"
          dominant-baseline="middle"
          :font-weight="fontFormat.fontWeightValues ? 'bold' : 'normal'"
          :font-style="fontFormat.fontItalicValues ? 'italic' : 'normal'"
          :font-size="fontFormat.fontSizeValue"
          :transform="`
            translate(${valuePositionTranslate(valuePosition)}),
            rotate(
              ${rotateFormat.rotateValues},
              ${x(parseTime(dataSet.data[0]))},
              ${y(dataSet[1])})`"
        >
          {{ dataSet[1] }}
        </text>

        <text
          v-if="tooltip === i"
          :x="x(parseTime(dataSet.data[0]))"
          :y="y(dataSet[1])"
          text-anchor="middle"
        >
          <tspan :x="x(parseTime(dataSet[scale.scaleXName]))" :dy="-30">
            {{ dataSet[1] }}
          </tspan>
        </text>
      </g>
    </g>

    <path
      v-if="regression.poly"
      fill="none"
      stroke-width="2"
      :stroke="colorDataAmount(groupDateAmount[0])"
      :d="lineGenerator(poly)"
    />
    <path
      v-if="regression.logaritm"
      fill="none"
      stroke-width="2"
      :stroke="colorDataAmount(groupDateAmount[0])"
      :d="lineGenerator(logaritm)"
    />
  </g>
</template>

<script setup>
import * as d3 from "d3";
import {
  groupDateAmount,
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
  regression: Object,
  seriesName: Array,
  serie: Array,
});

const colorDataAmount = d3.scaleOrdinal().range(props.schemeCategory);
const tooltip = ref(null);
</script>
<style scoped>
.hidden1,
.hidden2 {
  opacity: 0;
  transition: all 1s ease-in-out;
}
.line {
  cursor: pointer;
  &:not(.hidden1) {
    transition: 1s;
  }
}
</style>
