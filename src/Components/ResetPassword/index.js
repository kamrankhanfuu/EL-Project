import React, { useState, useEffect } from "react";
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
import Api from "Helpers/Api";
import Squares from "Components/Common/Squares";
import { withRouter } from "react-router-dom";
import querystring from "querystring";
import {
  getInputClass,
  getLabelClass,
  getBorderStyle,
} from "Components/Common/Form";
import { Input } from "Components/Common/Form/elements";
import { errorMessage } from "Helpers/Validation";
import "./Resetpass.scss";
import Swal from "sweetalert2";
import { URL_LOGIN } from "Helpers/urls";
import { initialValues, validationSchema } from "./validation";

const ResetPassword = (props) => {
  const [inputFocus, setInputFocus] = useState("");
  const query = querystring.parse(props.location.search);
  const [isLoading, setIsLoading] = useState(false);
  const token = query["?token"];
  const userName = query["userName"];
  const isSetupPassword = query["isSetupPassword"];

  const handleSubmitClick = async (values) => {
    values.token = token;
    setIsLoading(true);
    try {
      await Api.resetPassword({
        Token: token,
        UserName: userName,
        Password: values.password,
        ConfirmPassword: values.confirmPassword,
        IsSetupPassword: isSetupPassword
      });
      Swal.fire({
        icon: "success",
        title: "Password Changed successfully!",
      });
      props.history.push(URL_LOGIN);
    } catch (err) {
      console.error("err :>> ", err);
      Swal.fire({
        icon: "error",
        title: "Your session has expired!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    document.body.classList.add("login-page");

    return () => {
      document.body.classList.remove("login-page");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-header">
      <Squares />
      <Container>
        <Col className="mx-auto" lg="7" md="10">
          <Card className="card-login card-reset">
            <Formik
              initialValues={initialValues(userName)}
              validationSchema={validationSchema}
              onSubmit={handleSubmitClick}
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
                      <CardTitle tag="h4">
                        {isSetupPassword && <span>Setup Password</span>}
                        {!isSetupPassword && <span>Reset Password</span>}
                        </CardTitle>
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
                            disabled
                            placeholder="Enter userName"
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
                              <i className="tim-icons icon-lock-circle" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Field
                            type="password"
                            component={Input}
                            name="password"
                            placeholder="password"
                            onFocus={() => setInputFocus("password")}
                            onBlur={() => setInputFocus("")}
                            maxLength={32}
                          />
                        </InputGroup>
                        {errorMessage("password")}
                      </FormGroup>
                      <FormGroup className={labelClass("confirmPassword")}>
                        <InputGroup className={inputClass("confirmPassword")}>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText
                              style={borderStyle("confirmPassword")}
                            >
                              <i className="tim-icons icon-lock-circle" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Field
                            type="password"
                            component={Input}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onFocus={() => setInputFocus("confirmPassword")}
                            onBlur={() => setInputFocus("")}
                            maxLength={32}
                          />
                        </InputGroup>
                        {errorMessage("confirmPassword")}
                      </FormGroup>
                    </CardBody>
                    <CardFooter className="text-center">
                      <Button
                        block
                        className="btn-round mr-2"
                        color="primary"
                        type="submit"
                        size="lg"
                      >
                        Submit
                        {isLoading && <Spinner size="sm" className="ml-2" />}
                      </Button>
                    </CardFooter>
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

export default withRouter(ResetPassword);
