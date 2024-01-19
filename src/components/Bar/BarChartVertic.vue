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
  const groupDateAmount = d3.groups(props.data, (d) => d.dateAmount);
  const dataAmount = groupDateAmount.filter((e) => Boolean(e[0]))[0];
  console.log(dataAmount);
  const x = d3
    .scaleBand()
    .domain(dataAmount[1].map((d) => d.date))
    .range([props.marginLeft, props.width - props.marginRight])
    .padding(0.3);
  console.log(
    "dataAmount[1].map((d) => d.date",
    dataAmount[1].map((d) => d.date)
  );
  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(dataAmount[1], (d) => d.amount)])
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

  // Add the x-axis and label.
  const axisX = svg
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

  // 10. Добавление clipPath

  svg
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", props.width - props.marginLeft - props.marginRight)
    .attr("height", props.height - props.marginBottom)
    .attr("x", props.marginLeft)
    .attr("y", 0);

  const Bar = svg.append("g").attr("clip-path", "url(#clip)");

  const colorDataAmount = d3.scaleOrdinal(d3.schemeCategory10);

  Bar.attr("fill", colorDataAmount(dataAmount[0]))
    .selectAll()
    .data(dataAmount[1])
    .join("rect")
    .attr("x", (d) => x(d.date))
    .attr("y", (d) => (props.animation ? y(0) : y(d.amount)))
    .attr("height", (d) => (props.animation ? 0 : y(0) - y(d.amount)))
    .attr("width", x.bandwidth());
  // 11. Блок для зума
  const brush = d3
    .brushX()
    .extent([
      [props.marginLeft, props.marginTop],
      [props.width - props.marginRight, props.height - props.marginBottom],
    ])
    .on("end", updateChart);

  Bar.append("g").attr("class", "brush").call(brush);

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
        const index = Math.floor((value - paddingOuter) / eachBand) - 1;
        return domain[Math.max(0, Math.min(index, domain.length - 1))];
      };
    }

    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
    } else {
      const dRangeX = extent.map(scaleBandInvert(x));
      const indexMinMax = [];
      for (let i = 0; i < dRangeX.length; i++) {
        const el = x.domain().indexOf(dRangeX[i]);
        indexMinMax.push(el);
      }
      const arrDates = x.domain().slice(indexMinMax[0], indexMinMax[1]);
      x.padding(0.6).domain(arrDates);
      Bar.select(".brush").call(brush.move, null);
    }

    axisX.transition().duration(1000).call(d3.axisBottom(x));
    Bar.selectAll("rect")
      .data(dataAmount[1])
      .join("rect")
      .transition()
      .duration(1000)
      .attr("x", (d) => x(d.date))
      .attr("y", (d) => (props.animation ? y(0) : y(d.amount)))
      .attr("height", (d) => (props.animation ? 0 : y(0) - y(d.amount)))
      .attr("width", x.bandwidth());

    Bar.select(".brush").call(brush);
    // values1
    //   .transition()
    //   .duration(1000)
    //   .selectAll("text")
    //   .attr("x", (d) => x(parseTime(d.date)))
    //   .attr("y", (d) => y1(d.amount));
  }

  // 20. Сброс зума
  svg.on("dblclick", () => {
    x.domain(dataAmount[1].map((d) => d.date)).padding(0.3);
    axisX.transition().duration(1000).call(d3.axisBottom(x));
    Bar.selectAll("rect")
      .data(dataAmount[1])
      .join("rect")
      .transition()
      .duration(1000)
      .attr("x", (d) => x(d.date))
      .attr("y", (d) => (props.animation ? y(0) : y(d.amount)))
      .attr("height", (d) => (props.animation ? 0 : y(0) - y(d.amount)))
      .attr("width", x.bandwidth());
    Bar.select(".brush").call(brush);
  });
});
</script>
