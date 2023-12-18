<template>
  <Chart
    :width="width"
    :height="height"
    :margin-top="marginTop"
    :margin-right="marginRight"
    :margin-bottom="marginBottom"
    :margin-left="marginLeft"
    :data="data"
  />
  <LineWithTooltip />
</template>

<script setup>
import Chart from "./components/Chart.vue";
import LineWithTooltip from "./components/LineWithTooltip.vue";

const width = 800;
const height = 500;
const marginTop = 20;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 40;
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
