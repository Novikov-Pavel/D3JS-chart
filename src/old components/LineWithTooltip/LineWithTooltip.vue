<template>
  <div class="LinewithTooltip"></div>
</template>
<script setup>
import aapl from "../../../public/aapl.json";
import * as d3 from "d3";
import { onMounted } from "vue";

onMounted(() => {
  // Declare the chart dimensions and margins.
  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  const isoDate = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
  // Declare the x (horizontal position) scale.
  const x = d3.scaleUtc(
    d3.extent(aapl, (d) => isoDate(d.date)),
    [marginLeft, width - marginRight]
  );

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear(
    [0, d3.max(aapl, (d) => d.close)],
    [height - marginBottom, marginTop]
  );

  // Declare the line generator.
  const line = d3
    .line()
    .x((d) => x(isoDate(d.date)))
    .y((d) => y(d.close));

  // Create the SVG container.
  const svg = d3
    .select(".LinewithTooltip")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr(
      "style",
      "max-width: 100%; height: auto; height: intrinsic; font: 10px sans-serif;"
    )
    .style("-webkit-tap-highlight-color", "transparent")
    .style("overflow", "visible")
    .on("pointerenter pointermove", pointermoved)
    .on("pointerleave", pointerleft)
    .on("touchstart", (event) => event.preventDefault());

  // Add the x-axis.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0)
    );

  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Daily Close ($)")
    );

  // Append a path for the line.
  svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line(aapl));

  // Create the tooltip container.
  const tooltip = svg.append("g");

  const formatValue = (value) => {
    return value.toLocaleString("en", {
      style: "currency",
      currency: "USD",
    });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(isoDate(date));
  };

  // Add the event listeners that show or hide the tooltip.
  const bisect = d3.bisector((d) => isoDate(d.date));
  function pointermoved(event) {
    const i = bisect.center(aapl, x.invert(d3.pointer(event)[0]));
    tooltip.style("display", null);
    const [X] = d3.pointer(event);
    tooltip.style("display", null);
    tooltip.attr("transform", `translate(${X},${y(aapl[i].close)})`);

    const path = tooltip
      .selectAll("path")
      .data([,])
      .join("path")
      .attr("fill", "white")
      .attr("stroke", "black");

    const text = tooltip
      .selectAll("text")
      .data([,])
      .join("text")
      .call((text) =>
        text
          .selectAll("tspan")
          .data([formatDate(aapl[i].date), formatValue(aapl[i].close)])
          .join("tspan")
          .attr("x", 0)
          .attr("y", (_, i) => `${i * 1.1}em`)
          .attr("font-weight", (_, i) => (i ? null : "bold"))
          .text((d) => d)
      );

    size(text, path);
  }

  function pointerleft() {
    tooltip.style("display", "none");
  }

  // Wraps the text with a callout path of the correct size, as measured in the page.
  function size(text, path) {
    const { y, width, height } = text.node().getBBox();
    text.attr("transform", `translate(${-width / 2},${15 - y})`);
    path.attr(
      "d",
      `M${-width / 2 - 10},5H-5l5,-5l5,5H${width / 2 + 10}v${height + 20}h-${
        width + 20
      }z`
    );
  }
});
</script>
