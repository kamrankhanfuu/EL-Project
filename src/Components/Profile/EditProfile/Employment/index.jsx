import React, { useState } from "react";
import Swal from "sweetalert2";
// reactstrap components
import { FormGroup, Row, Col, Button, Spinner } from "reactstrap";
import { initialValues, validationSchema } from "./validation";
import { Formik, Form as FormikForm, Field } from "formik";
import { errorMessage } from "Helpers/Validation";
import { RadioGroup, CustomInput } from "Components/Common/Form/elements";
import Api from "Helpers/Api";
import { withRouter } from "react-router-dom";

const EmploymentInfo = ({ profileDetails, setActiveTab, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { id } = profileDetails;
      values.profileId = id;
      values.isLongTermUnemployed = values.isLongTermUnemployed === "true";

      const { organizationId } = props.participants;
      const { username } = props.match.params;

      if (username && organizationId) {
        await Api.editOrgUserEmploymentProfile({
          organizationId,
          updateEmploymentDto: {
            ...values,
          },
        });
      } else await Api.editEmploymentProfile(values);
      setActiveTab("Health");
      Swal.fire({
        icon: "success",
        title: "Employment Profile updated successfully!",
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
      initialValues={initialValues(profileDetails.userEmployment || {})}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, errors, touched }) => {
        const labelClasses = (name) => errors[name] && touched[name];
        return (
          <FormikForm onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Employment Status</label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: "Active", value: "Active" },
                      { label: "Inactive", value: "Inactive" },
                    ]}
                    name="employmentStatus"
                  />
                  {errorMessage("employmentStatus")}
                </FormGroup>
              </Col>
              <Col md="6">
                <CustomInput
                  label="Occupation"
                  value="occupation"
                  hasError={labelClasses("occupation")}
                />
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <CustomInput
                  label="Hourly Rate"
                  value="hourlyRate"
                  hasError={labelClasses("hourlyRate")}
                />
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>If Employed, Under-Employed</label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    name="isEmployed"
                  />
                  {errorMessage("isEmployed")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <CustomInput
                  label="U. I. Eligibility"
                  value="uiEligilbilty"
                  hasError={labelClasses("uiEligilbilty")}
                />
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Registered Apprenticeship Program</label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    name="isApprenticeshipProgram"
                  />
                  {errorMessage("isApprenticeshipProgram")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <CustomInput
                  label="# of Weeks Unemployed"
                  value="weeksUnEmployed"
                  hasError={labelClasses("weeksUnEmployed")}
                />
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Long-Term Unemployment</label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    name="isLongTermUnemployed"
                  />
                  {errorMessage("isLongTermUnemployed")}
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

export default withRouter(EmploymentInfo);
