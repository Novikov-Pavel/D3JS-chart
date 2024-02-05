function textAnchor(position) {
  const positions = {
    left: "end",
    right: "start",
  };
  return positions[position];
}

function valuePositionTranslate(translate) {
  const translates = {
    top: "0, -15",
    bottom: "0, 15",
    left: "-15, 0",
    right: "15, 0",
  };
  return translates[translate];
}

export { textAnchor, valuePositionTranslate };
