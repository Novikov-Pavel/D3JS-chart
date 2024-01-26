import * as d3 from "d3";
import config from "../config";
import { updateChart } from "./";

const brush = d3
  .brushX()
  .extent([
    [config.marginLeft, config.marginTop],
    [config.width - config.marginRight, config.height - config.marginBottom],
  ])
  .on("end", updateChart);

export { brush };
