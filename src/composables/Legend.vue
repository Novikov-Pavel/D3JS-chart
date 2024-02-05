<template>
  <svg :width="width" :height="height" :view-box="`0 0 ${width} ${height}`">
    <g
      @click="setActive"
      v-if="legend.legendSpace"
      v-for="(rect, i) in groupDateAmount"
      :key="rect[i]"
      :fill="colorDataAmount(groupDateAmount[0])"
    >
      <rect
        :class="{ legend: true, rectLegend: notActive }"
        :x="margin.left"
        :y="height - legend.legendSpace / 2 + i * legend.legendSize"
        :width="legend.legendSize"
        :height="legend.legendSize"
      />
      <text
        :class="{ legend: true, labelLegend: notActive }"
        :x="margin.left + legend.legendSize * 1.5"
        :y="height - legend.legendSpace / 2 + i * legend.legendSize"
        alignment-baseline="before-edge"
      >
        {{ rect[i] }}
      </text>
    </g>
  </svg>
</template>

<script setup>
import * as d3 from "d3";
import { groupDateAmount } from "./helpers";
import { ref } from "vue";

const props = defineProps({
  data: Array,
  width: Number,
  height: Number,
  margin: Object,
  animation: Boolean,
  valuePosition: String,
  rotateFormat: Object,
  fontFormat: Object,
  limitValue: Array,
  labelY: String,
  legend: Object,
  schemeCategory: Object,
  typeChart: String,
  ariaFill: Boolean,
  markerSize: Number,
  notActive: Boolean,
});
const colorDataAmount = d3.scaleOrdinal(props.schemeCategory);
const notActive = ref(false);

const emit = defineEmits(["isActive"]);
const setActive = () => {
  notActive.value = !notActive.value;
  emit("isActive", notActive);
};
</script>
<style scoped lang="scss">
.rectLegend,
.labelLegend {
  fill: #b8c1d4;
  transition: all 1s ease-in-out;
}
.legend {
  cursor: pointer;
  &:not(.rectLegend) {
    transition: 1s;
  }
}
</style>
