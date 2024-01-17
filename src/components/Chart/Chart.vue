<template>
  <div class="chartLine">
    <svg :width="width" :height="height"></svg>
  </div>
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
  const legendMargin = 70;
  const svg = d3.select("svg");

  // 1. Позиционирование легенды
  const divChart = svg
    .append("g")
    .attr(
      "transform",
      `translate(0, ${props.positionLegend === "top" ? legendMargin : 0})`
    );

  //2. Парсинг даты
  const parseTime = d3.timeParse("%d-%b-%y");

  //3. Создание осей, форматирование их значений и их названия
  const x = d3
    .scaleTime()
    .domain(d3.extent(props.data, (d) => parseTime(d.date)))
    .range([props.marginLeft, props.width - props.marginRight]);

  const axisX = divChart
    .append("g")
    .attr(
      "transform",
      `translate(0, ${props.height - props.marginBottom - legendMargin})`
    )
    .call(d3.axisBottom(x).ticks(20));

  axisX
    .selectAll("text")
    .attr("transform", `rotate(${props.rotateXText})`)
    .attr("font-weight", props.fontWeightX ? "bold" : "normal")
    .attr("font-style", props.fontItalicX ? "italic" : "normal")
    .attr("font-size", props.fontSizeX);

  const y1 = d3
    .scaleLinear()
    .range([props.height - props.marginBottom - legendMargin, props.marginTop]);
  y1.domain([0, d3.max(props.data, (d) => d.amount)]);

  const y2 = d3
    .scaleLinear()
    .range([props.height - props.marginBottom - legendMargin, props.marginTop]);
  y2.domain([0, 4]);

  const axisY1 = divChart
    .append("g")
    .attr("transform", `translate(${props.marginLeft})`, 0)
    .style("color", d3.scaleOrdinal(d3.schemeSet1))
    .call(d3.axisLeft(y1).ticks())
    .append("text")
    .attr("fill", "#000")
    .attr(
      "transform",
      `translate(0, ${props.marginTop / 2}),rotate(${props.rotateYText})`
    )
    .text(props.labelY || "");

  const axisY2 = divChart
    .append("g")
    .attr("transform", `translate(${props.width - props.marginRight})`, 0)
    .style("color", d3.scaleOrdinal(d3.schemeSet2))
    .call(d3.axisRight(y2).ticks());

  axisY1
    .selectAll("text")
    .attr("font-weight", props.fontWeightY ? "bold" : "normal")
    .attr("font-style", props.fontItalicY ? "italic" : "normal")
    .attr("font-size", props.fontSizeY);

  // 4. Создание графика
  const line1 = d3
    .line()
    .x((d) => x(parseTime(d.date)))
    .y((d) => y1(d.amount));

  const line2 = d3
    .line()
    .x((d) => x(parseTime(d.date)))
    .y((d) => y2(d.y2));

  // 5. Создаине заливки
  const ariaChart1 = d3
    .area()
    .x((d) => x(parseTime(d.date)))
    .y0(y1(0))
    .y1((d) => y1(d.amount));

  const ariaChart2 = d3
    .area()
    .x((d) => x(parseTime(d.date)))
    .y0(y2(0))
    .y1((d) => y2(d.y2));

  //6. Функция выравнивания значения на графике по вертикали

  function dominantBaseline(position) {
    const positions = {
      top: "text-top",
      bottom: "hanging",
    };
    return positions[position];
  }

  //7. Функция выравнивания значения на графике по горизонтали
  function textAnchor(position) {
    const positions = {
      left: "end",
      right: "start",
    };
    return positions[position];
  }

  //8. Функция позиционирования значения на графике
  function valuePositionTranslate(translate) {
    const translates = {
      top: "0, -15",
      bottom: "0, 15",
      left: "-15, 0",
      right: "15, 0",
    };
    return translates[translate];
  }

  //9. Функция позиционирования легенды
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
      .style("fill", d3.scaleOrdinal(d3.schemeSet1))
      .attr("rx", 3);

    legendDiv
      .append("text")
      .attr("x", props.marginLeft + 30)
      .attr("y", positionLegend(props.positionLegend || "bottom"))
      .attr("dy", ".5rem")
      .style("text-anchor", "start")
      .text(props.labelY || "");
  }
  // 10. Добавление clipPath для выделения при зуме
  svg
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", props.width - props.marginLeft - props.marginRight)
    .attr("height", props.height - props.marginBottom - legendMargin)
    .attr("x", props.marginLeft)
    .attr("y", 0);

  // 11. Блок для зума
  const brush = d3
    .brushX()
    .extent([
      [props.marginLeft, props.marginTop],
      [
        props.width - props.marginRight,
        props.height - props.marginBottom - legendMargin,
      ],
    ])
    .on("end", updateChart);

  // 12. Добавление тултипа для значения на граике
  const tooltip = d3
    .select(".chartLine")
    .append("div")
    .attr("class", "tooltip");

  const Line = svg.append("g").attr("clip-path", "url(#clip)");

  // 13. Отрисовка графика и заливки
  Line.append("path")
    .datum(props.data)
    .attr("class", "line1")
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", d3.scaleOrdinal(d3.schemeSet1))
    .attr("d", line1(props.data));

  Line.append("path")
    .datum(props.data)
    .attr("fill", "none")
    .attr("class", "line2")
    .attr("stroke-width", 2)
    .attr("stroke", d3.scaleOrdinal(d3.schemeSet2))
    .attr("d", line2(props.data));

  Line.append("path")
    .datum(props.data)
    .attr("class", "aria1")
    .attr("fill", d3.scaleOrdinal(d3.schemeSet1))
    .attr("fill-opacity", 0.2)
    .attr("d", ariaChart1);

  Line.append("path")
    .datum(props.data)
    .attr("class", "aria2")
    .attr("fill", d3.scaleOrdinal(d3.schemeSet2))
    .attr("fill-opacity", 0.2)
    .attr("d", ariaChart2);

  const values1 = Line.append("g").attr("class", "values1");
  const values2 = Line.append("g").attr("class", "values2");

  // 14. Добавление точек на график
  const gCircle1 = svg
    .selectAll(".gCircle1")
    .data(props.data)
    .enter()
    .append("g")
    .attr("class", "gCircle1");

  const gCircle2 = svg
    .selectAll(".gCircle2")
    .data(props.data)
    .enter()
    .append("g")
    .attr("class", "gCircle2");

  gCircle1
    .append("circle")
    .attr("style", "fill: white; stroke: skyblue; cursor: pointer")
    .attr("r", 3)
    .attr("cx", (d) => x(parseTime(d.date)))
    .attr("cy", (d) => y1(d.amount))
    .on("mouseover", mouseover1)
    .on("mouseout", mouseout)
    .on("contextmenu", () => console.log("правая кнопка нажата"));

  gCircle2
    .append("circle")
    .attr("style", "fill: white; stroke: skyblue; cursor: pointer")
    .attr("r", 3)
    .attr("cx", (d) => x(parseTime(d.date)))
    .attr("cy", (d) => y2(d.y2))
    .on("mouseover", mouseover2)
    .on("mouseout", mouseout)
    .on("contextmenu", () => console.log("правая кнопка нажата"));

  // 15. Функция наведения тултипа
  function mouseover1(d) {
    tooltip.append("p").html(d.target.__data__.date);
    tooltip.append("p").html(d.target.__data__.amount);
    tooltip.append("p").html(d.target.__data__.test);
    tooltip.style("display", "block");
  }

  function mouseover2(d) {
    tooltip.append("p").html(d.target.__data__.date);
    tooltip.append("p").html(d.target.__data__.y2);
    tooltip.append("p").html(d.target.__data__.test);
    tooltip.style("display", "block");
  }
  // 16. Фукнция удаления тултипа
  function mouseout() {
    tooltip.style("display", "none");
    tooltip.selectAll("p").remove();
  }
  // 17. Добавляем значения на график и их форматируем
  // const gValues1 = values1
  //   .selectAll("text")
  //   .data(props.data)
  //   .enter();

  // const gValues2 = values2.selectAll("text").data(props.data).enter();

  values1
    .selectAll("text")
    .data(props.data)
    .enter()
    .append("text")
    .attr("x", (d) => x(parseTime(d.date)))
    .attr("y", (d) => y1(d.amount))
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

  values2
    .selectAll("text")
    .data(props.data)
    .enter()
    .append("text")
    .attr("x", (d) => x(parseTime(d.date)))
    .attr("y", (d) => y2(d.y2))
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
    .text((d) => (props.valueCategory === "category" ? d.date : d.y2));

  Line.append("g").attr("class", "brush").call(brush);

  // 18. Удаляем выделение
  let idleTimeout;
  const idled = () => (idleTimeout = null);

  // 19. Функция обновления графика, точек и значений точек
  function updateChart(event) {
    const extent = event.selection;

    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      Line.select(".brush").call(brush.move, null);
    }

    axisX.transition().duration(1000).call(d3.axisBottom(x));

    Line.select(".line1").transition().duration(1000).attr("d", line1);
    Line.select(".line2").transition().duration(1000).attr("d", line2);
    Line.select(".aria1").transition().duration(1000).attr("d", ariaChart1);
    Line.select(".aria2").transition().duration(1000).attr("d", ariaChart2);

    gCircle1
      .transition()
      .duration(1000)
      .selectAll("circle")
      .attr("cx", (d) => x(parseTime(d.date)))
      .attr("cy", (d) => y1(d.amount));

    gCircle2
      .transition()
      .duration(1000)
      .selectAll("circle")
      .attr("cx", (d) => x(parseTime(d.date)))
      .attr("cy", (d) => y2(d.y2));

    values1
      .transition()
      .duration(1000)
      .selectAll("text")
      .attr("x", (d) => x(parseTime(d.date)))
      .attr("y", (d) => y1(d.amount));

    values2
      .transition()
      .duration(1000)
      .selectAll("text")
      .attr("x", (d) => x(parseTime(d.date)))
      .attr("y", (d) => y2(d.y2));
  }

  // 20. Сброс зума
  svg.on("dblclick", () => {
    x.domain(d3.extent(props.data, (d) => parseTime(d.date)));
    axisX.transition().call(d3.axisBottom(x).ticks(20));
    Line.select(".line1").transition().attr("d", line1);
    Line.select(".line2").transition().attr("d", line2);
    Line.select(".aria1").transition().attr("d", ariaChart1);
    Line.select(".aria2").transition().attr("d", ariaChart2);

    gCircle1
      .transition()
      .duration(1000)
      .selectAll("circle")
      .attr("cx", (d) => x(parseTime(d.date)))
      .attr("cy", (d) => y1(d.amount));

    gCircle2
      .transition()
      .duration(1000)
      .selectAll("circle")
      .attr("cx", (d) => x(parseTime(d.date)))
      .attr("cy", (d) => y2(d.y2));

    values1
      .transition()
      .duration(1000)
      .selectAll("text")
      .attr("x", (d) => x(parseTime(d.date)))
      .attr("y", (d) => y1(d.amount));

    values2
      .transition()
      .duration(1000)
      .selectAll("text")
      .attr("x", (d) => x(parseTime(d.date)))
      .attr("y", (d) => y2(d.y2));
  });

  // 21. Лимитные значения
  // const limitValue = svg.append("g");
  // if (props.limitValueMin) {
  //   limitValue
  //     .append("line")
  //     .attr("x1", props.marginLeft)
  //     .attr("y1", y(props.limitValueMin))
  //     .attr("x2", props.width - props.marginRight)
  //     .attr("y2", y(props.limitValueMin))
  //     .style("stroke-dasharray", "5 1")
  //     .style("stroke", "black")
  //     .style("stroke-width", "1px");
  // }

  // if (props.limitValueMax) {
  //   limitValue
  //     .append("line")
  //     .attr("x1", props.marginLeft)
  //     .attr("y1", y(props.limitValueMax))
  //     .attr("x2", props.width - props.marginRight)
  //     .attr("y2", y(props.limitValueMax))
  //     .style("stroke-dasharray", "5 1")
  //     .style("stroke", "black")
  //     .style("stroke-width", "1px");
  // }
});
</script>
<style>
.tooltip {
  z-index: 10;
  background: #eee;
  box-shadow: 0 0 5px #999999;
  width: fit-content;
  display: none;
  text-align: center;
  padding: 10px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
