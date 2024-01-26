import { ref, computed } from "vue";
import * as d3 from "d3";
import config from "../config";

const groupDateAmount = ref(d3.group(config.data, (d) => d.dateAmount));
const dateAmount = computed(() => groupDateAmount.value.get("amount"));
const newDateAmount = computed(() =>
  dateAmount.value.map(({ y2, dateAmount, dateY2, ...keepAttrs }) => keepAttrs)
);

const x = d3
  .scaleBand()
  .domain(newDateAmount.value.map((d) => d.date))
  .range([config.marginLeft, config.width - config.marginRight])
  .padding(0.3);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(newDateAmount.value, (d) => d.amount)])
  .range([
    config.height - config.marginBottom - config.legendSpace,
    config.marginTop,
  ]);

export { x, y, newDateAmount, groupDateAmount };
