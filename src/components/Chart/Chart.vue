<template>
  <div class="chartLine"></div>
</template>
<script setup>
import * as d3 from "d3";
import { onMounted } from "vue";

const props = defineProps({
  data: Array,
  width: Number,
  height: Number,
  marginTop: Number,
  marginRight: Number,
  marginBottom: Number,
  marginLeft: Number,
});

onMounted(() => {
  const svg = d3
    .select(".chartLine")
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height);

  //2. Parse the dates
  const parseTime = d3.timeParse("%d-%b-%y");

  //3. Creating the Chart Axes
  const x = d3
    .scaleTime()
    .domain(d3.extent(props.data, (d) => parseTime(d.date)))
    .range([props.marginLeft, props.width - props.marginRight]);

  const y = d3
    .scaleLinear()
    .domain(d3.extent(props.data, (d) => d.amount))
    .range([props.height - props.marginBottom, props.marginTop]);

  //4. Creating a Line
  const line = d3
    .line()
    .x((d) => x(parseTime(d.date)))
    .y((d) => y(d.amount));

  //5. Appending the Axes to the Chart
  svg
    .append("g")
    .attr("transform", `translate(0, ${props.height - props.marginBottom})`)
    .call(d3.axisBottom(x));

  const axisY = svg
    .append("g")
    .attr("transform", `translate(${props.marginLeft})`, 0)
    .call(d3.axisLeft(y));

  axisY
    .append("text")
    .attr("fill", "#000")
    .attr("transform", `translate(0, ${props.marginTop / 2})`)
    .text("Price, $");

  //6. Appending a path to the Chart
  svg
    .append("path")
    .attr("width", props.width)
    .attr("height", props.height)
    .datum(props.data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  svg
    .selectAll()
    .data(props.data)
    .enter()
    .append("circle")
    .attr("style", "fill: skyblue")
    .attr("r", 3.5)
    .attr("cx", (d) => x(parseTime(d.date)))
    .attr("cy", (d) => y(d.amount));
});
</script>
