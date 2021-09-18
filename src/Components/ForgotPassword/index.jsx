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
import Api from "Helpers/Api";
import { errorMessage } from "Helpers/Validation";
import "../Common/Squares/styles.css";
import { URL_RESET_PASSWORD, URL_LOGIN } from "Helpers/urls";
import { Input } from "Components/Common/Form/elements";
import {
  getInputClass,
  getLabelClass,
  getBorderStyle,
} from "Components/Common/Form";
import Swal from "sweetalert2";
import Squares from "Components/Common/Squares";
import { OrginUrl } from "../../Configs/index";
import "./Forgotpass.scss";
import { initialValues, validationSchema } from "./validation";

const ForgotPassword = (props) => {
  const [inputFocus, setInputFocus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    document.body.classList.add("login-page");

    return () => {
      document.body.classList.remove("login-page");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const forgotPayload = {
        userName: values.userName,
        resetPasswordLink: OrginUrl + URL_RESET_PASSWORD,
      };
      await Api.forgotPassword(forgotPayload);
      Swal.fire({
        icon: "success",
        title: "Email sent successfully!",
      });
      props.history.push(URL_LOGIN);
    } catch (error) {
      console.error("handleSubmit -> error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-header">
      <Squares />
      <Container>
        <Col className="mx-auto" lg="7" md="10">
          <Card className="card-login card-forgot">
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
                      <CardTitle tag="h4">Forgot Password</CardTitle>
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
                      <div className="link footer-link">
                        <h6>
                          <Link to={URL_LOGIN}>Back To Login</Link>
                        </h6>
                      </div>
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

export default withRouter(ForgotPassword);
