<template>
  <div class="charts">
    <!-- <Chart
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
    /> -->
    <!-- <LineWithTooltip /> -->
    <BarChartVertic v-bind="config" />
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
import config from "./components/config";
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
