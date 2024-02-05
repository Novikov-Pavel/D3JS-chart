import * as d3 from "d3";
import config from "../../config";
import { updateChart } from "./";

const brush = d3
  .brushX()
  .extent([
    [0, config.margin.top],
    [config.width, config.height - config.margin.bottom],
  ])
  .on("end", updateChart);

export { brush };
