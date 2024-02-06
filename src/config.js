import * as d3 from "d3";

const colorScheme1 = [
  "rgb(0, 32, 74)",
  "rgb(0, 87, 146)",
  "rgb(0, 187, 240)",
  "rgb(238, 108, 77)",
  "rgb(218, 175, 79)",
];

export default {
  width: 800,
  height: 500,
  margin: {
    top: 50,
    right: 30,
    bottom: 30,
    left: 60,
  },
  data: [
    {
      date: "10.07.2022",
      amount: 1,
      y2: 0,
      test: "3rdObj1",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "25.08.2022",
      amount: 2,
      y2: 2,
      test: "3rdObj2",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "30.08.2022",
      amount: 3,
      y2: 3,
      test: "3rdObj3",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "31.08.2022",
      amount: 4,
      y2: 1,
      test: "3rdObj4",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "31.08.2022",
      amount: 5,
      y2: 4,
      test: "3rdObj5",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "31.08.2022",
      amount: 6,
      y2: 1,
      test: "3rdObj6",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "31.08.2022",
      amount: 7,
      y2: 2,
      test: "3rdObj7",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "01.09.2022",
      amount: 8,
      y2: 1,
      test: "3rdObj8",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "01.09.2022",
      amount: 9,
      y2: 1,
      test: "3rdObj8",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "01.09.2022",
      amount: 10,
      y2: 1,
      test: "3rdObj8",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "02.09.2022",
      amount: 11,
      y2: 3,
      test: "3rdObj11",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "02.09.2022",
      amount: 12,
      y2: 3,
      test: "3rdObj11",
      dateAmount: "amount",
      dateY2: "Y2",
    },
    {
      date: "02.09.2022",
      amount: 13,
      y2: 3,
      test: "3rdObj11",
      dateAmount: "amount",
      dateY2: "Y2",
    },
  ],
  labelY: "amount",
  animation: false,
  valuePosition: "top",
  fontFormat: {
    fontItalicX: false,
    fontItalicY: true,
    fontItalicValues: false,
    fontWeightX: false,
    fontWeightY: false,
    fontWeightValues: true,
    fontSizeX: 10,
    fontSizeY: 10,
    fontSizeValue: 12,
  },
  rotateFormat: {
    rotateXText: 0,
    rotateYText: 0,
    rotateValues: 0,
  },
  limitValue: [],
  legend: {
    legendSpace: 40,
    legendSize: 20,
  },
  ariaFill: true,
  markerSize: 12,
  scale: {
    scaleX: () => d3.scaleTime(),
    scaleY: () => d3.scaleLinear(),
    scaleXName: "date",
    scaleYName: "amount",
  },
  schemeCategory: colorScheme1,
  typeChart: "Line",
  regression: {
    mean: false,
    median: false,
    poly: false,
    logaritm: false,
  },
};
