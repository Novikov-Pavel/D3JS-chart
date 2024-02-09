<template>
  <svg :width="width" :height="height" :view-box="`0 0 ${width} ${height}`">
    <g
      @click="setActive(i)"
      v-if="legend.legendSpace"
      v-for="(rect, i) in seriee"
      :key="rect[i]"
      :fill="colorDataAmount(rect)"
    >
      <rect
        :class="[
          'legend',
          notActive1 && !i
            ? 'rectLegend1'
            : notActive2 && i
            ? 'rectLegend2'
            : undefined,
        ]"
        :x="margin.left"
        :y="height - legend.legendSpace / 2 + i * legend.legendSize + i"
        :width="legend.legendSize"
        :height="legend.legendSize"
      />
      <text
        :class="[
          'legend',
          notActive1 && !i
            ? 'labelLegend1'
            : notActive2 && i
            ? 'labelLegend2'
            : undefined,
        ]"
        :x="margin.left + legend.legendSize * 1.5"
        :y="height - legend.legendSpace / 2 + i * legend.legendSize"
        alignment-baseline="before-edge"
      >
        {{ rect.key }}
      </text>
    </g>
  </svg>
</template>

<script setup>
import * as d3 from "d3";
import { seriee } from "./helpers";
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

const notActive1 = ref(false);
const notActive2 = ref(false);

const emit = defineEmits(["isActive1", "isActive2"]);
const setActive = (i) => {
  !i
    ? (notActive1.value = !notActive1.value)
    : (notActive2.value = !notActive2.value);
  emit("isActive1", notActive1);
  emit("isActive2", notActive2);
};
</script>
<style scoped lang="scss">
.rectLegend1,
.rectLegend2,
.labelLegend1,
.labelLegend2 {
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
