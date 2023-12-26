<template>
  <div class="chartVert"></div>
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
    .scaleBand()
    .domain(
      d3.groupSort(
        props.data,
        ([d]) => d.amount,
        (d) => d.date
      )
    )
    .range([props.marginLeft, props.width - props.marginRight])
    .padding(0.1);

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(props.data, (d) => d.amount)])
    .range([props.height - props.marginBottom, props.marginTop]);

  // Create the SVG container.
  const svg = d3
    .select(".chartVert")
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
    .attr("x", (d) => x(d.date))
    .attr("y", (d) => (props.animation ? y(0) : y(d.amount)))
    .attr("height", (d) => (props.animation ? 0 : y(0) - y(d.amount)))
    .attr("width", x.bandwidth());

  // Add the x-axis and label.
  svg
    .append("g")
    .attr("transform", `translate(0,${props.height - props.marginBottom})`)
    .call(d3.axisBottom(x));

  // Add the y-axis
  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${props.marginLeft}, 0)`)
    .call(d3.axisLeft(y));

  // add label
  yAxis.call((g) =>
    g
      .append("text")
      .attr("x", -props.marginLeft / 2)
      .attr("y", props.marginTop / 2)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("Price, $")
  );

  if (props.animation) {
    svg
      .selectAll("rect")
      .transition()
      .duration(1500)
      .attr("y", (d) => y(d.amount))
      .attr("height", (d) => props.height - props.marginBottom - y(d.amount));
  }
});
</script>
