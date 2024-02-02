<template>
  <ScaleX v-bind="props" />
  <ScaleY v-bind="props" :transform="-height + marginTop" />
  <Legend
    v-if="legendSpace"
    v-bind="props"
    :transform="-2 * height + marginTop"
  />
  <Line
    v-if="typeChart === 'Line'"
    @dblclick="dblclick"
    v-bind="props"
    :transform="-3 * height + marginTop"
  />
  <Bar
    v-if="typeChart === 'Bar'"
    @dblclick="dblclick"
    v-bind="props"
    :transform="-3 * height + marginTop"
  />
  <LimitValues
    v-if="limitValue"
    v-bind="props"
    :transform="-3 * height - marginBottom"
  />
  <Tooltips v-bind="props" />
</template>

<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import { animationBars, brush, dblclick, x, y } from "./helpers";
import ScaleX from "./Scales/ScaleX.vue";
import ScaleY from "./Scales/ScaleY.vue";
import Legend from "./Scales/Legend.vue";
import LimitValues from "./LimitValues.vue";
import Line from "./Line.vue";
import Bar from "./Bar.vue";

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
});

onMounted(() => {
  const axisX = d3.select(".xAxis").call(d3.axisBottom(x));

  axisX
    .selectAll(".tick text")
    .attr("transform", `rotate(${props.rotateXText})`)
    .attr("font-size", props.fontSizeX);

  const yAxis = d3.select(".yAxis").call(d3.axisLeft(y));

  yAxis
    .selectAll(".tick text")
    .attr("transform", `rotate(${props.rotateYText})`)
    .attr("font-size", props.fontSizeY);

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
</style>