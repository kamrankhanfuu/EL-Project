import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Formik, Form as FormikForm, Field } from "formik";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  FormGroup,
  Col,
  Spinner,
} from "reactstrap";
import { connect } from "react-redux";
import Api from "Helpers/Api";
import { initialValues, validationSchema } from "./validation";
import { login } from "Redux/Actions/auth.action";
import { errorMessage } from "Helpers/Validation";
import "../Common/Squares/styles.css";
import { URL_HOME } from "Helpers/urls";
import { URL_REGISTRATION, URL_FORGOT_PASSWORD } from "Helpers/urls";
import { Input } from "Components/Common/Form/elements";
import {
  getInputClass,
  getLabelClass,
  getBorderStyle,
} from "Components/Common/Form";
import querystring from "querystring";
import Swal from "sweetalert2";
import Squares from "Components/Common/Squares";

const Login = (props) => {
  const [inputFocus, setInputFocus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryToken = querystring.parse(props.location.search)["?token"];
  const queryEmail = querystring.parse(props.location.search)["email"];

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    document.body.classList.add("login-page");

    if (queryEmail && queryToken) ConfirmEmail();

    return () => {
      document.body.classList.remove("login-page");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ConfirmEmail = async () => {
    try {
      const email = queryEmail.replace(/ /g, "+");
      const ConfirmEmailPayload = {
        Token: queryToken,
        Email: email,
      };
      await Api.ConfirmEmail(ConfirmEmailPayload);
      Swal.fire({
        icon: "success",
        title: "Your account is now active. Please Sign In",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const result = await Api.login(values);
      props.login(result);
      // Redirect to prev section if any
      let navLocation = "";
      const { state } = props.location;
      if (state && state.from) navLocation = state.from;
      else navLocation = URL_HOME;
      props.history.push(navLocation);
    } catch (error) {
      console.error("handleSubmit -> error", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="page-header">
      <Squares />
      <Container>
        <Col className="mx-auto" lg="5" md="8">
          <Card className="card-login">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ handleSubmit, errors, touched }) => {
                const inputClass = (name) =>
                  getInputClass(errors, touched, inputFocus, name);
                const labelClass = (name) =>
                  getLabelClass(errors, touched, name);
                const borderStyle = (name) =>
                  getBorderStyle(errors, touched, inputFocus, name);
                return (
                  <FormikForm className="form" onSubmit={handleSubmit}>
                    <CardHeader>
                      <CardImg
                        alt="..."
                        src={require("Assets/img/square1.png")}
                      />
                      <CardTitle tag="h4">Login</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormGroup className={labelClass("userName")}>
                        <InputGroup className={inputClass("userName")}>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText style={borderStyle("userName")}>
                              <i className="tim-icons icon-single-02" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Field
                            component={Input}
                            name="userName"
                            placeholder="Username"
                            onFocus={() => setInputFocus("userName")}
                            onBlur={() => setInputFocus("")}
                            maxLength={80}
                          />
                        </InputGroup>
                        {errorMessage("userName")}
                      </FormGroup>
                      <FormGroup className={labelClass("password")}>
                        <InputGroup className={inputClass("password")}>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText style={borderStyle("password")}>
                              <i className="tim-icons icon-caps-small" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Field
                            component={Input}
                            name="password"
                            type="password"
                            placeholder="Password..."
                            onFocus={() => setInputFocus("password")}
                            onBlur={() => setInputFocus("")}
                            maxLength={32}
                          />
                        </InputGroup>
                        {errorMessage("password")}
                      </FormGroup>
                    </CardBody>
                    <CardFooter className="text-center mt-0 pt-0">
                      <Button
                        block
                        className="btn-round mr-2"
                        color="primary"
                        type="submit"
                        size="lg"
                      >
                        Get Started
                        {isLoading && <Spinner size="sm" className="ml-2" />}
                      </Button>
                    </CardFooter>
                    <div className="pull-left ml-3 mb-3">
                      <h6>
                        <Link
                          className="link footer-link"
                          to={URL_REGISTRATION}
                        >
                          Create Account
                        </Link>
                      </h6>
                    </div>
                    <div className="pull-right mr-3 mb-3">
                      <h6>
                        <Link
                          className="link footer-link"
                          to={URL_FORGOT_PASSWORD}
                        >
                          Forgot Password
                        </Link>
                      </h6>
                    </div>
                  </FormikForm>
                );
              }}
            </Formik>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

export default connect(null, { login })(withRouter(Login));
