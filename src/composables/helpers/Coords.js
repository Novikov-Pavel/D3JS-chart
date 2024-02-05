import { ref, computed } from "vue";
import * as d3 from "d3";
import config from "../../config";

// const parseTime = d3.timeParse("%d-%b-%y");
const parseTime = d3.timeParse("%d.%m.%Y");

const groupDateAmount = ref(d3.group(config.data, (d) => d.dateAmount));

const dateAmount = computed(() => groupDateAmount.value.get(config.scale.scaleYName));
const newDateAmount = ref(
  dateAmount.value.map(({ y2, dateAmount, dateY2, ...keepAttrs }) => keepAttrs)
);

const domainBarX = newDateAmount.value.map((d) => d[config.scale.scaleXName]);
const domainLineX = d3.extent(newDateAmount.value, (d) =>
  parseTime(d[config.scale.scaleXName])
);
const domainY = [0, d3.max(newDateAmount.value, (d) => d[config.scale.scaleYName])];

const chooseChart = (domain) => {
  const domains = {
    Bar: domainBarX,
    Line: domainLineX,
  };
  return domains[domain];
};

const x = config
  .scale.scaleX()
  .domain(chooseChart(config.typeChart))
  .range([config.margin.left, config.width - config.margin.right]);

if (config.typeChart === "Bar") x.padding(0.3);

const y = config
  .scale.scaleY()
  .domain(domainY)
  .range([
    config.height - config.margin.bottom - config.legend.legendSpace,
    config.margin.top,
  ]);

const line1 = d3
  .line()
  .x((d) => x(parseTime(d[config.scale.scaleXName])))
  .y((d) => y(d[config.scale.scaleYName]));

const ariaChart1 = d3
  .area()
  .x((d) => x(parseTime(d[config.scale.scaleXName])))
  .y0(y(0))
  .y1((d) => y(d[config.scale.scaleYName]));

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
