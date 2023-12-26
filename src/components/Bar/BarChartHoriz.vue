<template>
  <div class="chartHoriz"></div>
</template>

<script setup>
import { onMounted } from "vue";
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
});

onMounted(() => {
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(props.data, (d) => d.amount)])
    .range([props.marginLeft, props.width - props.marginRight]);

  const y = d3
    .scaleBand()
    .domain(
      d3.groupSort(
        props.data,
        ([d]) => d.amount,
        (d) => d.date
      )
    )
    .range([props.marginTop, props.height - props.marginBottom])
    .padding(0.1);

  // Create the SVG container.
  const svg = d3
    .select(".chartHoriz")
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height)
    .attr("viewBox", [0, 0, props.width, props.height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add a rect for each bar.
  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll()
    .data(props.data)
    .join("rect")
    .attr("x", x(0))
    .attr("y", (d) => y(d.date))
    .attr("width", (d) =>
      props.animation ? x(0) - props.marginLeft : x(d.amount) - x(0)
    )
    .attr("height", y.bandwidth());

  // Add the x-axis and label.

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${props.marginTop})`)
    .call(d3.axisTop(x));

  svg
    .append("g")
    .attr("transform", `translate(${props.marginLeft},0)`)
    .call(d3.axisLeft(y));

  xAxis.call((g) =>
    g
      .append("text")
      .attr("x", props.width - props.marginLeft)
      .attr("y", -props.marginTop / 2)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("Price, $")
  );

  if (props.animation) {
    svg
      .selectAll("rect")
      .transition()
      .duration(1500)
      .attr("width", (d) => x(d.amount) - x(0));
  }
});
</script>
