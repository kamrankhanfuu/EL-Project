import React, { useState, Fragment } from "react";
import Swal from "sweetalert2";
// reactstrap components
import { FormGroup, Row, Col, Button, CardTitle, Spinner } from "reactstrap";
import { initialValues, validationSchema } from "./validation";
import { Formik, Form as FormikForm, Field, FieldArray } from "formik";
import { Select, Input } from "Components/Common/Form/elements";
import { errorMessage } from "Helpers/Validation";
import Api from "Helpers/Api";
import { withRouter } from "react-router-dom";

const MedicalInfo = ({ profileDetails, relationship, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  const apiPayload = (values) => {
    const { id } = profileDetails;
    let data = { ...values };
    delete data.emergencyContacts;

    if (values.emergencyContacts)
      values.emergencyContacts.map((emgContact) => {
        emgContact.profileId = id;
        emgContact.relationship = emgContact.relation.id;
        emgContact.name = emgContact.guardians
          ? emgContact.guardians.value
          : "";
        return emgContact;
      });

    return {
      updateHealthDto: {
        profileId: id,
        ...data,
      },
      updateEmergencyContactsDto: values.emergencyContacts,
    };
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const data = await apiPayload(values);
      const { organizationId } = props.participants;
      const { username } = props.match.params;

      if (username && organizationId) {
        data.organizationId = organizationId;
        await Api.editOrgUserHealthProfile(data);
      } else await Api.editHealthProfile(data);

      Swal.fire({
        icon: "success",
        title: "Medical Profile updated successfully!",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterGuardians = React.useMemo(() => {
    if (profileDetails?.userBackground?.guardians) {
      let guardians = profileDetails?.userBackground?.guardians;
      let guardianNames = [];
      guardians.forEach((guardian) => {
        if (guardian.firstName || guardian.lastName)
          guardianNames.push(guardian);
      });
      return guardianNames;
    } else return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDetails?.userBackground?.guardians]);

  return (
    <Formik
      // enableReinitialize={true}
      initialValues={initialValues(
        profileDetails.userHealth || {},
        relationship,
        profileDetails.userBackground
          ? profileDetails.userBackground.guardians
          : {}
      )}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, errors, touched, values }) => {
        const labelClasses = (name) => errors[name] && touched[name];
        return (
          <FormikForm onSubmit={handleSubmit}>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label>Health Issues</label>
                  <Field component={Input} type="textarea" name="healthIssue" />
                  {errorMessage("healthIssue")}
                </FormGroup>
              </Col>
            </Row>
            <div className="full-divider" />
            <Row>
              <Col md="12">
                <CardTitle tag="h5">Emergency Contact</CardTitle>
              </Col>
              <FieldArray name="guardians">
                {() =>
                  values.emergencyContacts.map((emergencyContact, i) => {
                    return (
                      <Fragment key={i}>
                        <Col md="4">
                          <FormGroup
                            className={labelClasses(
                              `emergencyContacts.${i}.name`
                            )}
                          >
                            <label>Name</label>
                            <Field
                              name={`emergencyContacts.${i}.guardians`}
                              component={Select}
                              placeholder="Search..."
                              options={filterGuardians}
                              getOptionLabel={(option) =>
                                `${option.firstName} ${option.lastName}`
                              }
                              getOptionValue={(option) => option.id}
                            />
                            {errorMessage(`emergencyContacts.${i}.guardians`)}
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup
                            className={labelClasses(
                              `emergencyContacts.${i}.number`
                            )}
                          >
                            <label> Number</label>
                            <Field
                              component={Input}
                              name={`emergencyContacts.${i}.number`}
                              type="text"
                              maxLength={15}
                            />
                            {errorMessage(`emergencyContacts.${i}.number`)}
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <label>Relationship</label>
                            <Field
                              name={`emergencyContacts.${i}.relation`}
                              component={Select}
                              options={relationship}
                              placeholder="Search..."
                              getOptionValue={(option) => option.id}
                              getOptionLabel={(option) => option.displayName}
                            />
                            {errorMessage(`emergencyContacts.${i}.relation`)}
                          </FormGroup>
                        </Col>
                      </Fragment>
                    );
                  })
                }
              </FieldArray>
            </Row>
            <Button
              className="btn-fill float-right"
              color="primary"
              type="submit"
            >
              Save {isLoading && <Spinner size="sm" className="ml-2" />}
            </Button>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default withRouter(MedicalInfo);
