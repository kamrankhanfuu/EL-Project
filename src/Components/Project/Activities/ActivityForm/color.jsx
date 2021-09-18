import React from "react";
import chroma from "chroma-js";
import Select from "react-select";

const colourOptions = [
  { value: "Blue", label: "Blue", color: "#7FBBDF" },
  { value: "Green", label: "Green", color: "#92D6BD" },
  { value: "Purple", label: "Purple", color: "#B6A4CC" },
  { value: "Gray", label: "Gray", color: "#CBCBCB" },
  { value: "Pink", label: "Pink", color: "#F59FBC" },
  { value: "Red", label: "Red", color: "#F7B0B6" },
];

const fetchColor = (props, colourOptions) => {
  for (let i = 0; i < colourOptions.length; i++) {
    if (props.getColor !== colourOptions[i].value) continue;
    else return colourOptions[i];
  }
};

const dot = (color = "#ccc") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "transparent",
    borderColor: "#2b3553",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color).darken(3).saturate(2);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor:
          !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot() }),
  singleValue: (styles, { data }) => ({
    ...styles,
    ...dot(data.color),
    color: data.color,
  }),
};

export default (props) => (
  <Select
    value={fetchColor(props, [...colourOptions])}
    options={colourOptions}
    styles={colourStyles}
    onChange={(event) =>
      props.selectColor(
        { ...event, target: { value: event.value } },
        "color",
        "length",
        1
      )
    }
    className="react-select react-select-primary"
    classNamePrefix="react-select"
    name="color"
    onFocus={props.onFocus}
    onBlur={props.onBlur}
  />
);
