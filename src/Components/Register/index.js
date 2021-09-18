import React, { useEffect, useState, useRef } from "react";
import "../Common/Squares/styles.css";
import { validationSchema, initialValues } from "./validation";
import Squares from "Components/Common/Squares";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { Formik, Form, Field } from "formik";
import { errorMessage } from "Helpers/Validation";
import Swal from "sweetalert2";
import Api from "Helpers/Api";
import { withRouter, Link } from "react-router-dom";
import { Input } from "Components/Common/Form/elements";
import {
  getInputClass,
  getLabelClass,
  getBorderStyle,
} from "Components/Common/Form";
import { URL_LOGIN } from "Helpers/urls";
import querystring from "querystring";
import DatePicker from "react-datetime";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import "./Register.scss";
import pdf from '../../Assets/pdf/terms.pdf';


const Register = (props) => {
  let ref = useRef("wrapper");
  const [inputFocus, setInputFocus] = useState("");
  const [squares1to6, setsquares1to6] = useState("");
  const [squares7and8, setsquares7and8] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryId = querystring.parse(props.location.search)["id"];

  const followCursor = (event) => {
    let posX = event.clientX - window.innerWidth / 2;
    let posY = event.clientY - window.innerWidth / 6;
    setsquares1to6(
      "perspective(500px) rotateY(" +
        posX * 0.05 +
        "deg) rotateX(" +
        posY * -0.05 +
        "deg)"
    );
    setsquares7and8(
      "perspective(500px) rotateY(" +
        posX * 0.02 +
        "deg) rotateX(" +
        posY * -0.02 +
        "deg)"
    );
  };

  const acceptInvitation = async () => {
    try {
      await Api.acceptInvitation(queryId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    ref.current.focus();
    document.body.classList.add("register-page");
    document.documentElement.addEventListener("mousemove", followCursor);
    return () => {
      document.body.classList.remove("register-page");
    };
  }, [squares1to6, squares7and8]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      values.emailConfirmationLink = window.location.origin + URL_LOGIN;

      await Api.register(values);

      // Accept invitation for organization
      if (queryId) {
        await acceptInvitation();
        values.invitationId = queryId;
      }

      Swal.fire({
        icon: "success",
        title: "Congratulations! You have successfully registered!",
        text: "We've sent you an email to verify your account.",
      }).then(() => {
        props.history.push("/login");
      });
    } catch (error) {
      console.error("onSubmit -> error", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="wrapper" ref={ref}>
        <div className="page-header">
          <div className="page-header-image" />
          <Container>
            <Row>
              <Col lg="7" md="12">
                <div
                  className="square square-7 square-5"
                  style={{ transform: squares7and8 }}
                />
                <div
                  className="square square-8"
                  style={{ transform: squares7and8 }}
                />
                <Card className="card-register">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      setFieldValue,
                    }) => {
                      const inputClass = (name) =>
                        getInputClass(errors, touched, inputFocus, name);
                      const labelClass = (name) =>
                        getLabelClass(errors, touched, name);
                      const borderStyle = (name) =>
                        getBorderStyle(errors, touched, inputFocus, name);
                      return (
                        <Form
                          className="form"
                          onSubmit={handleSubmit}
                          id="RegisterValidation"
                        >
                          <CardHeader style={{ paddingBottom: "10px" }}>
                            <CardImg
                              alt="..."
                              src={require("Assets/img/square1.png")}
                            />
                            <CardTitle tag="h4">Register</CardTitle>
                          </CardHeader>
                          <CardBody>
                            <Row>
                              <Col sm="6">
                                <FormGroup className={labelClass("firstName")}>
                                  <label className="labels">First Name</label>
                                  <InputGroup
                                    className={inputClass("firstName")}
                                  >
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={borderStyle("firstName")}
                                      >
                                        <i className="tim-icons icon-single-02" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Field
                                      component={Input}
                                      name="firstName"
                                      placeholder="First Name"
                                      onFocus={() => setInputFocus("firstName")}
                                      onBlur={() => setInputFocus("")}
                                      maxLength={80}
                                    />
                                  </InputGroup>
                                  {errorMessage("firstName")}
                                </FormGroup>
                              </Col>
                              <Col sm="6">
                                <FormGroup className={labelClass("lastName")}>
                                  <label className="labels">Last Name</label>
                                  <InputGroup
                                    className={inputClass("lastName")}
                                  >
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={borderStyle("lastName")}
                                      >
                                        <i className="tim-icons icon-single-02" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Field
                                      component={Input}
                                      name="lastName"
                                      placeholder="Last Name"
                                      onFocus={() => setInputFocus("lastName")}
                                      onBlur={() => setInputFocus()}
                                      maxLength={80}
                                    />
                                  </InputGroup>
                                  {errorMessage("lastName")}
                                </FormGroup>
                              </Col>
                              <Col sm="6">
                                <FormGroup className={labelClass("userName")}>
                                  <label className="labels">User Name</label>
                                  <InputGroup
                                    className={inputClass("userName")}
                                  >
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={borderStyle("userName")}
                                      >
                                        <i className="tim-icons icon-alert-circle-exc" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Field
                                      component={Input}
                                      name="userName"
                                      placeholder="User Name"
                                      onFocus={() => setInputFocus("userName")}
                                      onBlur={() => setInputFocus("")}
                                      maxLength={80}
                                    />
                                  </InputGroup>
                                  {errorMessage("userName")}
                                </FormGroup>
                              </Col>
                              <Col sm="6">
                                <FormGroup className={labelClass("email")}>
                                  <label className="labels">Email</label>
                                  <InputGroup className={inputClass("email")}>
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={borderStyle("email")}
                                      >
                                        <i className="tim-icons icon-email-85" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Field
                                      component={Input}
                                      name="email"
                                      placeholder="Email"
                                      onFocus={() => setInputFocus("email")}
                                      onBlur={() => setInputFocus("")}
                                      maxLength={100}
                                    />
                                  </InputGroup>
                                  {errorMessage("email")}
                                </FormGroup>
                              </Col>

                              <Col sm="6">
                                <FormGroup className={labelClass("password")}>
                                  <label className="labels">Password</label>
                                  <InputGroup
                                    className={inputClass("password")}
                                  >
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={borderStyle("password")}
                                      >
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
                              </Col>
                              <Col sm="6">
                                <FormGroup
                                  className={labelClass("confirmPassword")}
                                >
                                  <label className="labels">
                                    Confirm Password
                                  </label>
                                  <InputGroup
                                    className={inputClass("confirmPassword")}
                                  >
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
                                      onFocus={() =>
                                        setInputFocus("confirmPassword")
                                      }
                                      onBlur={() => setInputFocus("")}
                                      maxLength={32}
                                    />
                                  </InputGroup>
                                  {errorMessage("confirmPassword")}
                                </FormGroup>
                              </Col>
                              <Col sm="6">
                                <FormGroup
                                  className={labelClass("dateOfBirth")}
                                >
                                  <label className="labels">
                                    Date of Birth
                                  </label>
                                  <InputGroup
                                    className={inputClass("dateOfBirth")}
                                  >
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={borderStyle("dateOfBirth")}
                                      >
                                        <i className="tim-icons icon-calendar-60" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <DatePicker
                                      name="dateOfBirth"
                                      onChange={(val) => {
                                        if (moment(val).isValid())
                                          setFieldValue(
                                            "dateOfBirth",
                                            moment(val).format("YYYY-MM-DD")
                                          );
                                      }}
                                      inputProps={{
                                        className: "form-control",
                                        placeholder: "Select...",
                                      }}
                                      className="datepicker-birthdate"
                                      timeFormat={false}
                                      onFocus={() =>
                                        setInputFocus("dateOfBirth")
                                      }
                                      onBlur={() => setInputFocus("")}
                                      // closeOnSelect={true}
                                    />
                                  </InputGroup>
                                  {errorMessage("dateOfBirth")}
                                </FormGroup>
                              </Col>
                            </Row>
                            <FormGroup check className="text-left member-check">
                              <label>
                                Are you registering as a member of a business?
                              </label>
                              <div className="member-radio">
                                <ReactTooltip
                                  id="IsBussiness"
                                  aria-haspopup="true"
                                  role="radio"
                                >
                                  <p>
                                    If you want to invite your
                                    organization/business to Eleveight
                                    <br />
                                    or provide funding and assistance to
                                    participants than answer Yes
                                  </p>
                                </ReactTooltip>
                                <span
                                  className="mr-2"
                                  data-tip
                                  data-for="IsBussiness"
                                >
                                  <input
                                    type="radio"
                                    name="bussiness"
                                    onChange={() =>
                                      setFieldValue("isBusiness", true)
                                    }
                                    value={true}
                                    id="yes"
                                  />
                                  <label htmlFor="yes">Yes</label>
                                </span>
                                <input
                                  value={false}
                                  onChange={() =>
                                    setFieldValue("isBusiness", false)
                                  }
                                  name="bussiness"
                                  type="radio"
                                  id="no"
                                />
                                <label htmlFor="no">No</label>
                              </div>
                            </FormGroup>
                            <FormGroup check className="text-left">
                              <Label check>
                                <Field
                                  type="checkbox"
                                  component={Input}
                                  name="agreeTerms"
                                />
                                <span className="form-check-sign" />I agree to
                                the{" "}
                                <a
                                  href={pdf}
                                  target="_blank"
                                >
                                  terms and conditions
                                </a>
                                .
                              </Label>
                            </FormGroup>
                          </CardBody>
                          <CardFooter>
                            <Button
                              type="submit"
                              className="btn-round"
                              color="info"
                              size="lg"
                              disabled={!values.agreeTerms}
                            >
                              Get Started
                              {isLoading && (
                                <Spinner size="sm" className="ml-2" />
                              )}
                            </Button>
                            <>
                              <br />

                              <div className="link footer-link">
                                <h6>
                                  Already have an account ? &nbsp;
                                  <Link to={URL_LOGIN}>Sign In</Link>
                                </h6>
                              </div>
                            </>
                          </CardFooter>
                        </Form>
                      );
                    }}
                  </Formik>
                </Card>
              </Col>
            </Row>
          </Container>
          <Squares data={squares1to6} />
        </div>
      </div>
    </>
  );
};

export default withRouter(Register);
