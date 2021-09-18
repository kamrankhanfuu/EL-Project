import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import {
  URL_LOGIN,
  URL_REGISTRATION,
  URL_ORGANIZATIONS_DENIED,
  URL_ORGANIZATIONS_APPROVED,
  URL_PROJECT_ORG_ACCEPT,
  URL_FORGOT_PASSWORD,
  URL_RESET_PASSWORD
} from "Helpers/urls";
import ProtectedRoute from "./private";

// COMPONENTS
import Login from "Components/Login";
import Registration from "Components/Register";
import { createBrowserHistory } from "history";
import ProjectOrgAccept from "Components/Project/Organizations/accept";
import Approved from "Components/Organization/ApprovalProcess/Approved";
import Denied from "Components/Organization/ApprovalProcess/Denied";
import Layout from "../app.js";
import ForgotPassword from "Components/ForgotPassword";
import ResetPassword from "Components/ResetPassword";

const hist = createBrowserHistory();

export default () => (
  <Router history={hist}>
    <Switch>
      <Route exact path={URL_LOGIN} component={Login} />
      <Route exact path={URL_REGISTRATION} component={Registration} />
      <Route exact path={URL_ORGANIZATIONS_APPROVED} component={Approved} />
      <Route exact path={URL_ORGANIZATIONS_DENIED} component={Denied} />
      <Route exact path={URL_PROJECT_ORG_ACCEPT} component={ProjectOrgAccept} />
      <Route exact path={URL_FORGOT_PASSWORD} component={ForgotPassword} />
      <Route exact path={URL_RESET_PASSWORD} component={ResetPassword} />
      <ProtectedRoute>
        {/* Sidebar Routes with layout */}
        <Route path="/" render={(props) => <Layout {...props} />} />
      </ProtectedRoute>
    </Switch>
  </Router>
);
