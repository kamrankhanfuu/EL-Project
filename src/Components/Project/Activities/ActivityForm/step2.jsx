import React, { Component } from "react";
import { FormGroup, Row, Col, Input, Label } from "reactstrap";
import { RECURRENCE, RECURRENCE_TYPES } from "Helpers/constants";
import ReactSelect from "react-select";
import ReactDatetime from "react-datetime";
import classnames from "classnames";
import moment from "moment";
import "./tabs.scss";

class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  isValidated = () => {
    const {
      recurrenceState,
      recurrenceTypeState,
      startDateState,
      endDateState,
      // startTimeState,
      // endTimeState,
      recurrence,
      startDate,
      endDate,
      recurrenceType,
      allWeekDays,
      weekdaysState,
      handleChange,
      // startTime,
      // endTime,
    } = this.props;

    if (
      recurrence === "Recurring" &&
      recurrenceTypeState !== "has-succes" &&
      !recurrenceType
    ) {
      handleChange("has-danger", "recurrenceTypeState");
      return false;
    }

    if (
      recurrenceType &&
      (recurrenceType.value === 1 || recurrenceType.value === 2) &&
      weekdaysState !== "has-succes"
    ) {
      // one checkbox should be checked
      const anyChecked = allWeekDays.filter((w) => w.isChecked);
      if (!anyChecked.length) {
        handleChange("has-danger", "weekdaysState");
        return false;
      }
    }

    const isAfter = moment(moment(startDate).format("llll")).isAfter(
      moment(endDate).format("llll")
    );

    const isPast = !moment(startDate).isAfter();

    if (startDate && isPast) {
      handleChange(
          "Activity start date must be today or in the future.",
          "startDateError"
      );
      handleChange("has-danger", "startDateState");
      return false;
    }

    if (startDate && endDate && isAfter) {
      handleChange(
        `End Date field must be later than ${moment(startDate).format(
          "YYYY-MM-DD LT"
        )}`,
        "endDateError"
      );
      handleChange("has-danger", "endDateState");
      return false;
    }

