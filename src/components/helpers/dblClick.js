import * as d3 from "d3";
import { brush, groupDateAmount, x, parseTime, newDateAmount } from "./";
import config from "../config";

export function dblclick() {
  groupDateAmount.value = d3.group(config.data, (d) => d.dateAmount);
  newDateAmount.value = groupDateAmount.value
    .get(config.scaleYName)
    .map(({ y2, dateAmount, dateY2, ...keepAttrs }) => keepAttrs);

  if (config.typeChart === "Line") {
    x.domain(
      d3.extent(newDateAmount.value, (d) => parseTime(d[config.scaleXName]))
    );
  }
  if (config.typeChart === "Bar") {
    x.domain(newDateAmount.value.map((d) => d[config.scaleXName]));
  }

  d3.select(".xAxis").call(d3.axisBottom(x));
  d3.select(".brush").call(brush);
}
