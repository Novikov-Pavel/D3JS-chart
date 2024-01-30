import * as d3 from "d3";
import {
  animationBars,
  brush,
  groupDateAmount,
  newDateAmount,
  x,
} from "./";
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
    if (config.typeChart === "Line")
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
    newDateAmount.value = newDateAmount.value.slice(0);
    if (config.typeChart === "Bar") {
      const dRangeX = extent.map(scaleBandInvert(x));
      const indexMinMax = [];
      for (let i in dRangeX) {
        const el = x.domain().indexOf(dRangeX[i]);
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

      const filteredData = newDateAmount.value.filter((item) =>
        arrDates.includes(item.date)
      );
      groupDateAmount.value.set("amount", filteredData);
      x.domain(arrDates).paddingOuter(1).paddingInner(0.5);
      if (arrDates.length <= 4) x.paddingInner(0.7);
      if (arrDates.length <= 2) x.paddingInner(0.9);
    }
    d3.select(".brush").call(brush.move, null);
    d3.select(".xAxis").call(d3.axisBottom(x));
  }
  animationBars();
}
