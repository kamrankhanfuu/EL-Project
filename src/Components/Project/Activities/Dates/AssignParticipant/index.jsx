import React, { useEffect, useState } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Row,
  Col,
  Spinner,
  Label,
} from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { errorMessage } from "Helpers/Validation";
import { initialValues, validationSchema } from "./validation";
import { Input, Select } from "Components/Common/Form/elements";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import Api from "Helpers/Api";
import { connect } from "react-redux";
import moment from "moment";
import Swal from "sweetalert2";

const ProjectForm = (props) => {
  const { id, activityId } = props.match.params;
  const [activityUsers, setActivityUsers] = useState([]);
  const [activityDates, setActivityDates] = useState([]);
  const [activityName, setActivityName] = useState('');

  const handleCancelClick = () => props.history.goBack();

  const handleSubmit = async (values, actions) => {
    values.participants = values.participants.map((part) => part.id);
    try {
      let data = [];
      for(let d=0; d < values.activityDates.length; d++)
      {
        for(let p=0; p < values.participants.length; p++)
        {
          data.push({
            activityDatesId: values.activityDates[d],
            participantId: values.participants[p],
            isRequired: values.activityIsRequired ? values.activityIsRequired : false
          });
        }
      }
      await Api.assignActivitiesParticipants(data);
      Swal.fire({
        icon: "success",
        title: "Participants assigned successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("handleSubmit -> error", error);
    } finally {
      actions.setSubmitting(false);
      actions.resetForm();
    }
  };

  const getActivityDates = async () => {
    try {
      const result = await Api.getActivityDates({
        activityId: window.atob(activityId),
      });
      setActivityDates(result.activityDates);
      setActivityName(result.name);
    } catch (error) {
      console.error("getProjects -> error", error);
    }
  };

  const getOrganizationUsers = async () => {
    try {
      if (id) {
        const result = await Api.getActivitytUsers(window.atob(id));
        setActivityUsers(result);
        return result;
      }
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  const getProjectActivityData = async () => {
    await Promise.all([getOrganizationUsers(), getActivityDates()]);
  };

  useEffect(() => {
    getProjectActivityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, errors, touched, isSubmitting }) => {
              const labelClasses = (name) =>
                classnames("has-label", {
                  "has-danger": errors[name] && touched[name],
                });

              return (
                <FormikForm onSubmit={handleSubmit} id="RegisterValidation">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">
                        Assign participant(s) for Activities of {activityName}
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormGroup className={labelClasses("participants")}>
                        <label>Participants</label>
                        <Field
                          component={Select}
                          className="react-select info form-control"
                          classNamePrefix="react-select"
                          getOptionLabel={(option) => option.email}
                          getOptionValue={(option) => option.id}
                          name="participants"
                          options={activityUsers}
                          isMulti
                        />
                        {errorMessage("participants")}
                      </FormGroup>
                      <Row>
                        <Col md="12">
                          <FormGroup check>
                            <div className="activity-dates-wrapper">
                              <Label check className="mr-3">
                                <Field
                                    name="activityIsRequired"
                                    component={Input}
                                    type="checkbox"
                                />
                                <span className="form-check-sign" />
                                Activity Participation Required
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup check>
                            <label className="mr-3">Activity Dates</label>
                            <div className="activity-dates-wrapper">
                              {activityDates.map((act) => (
                                  <Label check className="mr-3" key={act.id}>
                                    <Field
                                        name="activityDates"
                                        component={Input}
                                        type="checkbox"
                                        value={act.id}
                                    />
                                    <span className="form-check-sign" />
                                    {moment(act.startDate).format("MMM DD, YYYY") + ' ' + moment(act.startDate).format('hh:mm A')}
                                  </Label>
                              ))}
                            </div>
                          </FormGroup>
                          {errorMessage("activityDates")}
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter className="text-right">
                      <Button color="default mr-3" onClick={handleCancelClick}>
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        onSubmit={handleSubmit}
                      >
                        Create
                        {isSubmitting && <Spinner size="sm" className="ml-2" />}
                      </Button>
                    </CardFooter>
                  </Card>
                </FormikForm>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(ProjectForm));
