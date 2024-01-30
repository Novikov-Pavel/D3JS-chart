import { ref, computed } from "vue";
import * as d3 from "d3";
import config from "../config";

const parseTime = d3.timeParse("%d-%b-%y");
const groupDateAmount = ref(d3.group(config.data, (d) => d.dateAmount));

const dateAmount = computed(() => groupDateAmount.value.get("amount"));
const newDateAmount = ref(
  dateAmount.value.map(({ y2, dateAmount, dateY2, ...keepAttrs }) => keepAttrs)
);

const domainBarX = newDateAmount.value.map((d) => d.date);
const domainLineX = d3.extent(newDateAmount.value, (d) => parseTime(d.date));
const domainY = [0, d3.max(newDateAmount.value, (d) => d.amount)];

const chooseChart = (domain) => {
  const domains = {
    Bar: domainBarX,
    Line: domainLineX,
  };
  return domains[domain];
};

const x = config
  .scaleX()
  .domain(chooseChart(config.typeChart))
  .range([config.marginLeft, config.width - config.marginRight]);

if (config.typeChart === "Bar") x.padding(0.3);

const y = config
  .scaleY()
  .domain(domainY)
  .range([
    config.height - config.marginBottom - config.legendSpace,
    config.marginTop,
  ]);

const line1 = d3
  .line()
  .x((d) => x(parseTime(d.date)))
  .y((d) => y(d.amount));

const ariaChart1 = d3
  .area()
  .x((d) => x(parseTime(d.date)))
  .y0(y(0))
  .y1((d) => y(d.amount));

export {
  ariaChart1,
  domainLineX,
  groupDateAmount,
  line1,
  newDateAmount,
  parseTime,
  x,
  y,
};
