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
  const legendMargin = 70;
  const svg = d3
    .select(".chartLine")
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height);

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

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(props.data, (d) => d.amount)])
    .range([props.height - props.marginBottom - legendMargin, props.marginTop]);

  const axisY = divChart
    .append("g")
    .attr("transform", `translate(${props.marginLeft})`, 0)
    .call(d3.axisLeft(y).ticks(20))
    .append("text")
    .attr("fill", "#000")
    .attr(
      "transform",
      `translate(0, ${props.marginTop / 2}),rotate(${props.rotateYText})`
    )
    .text(props.labelY || "");

  axisY
    .selectAll("text")
    .attr("font-weight", props.fontWeightY ? "bold" : "normal")
    .attr("font-style", props.fontItalicY ? "italic" : "normal")
    .attr("font-size", props.fontSizeY);

  // 4. Создание графика
  const line = d3
    .line()
    .x((d) => x(parseTime(d.date)))
    .y((d) => y(d.amount));

  // 5. Создаине заливки
  const ariaChart = d3
    .area()
    .x((d) => x(parseTime(d.date)))
    .y0(y(0))
    .y1((d) => y(d.amount));

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
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .attr("stroke", d3.scaleOrdinal(d3.schemeAccent))
    .attr("d", line);

  Line.append("path")
    .datum(props.data)
    .attr("class", "aria")
    .attr("fill", "gray")
    .attr("fill-opacity", 0.2)
    .attr("d", ariaChart);

  const values = Line.append("g");

  // 14. Добавление точек на график
  svg
    .selectAll("circle")
    .data(props.data)
    .enter()
    .append("circle")
    .attr("style", "fill: white; stroke: skyblue; cursor: pointer")
    .attr("r", 3)
    .attr("cx", (d) => x(parseTime(d.date)))
    .attr("cy", (d) => y(d.amount))
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("contextmenu", () => console.log('правая кнопка нажата'))

  // 15. Функция наведения тултипа
  function mouseover(d) {
    tooltip.append("p").html(d.target.__data__.date);
    tooltip.append("p").html(d.target.__data__.amount);
    tooltip.append("p").html(d.target.__data__.test);
    tooltip.style("display", "block");
  }
  // 16. Фукнция удаления тултипа
  function mouseout() {
    tooltip.style("display", "none");
    tooltip.selectAll("p").remove();
  }
  // 17. Добавляем значения на график и их форматируем
  values
    .selectAll("text")
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

    Line.select(".line").transition().duration(1000).attr("d", line);
    Line.select(".aria").transition().duration(1000).attr("d", ariaChart);

    svg
      .transition()
      .duration(1000)
      .selectAll("circle")
      .attr("cx", (d) => x(parseTime(d.date)))
      .attr("cy", (d) => y(d.amount));

    values
      .transition()
      .duration(1000)
      .selectAll("text")
      .attr("x", (d) => x(parseTime(d.date)))
      .attr("y", (d) => y(d.amount));
  }

  // 20. Сброс зума
  svg.on("dblclick", () => {
    x.domain(d3.extent(props.data, (d) => parseTime(d.date)));
    axisX.transition().call(d3.axisBottom(x).ticks(20));
    Line.select(".line").transition().attr("d", line);
    Line.select(".aria").transition().attr("d", ariaChart);

    svg
      .transition()
      .duration(1000)
      .selectAll("circle")
      .attr("cx", (d) => x(parseTime(d.date)))
      .attr("cy", (d) => y(d.amount));

    values
      .transition()
      .duration(1000)
      .selectAll("text")
      .attr("x", (d) => x(parseTime(d.date)))
      .attr("y", (d) => y(d.amount));
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
