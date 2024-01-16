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
  valuePosition: String,
  valueCategory: String,
  rotateXText: Number,
  rotateYText: Number,
  fontWeightX: Boolean,
  fontWeightY: Boolean,
  fontWeightValues: Boolean,
  fontItalicValues: Boolean,
  fontItalicX: Boolean,
  fontSizeX: Number,
  fontItalicY: Boolean,
  fontSizeY: Number,
  fontSizeValue: Number,
});

onMounted(() => {
  const legend = 70;
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

  // 4. Creating a Line
  // const line = d3
  //   .line()
  //   .x((d) => x(parseTime(d.date)))
  //   .y((d) => y(d.amount));

  const ariaChart = d3
    .area()
    .x((d) => x(parseTime(d.date)))
    .y0(y(0))
    .y1((d) => y(d.amount));

  const divChart = svg
    .append("g")
    .attr(
      "transform",
      `translate(0, ${props.positionLegend === "top" ? legend : 0})`
    );

  //5. Appending the Axes to the Chart
  const axisX = divChart
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
    .attr(
      "transform",
      `translate(0, ${props.marginTop / 2}),rotate(${props.rotateYText})`
    )
    .text(props.labelY || "");

  //6. Appending a path to the Chart
  divChart
    .append("path")
    .style("cursor", "pointer")
    .attr("class", "pathLine")
    .attr("fill", props.ariaChart ? "gray" : "none")
    .attr("stroke", d3.scaleOrdinal(d3.schemeAccent));
  // .attr("d", line(props.data));

  const path = document.querySelector(".pathLine");
  const lengthPathLine = path.getTotalLength();
  
  divChart
    .select(".pathLine")
    // .attr("d", props.ariaChart ? ariaChart(props.data) : line(props.data))
    .attr("fill-opacity", 0.2)
    .attr(
      "stroke-dasharray",
      `${lengthPathLine}, ${2 * (props.width + props.height)}`
    );

  const dots = divChart.append("g");
  const values = divChart.append("g");

  dots
    .selectAll()
    .data(props.data)
    .enter()
    .append("circle")
    .attr("style", "fill: white; stroke: skyblue; cursor: pointer")
    .attr("r", 3)
    .attr("cx", (d) => x(parseTime(d.date)))
    .attr("cy", (d) => y(d.amount));

  values
    .selectAll()
    .data(props.data)
    .enter()
    .append("text")
    .attr("x", (d) => x(parseTime(d.date)))
    .attr("y", (d) => y(d.amount))
    .attr("text-anchor", textAnchor(props.valuePosition) || "middle")
    .attr(
      "dominant-baseline",
      dominantBaseline(props.valuePosition) || "middle"
    )
    .attr(
      "transform",
      `translate(${valuePositionTranslate(props.valuePosition)}), rotate(${0})`
    )
    .attr("font-weight", props.fontWeightValues ? "bold" : "normal")
    .attr("font-style", props.fontItalicValues ? "italic" : "normal")
    .attr("font-size", props.fontSizeValue)
    .text((d) => (props.valueCategory === "category" ? d.date : d.amount));

  axisX
    .selectAll("text")
    .attr("transform", `rotate(${props.rotateXText})`)
    .attr("font-weight", props.fontWeightX ? "bold" : "normal")
    .attr("font-style", props.fontItalicX ? "italic" : "normal")
    .attr("font-size", props.fontSizeX);

  axisY
    .selectAll("text")
    .attr("font-weight", props.fontWeightY ? "bold" : "normal")
    .attr("font-style", props.fontItalicY ? "italic" : "normal")
    .attr("font-size", props.fontSizeY);

  function dominantBaseline(position) {
    const positions = {
      top: "text-top",
      bottom: "hanging",
    };
    return positions[position];
  }

  function textAnchor(position) {
    const positions = {
      left: "end",
      right: "start",
    };
    return positions[position];
  }

  function valuePositionTranslate(translate) {
    const translates = {
      top: "0, -15",
      bottom: "0, 15",
      left: "-15, 0",
      right: "15, 0",
    };
    return translates[translate];
  }

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
      .text(props.labelY || "");
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

  svg
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", props.width - props.marginLeft - props.marginRight)
    .attr("height", props.height - props.marginTop - props.marginBottom - legend)
    .attr("x", props.marginLeft)
    .attr("y", props.marginTop);

  const brush = d3
    .brushX()
    .extent([
      [props.marginLeft, props.marginTop],
      [
        props.width - props.marginTop,
        props.height - props.marginBottom - legend,
      ],
    ])
    .on("end", updateChart);

  const Line = svg.append("g").attr("clip-path", "url(#clip)");

  Line.append("path")
    .datum(props.data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", d3.scaleOrdinal(d3.schemeAccent))
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(parseTime(d.date)))
        .y((d) => y(d.amount))
    );

  Line.append("g").attr("class", "brush").call(brush);

  let idleTimeout;
  const idled = () => (idleTimeout = null);

  function updateChart(event, d) {
    const extent = event.selection;
    // console.log("event", event);
    // console.log("x.invert(extent[0])", x.invert(extent[0]));
    // console.log("x.invert(extent[1])", x.invert(extent[1]));

    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      Line.select(".brush").call(brush.move, null);
    }

    axisX.transition().duration(1000).call(d3.axisBottom(x));
    Line.select(".line")
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(parseTime(d.date)))
          .y((d) => y(d.amount))
      );
  }

  svg.on("dblclick", () => {
    x.domain(d3.extent(props.data, (d) => parseTime(d.date)));
    axisX.transition().call(d3.axisBottom(x));
    Line.select(".line")
      .transition()
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(parseTime(d.date)))
          .y((d) => y(d.amount))
      );
  });

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
