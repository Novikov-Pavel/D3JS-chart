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
  legend: Boolean,
  labelY: String,
  positionLegend: String,
  limitValueMin: Number,
  limitValueMax: Number,
  ariaChart: Boolean,
});

onMounted(() => {
  const legend = 70;
  const amount = Object.keys(props.data[0])[1];
  const svg = d3
    .select(".chartLine")
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height)
    .on("pointerenter pointermove", pointermoved)
    .on("pointerleave", pointerleft);

  //2. Parse the dates
  const parseTime = d3.timeParse("%d-%b-%y");

  //3. Creating the Chart Axes
  const x = d3
    .scaleTime()
    .domain(d3.extent(props.data, (d) => parseTime(d.date)))
    .range([props.marginLeft, props.width - props.marginRight]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(props.data, (d) => d.amount)])
    .range([props.height - props.marginBottom - legend, props.marginTop]);

  //4. Creating a Line
  const line = props.ariaChart
    ? d3
        .area()
        .x((d) => x(parseTime(d.date)))
        .y0(y(0))
        .y1((d) => y(d.amount))
    : d3
        .line()
        .x((d) => x(parseTime(d.date)))
        .y((d) => y(d.amount));

  const divChart = svg
    .append("g")
    .attr(
      "transform",
      `translate(0, ${props.positionLegend === "top" ? legend : 0})`
    );

  //5. Appending the Axes to the Chart
  divChart
    .append("g")
    .attr(
      "transform",
      `translate(0, ${props.height - props.marginBottom - legend})`
    )
    .call(d3.axisBottom(x).ticks(20));

  const axisY = divChart
    .append("g")
    .attr("transform", `translate(${props.marginLeft})`, 0)
    .call(d3.axisLeft(y).ticks(20));

  axisY
    .append("text")
    .attr("fill", "#000")
    .attr("transform", `translate(0, ${props.marginTop / 2})`)
    .text(props.labelY || amount);

  //6. Appending a path to the Chart
  divChart
    .append("path")
    .style("cursor", "pointer")
    .attr("fill", props.ariaChart ? "gray" : "none")
    .attr("stroke", "skyblue")
    .attr(
      "stroke-dasharray",
      `${props.width - props.marginLeft}, ${2 * (props.width + props.height)}`
    )
    .attr("d", line(props.data))
    .attr("fill-opacity", 0.2);

  divChart
    .selectAll()
    .data(props.data)
    .enter()
    .append("circle")
    .attr("style", "fill: white; stroke: skyblue; cursor: pointer")
    .attr("r", 3)
    .attr("cx", (d) => x(parseTime(d.date)))
    .attr("cy", (d) => y(d.amount));

  function positionLegend(value) {
    const values = {
      top: props.marginTop,
      bottom: props.height - props.marginBottom,
    };
    return values[value];
  }

  if (props.legend) {
    const legendDiv = svg.append("g");

    legendDiv
      .append("rect")
      .attr("x", props.marginLeft)
      .attr("y", positionLegend(props.positionLegend || "bottom"))
      .attr("width", 22)
      .attr("height", 12)
      .style("fill", d3.scaleOrdinal(d3.schemeAccent))
      .attr("rx", 3);

    legendDiv
      .append("text")
      .attr("x", props.marginLeft + 30)
      .attr("y", positionLegend(props.positionLegend || "bottom"))
      .attr("dy", ".5rem")
      .style("text-anchor", "start")
      .text(props.labelY || amount);
  }

  const tooltip = svg.append("g");

  function pointermoved(event) {
    tooltip.style("display", null);
    const bisect = d3.bisector((d) => parseTime(d.date)).center;
    const [xCoord] = d3.pointer(event);
    const scaleXCoord = x.invert(xCoord);
    const dataIndex = bisect(props.data, scaleXCoord);

    tooltip
      .attr(
        "transform",
        `translate(
          ${x(parseTime(props.data[dataIndex]?.date)) - 20},
          ${y(props.data[dataIndex].amount) - 50})`
      )
      .style("cursor", "pointer")
      .selectAll("text")
      .data([,])
      .join("text")
      .call((text) =>
        text
          .selectAll("tspan")
          .data([props.data[dataIndex].date, props.data[dataIndex].amount])
          .join("tspan")
          .attr("x", 0)
          .attr("y", (_, dataIndex) => `${dataIndex * 1}em`)
          .attr("font-weight", (_, dataIndex) => (dataIndex ? null : "bold"))
          .text((d) => d)
      );
  }

  function pointerleft() {
    tooltip.style("display", "none");
  }

  const limitValue = svg.append("g");
  if (props.limitValueMin) {
    limitValue
      .append("line")
      .attr("x1", props.marginLeft)
      .attr("y1", y(props.limitValueMin))
      .attr("x2", props.width - props.marginRight)
      .attr("y2", y(props.limitValueMin))
      .style("stroke-dasharray", "5 1")
      .style("stroke", "black")
      .style("stroke-width", "1px");
  }

  if (props.limitValueMax) {
    limitValue
      .append("line")
      .attr("x1", props.marginLeft)
      .attr("y1", y(props.limitValueMax))
      .attr("x2", props.width - props.marginRight)
      .attr("y2", y(props.limitValueMax))
      .style("stroke-dasharray", "5 1")
      .style("stroke", "black")
      .style("stroke-width", "1px");
  }
});
</script>
