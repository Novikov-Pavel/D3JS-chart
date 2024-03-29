<template>
  <scaleX v-bind="props" />
  <scaleY v-bind="props" />
  <Legend
    v-if="legend.legendSpace"
    v-bind="props"
    @isActive1="(notActive1) => $emit('isActive1', notActive1)"
    @isActive2="(notActive2) => $emit('isActive2', notActive2)"
    :style="{ top: legend.legendSpace }"
  />
  <LimitValues
    v-if="limitValue"
    :width="width"
    :height="height"
    :margin="margin"
    :markerSize="markerSize"
    :limitValue="limitValue"
    :legend="legend"
  />
  <Mean
    v-if="regression.mean"
    :width="width"
    :height="height"
    :margin="margin"
    :markerSize="markerSize"
    :legend="legend"
  />
  <Median
    v-if="regression.median"
    :width="width"
    :height="height"
    :margin="margin"
    :markerSize="markerSize"
    :legend="legend"
  />
  <LineContainer
    v-if="typeChart === 'Line'"
    :class="['chart']"
    @dblclick="dblclick"
    v-bind="props"
    :regression="regression"
    :style="{ top: margin.top }"
    :notActive1="notActive1"
    :notActive2="notActive2"
  />
  <!-- <Bar
    v-if="typeChart === 'Bar'"
    :class="['chart', { notActive: notActive }]"
    @dblclick="dblclick"
    v-bind="props"
    :style="{ top: margin.top }"
  /> -->
</template>

<script setup>
import * as d3 from "d3";
import { onMounted } from "vue";
import { Legend, LimitValues, Mean, Median } from "../composables";
import {
  animationBars,
  brush,
  dblclick,
  x,
  y,
  seriee,
} from "../composables/helpers";
import { scaleX, scaleY } from "./Scales";
import { Bar, Line } from "./Charts";
import LineContainer from "./Charts/Line/LineContainer.vue";

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
  notActive1: Boolean,
  notActive2: Boolean,
  mean: Boolean,
  median: Boolean,
  regression: Object,
  seriesName: Array,
});

const emit = defineEmits(["isActive1", "isActive2"]);

onMounted(() => {
  const axisX = d3.select(".xAxis").call(d3.axisBottom(x));

  axisX
    .selectAll(".tick text")
    .attr("transform", `rotate(${props.rotateFormat.rotateXText})`)
    .attr("font-size", props.fontFormat.fontSizeX);

  const yAxis = d3.select(".yAxis").call(d3.axisLeft(y));

  yAxis
    .selectAll(".tick text")
    .attr("transform", `rotate(${props.rotateFormat.rotateYText})`)
    .attr("font-size", props.fontFormat.fontSizeY);

  animationBars();
  d3.select(".brush").call(brush);
});
</script>
<style>
@font-face {
  font-family: Microsoft YaHei;
  src: url("../../public/fonts/microsoft-yahei.ttf");
}
.rects,
circle {
  cursor: pointer;
}
text {
  user-select: none;
  font-family: Microsoft YaHei;
  fill: #6e7079;
}
.notActive {
  opacity: 0;
  transition: all 1s ease-in-out;
}
.chart:not(.notActive) {
  transition: 1s;
}
</style>
