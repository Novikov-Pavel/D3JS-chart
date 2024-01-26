<template>
  <svg
    @dblclick="dblclick"
    class="chartVert"
    :width="width"
    :height="height"
    :view-box="`0 0 ${width} ${height}`"
  >
    <g
      class="xAxis"
      :transform="`translate(0,${height - marginBottom - props.legendSpace})`"
      :font-weight="fontWeightX ? 'bold' : 'normal'"
      :font-style="fontItalicX ? 'italic' : 'normal'"
      :font-size="fontSizeX"
    />
    <g
      class="yAxis"
      :transform="`translate(${marginLeft}, 0)`"
      :font-weight="fontWeightY ? 'bold' : 'normal'"
      :font-style="fontItalicY ? 'italic' : 'normal'"
      :font-size="fontSizeY"
    >
      <text fill="currentColor" text-anchor="end" :y="marginTop / 2">
        {{ labelY }}
      </text>
    </g>
    <g class="rects" :fill="colorDataAmount(groupDateAmount[0])">
      <g class="brush" />
      <g
        v-for="(dataSet, i) in newDateAmount"
        :key="x(dataSet.date)"
        @pointerover="tooltip = i"
        @pointerleave="tooltip = null"
      >
        <rect
          :x="x(dataSet.date)"
          :y="animation ? y(0) : y(dataSet.amount)"
          :height="animation ? 0 : y(0) - y(dataSet.amount)"
          :width="x.bandwidth()"
        />
        <text
          text-anchor="middle"
          :x="x(dataSet.date) + x.bandwidth() / 2"
          :y="animation ? y(0) : y(dataSet.amount) - x.bandwidth() / 10"
          :font-weight="fontWeightValues ? 'bold' : 'normal'"
          :font-style="fontItalicValues ? 'italic' : 'normal'"
          :font-size="fontSizeValue"
        >
          {{ dataSet.amount }}
        </text>
        <text :x="x(dataSet.date)" :y="y(dataSet.amount)" v-if="tooltip === i">
          <tspan
            :x="x(dataSet.date)"
            :dy="-20"
            v-for="itemTooltip in dataSet"
            :key="itemTooltip"
          >
            {{ itemTooltip }}
          </tspan>
        </text>
      </g>
    </g>
    <g
      :fill="colorDataAmount(groupDateAmount[0])"
      v-for="(rect, i) in groupDateAmount"
      :key="rect[i]"
    >
      <rect
        class="rectLegend"
        :x="props.marginLeft"
        :y="props.height - props.legendSpace / 2 + i * props.sizeLegend"
        :width="props.sizeLegend"
        :height="props.sizeLegend"
      />
      <text
        class="labelLegend"
        :x="marginLeft + props.sizeLegend * 1.5"
        :y="height - props.legendSpace / 2 + i * props.sizeLegend"
        alignment-baseline="hanging"
      >
        {{ rect[i] }}
      </text>
    </g>
    <g stroke-dasharray="5 1" stroke="black" stroke-width="1px">
      <line
        v-for="limit in limitValue"
        :key="limit"
        :x1="marginLeft"
        :y1="y(limit)"
        :x2="width - marginRight"
        :y2="y(limit)"
      />
    </g>
  </svg>
</template>

<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import {
  animationBars,
  brush,
  dblclick,
  groupDateAmount,
  newDateAmount,
  x,
  y,
} from "../helpers/";

const props = defineProps({
  data: Array,
  width: Number,
  height: Number,
  marginTop: Number,
  marginRight: Number,
  marginBottom: Number,
  marginLeft: Number,
  animation: Boolean,
  fontWeightValues: Boolean,
  fontItalicValues: Boolean,
  fontSizeValue: Number,
  rotateXText: Number,
  rotateYText: Number,
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
});

const svg = d3.select(".chartVert");
const colorDataAmount = d3.scaleOrdinal(d3.schemeCategory10);

const tooltip = ref(null);

onMounted(() => {
  const axisX = d3.select(".xAxis").call(d3.axisBottom(x));

  axisX
    .selectAll(".tick")
    .selectAll("text")
    .attr("transform", `rotate(${props.rotateXText})`);

  const yAxis = d3.select(".yAxis").call(d3.axisLeft(y));

  yAxis
    .selectAll(".tick")
    .selectAll("text")
    .attr("transform", `rotate(${props.rotateYText})`);

  animationBars();
  d3.select(".brush").call(brush);
});
</script>
<style>
.rects {
  cursor: pointer;
}
</style>
