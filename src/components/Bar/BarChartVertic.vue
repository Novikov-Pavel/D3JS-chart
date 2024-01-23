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
  limitValueMin: Number,
  limitValueMax: Number,
});

onMounted(() => {
  const groupDateAmount = d3.group(props.data, (d) => d.dateAmount);
  const dateAmount = groupDateAmount.get("amount");

  console.log("dateAmount", dateAmount);

  const legendSpace = 40;
  console.log(groupDateAmount);
  const x = d3
    .scaleBand()
    .domain(dateAmount.map((d) => d.date))
    .range([props.marginLeft, props.width - props.marginRight])
    .padding(0.3);

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(dateAmount, (d) => d.amount)])
    .range([props.height - props.marginBottom - legendSpace, props.marginTop]);

  // Create the SVG container.
  const svg = d3
    .select(".chartVert")
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height)
    .attr("viewBox", [0, 0, props.width, props.height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add the x-axis and label.
  const axisX = svg
    .append("g")
    .attr(
      "transform",
      `translate(0,${props.height - props.marginBottom - legendSpace})`
    )
    .call(d3.axisBottom(x));

  axisX
    .selectAll("text")
    .attr("transform", `rotate(${props.rotateXText})`)
    .attr("font-weight", props.fontWeightX ? "bold" : "normal")
    .attr("font-style", props.fontItalicX ? "italic" : "normal")
    .attr("font-size", props.fontSizeX);

  // Add the y-axis
  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${props.marginLeft}, 0)`)
    .call(d3.axisLeft(y));

  yAxis
    .selectAll("text")
    .attr("font-weight", props.fontWeightY ? "bold" : "normal")
    .attr("font-style", props.fontItalicY ? "italic" : "normal")
    .attr("font-size", props.fontSizeY)
    .attr("transform", `rotate(${props.rotateYText})`);

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

  const colorDataAmount = d3.scaleOrdinal(d3.schemeCategory10);
  const Bar = svg.append("g").attr("fill", colorDataAmount(dateAmount[0]));
  const brushG = Bar.append("g").attr("class", "brush");

  Bar.selectAll("rect")
    .data(dateAmount)
    .enter()
    .append("rect")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .attr("x", (d) => x(d.date))
    .attr("y", (d) => (props.animation ? y(0) : y(d.amount)))
    .attr("height", (d) => (props.animation ? y(0) : y(0) - y(d.amount)))
    .attr("width", x.bandwidth());

  Bar.selectAll("text")
    .data(dateAmount)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", (d) => y(d.amount) - x.bandwidth() / 10)
    .text((d) => d.amount)
    .attr("font-weight", props.fontWeightValues ? "bold" : "normal")
    .attr("font-style", props.fontItalicValues ? "italic" : "normal")
    .attr("font-size", props.fontSizeValue)
    .transition()
    .duration(1000)
    .attr("x", (d) => x(d.date) + x.bandwidth() / 2);

  if (props.animation) {
    Bar.selectAll("rect")
      .transition()
      .duration(1500)
      .attr("y", (d) => y(d.amount))
      .attr("height", (d) => y(0) - y(d.amount));
  }

  const tooltip = d3
    .select(".chartVert")
    .append("div")
    .style("position", "absolute");

  // 15. Функция наведения тултипа
  function mouseover(d) {
    tooltip.append("p").html(d.target.__data__.date);
    tooltip.append("p").html(d.target.__data__.amount);
    tooltip.append("p").html(d.target.__data__.test);
    tooltip.style("display", "block");
    tooltip.style("top", "0");
  }
  function mouseout() {
    tooltip.style("display", "none");
    tooltip.selectAll("p").remove();
  }

  // Легенда
  const sizeLegend = 20;
  const legend = svg.append("g").attr("fill", colorDataAmount(dateAmount[0]));

  legend
    .selectAll("rectLegend")
    .data(groupDateAmount)
    .enter()
    .append("rect")
    .attr("x", props.marginLeft)
    .attr("y", (_, i) => props.height - legendSpace / 2 + i * sizeLegend)
    .attr("width", sizeLegend)
    .attr("height", sizeLegend);

  legend
    .selectAll("labelLegend")
    .data(groupDateAmount)
    .enter()
    .append("text")
    .attr("x", props.marginLeft + sizeLegend * 1.5)
    .attr("y", (_, i) => props.height - legendSpace / 2 + i * sizeLegend)
    .text((d) => d[0])
    .style("alignment-baseline", "hanging");

  // 11. Блок для зума
  const brush = d3
    .brushX()
    .extent([
      [props.marginLeft, props.marginTop],
      [props.width - props.marginRight, props.height - props.marginBottom],
    ])
    .on("end", updateChart);

  brushG.call(brush);

  // 18. Удаляем выделение
  let idleTimeout;
  const idled = () => (idleTimeout = null);

  // 19. Функция обновления графика, точек и значений точек
  function updateChart(event) {
    const extent = event.selection;
    // function scaleBandInvert(scale) {
    //   const domain = scale.domain();
    //   const paddingOuter = scale.paddingOuter();

    //   return function (value) {
    //     console.log("d3.pointer", d3.pointer(event));

    //     var val = scale.domain();

    //     var eachBand =
    //       (props.width - props.marginLeft - props.marginRight) / domain.length;

    //     var index = Math.floor(
    //       (d3.pointer(event)[0] - props.marginLeft) / eachBand
    //     );
    //     if (index < 0) index = 0;
    //     if (index > domain.length - 1) index = domain.length - 1;

    //     // var index = Math.round(d3.pointer(event)[0] / eachBand);

    //     console.log("index", index);
    //     console.log("eachBand", eachBand);
    //     console.log("val", val);

    //     return domain[Math.max(0, Math.min(index, domain.length - 1))];
    //   };
    // }

    function scaleBandInvert(scale) {
      const domain = scale.domain();
      const paddingOuter = scale.paddingOuter();
      const eachBand = scale.step();
      return function (value) {
        let index = Math.floor((value - paddingOuter) / eachBand) - 1;
        // if (index > domain.length) index = domain.length - 1;
        console.log("index", index);
        return domain[Math.max(0, Math.min(index, domain.length - 1))];
      };
    }

    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
    } else {
      const dRangeX = extent.map(scaleBandInvert(x));
      console.log("dRangeX", dRangeX);
      const indexMinMax = [];
      for (let i in dRangeX) {
        const el = x.domain().indexOf(dRangeX[i]);
        console.log("el", el);
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

      Bar.select(".brush").call(brush.move, null);

      const filteredData = dateAmount.filter((item) =>
        arrDates.includes(item.date)
      );

      x.domain(arrDates);

      axisX.transition().duration(1000).call(d3.axisBottom(x));

      Bar.selectAll("rect").remove();
      Bar.selectAll("rect")
        .data(filteredData)
        .enter()
        .append("rect")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .attr("y", (d) => y(d.amount))
        .attr("x", (d) => x(d.date))
        .attr("width", x.bandwidth())
        .transition()
        .duration(1000)
        .attr("height", (d) => y(0) - y(d.amount));

      Bar.selectAll("text").remove();

      Bar.attr("fill", colorDataAmount(dateAmount[0]))
        .selectAll("text")
        .data(filteredData)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", (d) => x(d.date) + x.bandwidth() / 2)
        .text((d) => d.amount)
        .attr("font-weight", props.fontWeightValues ? "bold" : "normal")
        .attr("font-style", props.fontItalicValues ? "italic" : "normal")
        .attr("font-size", props.fontSizeValue)
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d.amount) - x.bandwidth() / 10);

      Bar.select(".brush").call(brush);
    }
  }

  // 20. Сброс зума
  svg.on("dblclick", () => {
    x.domain(dateAmount.map((d) => d.date)).padding(0.3);
    axisX.transition().duration(1000).call(d3.axisBottom(x));

    Bar.selectAll("rect").remove();
    Bar.selectAll("rect")
      .data(dateAmount)
      .enter()
      .append("rect")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .attr("x", (d) => x(d.date))
      .attr("y", (d) => y(d.amount))
      .attr("height", (d) => y(0) - y(d.amount))
      .attr("width", x.bandwidth())
      .transition()
      .duration(1000);

    Bar.selectAll("text").remove();

    Bar.attr("fill", colorDataAmount(dateAmount[0]))
      .selectAll("text")
      .data(dateAmount)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", (d) => y(d.amount) - x.bandwidth() / 10)
      .text((d) => d.amount)
      .attr("font-weight", props.fontWeightValues ? "bold" : "normal")
      .attr("font-style", props.fontItalicValues ? "italic" : "normal")
      .attr("font-size", props.fontSizeValue)
      .transition()
      .duration(1000)
      .attr("x", (d) => x(d.date) + x.bandwidth() / 2);

    Bar.select(".brush").call(brush);

    axisX
      .selectAll("text")
      .attr("transform", `rotate(${props.rotateXText})`)
      .attr("font-weight", props.fontWeightX ? "bold" : "normal")
      .attr("font-style", props.fontItalicX ? "italic" : "normal")
      .attr("font-size", props.fontSizeX);
  });

  // 21. Лимитные значения
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
<style>
.chartVert {
  position: relative;
}
</style>
