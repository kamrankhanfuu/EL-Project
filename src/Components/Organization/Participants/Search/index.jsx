import React, { useState } from "react";
import { validationSchema, initialValues } from "./validation";
// reactstrap components
import {
  Button,
  CardBody,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { Formik, Form, Field } from "formik";
import { errorMessage } from "Helpers/Validation";
import Api from "Helpers/Api";
import { withRouter } from "react-router-dom";
import { Input, Select } from "Components/Common/Form/elements";
import {
  getInputClass,
  getLabelClass,
  getBorderStyle,
} from "Components/Common/Form";
import DatePicker from "react-datetime";
import moment from "moment";
import { searchParticipants } from "Redux/Actions/search.action";
import { connect } from "react-redux";

const Search = (props) => {
  const [inputFocus, setInputFocus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values) => {
    setIsLoading(true);
    const searchParams = { ...values };
    try {
      if (searchParams?.address?.label) {
        searchParams.address = searchParams.address.label
      }
      const result = await Api.getSearchParticipants({
        ...searchParams,
        organizationId: props.participants.organizationId,
        skip: 0,
        take: 10,
      });
      if (result.length === 0) {
        props.setParticipants([]);
        return props.isDisplayingSearchResults(true);
      }
      props.searchParticipants({
        ...props.participants,
        ...values,
      });
      // NOTE: Set results in parent component
      props.isDisplayingSearchResults(true);
      props.setParticipants(result);
    } catch (error) {
      console.error("onSubmit -> error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardBody>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, errors, touched, setFieldValue }) => {
          const inputClass = (name) =>
            getInputClass(errors, touched, inputFocus, name);
          const labelClass = (name) => getLabelClass(errors, touched, name);
          const borderStyle = (name) =>
            getBorderStyle(errors, touched, inputFocus, name);
          return (
            <Form
              className="form"
              onSubmit={handleSubmit}
              id="RegisterValidation"
            >
              <Row>
                <Col sm="3">
                  <FormGroup className={labelClass("firstName")}>
                    <label className="labels">First Name</label>
                    <InputGroup className={inputClass("firstName")}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={borderStyle("firstName")}>
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
                <Col sm="3">
                  <FormGroup className={labelClass("lastName")}>
                    <label className="labels">Last Name</label>
                    <InputGroup className={inputClass("lastName")}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={borderStyle("lastName")}>
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
                <Col sm="3">
                  <FormGroup className={labelClass("username")}>
                    <label className="labels">User Name</label>
                    <InputGroup className={inputClass("username")}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={borderStyle("username")}>
                          <i className="tim-icons icon-alert-circle-exc" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Field
                        component={Input}
                        name="username"
                        placeholder="User Name"
                        onFocus={() => setInputFocus("username")}
                        onBlur={() => setInputFocus("")}
                        maxLength={80}
                      />
                    </InputGroup>
                    {errorMessage("username")}
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup className={labelClass("ssn")}>
                    <label className="labels">SSN/Id</label>
                    <InputGroup className={inputClass("ssn")}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={borderStyle("ssn")}>
                          <i className="tim-icons icon-alert-circle-exc" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Field
                        component={Input}
                        name="ssn"
                        placeholder="SSN/Id"
                        onFocus={() => setInputFocus("ssn")}
                        onBlur={() => setInputFocus("")}
                        maxLength={80}
                      />
                    </InputGroup>
                    {errorMessage("ssn")}
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup className={labelClass("address")}>
                    <label className="labels">State</label>
                    <InputGroup className={inputClass("address")}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={borderStyle("address")}>
                          <i className="tim-icons icon-email-85" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Field
                        component={Select}
                        name="address"
                        placeholder="State"
                        onFocus={() => setInputFocus("address")}
                        onBlur={() => setInputFocus("")}
                        options={props.usStates}
                        isClearable
                      />
                    </InputGroup>
                    {errorMessage("address")}
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup className={labelClass("phone")}>
                    <label className="labels">Phone Number</label>
                    <InputGroup className={inputClass("phone")}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={borderStyle("phone")}>
                          <i className="tim-icons icon-mobile" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Field
                        component={Input}
                        name="phone"
                        placeholder="Phone Number"
                        onFocus={() => setInputFocus("phone")}
                        onBlur={() => setInputFocus("")}
                        maxLength={15}
                      />
                    </InputGroup>
                    {errorMessage("phone")}
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup className={labelClass("birthDate")}>
                    <label className="labels">Date of Birth</label>
                    <InputGroup className={inputClass("birthDate")}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={borderStyle("birthDate")}>
                          <i className="tim-icons icon-calendar-60" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <DatePicker
                        name="birthDate"
                        onChange={(val) => {
                          if (moment(val).isValid())
                            setFieldValue(
                              "birthDate",
                              moment(val).format("YYYY-MM-DD")
                            );
                        }}
                        inputProps={{
                          className: "form-control",
                          placeholder: "Select...",
                        }}
                        className="datepicker-birthdate"
                        timeFormat={false}
                        onFocus={() => setInputFocus("birthDate")}
                        onBlur={() => setInputFocus("")}
                        closeOnSelect={true}
                      />
                    </InputGroup>
                    {errorMessage("birthDate")}
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <Button
                    type="submit"
                    className="btn-round mt-3"
                    color="info"
                    size="lg"
                  >
                    Search
                    {isLoading && <Spinner size="sm" className="ml-2" />}
                  </Button>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </CardBody>
  );
};

const mapReduxStateToProps = (state) => ({
  participants: state.search.participants,
});

export default connect(mapReduxStateToProps, { searchParticipants })(
  withRouter(Search)
);
