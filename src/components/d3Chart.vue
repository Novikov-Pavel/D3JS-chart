<template>
  <svg
    :width="width"
    :height="height"
    :view-box="`0 0 ${width} ${height}`"
    :transform="`translate(0, ${marginTop})`"
  >
    <g
      class="xAxis"
      :transform="`translate(0,${height - marginBottom - legendSpace})`"
      :font-weight="fontWeightX ? 'bold' : 'normal'"
      :font-style="fontItalicX ? 'italic' : 'normal'"
    />
    <g
      class="yAxis"
      :transform="`translate(${marginLeft}, 0)`"
      :font-weight="fontWeightY ? 'bold' : 'normal'"
      :font-style="fontItalicY ? 'italic' : 'normal'"
    >
      <text fill="currentColor" text-anchor="end" :y="marginTop / 2">
        {{ labelY }}
      </text>
    </g>
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
  <svg
    @dblclick="dblclick"
    :width="width - marginLeft - marginRight"
    :height="height - marginBottom - legendSpace"
    :transform="`translate(${marginLeft}, ${-height - marginTop})`"
  >
    <g
      :transform="`translate(${-marginLeft}, 0)`"
      v-if="props.typeChart === 'Line'"
    >
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
        :key="x(dataSet.date)"
        @pointerover="tooltip = i"
        @pointerleave="tooltip = null"
      >
        <circle
          r="3"
          fill="white"
          :stroke="colorDataAmount(groupDateAmount[0])"
          :cx="x(parseTime(dataSet.date))"
          :cy="y(dataSet.amount)"
        />
        <text
          :x="x(parseTime(dataSet.date))"
          :y="y(dataSet.amount)"
          :text-anchor="textAnchor(props.valuePosition) || 'middle'"
          dominant-baseline="middle"
          :font-weight="fontWeightValues ? 'bold' : 'normal'"
          :font-style="fontItalicValues ? 'italic' : 'normal'"
          :font-size="fontSizeValue"
          :transform="`
            translate(${valuePositionTranslate(props.valuePosition)}),
            rotate(
              ${props.rotateValues},
              ${x(parseTime(dataSet.date))},
              ${y(dataSet.amount)})`"
        >
          {{ dataSet.amount }}
        </text>
        <text
          v-if="tooltip === i"
          :x="x(parseTime(dataSet.date))"
          :y="y(dataSet.amount)"
          text-anchor="middle"
        >
          <tspan
            :x="x(parseTime(dataSet.date))"
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
      :transform="`translate(${-marginLeft}, 0)`"
      v-if="typeChart === 'Bar'"
      class="rects"
      :fill="colorDataAmount(groupDateAmount[0])"
    >
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
    <g v-if="limitValue" stroke="black">
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
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import {
  animationBars,
  brush,
  dblclick,
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
});

const colorDataAmount = d3.scaleOrdinal(props.schemeCategory);
const tooltip = ref(null);

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
  fill: #6E7079;
}
</style>
