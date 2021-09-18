import React, { useEffect, useState, useRef } from "react";
import "Components/Common/Squares/styles.css";
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
import { withRouter } from "react-router-dom";
import { Input, Select } from "Components/Common/Form/elements";
import {
  getInputClass,
  getLabelClass,
  getBorderStyle,
} from "Components/Common/Form";
import { URL_RESET_PASSWORD } from "Helpers/urls";
import DatePicker from "react-datetime";
import moment from "moment";
import { connect } from "react-redux";
import { searchParticipants } from "Redux/Actions/search.action";
import querystring from "querystring";
import { encodeId } from "Helpers/utils";

const Register = (props) => {
  let ref = useRef("wrapper");
  const { organizationId } = props.participants;
  const [inputFocus, setInputFocus] = useState("");
  const [squares1to6, setsquares1to6] = useState("");
  const [squares7and8, setsquares7and8] = useState("");
  const [organizationUsers, setOrganizationUsers] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

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

  const handleCancelClick = () => props.history.goBack();
  const userId = querystring.parse(props.location.search)["?userId"];

  useEffect(() => {
    ref.current.focus();
    document.body.classList.add("register-page");
    document.documentElement.addEventListener("mousemove", followCursor);
    return () => {
      document.body.classList.remove("register-page");
    };
  }, [squares1to6, squares7and8]);

  const onSubmit = async (values, actions) => {
    try {
      values.emailConfirmationLink  = window.location.origin + URL_RESET_PASSWORD;
      values.organizationUserId = values.organizationUser.id;
      values.UserId = userId;

      const result = await Api.registerParticipants(values);
      props.searchParticipants({
        ...props.participants,
        participantId: result,
      });

      Swal.fire({
        icon: "success",
        title: "Participant has been successfully registered!",
      }).then(() => { 
        props.history.push(`/organization/${encodeId(organizationId)}/participants`);
      });
    } catch (error) {
      const { errors } = error.response.data;
      if (errors.length > 0)
        Swal.fire({
          icon: "error",
          title: errors[0].description,
        });
      console.error("onSubmit -> error", error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const getUserInfo = async (userId) => {
    try {
      const result = await Api.getUserDetails(userId, false);
      setUserInfo(result);
      if(result){
        initialValues.firstName = result.firstName;
        initialValues.lastName = result.lastName;
        initialValues.userName = result.userName;
        initialValues.email = result.workEmail == null? result.personalEmail: result.workEmail;
        initialValues.phoneNumber = result.phoneNumber == null? "" : result.phoneNumber;
        initialValues.dateOfBirth = result.dateOfBirth;
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const getOrganizationUsers = async () => {
    try {
      const result = await Api.getOrganizationUsers(organizationId);
      setOrganizationUsers(result);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    getOrganizationUsers();
    if(userId){
      getUserInfo(userId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  return (
    <div className="wrapper" ref={ref}>
      <div className="page-header">
        <div className="page-header-image" />
        <Container>
          <Row>
            <Col lg="3" md="12"></Col>
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
                    errors,
                    touched,
                    setFieldValue,
                    isSubmitting,
                    values,
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
                            className={"org-part-register"}
                          />
                          <CardTitle tag="h4">Register</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Col sm="6">
                              <FormGroup className={labelClass("firstName")}>
                                <label className="labels">First Name</label>
                                <InputGroup className={inputClass("firstName")}>
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
                                    value={userInfo.firstName}
                                  />
                                </InputGroup>
                                {errorMessage("firstName")}
                              </FormGroup>
                            </Col>
                            <Col sm="6">
                              <FormGroup className={labelClass("lastName")}>
                                <label className="labels">Last Name</label>
                                <InputGroup className={inputClass("lastName")}>
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText
                                      style={borderStyle("lastName")}
                                    >
                                      <i className="tim-icons icon-alert-circle-exc" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Field
                                    component={Input}
                                    name="lastName"
                                    placeholder="Last Name"
                                    onFocus={() => setInputFocus("lastName")}
                                    onBlur={() => setInputFocus("")}
                                    maxLength={80}
                                    value={userInfo.lastName}
                                  />
                                </InputGroup>
                                {errorMessage("lastName")}
                              </FormGroup>
                            </Col>
                            <Col sm="6">
                              <FormGroup className={labelClass("userName")}>
                                <label className="labels">User Name</label>
                                <InputGroup className={inputClass("userName")}>
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
                                    value={userInfo.userName}
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
                                    value={userInfo.workEmail == null? userInfo.personalEmail: userInfo.workEmail}
                                  />
                                </InputGroup>
                                {errorMessage("email")}
                              </FormGroup>
                            </Col>
                            <Col sm="6">
                              <FormGroup className={labelClass("phoneNumber")}>
                                <label className="labels">Phone Number</label>
                                <InputGroup
                                  className={inputClass("phoneNumber")}
                                >
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText
                                      style={borderStyle("phoneNumber")}
                                    >
                                      <i className="tim-icons icon-mobile" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Field
                                    component={Input}
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    onFocus={() => setInputFocus("phoneNumber")}
                                    onBlur={() => setInputFocus("")}
                                    maxLength={15}
                                    value={userInfo.phoneNumber}
                                  />
                                </InputGroup>
                                {errorMessage("phoneNumber")}
                              </FormGroup>
                            </Col>
                            <Col sm="6">
                              <FormGroup className={labelClass("birthDate")}>
                                <label className="labels">Date of Birth</label>
                                <InputGroup className={inputClass("birthDate")}>
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
                                      else setFieldValue("dateOfBirth", "");
                                    }}
                                    inputProps={{
                                      className: "form-control",
                                      placeholder: "Select...",
                                    }}
                                    className="datepicker-birthdate"
                                    timeFormat={false}
                                    onFocus={() => setInputFocus("dateOfBirth")}
                                    onBlur={() => setInputFocus("")}
                                    // closeOnSelect={true}
                                  />
                                </InputGroup>
                                {errorMessage("dateOfBirth")}
                              </FormGroup>
                            </Col>
                            <Col sm="6">
                              <FormGroup
                                className={labelClass("organizationUser")}
                              >
                                <label className="labels">
                                  Assigned To
                                </label>
                                <InputGroup
                                  className={inputClass("organizationUser")}
                                >
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText
                                      style={borderStyle("organizationUser")}
                                    >
                                      <i className="tim-icons icon-alert-circle-exc" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Field
                                    component={Select}
                                    className="react-select info form-control"
                                    classNamePrefix="react-select"
                                    getOptionLabel={(option) =>
                                      option.user.name
                                    }
                                    getOptionValue={(option) => option.id}
                                    name="organizationUser"
                                    options={organizationUsers}
                                    onFocus={() =>
                                      setInputFocus("organizationUser")
                                    }
                                    onBlur={() => setInputFocus("")}
                                    value={values.organizationUser}
                                  />
                                </InputGroup>
                                {errorMessage("organizationUser")}
                              </FormGroup>
                            </Col>
                          </Row>
                        </CardBody>
                        <CardFooter className="mt-0">
                          <Button
                            type="submit"
                            className="btn-round"
                            color="info"
                            size="lg"
                          >
                            Register
                            {isSubmitting && (
                              <Spinner size="sm" className="ml-2" />
                            )}
                          </Button>
                          <Button
                            size="lg"
                            color="default ml-3"
                            className="btn-round"
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </Button>
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
  );
};

const mapReduxStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  userId: state.auth.userId,
  participants: state.search.participants,
});

export default connect(mapReduxStateToProps, { searchParticipants })(
  withRouter(Register)
);
