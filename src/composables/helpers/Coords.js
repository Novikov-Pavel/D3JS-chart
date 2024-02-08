import { ref, computed, reactive } from "vue";
import * as d3 from "d3";
import { regressionPoly, regressionLog } from "d3-regression";
import config from "../../config";

// const parseTime = d3.timeParse("%d-%b-%y");
const parseTime = d3.timeParse("%d.%m.%Y");

const groupDateAmount = ref(d3.group(config.data, (d) => d.dateAmount));

const data = computed(() => config.data);

const series = ref(
  d3
    .stack()
    .keys(d3.union(data.value.map((d) => d.dateAmount)))
    .value(([, group], key) => group.get(key).amount)(
    d3.index(
      data.value,
      (d) => d.date,
      (d) => d.dateAmount
    )
  )
);

const seriee = reactive(series);

const dateAmount = computed(() =>
  groupDateAmount.value.get(config.scale.scaleYName)
);
const newDateAmount = ref(
  dateAmount.value.map(({ y2, dateAmount, dateY2, ...keepAttrs }) => keepAttrs)
);

const domainBarX = newDateAmount.value.map((d) => d[config.scale.scaleXName]);
const domainLineX = reactive(
  d3.extent(newDateAmount.value, (d) => parseTime(d[config.scale.scaleXName]))
);

const domainY = [0, d3.max(series.value, (d) => d3.max(d, (d) => d[1]))];

const mean = d3.mean(domainY);
const median = d3.median(domainY);

console.log("mean", mean);
console.log("median", median);

const chooseChart = (domain) => {
  const domains = {
    Bar: domainBarX,
    Line: domainLineX,
  };
  return domains[domain];
};

const x = config.scale
  .scaleX()
  .domain(chooseChart(config.typeChart))
  .range([config.margin.left, config.width - config.margin.right]);

if (config.typeChart === "Bar") x.padding(0.3);

const y = config.scale
  .scaleY()
  .domain(domainY)
  .range([
    config.height - config.margin.bottom - config.legend.legendSpace,
    config.margin.top,
  ]);

const line1 = computed(() =>
  d3
    .line()
    .curve(d3.curveCatmullRom.alpha(0.5))
    .x((d) => x(parseTime(d.data?.[0])))
    .y((d) => y(d[1]))
);

const ariaChart1 = d3
  .area()
  .curve(d3.curveCatmullRom.alpha(0.5))
  .x((d) => x(parseTime(d.data?.[0])))
  .y0((d) => y(d[0]))
  .y1((d) => y(d[1]));

const polyRegression = regressionPoly()
  .x((d) => x(parseTime(d[config.scale.scaleXName])))
  .y((d) => y(d[config.scale.scaleYName]))
  .order(3);

const logRegression = regressionLog()
  .x((d) => x(parseTime(d[config.scale.scaleXName])))
  .y((d) => y(d[config.scale.scaleYName]));

const poly = computed(() => polyRegression(newDateAmount.value));
const logaritm = computed(() => logRegression(newDateAmount.value));

const lineGenerator = d3
  .line()
  .x((d) => d[0])
  .y((d) => d[1]);

export {
  ariaChart1,
  data,
  groupDateAmount,
  line1,
  lineGenerator,
  logaritm,
  poly,
  mean,
  median,
  newDateAmount,
  parseTime,
  x,
  y,
  series,
  seriee,
};
