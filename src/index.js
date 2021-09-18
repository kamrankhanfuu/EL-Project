import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./Redux/store";
import Routes from "Routes";

// styles
import "Assets/css/nucleo-icons.css";
import "Assets/scss/blk-design-system-pro-react.scss?v1.0.0";
import "Assets/demo/demo.css";
import "Assets/demo/react-demo.css";
import "react-notification-alert/dist/animate.css";
import "Assets/scss/black-dashboard-pro-react.scss?v=1.1.0";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById("root")
);
