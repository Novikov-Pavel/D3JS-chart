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
      labelY=""
      position-legend="bottom"
      :limit-value-min="10"
      :limit-value-max="100"
      :aria-chart="true"
      value-position="top"
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
const marginTop = 20;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 60;
const data = [
  { date: "24-Apr-07", amount: 93.24 },
  { date: "25-Apr-07", amount: 95.35 },
  { date: "26-Apr-07", amount: 98.84 },
  { date: "27-Apr-07", amount: 99.92 },
  { date: "30-Apr-07", amount: 99.8 },
  { date: "1-May-07", amount: 99.47 },
  { date: "2-May-07", amount: 100.39 },
  { date: "3-May-07", amount: 100.4 },
  { date: "4-May-07", amount: 100.81 },
  { date: "7-May-07", amount: 103.92 },
  { date: "8-May-07", amount: 105.06 },
  { date: "9-May-07", amount: 106.88 },
  { date: "10-May-07", amount: 127.34 },
];
</script>

<style lang="scss">
.charts {
  display: flex;
  flex-direction: column;
  gap: 100px;
}
</style>
