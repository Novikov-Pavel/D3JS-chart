<template>
  <svg
    :opacity="opacity ? 0 : 1"
    :width="width - margin.left - margin.right"
    :height="height - margin.bottom - legend.legendSpace"
    :transform="`translate(${margin.left}, 0)`"
  >
    <g
      :transform="`translate(${-margin.left}, 0)`"
      class="rects"
      :fill="colorDataAmount(groupDateAmount[0])"
    >
      <g class="brush" />
      <g
        v-for="(dataSet, i) in newDateAmount"
        :key="x(dataSet[scale.scaleXName])"
        @pointerover="tooltip = i"
        @pointerleave="tooltip = null"
        @pointerdown="onClick(i)"
        ref="opacityRect"
      >
        <rect
          :x="x(dataSet[scale.scaleXName])"
          :y="animation ? y(0) : y(dataSet[scale.scaleYName])"
          :height="animation ? 0 : y(0) - y(dataSet[scale.scaleYName])"
          :width="x.bandwidth()"
        />
        <text
          text-anchor="middle"
          :x="x(dataSet[scale.scaleXName]) + x.bandwidth() / 2"
          :y="
            animation
              ? y(0)
              : y(dataSet[scale.scaleYName]) - x.bandwidth() / 10
          "
          :font-weight="fontFormat.fontWeightValues ? 'bold' : 'normal'"
          :font-style="fontFormat.fontItalicValues ? 'italic' : 'normal'"
          :font-size="fontFormat.fontSizeValue"
        >
          {{ dataSet[scale.scaleYName] }}
        </text>
        <text
          :x="x(dataSet[scale.scaleXName])"
          :y="y(dataSet[scale.scaleYName])"
          v-if="tooltip === i"
        >
          <tspan
            :x="x(dataSet[scale.scaleXName])"
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
});

const tooltip = ref(null);
const colorDataAmount = d3.scaleOrdinal(props.schemeCategory);

const opacityRect = ref([]);
const onClick = (i) => {
  opacityRect.value.map((e, idx) =>
    idx !== i ? (e.style.opacity = 0.3) : (e.style.opacity = 1)
  );
};
</script>
