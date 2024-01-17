<template>
  <div class="charts">
    <Chart
      :width="width"
      :height="height"
      :margin-top="marginTop"
      :margin-right="marginRight"
      :margin-bottom="marginBottom"
      :margin-left="marginLeft"
      :data="data"
      :legend="true"
      label-y="amount"
      position-legend="bottom"
      :limit-value-min="10"
      :limit-value-max="20"
      :aria-chart="true"
      value-position="top"
      value-category="value"
      :rotate-x-text="0"
      :rotate-y-text="0"
      :font-weight-x="false"
      :font-italic-x="false"
      :font-size-x="12"
      :font-weight-y="false"
      :font-size-y="12"
      :font-size-value="12"
      :font-italic-y="false"
      :font-weight-values="false"
      :font-italic-values="false"
    />
    <LineWithTooltip />
    <BarChartVertic
      :width="width"
      :height="height"
      :margin-top="marginTop"
      :margin-right="marginRight"
      :margin-bottom="marginBottom"
      :margin-left="marginLeft"
      :data="data"
      :animation="true"
    />
    <BarChartHoriz
      :width="width"
      :height="height"
      :margin-top="marginTop"
      :margin-right="marginRight"
      :margin-bottom="marginBottom"
      :margin-left="marginLeft"
      :data="data"
      :animation="true"
    />
  </div>
</template>

<script setup>
import {
  Chart,
  LineWithTooltip,
  BarChartVertic,
  BarChartHoriz,
} from "./components";

const width = 800;
const height = 500;
const marginTop = 50;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 60;
const data = [
  { date: "24-Apr-07", amount: 93.24, test: "3rdObj1" },
  { date: "25-Apr-07", amount: 95.35, test: "3rdObj2" },
  { date: "26-Apr-07", amount: 98.84, test: "3rdObj3" },
  { date: "27-Apr-07", amount: 99.92, test: "3rdObj4" },
  { date: "30-Apr-07", amount: 99.8, test: "3rdObj5" },
  { date: "1-May-07", amount: 99.47, test: "3rdObj6" },
  { date: "2-May-07", amount: 100.39, test: "3rdObj7" },
  { date: "3-May-07", amount: 100.4, test: "3rdObj8" },
  { date: "4-May-07", amount: 100.81, test: "3rdObj9" },
  { date: "7-May-07", amount: 103.92, test: "3rdObj10" },
  { date: "8-May-07", amount: 105.06, test: "3rdObj11" },
  { date: "9-May-07", amount: 106.88, test: "3rdObj12" },
  { date: "10-May-07", amount: 127.34, test: "3rdObj13" },
];
</script>

<style lang="scss">
.charts {
  display: flex;
  flex-direction: column;
  gap: 100px;
}
</style>
