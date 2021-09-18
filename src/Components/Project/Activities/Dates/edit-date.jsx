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
} from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { errorMessage } from "Helpers/Validation";
import { initialValues, validationSchema } from "./validation";
import { TimePicker, Input } from "Components/Common/Form/elements";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import Api from "Helpers/Api";
import Swal from "sweetalert2";
import moment from "moment";

const ProjectForm = (props) => {
  const { id, activityDateId, activityId } = props.match.params;
  const [activityDetails, setActivityDetails] = useState({});
  const [activityDateDetails, setActivityDateDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCancelClick = () => props.history.goBack();

  const handleEditProject = async (values) => {
    try {
      const { startDate, endDate } = activityDateDetails;
      values.id = window.atob(activityDateId);
      values.activityId = window.atob(activityId);

      await Api.editActivityDateDetails({
        ...values,
        startDate: `${moment(startDate).format(
          "YYYY-MM-DD"
        )}T${values.startTime.format("HH:mm:ss")}Z`,
        endDate: `${moment(endDate).format(
          "YYYY-MM-DD"
        )}T${values.endTime.format("HH:mm:ss")}Z`,
      });

      Swal.fire({
        icon: "success",
        title: "Activity date details has been edited successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    handleEditProject(values);
  };

  const getActivityDateDetails = async () => {
    try {
      if (activityDateId) {
        const result = await Api.getActivityDateDetails({
          activityDateId: window.atob(activityDateId),
        });
        setActivityDateDetails(result);
      }
    } catch (error) {
      console.error("getProjectDetails -> error", error);
    }
  };

  const getActivityDetails = async () => {
    try {
      const result = await Api.getActivityDetails(window.atob(activityId));
      setActivityDetails(result);
      return result;
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  const getProjectActivityData = async () => {
    await Promise.all([getActivityDetails(), getActivityDateDetails()]);
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
            initialValues={initialValues(activityDateDetails)}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => {
              const labelClasses = (name) =>
                classnames("has-label", {
                  "has-danger": errors[name] && touched[name],
                });
              return (
                <FormikForm id="RegisterValidation">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">
                        Project Activity Date Form for{" "}
                        {activityDetails.name || ""} (
                        {moment(activityDateDetails.startDate).format(
                          "DD MMM, YYYY"
                        )}
                        )
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormGroup className={labelClasses("name")}>
                        <label>Name</label>
                        <Field component={Input} name="name" type="text" />
                        {errorMessage("name")}
                      </FormGroup>
                      <FormGroup className={labelClasses("description")}>
                        <label>Description</label>
                        <Field
                          type="textarea"
                          component={Input}
                          name="description"
                        />
                        {errorMessage("description")}
                      </FormGroup>
                      <Row>
                        <Col md={4}>
                          <FormGroup className={labelClasses("location")}>
                            <label>Site Name</label>
                            <Field
                              component={Input}
                              name="location"
                              type="text"
                            />
                            {errorMessage("location")}
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className={labelClasses("minAttendees")}>
                            <label>Minimum number of Participants</label>
                            <Field
                              component={Input}
                              name="minAttendees"
                              type="text"
                            />
                            {errorMessage("minAttendees")}
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className={labelClasses("maxAttendees")}>
                            <label>Maximum number of Participants</label>
                            <Field
                              component={Input}
                              name="maxAttendees"
                              type="text"
                            />
                            {errorMessage("maxAttendees")}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FormGroup className={labelClasses("startDate")}>
                            <label>Date</label>
                            <p className="mb-4">
                              {" "}
                              {moment(activityDateDetails.startDate).format(
                                "DD MMM, YYYY"
                              )}
                            </p>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className={labelClasses("startTime")}>
                            <label>Start Time</label>
                            <Field component={TimePicker} name="startTime" />
                            {errorMessage("startTime")}
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className={labelClasses("endTime")}>
                            <label>End Time</label>
                            <Field component={TimePicker} name="endTime" />
                            {errorMessage("endTime")}
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter className="text-right">
                      <Button color="default mr-3" onClick={handleCancelClick}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit" disabled={loading}>
                        {id ? "Update" : "Create"}
                        {loading && <Spinner size="sm" className="ml-2" />}
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

export default withRouter(ProjectForm);
