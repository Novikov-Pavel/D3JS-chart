import config from "../config";
import * as d3 from "d3";

export default function animationBars() {
  const Bar = d3.select(".rects");
  if (config.animation) {
    Bar.selectAll("rect")
      .data(newDateAmount.value)
      .join("rect")
      .transition()
      .duration(1500)
      .attr("y", (d) => y(d.amount))
      .attr("height", (d) => y(0) - y(d.amount));

    Bar.selectAll("text")
      .data(newDateAmount.value)
      .join("text")
      .transition()
      .duration(1500)
      .attr("y", (d) => y(d.amount) - x.bandwidth() / 10);
  }
}
