// nodejs library that concatenates classes
import classnames from "classnames";

const getInputClass = (errors, touched, inputFocus, name) =>
  classnames("input-lg", {
    "input-group-focus": inputFocus === name,
    "has-danger": errors[name] && touched[name],
    "has-success": !errors[name] && touched[name],
  });

const getLabelClass = (errors, touched, name) =>
  classnames("has-label", {
    "has-danger": errors[name] && touched[name],
  });

const getBorderStyle = (errors, touched, inputFocus, name) => {
  if (errors[name] && touched[name])
    return {
      borderColor: "red",
    };
  else if (inputFocus === name)
    return {
      borderColor: "#1d8cf8",
    };
  else
    return {
      borderColor: "indigo",
    };
};

export { getInputClass, getLabelClass, getBorderStyle };
