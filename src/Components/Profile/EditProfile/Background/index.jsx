import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { errorMessage } from 'Helpers/Validation';
// reactstrap components
import { FormGroup, Row, Col, Button, CardTitle, Spinner } from 'reactstrap';
import { Formik, Form as FormikForm, Field, FieldArray } from 'formik';
import { initialValues, validationSchema } from './validation';
import {
  RadioGroup,
  CustomInput,
  Select,
  DatePicker,
} from 'Components/Common/Form/elements';
import { AUTHORIZED_PLACE } from 'Helpers/constants';
import Api from 'Helpers/Api';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';

const BackgroundInfo = ({
  profileDetails,
  relationship,
  getProfileDetails,
  setActiveTab,
  ...props
}) => {
  const [ethnicity, setEthnicity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allEthnicity, setAllEthnicity] = useState([]);

  const apiPayload = (values) => {
    const { id } = profileDetails;
    let data = { ...values };
    delete data.guardians;
    delete data.ethnicity;

    if (values.guardians)
      values.guardians.map((guardian) => {
        guardian.profileId = id;
        guardian.relationship = guardian.relation ? guardian.relation.id : 0;
        guardian.isEmergencyContact = guardian.isEmergencyContact === 'true';
        return guardian;
      });

    return {
      updateBackgroundDto: {
        profileId: id,
        ...data,
        ethnicityId: data.ethnicity ? data.ethnicity.value : 0,
        isVeteran: data.isVeteran === 'true',
      },
      updateGuardiansDto: values.guardians,
    };
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Modify required fields
      const data = await apiPayload(values);
      const { organizationId } = props.participants;
      const { username } = props.match.params;

      if (username && organizationId) {
        data.organizationId = organizationId;
        await Api.editOrgUserBackgroundProfile(data);
      } else await Api.editBackgroundProfile(data);
      getProfileDetails();
      setActiveTab('Education');
      Swal.fire({
        icon: 'success',
        title: 'Backgroud Profile updated successfully!',
      });
    } catch (error) {
      console.error(error);
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: error.response.data.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancel = false;

    const getEthnicity = async () => {
      try {
        const response = await Api.getEthnicity();
        if (cancel) return;
        setAllEthnicity(response);

        let ethnicities = [];
        response.map((data) => {
          ethnicities.push({
            label: data.displayName,
            value: data.id,
          });
          return data;
          /* if (data.parentId === "0") {
            // Filter child options
            const selectedParent = response.filter(
              (group) => data.id === parseInt(group.parentId)
            );

            if (selectedParent.length)
              selectedParent.map((data) => {
                data.label = data.displayName;
                da ta.value = data.id;
                return data;
              });

            ethnicities.push({
              label: data.displayName,
              [selectedParent.length
                ? "options"
                : "value"]: selectedParent.length ? selectedParent : data.id,
            });
          } 

          return data; */
        });
        setEthnicity(ethnicities);
      } catch (error) {
        console.error(error);
      }
    };

    getEthnicity();

    return () => {
      cancel = true;
    };
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues(
        profileDetails.userBackground || {},
        relationship,
        allEthnicity
      )}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, errors, touched, values }) => {
        const labelClasses = (name) => errors[name] && touched[name];
        return (
          <FormikForm onSubmit={handleSubmit}>
            <Row>
              <Col md='4'>
                <FormGroup>
                  <label>Gender Assigned at Birth</label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: 'Male', value: 1 },
                      { label: 'Female', value: 2 },
                    ]}
                    name='genderAtBirth'
                  />
                  {errorMessage('genderAtBirth')}
                </FormGroup>
              </Col>
              <Col md='4'>
                <FormGroup>
                  <label>Gender I Identify As</label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: 'Male', value: 1 },
                      { label: 'Female', value: 2 },
                      { label: 'Nonbinary', value: 3 },
                    ]}
                    name='genderIdentified'
                  />
                  {errorMessage('genderIdentified')}
                </FormGroup>
              </Col>
              <Col md='4'>
                <FormGroup>
                  <label>Selective Service (Males only)</label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: 'Yes', value: '1' },
                      { label: 'No', value: '2' },
                      { label: 'Exempt', value: '3' },
                    ]}
                    name='selectiveService'
                  />
                  {errorMessage('selectiveService')}
                </FormGroup>
              </Col>
              <Col md='4'>
                <FormGroup>
                  <label>Ethnicity</label>
                  <Field
                    name='ethnicity'
                    component={Select}
                    options={ethnicity}
                    placeholder='Search...'
                  />
                  {errorMessage('ethnicity')}
                </FormGroup>
              </Col>
              <Col md='4'>
                <FormGroup>
                  <label>Veteran</label>
                  <Field
                    component={RadioGroup}
                    options={[
                      { label: 'Yes', value: true },
                      { label: 'No', value: false },
                    ]}
                    name='isVeteran'
                  />
                  {errorMessage('isVeteran')}
                </FormGroup>
              </Col>
              <Col md='4'>
                <FormGroup>
                  <label>Authorized to Work In U.S.</label>
                  <Field
                    name='citizenshipType'
                    component={Select}
                    options={AUTHORIZED_PLACE}
                    value={AUTHORIZED_PLACE.filter(function (option) {
                      return option === values.citizenshipType;
                    })}
                    getOptionValue={(option) => option}
                    getOptionLabel={(option) => option}
                  />
                  {errorMessage('citizenshipType')}
                </FormGroup>
              </Col>
            </Row>
            {values.citizenshipType === 'U.S. Citizen' && (
              <Row>
                <Col md='6'>
                  <CustomInput
                    label='Social Security #'
                    value='ssn'
                    hasError={labelClasses('ssn')}
                  />
                </Col>
              </Row>
            )}
            {(values.citizenshipType === 'U.S. Permanent Citizen' ||
              values.citizenshipType ===
                'Alien/Refuge Lawfully Admitted to U.S.') && (
              <Row>
                <Col md='6'>
                  <CustomInput
                    label='Visa Registration #'
                    value='visaRegistrationNumber'
                    hasError={labelClasses('visaRegistrationNumber')}
                  />
                </Col>
                <Col md='6'>
                  <FormGroup
                    className={classnames('has-label', {
                      'has-danger': labelClasses('expirationDate'),
                    })}
                  >
                    <label>Expiration Date</label>
                    <Field component={DatePicker} name='expirationDate' />
                    {errorMessage('expirationDate')}
                  </FormGroup>
                </Col>
              </Row>
            )}
            <div className='full-divider' />
            <Row>
              <Col md='12'>
                <CardTitle tag='h4' className='title'>
                  Family
                </CardTitle>
              </Col>
            </Row>
            <FieldArray name='guardians'>
              {() =>
                values.guardians.map((guardian, i) => {
                  return (
                    <div key={i}>
                      <Row>
                        <Col md='12'>
                          <CardTitle tag='h5'>Guardian {i + 1}</CardTitle>
                        </Col>
                      </Row>
                      <Row>
                        <Col md='6'>
                          <CustomInput
                            label='Guardian First Name'
                            value={`guardians.${i}.firstName`}
                            hasError={labelClasses(`guardians.${i}.firstName`)}
                          />
                        </Col>
                        <Col md='6'>
                          <CustomInput
                            label='Guardian Last Name'
                            value={`guardians.${i}.lastName`}
                            hasError={labelClasses(`guardians.${i}.lastName`)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md='6'>
                          <CustomInput
                            label='Guardian Occupation'
                            value={`guardians.${i}.occupation`}
                            hasError={labelClasses(`guardians.${i}.occupation`)}
                          />
                        </Col>
                        <Col md='6'>
                          <CustomInput
                            label='Guardian Education Level'
                            value={`guardians.${i}.educationLevel`}
                            hasError={labelClasses(
                              `guardians.${i}.educationLevel`
                            )}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md='6'>
                          <FormGroup>
                            <label>Is Guardian an Emergency Contact?</label>
                            <Field
                              component={RadioGroup}
                              options={[
                                { label: 'Yes', value: true },
                                { label: 'No', value: false },
                              ]}
                              name={`guardians.${i}.isEmergencyContact`}
                            />
                            {errorMessage(`guardians.${i}.isEmergencyContact`)}
                          </FormGroup>
                        </Col>
                        <Col md='6'>
                          <FormGroup>
                            <label>Relationship</label>
                            <Field
                              name={`guardians.${i}.relation`}
                              component={Select}
                              options={relationship}
                              placeholder='Search...'
                              getOptionValue={(option) => option.id}
                              getOptionLabel={(option) => option.displayName}
                            />
                            {errorMessage(`guardians.${i}.relation`)}
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  );
                })
              }
            </FieldArray>
            <Row>
              <Col md='6'>
                <CustomInput
                  label='Family Size'
                  value='familySize'
                  hasError={labelClasses('familySize')}
                />
              </Col>
              <Col md='6'>
                <CustomInput
                  label='Annual Family Income'
                  value='annualFamilyIncome'
                  hasError={labelClasses('annualFamilyIncome')}
                />
              </Col>
            </Row>
            <Button
              className='btn-fill float-right'
              color='primary'
              type='submit'
            >
              Next {isLoading && <Spinner size='sm' className='ml-2' />}
            </Button>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default withRouter(BackgroundInfo);
