import * as d3 from "d3";
import { animationBars, brush, groupDateAmount, newDateAmount, x } from "./";
import config from "../config";

let idleTimeout;
const idled = () => (idleTimeout = null);

export function updateChart(event) {
  const extent = event.selection;

  function scaleBandInvert(scale) {
    const domain = scale.domain();
    const paddingOuter = scale.paddingOuter();
    const eachBand = scale.step();
    return function (value) {
      let index = Math.floor((value - paddingOuter) / eachBand) - 1;
      return domain[Math.max(0, Math.min(index, domain.length - 1))];
    };
  }

  if (!extent) {
    if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
  } else {
    if (config.typeChart === "Line") {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      newDateAmount.value = newDateAmount.value.slice(0);
    }

    if (config.typeChart === "Bar") {
      const dRangeX = extent.map(scaleBandInvert(x));
      console.log("dRangeXBar", dRangeX);
      const indexMinMax = dRangeX.map((el) => x.domain().indexOf(el));
      const arrDates = x
        .domain()
        .slice(
          indexMinMax[0],
          indexMinMax[1] === x.domain().length - 1 ||
            indexMinMax[0] === indexMinMax[1]
            ? indexMinMax[1] + 1
            : indexMinMax[1]
        );
      const filteredData = newDateAmount.value.filter((item) =>
        arrDates.includes(item.date)
      );

      groupDateAmount.value.set("amount", filteredData);
      newDateAmount.value = groupDateAmount.value
        .get("amount")
        .map(({ y2, dateAmount, dateY2, ...keepAttrs }) => keepAttrs);
      x.domain(arrDates);
    }
    d3.select(".brush").call(brush.move, null);
    d3.select(".xAxis").call(d3.axisBottom(x));
  }
  animationBars();
}
