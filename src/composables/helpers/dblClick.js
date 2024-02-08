import * as d3 from "d3";
import {
  brush,
  groupDateAmount,
  x,
  parseTime,
  newDateAmount,
  seriee,
} from "./";
import config from "../../config";

export function dblclick() {
  groupDateAmount.value = d3.group(config.data, (d) => d.dateAmount);
  newDateAmount.value = groupDateAmount.value
    .get(config.scale.scaleYName)
    .map(({ y2, dateAmount, dateY2, ...keepAttrs }) => keepAttrs);

  if (config.typeChart === "Line") {
    x.domain(
      d3.extent(newDateAmount.value, (d) =>
        parseTime(d[config.scale.scaleXName])
      )
    );
    seriee.value = seriee.value.slice(0);
  }
  if (config.typeChart === "Bar") {
    x.domain(newDateAmount.value.map((d) => d[config.scale.scaleXName]));
  }
  d3.select(".xAxis").call(d3.axisBottom(x));
  d3.select(".brush").call(brush);
}
