import React, { Component } from "react";
import { FormGroup, Row, Col, Input, Button } from "reactstrap";
import ReactSelect from "react-select";
import classnames from "classnames";
import { Link } from "react-router-dom";
import ActivityColorOption from "./color";
import { ACTIVITY_TYPES } from "Helpers/constants";

class Step1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      organizationIds: "",
      assignedStaff: [],
      minAttendees: 0,
      maxAttendees: 0,
      nameState: "",
      descriptionState: "",
      organizationIdsState: "",
      assignedStaffState: "",
      minAttendeesState: 0,
      maxAttendeesState: 0,
      minAttendeesError: "",
      maxAttendeesError: "",
      color: this.props.activityDetails.color,
      colorState: "",
      isMaxAttendeesGreater: true,
      type : "",   //type here is model property and input field for activity type
    };
  }

  // function that verifies if value contains only numbers
  verifyNumber = (value) => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  // function that verifies if a string has a given length or not
  verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };

  change = (event, stateName, type, stateNameEqualTo, maxValue) => {
    const { value } = event.target;
    let stateVal = "has-danger",
      isMaxAttendeesGreater = true;

    switch (type) {
      case "number":
        if (this.verifyNumber(value, stateNameEqualTo)) {
          if (
            stateName === "maxAttendees" &&
            this.state.minAttendees >= value
          ) {
            stateVal = "has-danger";
            isMaxAttendeesGreater = false;
          } else if (value) {
            stateVal = "has-succes";
          }
        }
        break;
      case "length":
        if (this.verifyLength(value, stateNameEqualTo)) {
          stateVal = "has-succes";
        }
        break;
      default:
        stateVal = "has-danger";
        break;
    }

    this.setState({
      [stateName + "State"]: stateVal,
      isMaxAttendeesGreater,
      [stateName]: event.target.value,
    });
  };

  isValidated = () => {
    const {
      name,
      nameState,
      descriptionState,
      description,
      organizationIdsState,
      organizationIds,
      assignedStaffState,
      assignedStaff,
      color,
      colorState,
      minAttendees,
      maxAttendees,
      typeState,
      type, 
    } = this.state;
    if (
      (nameState === "has-succes" || name) &&
      (descriptionState === "has-succes" || description) &&
      (organizationIdsState === "has-succes" || organizationIds) &&
      (assignedStaffState === "has-succes" ||
        (assignedStaff && assignedStaff.length > 0)) &&
      (colorState === "has-succes" || color) &&
      +minAttendees > 0 &&
      +maxAttendees >= +minAttendees && 
      typeState === "has-success" || type
    ) {
      this.setState({ minAttendeesState: "has-succes" });
      this.setState({ minAttendeesError: "" });
      this.setState({ maxAttendeesState: "has-succes" });
      this.setState({ maxAttendeesError: "" });
      return true;
    } else {
      if (nameState !== "has-succes" && !name)
        this.setState({ nameState: "has-danger" });
      if (descriptionState !== "has-succes" && !description)
        this.setState({ descriptionState: "has-danger" });
      if (organizationIdsState !== "has-succes" && !organizationIds)
        this.setState({ organizationIdsState: "has-danger" });
      if (
        assignedStaffState !== "has-succes" &&
        (!assignedStaff || assignedStaff.length === 0)
      )
        this.setState({ assignedStaffState: "has-danger" });
      if (colorState !== "has-succes" && !color)
        this.setState({ colorState: "has-danger" });

      if (minAttendees && +minAttendees < 1) {
        this.setState({ minAttendeesState: "has-danger" });
        this.setState({
          minAttendeesError:
            "The minimum number of participants should be more than one",
        });
      }

      if (maxAttendees && minAttendees && +maxAttendees < +minAttendees) {
        this.setState({ maxAttendeesState: "has-danger" });
        this.setState({
          maxAttendeesError:
            "Maximum number of Participants must be more than Minimum number of Participants",
        });
      }

      if(typeState !== "has-succes" && !type)
      {
        this.setState({ typeState: "has-danger" });
      }

      return false;
    }
  };

  componentDidMount() {
    const {
      name,
      description,
      location,
      minAttendees,
      maxAttendees,
      organizationIds,
      assignedStaff,
      color,
      type,
    } = this.props.activityDetails;
    this.setState({
      name: name || "",
      description: description || "",
      location: location || "",
      minAttendees: minAttendees || 1,
      maxAttendees: maxAttendees || 1,
      organizationIds: organizationIds || "",
      assignedStaff: assignedStaff || [],
      color: color || "",
      type: type || "",
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps?.activityDetails?.id !== this.props.activityDetails.id) {
      const {
        name,
        description,
        location,
        minAttendees,
        maxAttendees,
        organizationIds,
        assignedStaff,
        color,
        type,
      } = this.props.activityDetails;

      this.setState({
        name: name || "",
        description: description || "",
        location: location || "",
        minAttendees: minAttendees || 1,
        maxAttendees: maxAttendees || 1,
        organizationIds: organizationIds || "",
        assignedStaff: assignedStaff || [],
        color: color || "",
        type: type || "",
      });
    }
  }

  render() {
    const { projectOrgs, activityUsers } = this.props;
    const { id } = this.props.match;
    const {
      name,
      nameFocus,
      nameState,
      description,
      descriptionState,
      descriptionFocus,
      sitenameFocus,
      location,
      organizationIdsState,
      organizationIdsFocus,
      assignedStaffFocus,
      assignedStaffState,
      assignedStaff,
      minAttendees,
      minAttendeesState,
      minAttendeesFocus,
      maxAttendeesFocus,
      maxAttendeesState,
      maxAttendees,
      organizationIds,
      colorState,
      colorFocus,
      minAttendeesError,
      maxAttendeesError,
      typeFocus,
      type,
      typeState,
    } = this.state;

    return (
      <>
        <Row>
          <Col>
            <h5 className="info-text float-left">
              Let's start with the basic information
            </h5>
          </Col>
          <Col>
            <div className="float-right">
              <Link to={`/project/${id}/activity`}>
                <Button className="btn-link float-right mr-3" color="info">
                  <i className="tim-icons icon-minimal-left" /> Go back
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup
              className={classnames("has-label", nameState, {
                "input-group-focus": nameFocus,
              })}
            >
              <label>
                Name <span className="required-mark">*</span>
              </label>
              <Input
                type="text"
                name="name"
                onChange={(e) => this.change(e, "name", "length", 1)}
                value={name}
                maxLength={250}
              />
              {nameState === "has-danger" && (
                <label className="error">Required.</label>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup
              className={classnames("has-label", typeState, {
                "input-group-focus": typeFocus,
              })}
            >
              <label>
                Who is allowed to attend? <span className="required-mark">*</span>
              </label>
              <ReactSelect
                value={type}
                onChange={(option) => {
                  if (option) {
                    this.setState({
                      type: option,
                      typeState: "has-succes",
                    });
                  } else {
                    this.setState({
                      type: "",
                      typeState: "has-danger",
                    });
                  }
                }}
                className="react-select react-select-primary"
                classNamePrefix="react-select"
                name="type"
                options={ACTIVITY_TYPES}
              />
              {typeState === "has-danger" && (
                <label className="error">Required.</label>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup
              className={classnames("has-label", descriptionState, {
                "input-group-focus": descriptionFocus,
              })}
            >
              <label>
                Description <span className="required-mark">*</span>
              </label>
              <Input
                value={description}
                type="textarea"
                name="description"
                onChange={(e) => this.change(e, "description", "length", 1)}
                onFocus={(e) => this.setState({ descriptionFocus: true })}
                onBlur={(e) => this.setState({ descriptionFocus: false })}
                maxLength={500}
              />
              {descriptionState === "has-danger" && (
                <label className="error">Required.</label>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup
              className={classnames("has-label", colorState, {
                "input-group-focus": colorFocus,
              })}
            >
              <label>
                Choose Color <span className="required-mark">*</span>
              </label>
              <ActivityColorOption
                getColor={this.state.color}
                selectColor={this.change}
                onFocus={(e) => this.setState({ colorFocus: true })}
                onBlur={(e) => this.setState({ colorFocus: false })}
              />
              {colorState === "has-danger" && (
                <label className="error">Required.</label>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup
              className={classnames("has-label", {
                "input-group-focus": sitenameFocus,
              })}
            >
              <label>Site Name</label>
              <Input
                name="location"
                type="text"
                onChange={(e) => this.change(e, "location", "length", 1)}
                value={location || ""}
                maxLength={300}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup
              className={classnames("has-label", organizationIdsState, {
                "input-group-focus": organizationIdsFocus,
              })}
            >
              <label>
                Organizations <span className="required-mark">*</span>
              </label>
              <ReactSelect
                value={organizationIds}
                onChange={(option) => {
                  if (option) {
                    this.setState({
                      organizationIds: option,
                      organizationIdsState: "has-succes",
                    });
                  } else {
                    this.setState({
                      organizationIds: "",
                      organizationIdsState: "has-danger",
                    });
                  }
                }}
                className="react-select react-select-primary"
                classNamePrefix="react-select"
                name="organizationIds"
                options={projectOrgs}
                defaultValues={[projectOrgs ? projectOrgs[0] : {}]}
                isMulti
              />
              {organizationIdsState === "has-danger" && (
                <label className="error">Required.</label>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup
              className={classnames("has-label", assignedStaffState, {
                "input-group-focus": assignedStaffFocus,
              })}
            >
              <label>
                Assigned Users/Staff <span className="required-mark">*</span>
              </label>
              <ReactSelect
                value={assignedStaff}
                onChange={(option) => {
                  if (option) {
                    this.setState({
                      assignedStaff: option,
                      assignedStaffState: "has-succes",
                    });
                  } else {
                    this.setState({
                      assignedStaff: "",
                      assignedStaffState: "has-danger",
                    });
                  }
                }}
                className="react-select react-select-primary"
                classNamePrefix="react-select"
                getOptionLabel={(option) => option.email}
                getOptionValue={(option) => option.id}
                name="assignedStaff"
                options={activityUsers}
                isMulti
              />
              {assignedStaffState === "has-danger" && (
                <label className="error">Required.</label>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup
              className={classnames("has-label", minAttendeesState, {
                "input-group-focus": minAttendeesFocus,
              })}
            >
              <label>
                Minimum number of Participants{" "}
                <span className="required-mark">*</span>
              </label>
              <Input
                name="minAttendees"
                type="number"
                onChange={(e) => {
                  if (e.target.value && +e.target.value > 0)
                    this.setState({ minAttendees: e.target.value });
                }}
                onFocus={(e) => this.setState({ minAttendeesFocus: true })}
                onBlur={(e) => this.setState({ minAttendeesFocus: false })}
                value={minAttendees}
              />
              {minAttendeesError && (
                <label className="error">{minAttendeesError}</label>
              )}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup
              className={classnames("has-label", maxAttendeesState, {
                "input-group-focus": maxAttendeesFocus,
              })}
            >
              <label>
                Maximum number of Participants{" "}
                <span className="required-mark">*</span>
              </label>
              <Input
                name="maxAttendees"
                type="number"
                onChange={(e) => {
                  if (e.target.value && +e.target.value > 0)
                    this.setState({ maxAttendees: e.target.value });
                }}
                onFocus={(e) => this.setState({ maxAttendeesFocus: true })}
                onBlur={(e) => this.setState({ maxAttendeesFocus: false })}
                value={maxAttendees}
              />
              {maxAttendeesError && (
                <label className="error">{maxAttendeesError}</label>
              )}
            </FormGroup>
          </Col>
        </Row>
      </>
    );
  }
}

export default Step1;
