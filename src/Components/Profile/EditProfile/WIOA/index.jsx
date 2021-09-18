import React from "react";
import Swal from "sweetalert2";
// reactstrap components
import { FormGroup, Row, Col, Button, CardTitle } from "reactstrap";
import { initialValues, validationSchema } from "./validation";
import { Formik, Form as FormikForm, Field } from "formik";
import {
  CustomInput,
  DatePicker,
  RadioGroup,
} from "Components/Common/Form/elements";
import { errorMessage } from "Helpers/Validation";
import moment from "moment";

const WIOAInfo = () => {
  const handleSubmit = (values) => {
    try {
      Swal.fire({
        icon: "success",
        title: "WIOA Profile updated successfully!",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues({})}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, errors, touched, setFieldValue }) => {
        const labelClasses = (name) => errors[name] && touched[name];
        return (
          <FormikForm onSubmit={handleSubmit}>
            <Row>
              <Col md="12">
                <CardTitle tag="h5">Public Assistance</CardTitle>
              </Col>
              <Col className="pr-md-1 mb-3" md="6">
                <FormGroup>
                  <label>
                    Temporary Assistance for Needy Families (TANF) Recipient
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Applicant", "Family Member", "Not Applicable"]}
                    name="tanf"
                  />
                  {errorMessage("tanf")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Supplemental Security Income (SSI) Recipient</label>
                  <Field
                    component={RadioGroup}
                    options={["Applicant", "Family Member", "Not Applicable"]}
                    name="ssi"
                  />
                  {errorMessage("ssi")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="pr-md-1 mb-3" md="6">
                <FormGroup>
                  <label>General Assistance (GA)</label>
                  <Field
                    component={RadioGroup}
                    options={["Applicant", "Family Member", "Not Applicable"]}
                    name="ga"
                  />
                  {errorMessage("ga")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>
                    Supplemental Nutrition Assistance Program (SNAP)
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Applicant", "Family Member", "Not Applicable"]}
                    name="snap"
                  />
                  {errorMessage("snap")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="pr-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Refugee Case Assistance (RCA)</label>
                  <Field
                    component={RadioGroup}
                    options={["Applicant", "Family Member", "Not Applicable"]}
                    name="rca"
                  />
                  {errorMessage("rca")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>
                    Foster Child (State or local payments are made for applicant
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="fosterChild"
                  />
                  {errorMessage("fosterChild")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="pr-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Youth currently living in a high-poverty area</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="highPovertyArea"
                  />
                  {errorMessage("highPovertyArea")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>
                    Youth current receives, or is eligible to receive, free or
                    reduced lunch
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="reducedLunch"
                  />
                  {errorMessage("reducedLunch")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="pr-md-1 mb-3" md="6">
                <FormGroup>
                  <label>
                    Receiving services under SNAP Employment & Training Program
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="receivingSnap"
                  />
                  {errorMessage("receivingSnap")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>
                    Receiving or has been notified will receive Pell Grant
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="receivingPellGrant"
                  />
                  {errorMessage("receivingPellGrant")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="pr-md-1 mb-3" md="12">
                <FormGroup>
                  <label>
                    Ticket to Work Holder issued by the Social Security
                    Administration
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="ticketToWork"
                  />
                  {errorMessage("ticketToWork")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <CardTitle tag="h5">Barriers</CardTitle>
              </Col>
              <Col className="pr-md-1 mb-3" md="6">
                <FormGroup>
                  <label>English Language Learner</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="englishLearner"
                  />
                  {errorMessage("englishLearner")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Basic Skills Deficient/Low Levels of Literacy</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="basicSkillsDeficient"
                  />
                  {errorMessage("basicSkillsDeficient")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="pr-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Displaced Homemaker</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="displacedHomemaker"
                  />
                  {errorMessage("displacedHomemaker")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Runaway</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="runaway"
                  />
                  {errorMessage("runaway")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="pr-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Youth in, or aged out of, Foster Care</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "Yes-Aged Out", "No"]}
                    name="fosterCare"
                  />
                  {errorMessage("fosterCare")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Runaway</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="homeless"
                  />
                  {errorMessage("homeless")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="pr-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Incarcerated at Program Entry</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="incarcerated"
                  />
                  {errorMessage("incarcerated")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Date Released From Incarceration</label>
                  <Field component={DatePicker} name="dateReleased" />
                  {errorMessage("dateReleased")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>
                    Ex-Offender - individual has been arrested/convicted of a
                    crime
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="exOffender"
                  />
                  {errorMessage("exOffender")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Pregnant/Parenting youth</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="pregnantParenting"
                  />
                  {errorMessage("pregnantParenting")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Substance Abuse</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="substanceAbuse"
                  />
                  {errorMessage("substanceAbuse")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Out-Of-Home Placement</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="outOfHome"
                  />
                  {errorMessage("outOfHome")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>
                    Eligible under Section 477 of the Social Security Act
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="eligible"
                  />
                  {errorMessage("eligible")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>
                    Youth Requires Additional Assistance to complete an
                    educational program or to secure/hold employment
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="additionalAssistance"
                  />
                  {errorMessage("additionalAssistance")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>
                    Within 2 years of exhausting TANF lifetime eligibility
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="withinTwoYearsTanf"
                  />
                  {errorMessage("withinTwoYearsTanf")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Single Parent (including single pregnant woman)</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="singleParent"
                  />
                  {errorMessage("singleParent")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Hawaiian Native</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="hawaiianNative"
                  />
                  {errorMessage("hawaiianNative")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>
                    Eligible Migrant Season Farmworker as defined in WIOA Sec
                    167(i)
                  </label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="eligibleMigrantSeasonFarmworker"
                  />
                  {errorMessage("eligibleMigrantSeasonFarmworker")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Cultural Barriers</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="culturalBarriers"
                  />
                  {errorMessage("culturalBarriers")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <FormGroup>
                  <label>Gang Status</label>
                  <Field
                    component={RadioGroup}
                    options={["Gang Member", "Gang Involved", "At-Risk", "N/A"]}
                    name="gangStatus"
                  />
                  {errorMessage("gangStatus")}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Youth of Incarcerated Parent</label>
                  <Field
                    component={RadioGroup}
                    options={["Gang Member", "Gang Involved", "At-Risk", "N/A"]}
                    name="incarceratedParent"
                  />
                  {errorMessage("incarceratedParent")}
                </FormGroup>
              </Col>
              <Col className="pl-md-1 mb-3" md="6">
                <CustomInput
                  label="Parole #"
                  value="paroleNumber"
                  hasError={labelClasses("paroleNumber")}
                />
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Meets Governor's special barriers to employment</label>
                  <Field
                    component={RadioGroup}
                    options={["Yes", "No"]}
                    name="meetsGovernorsBarrier"
                  />
                  {errorMessage("meetsGovernorsBarrier")}
                </FormGroup>
              </Col>
            </Row>
            <Button className="btn-fill" color="primary" type="submit">
              Save
            </Button>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default WIOAInfo;
