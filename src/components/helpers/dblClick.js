import * as d3 from "d3";
import { computed } from "vue";
import { brush } from "./brush";
import { x, groupDateAmount } from "./Coords";
import config from "../config";

export default function dblclick() {
  groupDateAmount.value = d3.group(config.data, (d) => d.dateAmount);
  const newDateAmount = computed(() => groupDateAmount.value.get("amount"));
  x.domain(newDateAmount.value.map((d) => d.date)).padding(0.3);
  d3.select(".xAxis").call(d3.axisBottom(x));
  d3.select(".rects").select(".brush").call(brush);
}
