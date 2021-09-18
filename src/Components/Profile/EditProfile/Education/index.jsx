import React, { useState } from "react";
import Swal from "sweetalert2";
import { Formik, Form as FormikForm, Field } from "formik";
// reactstrap components
import { FormGroup, Row, Col, Button, Spinner } from "reactstrap";
import { initialValues, validationSchema } from "./validation";
import {
  RadioGroup,
  CustomInput,
  Select,
  DatePicker,
} from "Components/Common/Form/elements";
import { errorMessage } from "Helpers/Validation";
import classnames from "classnames";
import Api from "Helpers/Api";
import { withRouter } from "react-router-dom";

const EducationInfo = ({ profileDetails, setActiveTab, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { id } = profileDetails;
      values.profileId = id;
      values.highestSchoolGrade = values.highestSchoolGrades.value || "";

      const { organizationId } = props.participants;
      const { username } = props.match.params;

      if (username && organizationId) {
        await Api.editOrgUserEducationProfile({
          organizationId,
          updateEducationDto: {
            ...values,
          },
        });
      } else await Api.editEducationProfile(values);
      setActiveTab("Employment");
      Swal.fire({
        icon: "success",
        title: "Education Profile updated successfully!",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues(profileDetails.userEducation || {})}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, errors, touched }) => {
        const labelClasses = (name) => errors[name] && touched[name];
        return (
          <FormikForm onSubmit={handleSubmit}>
            <Row>
              <Col md="12">
                <CustomInput
                  label="School Status"
                  value="schoolStatus"
                  hasError={labelClasses("schoolStatus")}
                />
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label>
                    Within compulsory school age and did not attend the most
                    recent complete school year calendar quarter?
                  </label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    name="isCompulsoryEducationDone"
                  />
                  {errorMessage("isCompulsoryEducationDone")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup
                  className={classnames("has-label", {
                    "has-danger": labelClasses("lastSchoolAttended"),
                  })}
                >
                  <label>Recent Date Attended Secondary School</label>
                  <Field component={DatePicker} name="lastSchoolAttended" />
                  {errorMessage("lastSchoolAttended")}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>
                    Federally Reported Highest School Grade Completed
                  </label>
                  <Field
                    component={Select}
                    name="highestSchoolGrades"
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                      (item) => ({
                        label: item,
                        value: item.toString(),
                      })
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label>
                    Enrolled in education leading to Diploma, GED/High School
                    Equivalency Diploma or Certificate
                  </label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    name="isEnrolledInDiploma"
                  />
                  {errorMessage("isEnrolledInDiploma")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label>Has Diploma/equivalent</label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    name="isDiplomaEquivalent"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button
              className="btn-fill float-right"
              color="primary"
              type="submit"
            >
              Next {isLoading && <Spinner size="sm" className="ml-2" />}
            </Button>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default withRouter(EducationInfo);
