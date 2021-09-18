import React, { useEffect, useState } from 'react';
// reactstrap components
import { FormGroup, Row, Col, Button, Spinner } from 'reactstrap';
import ImageUpload from 'Components/Common/Form/upload';
import { Formik, Form as FormikForm, Field, FieldArray } from 'formik';
import { initialValues, validationSchema } from './validation';
import { errorMessage } from 'Helpers/Validation';
import { updateTopbarProfile } from 'Redux/Actions/auth.action';
import {
  Input,
  Select,
  CustomInput,
  DatePicker,
} from 'Components/Common/Form/elements';
import { US_STATE_ID } from 'Helpers/constants';
import { getStates } from 'Helpers/address';
import Swal from 'sweetalert2';
import Api from 'Helpers/Api';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const BasicInfo = ({
  profileDetails,
  getProfileDetails,
  setActiveTab,
  ...props
}) => {
  const [usStates, setUsStates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [currentState, setCurrentState] = useState();

  const apiPayload = (values) => {
    const { id } = profileDetails;
    let data = { ...values };
    delete data.userContact;

    return {
      updateProfileDto: {
        ...data,
        id: id,
        dateOfBirth: moment(data.dateOfBirth).format('YYYY-MM-DD'),
      },
      updateContactDto: {
        profileId: id,
        isPrimary: true,
        ...values.userContact[0],
        state: values.userContact[0].state === null ? null : values.userContact[0].state.value || values.userContact[0].state, 
      },
    };
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Modify fields as per API request
      const data = await apiPayload(values);
      const { organizationId } = props.participants;
      const { username } = props.match.params;

      if (username && organizationId) {
        data.organizationId = organizationId;
        await Api.editOrgUserContactProfile(data);
      } else await Api.editContactProfile(data);
      getProfileDetails();
      props.updateTopbarProfile();
      setActiveTab('Background');
      Swal.fire({
        icon: 'success',
        title: 'Basic Profile updated successfully!',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancel = false;
    let userId; 
    if(props.match.params.username !== undefined){
      userId = props.participants.participantId.id || props.participants.participantId;
    }
    else
    userId = props.userId;

    const getAllUsStates = async () => {
      try {
        const states = await getStates(US_STATE_ID);
        if (cancel) return;
        setUsStates(states);
      } catch (error) {
        console.error('Organization -> error', error);
      }
    };
    const getUserProfile = async () => {
      try {
        const users = await Api.getUser(userId);
        setCurrentState(users.model.userContact.state);
        setUserDetails(users.model);
      } catch (error) {
        console.error('Organization -> error', error);
      }
    };
    getUserProfile();
    getAllUsStates();

    return () => {
      cancel = true;
    };
  }, [profileDetails, props.participants.participantId]);

  const handleFileChange = ({ fileUrl, fileName }, setFieldValue) => {
    setFieldValue('imageData', fileUrl);
    setFieldValue('fileName', fileName);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues((userDetails && userDetails) || {})}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, errors, touched, setFieldValue, values }) => {
        const labelClasses = (name) => errors[name] && touched[name];
        return (
          <FormikForm onSubmit={handleSubmit}>
            <Row>
              <Col md='3'>
                <FormGroup>
                  <div className='img-avatar'>
                    <label>Avatar</label>
                    <div className='text-center'>
                      <ImageUpload
                        avatar
                        accept='image/*'
                        onChange={(data) =>
                          handleFileChange(data, setFieldValue)
                        }
                        defaultValue={values.avatar}
                      />
                    </div>
                  </div>
                  <label>
                    {moment(profileDetails.created).format('MMM DD, YYYY')}
                  </label>
                </FormGroup>
              </Col>
              <Col md='9'>
                <Row>
                  <Col md='4'>
                    <CustomInput
                      label='First Name *'
                      value='firstName'
                      hasError={labelClasses('firstName')}
                    />
                  </Col>
                  <Col md='4'>
                    <CustomInput
                      label='Last Name *'
                      value='lastName'
                      hasError={labelClasses('lastName')}
                    />
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      <label>User Name</label>
                      <Field
                        component={Input}
                        type='text'
                        name='userName'
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md='4'>
                    <FormGroup
                      className={classnames('has-label', {
                        'has-danger': labelClasses('dateOfBirth'),
                      })}
                    >
                      <label>Date of Birth *</label>
                      <Field component={DatePicker} name='dateOfBirth' />
                      {errorMessage('dateOfBirth')}
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup>
                      <label>Age</label>
                      <Field
                        component={Input}
                        type='text'
                        name='age'
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md='4'>
                    <FormGroup className={labelClasses('phoneNumber')}>
                      <label> Mobile Phone Number</label>
                      <Field
                        component={Input}
                        name='phoneNumber'
                        type='text'
                        maxLength={15}
                      />
                      {errorMessage('phoneNumber')}
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md='6'>
                <CustomInput
                  type='email'
                  label='Personal Email *'
                  value='personalEmail'
                  hasError={labelClasses('personalEmail')}
                />
              </Col>
              <Col md='6'>
                <CustomInput
                  label='Work Email'
                  value='workEmail'
                  hasError={labelClasses('workEmail')}
                />
              </Col>
            </Row>
            <Row>
              <Col md='12'>
                <FormGroup
                  className={classnames('has-label', {
                    'has-danger': labelClasses('profileDescription'),
                  })}
                >
                  <label>Bio</label>
                  <Field
                    component={Input}
                    type='textarea'
                    name='profileDescription'
                    maxLength={150}
                  />
                  {errorMessage('profileDescription')}
                </FormGroup>
              </Col>
            </Row>
            <FieldArray name='userContact'>
              {() =>
                values?.userContact?.map((_, i) => {
                  return (
                    <div key={i}>
                      <Row>
                        <Col md={6}>
                          <CustomInput
                            label='Address Line 1'
                            value={`userContact.${i}.addressLine1`}
                            hasError={labelClasses(
                              `userContact.${i}.addressLine1`
                            )}
                          />
                        </Col>
                        <Col md={6}>
                          <CustomInput
                            label='Address Line 2'
                            value={`userContact.${i}.addressLine2`}
                            hasError={labelClasses(
                              `userContact.${i}.addressLine2`
                            )}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md='4'>
                          <CustomInput
                            label='City'
                            value={`userContact.${i}.city`}
                            hasError={labelClasses(`userContact.${i}.city`)}
                          />
                        </Col>
                        <Col md='4'>
                          <FormGroup
                            className={labelClasses(`userContact.${i}.states`)}
                          >
                            <label>State</label>
                            <Field
                              component={Select}
                              name={`userContact.${i}.state`}
                              options={usStates}
                              placeholder={currentState}
                            />
                            {errorMessage(`userContact.${i}.state`)}
                          </FormGroup>
                        </Col>
                        <Col md='4'>
                          <CustomInput
                            label='Postal Code'
                            value={`userContact.${i}.postalCode`}
                            hasError={labelClasses(
                              `userContact.${i}.postalCode`
                            )}
                            maxLength={6}
                          />
                        </Col>
                      </Row>
                    </div>
                  );
                })
              }
            </FieldArray>
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

export default connect(null, {
  updateTopbarProfile,
})(withRouter(BasicInfo));