    if (
      (recurrenceState === "has-succes" || recurrence) &&
      (startDateState === "has-succes" || startDate) &&
      (endDateState === "has-succes" || endDate)
      // (startTimeState === "has-succes" || startTime) &&
      // (endTimeState === "has-succes" || endTime)
    ) {
      return true;
    } else {
      if (recurrenceState !== "has-succes" && !recurrence)
        handleChange("has-danger", "recurrenceState");
      if (
        recurrence === "Recurring" &&
        recurrenceTypeState !== "has-succes" &&
        !recurrenceType
      )
        handleChange("has-danger", "recurrenceTypeState");
      if (startDateState !== "has-succes" && !startDate) {
        handleChange("has-danger", "startDateState");
        handleChange("Required", "startDateError");
      }
      if (endDateState !== "has-succes" && !endDate) {
        handleChange("has-danger", "endDateState");
        handleChange("Required", "endDateError");
      }
      // if (startTimeState !== "has-succes" && !startTime)
      //   handleChange("has-danger", "startTimeState");
      // if (endTimeState !== "has-succes" && !endTime)
      //   handleChange("has-danger", "endTimeState");

      return false;
    }
  };

  render() {
    const {
      recurrence,
      recurrenceState,
      recurrenceFocus,
      recurrenceType,
      recurrenceTypeState,
      recurrenceTypeFocus,
      weekdaysState,
      startDate,
      startDateState,
      startDateError,
      startDateFocus,
      endDate,
      endDateState,
      endDateFocus,
      endDateError,
      // startTime,
      // startTimeState,
      // startTimeFocus,
      // endTimeFocus,
      // endTime,
      // endTimeState,
      allWeekDays,
      handleChange,
      handleCheckboxs,
    } = this.props;

    // disable past dates
    const yesterday = moment().subtract(1, "day");
    const disablePastDt = (current) => {
      return current.isAfter(yesterday);
    };

    return (
      <>
        <Row>
          <Col>
            <FormGroup
              className={classnames("has-label", recurrenceState, {
                "input-group-focus": recurrenceFocus,
              })}
            >
              <label>Recurrence <span className="required-mark">*</span></label>
              <ReactSelect
                onChange={(option) => handleChange(option, "recurrence")}
                className="react-select react-select-primary"
                classNamePrefix="react-select"
                value={RECURRENCE.filter(function (option) {
                  return option === recurrence;
                })}
                getOptionValue={(option) => option}
                getOptionLabel={(option) => option}
                options={RECURRENCE}
              />
              {recurrenceState === "has-danger" && (
                <label className="error">Required.</label>
              )}
            </FormGroup>
          </Col>
        </Row>
        {recurrence === "Recurring" && (
          <Row>
            <Col>
              <FormGroup
                className={classnames("has-label", recurrenceTypeState, {
                  "input-group-focus": recurrenceTypeFocus,
                })}
              >
                <label>Recurrence Type <span className="required-mark">*</span></label>
                <ReactSelect
                  onChange={(option) => handleChange(option, "recurrenceType")}
                  className="react-select react-select-primary"
                  classNamePrefix="react-select"
                  name="recurrenceType"
                  value={recurrenceType}
                  options={RECURRENCE_TYPES}
                />

                {recurrenceTypeState === "has-danger" && (
                  <label className="error">Required.</label>
                )}
              </FormGroup>
            </Col>
          </Row>
        )}
        {recurrence === "Recurring" &&
          recurrenceType &&
          (recurrenceType.value === 1 || recurrenceType.value === 2) && (
            <Row>
              <Col md="12">
                <FormGroup check>
                  <label className="mr-3">Week days <span className="required-mark">*</span></label>
                  {allWeekDays?.map((week) => (
                    <Label check className="mr-3" key={week.value}>
                      <Input
                        defaultChecked={week.isChecked}
                        onChange={handleCheckboxs}
                        type="checkbox"
                        name="weekdays"
                        value={week.value}
                      />
                      <span className="form-check-sign" />
                      {week.label}
                    </Label>
                  ))}
                </FormGroup>
                <div className="mb-3">
                  {weekdaysState === "has-danger" && (
                    <label className="error">Required.</label>
                  )}
                </div>
              </Col>
            </Row>
          )}
        <Row>
          <Col md={6} className="rdtPickerup">
            <FormGroup
              className={classnames("has-label", startDateState, {
                "input-group-focus": startDateFocus,
              })}
            >
              <label>Start <span className="required-mark">*</span></label>
              <ReactDatetime
                inputProps={{
                  className: "form-control",
                  placeholder: "Select...",
                }}
                value={
                  moment(startDate).isValid()
                    ? moment(startDate).format("MM/DD/YYYY hh:mm A")
                    : startDate
                }
                name="startDate"
                // timeFormat={false}
                closeOnSelect={true}
                selected={startDate ? new Date(startDate) : null}
                onChange={(val) => {
                  if (moment(val).isValid()) {
                    handleChange(val, "startDate");
                    handleChange("", "startDateError");
                    handleChange("has-succes", "startDateState");
                  }
                  else {
                    handleChange("", "startDate");
                    handleChange("Required", "startDateError");
                  }
                }}
                isValidDate={disablePastDt}
              />
              {startDateError && (
                <label className="error">{startDateError}</label>
              )}
            </FormGroup>
          </Col>
          {/* <Col md={3}>
            <FormGroup
              className={classnames("has-label", startTimeState, {
                "input-group-focus": startTimeFocus,
              })}
            >
              <label>Start Time</label>
              <ReactDatetime
                inputProps={{
                  className: "form-control",
                  placeholder: "Select...",
                  value: startTime ? moment(startTime).format("hh:mm A") : "",
                }}
                value={startTime}
                name="startTime"
                dateFormat={false}
                timeFormat="hh:mm A"
                closeOnSelect={true}
                selected={startTime ? new Date(startTime) : null}
                onChange={(val) => {
                  if (moment(val).isValid()) handleChange(val, "startTime");
                  else handleChange("", "startTime");
                }}
              />
              {startTimeState === "has-danger" && (
                <label className="error">Required.</label>
              )}
            </FormGroup>
          </Col> */}
          <Col md={6} className="rdtPickerup">
            <FormGroup
              className={classnames("has-label", endDateState, {
                "input-group-focus": endDateFocus,
              })}
            >
              <label>End <span className="required-mark">*</span></label>
              <ReactDatetime
                inputProps={{
                  className: "form-control",
                  placeholder: "Select...",
                }}
                value={
                  moment(endDate).isValid()
                    ? moment(endDate).format("MM/DD/YYYY hh:mm A")
                    : endDate
                }
                name="endDate"
                // timeFormat={false}
                closeOnSelect={true}
                selected={endDate ? new Date(endDate) : null}
                onChange={(val) => {
                  if (moment(val).isValid()) {
                    handleChange(val, "endDate");
                    handleChange("", "endDateError");
                  } else {
                    handleChange("", "endDate");
                    handleChange("Required", "endDateError");
                  }
                }}
              />
              {endDateError && <label className="error">{endDateError}</label>}
            </FormGroup>
          </Col>
          {/* <Col md={3}>
            <FormGroup
              className={classnames("has-label", endTimeState, {
                "input-group-focus": endTimeFocus,
              })}
            >
              <label>End Time</label>
              <ReactDatetime
                inputProps={{
                  className: "form-control",
                  placeholder: "Select...",
                  value: endTime ? moment(endTime).format("hh:mm A") : "",
                }}
                value={endTime}
                name="endTime"
                timeFormat="hh:mm A"
                dateFormat={false}
                closeOnSelect={true}
                selected={endTime ? new Date(endTime) : null}
                onChange={(val) => {
                  if (moment(val).isValid()) handleChange(val, "endTime");
                  else handleChange("", "endTime");
                }}
              />
              {endTimeState === "has-danger" && (
                <label className="error">Required.</label>
              )}
            </FormGroup>
          </Col> */}
        </Row>
      </>
    );
  }
}

export default Step2;
