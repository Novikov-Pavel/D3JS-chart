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
    <!-- <LineWithTooltip /> -->
    <BarChartVertic
      :width="width"
      :height="height"
      :margin-top="marginTop"
      :margin-right="marginRight"
      :margin-bottom="marginBottom"
      :margin-left="marginLeft"
      :data="data"
      :animation="false"
    />
    <!-- <BarChartHoriz
      :width="width"
      :height="height"
      :margin-top="marginTop"
      :margin-right="marginRight"
      :margin-bottom="marginBottom"
      :margin-left="marginLeft"
      :data="data"
      :animation="true"
    /> -->
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
  {
    date: "24-Apr-07",
    amount: 93.24,
    test: "3rdObj1",
    dateAmount: "amount",
  },
  {
    date: "25-Apr-07",
    amount: 95.35,
    test: "3rdObj2",
    dateAmount: "amount",
  },
  {
    date: "26-Apr-07",
    amount: 98.84,
    test: "3rdObj3",
    dateAmount: "amount",
  },
  {
    date: "27-Apr-07",
    amount: 99.92,
    test: "3rdObj4",
    dateAmount: "amount",
  },
  {
    date: "30-Apr-07",
    amount: 99.8,
    test: "3rdObj5",
    dateAmount: "amount",
  },
  {
    date: "1-May-07",
    amount: 99.47,
    test: "3rdObj6",
    dateAmount: "amount",
  },
  {
    date: "2-May-07",
    amount: 100.39,
    test: "3rdObj7",
    dateAmount: "amount",
  },
  {
    date: "3-May-07",
    amount: 100.4,
    test: "3rdObj8",
    dateAmount: "amount",
  },
  {
    date: "4-May-07",
    amount: 100.81,
    test: "3rdObj9",
    dateAmount: "amount",
  },
  {
    date: "7-May-07",
    amount: 103.92,
    test: "3rdObj10",
    dateAmount: "amount",
  },
  {
    date: "8-May-07",
    amount: 105.06,
    test: "3rdObj11",
    dateAmount: "amount",
  },
  {
    date: "9-May-07",
    amount: 106.88,
    test: "3rdObj12",
    dateAmount: "amount",
  },
  {
    date: "10-May-07",
    amount: 127.34,
    test: "3rdObj13",
    dateAmount: "amount",
  },

  {
    date: "24-Apr-07",
    y2: 0,
    test: "3rdObj1",
    dateY2: "Y2",
  },
  {
    date: "25-Apr-07",
    y2: 2,
    test: "3rdObj2",
    dateY2: "Y2",
  },
  {
    date: "26-Apr-07",
    y2: 3,
    test: "3rdObj3",
    dateY2: "Y2",
  },
  {
    date: "27-Apr-07",
    y2: 1,
    test: "3rdObj4",
    dateY2: "Y2",
  },
  {
    date: "30-Apr-07",
    y2: 0,
    test: "3rdObj5",
    dateY2: "Y2",
  },
  {
    date: "1-May-07",
    y2: 1,
    test: "3rdObj6",
    dateY2: "Y2",
  },
  {
    date: "2-May-07",
    y2: 2,
    test: "3rdObj7",
    dateY2: "Y2",
  },
  {
    date: "3-May-07",
    y2: 1,
    test: "3rdObj8",
    dateY2: "Y2",
  },
  {
    date: "4-May-07",
    y2: 1,
    test: "3rdObj9",
    dateY2: "Y2",
  },
  {
    date: "7-May-07",
    y2: 3,
    test: "3rdObj10",
    dateY2: "Y2",
  },
  {
    date: "8-May-07",
    y2: 3,
    test: "3rdObj11",
    dateY2: "Y2",
  },
  {
    date: "9-May-07",
    y2: 0,
    test: "3rdObj12",
    dateY2: "Y2",
  },
  {
    date: "10-May-07",
    y2: 2,
    test: "3rdObj13",
    dateY2: "Y2",
  },
];
</script>

<style lang="scss">
body {
  margin: 0;
}
.charts {
  display: flex;
  flex-direction: column;
  gap: 100px;
}
</style>
