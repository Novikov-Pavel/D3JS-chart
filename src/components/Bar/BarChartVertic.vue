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
      :transform="`translate(0,${height - marginBottom - legendSpace})`"
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
            key="itemTooltip"
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
        :x="marginLeft"
        :y="height - legendSpace / 2 + i * sizeLegend"
        :width="sizeLegend"
        :height="sizeLegend"
      />
      <text
        class="labelLegend"
        :x="marginLeft + sizeLegend * 1.5"
        :y="height - legendSpace / 2 + i * sizeLegend"
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
import { computed, onMounted, ref } from "vue";
import * as d3 from "d3";

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
});
const svg = d3.select(".chartVert");
const sizeLegend = 20;
const legendSpace = 40;
const colorDataAmount = d3.scaleOrdinal(d3.schemeCategory10);
const groupDateAmount = ref(d3.group(props.data, (d) => d.dateAmount));
const dateAmount = computed(() => groupDateAmount.value.get("amount"));
const newDateAmount = computed(() =>
  dateAmount.value.map(({ y2, dateAmount, dateY2, ...keepAttrs }) => keepAttrs)
);

const x = d3
  .scaleBand()
  .domain(newDateAmount.value.map((d) => d.date))
  .range([props.marginLeft, props.width - props.marginRight])
  .padding(0.3);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(newDateAmount.value, (d) => d.amount)])
  .range([props.height - props.marginBottom - legendSpace, props.marginTop]);

const tooltip = ref(null);

function aminationBars() {
  const Bar = d3.select(".rects");
  if (props.animation) {
    Bar.selectAll("rect")
      .data(newDateAmount.value)
      .join("rect")
      .transition()
      .duration(1500)
      .attr("y", (d) => y(d.amount))
      .attr("height", (d) => y(0) - y(d.amount));

    Bar.selectAll("text")
      .data(newDateAmount.value)
      .join("text")
      .transition()
      .duration(1500)
      .attr("y", (d) => y(d.amount) - x.bandwidth() / 10);
  }
}

const brush = d3
  .brushX()
  .extent([
    [props.marginLeft, props.marginTop],
    [props.width - props.marginRight, props.height - props.marginBottom],
  ])
  .on("end", updateChart);

let idleTimeout;
const idled = () => (idleTimeout = null);

function updateChart(event) {
  const extent = event.selection;

  function scaleBandInvert(scale) {
    const domain = scale.domain();
    const paddingOuter = scale.paddingOuter();
    const eachBand = (scale.step() - scale.bandwidth()) / 2 + scale.bandwidth();
    return function (value) {
      let index = Math.floor((value - paddingOuter) / eachBand) - 1;
      return domain[Math.max(0, Math.min(index, domain.length - 1))];
    };
  }

  if (!extent) {
    if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
  } else {
    const dRangeX = extent.map(scaleBandInvert(x));
    const indexMinMax = [];
    for (let i in dRangeX) {
      const el = x.domain().indexOf(dRangeX[i]);
      indexMinMax.push(el);
    }
    const arrDates = x
      .domain()
      .slice(
        indexMinMax[0],
        indexMinMax[1] === x.domain().length - 1 ||
          indexMinMax[0] === indexMinMax[1]
          ? indexMinMax[1] + 1
          : indexMinMax[1]
      );

    d3.select(".brush").call(brush.move, null);

    const filteredData = newDateAmount.value.filter((item) =>
      arrDates.includes(item.date)
    );

    groupDateAmount.value.set("amount", filteredData);

    x.domain(arrDates);
    d3.select(".xAxis").call(d3.axisBottom(x));
  }
}

function dblclick() {
  groupDateAmount.value = d3.group(props.data, (d) => d.dateAmount);
  const newDateAmount = computed(() => groupDateAmount.value.get("amount"));
  x.domain(newDateAmount.value.map((d) => d.date)).padding(0.3);
  d3.select(".xAxis").call(d3.axisBottom(x));
  d3.select(".rects").select(".brush").call(brush);
}

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

  aminationBars();
  d3.select(".brush").call(brush);
});
</script>
<style>
.rects {
  cursor: pointer;
}
</style>
