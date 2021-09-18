import React, { useEffect, useState } from 'react';
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
  Label,
  Spinner,
} from 'reactstrap';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Input } from 'Components/Common/Form/elements';
import { errorMessage } from 'Helpers/Validation';
import { initialValues, validationSchema } from './validation';
import { Select } from 'Components/Common/Form/elements';
import { getStates } from 'Helpers/address';
import classnames from 'classnames';
import { US_STATE_ID } from 'Helpers/constants';
import { withRouter } from 'react-router-dom';
import Api from 'Helpers/Api';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import ImageUpload from 'Components/Common/Form/upload';
import {
  URL_ORGANIZATION,
  URL_ORGANIZATIONS_DENIED,
  URL_ORGANIZATIONS_APPROVED,
} from 'Helpers/urls';
import { DatePicker } from 'Components/Common/Form/elements';
import { Fragment } from 'react';

const ANNUAL_BUDGET = [
  '$0 - $500,000',
  '$500,001 - $1,000,000',
  '$1,000,001 - $5,000,000',
  '$5,000,001 - $10,000,000',
  '$10,000,001 +',
];

const Organization = (props) => {
  const { id } = props.match.params;
  const [orgDetails, setOrgDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [usStates, setUsStates] = useState([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [OrganizationType, setOrganizationType] = useState([]);
  const [organizationDocuments, setOrganizationDocuments] = useState([]);

  const getApiValues = (values) => {
    const location = window.location.origin;
    return {
      name: values.name,
      address1: values.address1,
      address2: values.address2,
      city: values.city,
      state: values.state,
      country: values.country,
      zipcode: values.zipcode,
      email: values.contactEmail,
      approveLink: location + URL_ORGANIZATIONS_APPROVED,
      denyLink: location + URL_ORGANIZATIONS_DENIED,
      organizationUsers: [{ userId: props.userId }],
      createdBy: props.userId,
      organizationDocuments: organizationDocuments,
      organizationDetails: {
        organizationId: orgDetails.id,
        siteName: values.siteName,
        phoneNumber: values.phoneNumber,
        email: values.contactEmail,
        webSiteURL: values.websiteUrl,
        contactName: values.contactName,
        contactEmail: values.contactEmail,
        orgTypeId: values.organizationtype.value,
        determinationDate: values.determinationDate,
        budgetRange: values.budgetRange,
        municipality: values.municipality,
        irsTaxEntity: values.organizationtype.isTaxExempt,
        ein: values.ein,
      },
    };
  };

  const editOrganizationDetails = (values) => {
    try {
      return Api.editOrganization(values);
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrganizationLogo = (values) => {
    try {
      if (logoUrl !== values.logo)
        return Api.addOrganizationLogo({
          id: orgDetails.id,
          image: values.logo,
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditOrg = async (values, actions) => {
    try {
      let apiData = await getApiValues(values);
      apiData.id = orgDetails.id;
      apiData.createdDate = orgDetails.createdDate;
      apiData.approvalDate = orgDetails.approvalDate;
      apiData.organizationUsers = orgDetails.organizationUsers;

      // Updating organization details with logo
      await Promise.all([
        editOrganizationDetails(apiData),
        updateOrganizationLogo(values),
      ]);

      Swal.fire({
        icon: 'success',
        title: 'Organization edited successfully!',
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error('Organization -> error', error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleCancelClick = () => props.history.push(URL_ORGANIZATION);

  const handleAddOrg = async (values, actions) => {
    try {
      const apiData = await getApiValues(values);
      const result = await Api.addOrganization(apiData);
      await Api.addOrganizationLogo({
        id: result.id,
        image: values.logo,
      });
      Swal.fire({
        icon: 'success',
        title: 'Organization added successfully!',
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error('Organization -> error', error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(true);
    values.state = values.state.label;
    if (id) return handleEditOrg(values, actions);
    handleAddOrg(values, actions);
  };

  const getOrganizationDetails = async () => {
    try {
      if (id) {
        const result = await Api.getOrganizationById(window.atob(id));
        result.contactEmail = result.email;
        result.state = {
          label: result.state,
          value: result.state,
        };
        setOrganizationDocuments(result.organizationDocuments);
        setOrgDetails(result);
      }
    } catch (error) {
      console.error('getOrganizationDetails -> error', error);
    }
  };

  const getOrganizationLogo = async () => {
    if (id) {
      try {
        const result = await Api.getOrganizationLogo(window.atob(id));
        setLogoUrl(result);
      } catch (error) {
        console.error('Organization -> error', error);
      }
    }
  };

  const getOrganizationTypes = async () => {
    try {
      const result = await Api.getOrganizationtype();
      setOrganizationType(result);
    } catch (error) {
      console.error('Organization -> error', error);
    }
  };

  const getAllUsStates = async () => {
    try {
      const states = await getStates(US_STATE_ID);
      setUsStates(states);
    } catch (error) {
      console.error('Organization -> error', error);
    }
  };

  const getOrganizationData = async () => {
    setLoading(true);
    await Promise.all([
      getOrganizationDetails(),
      getAllUsStates(),
      getOrganizationLogo(),
      getOrganizationTypes(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    getOrganizationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (
    { fileUrl, fileName, documentType },
    setFieldValue
  ) => {
    const obj = {
      fileData: fileUrl,
      fileName: fileName,
      documentType: documentType,
      fileURL: fileUrl,
      createdDate: new Date(),
    };
    let data = [...organizationDocuments];
    data.push(obj);
    setOrganizationDocuments(data);
    setFieldValue(documentType, fileUrl);
  };

  const handleLogoChange = ({ fileUrl }, setFieldValue) => {
    setFieldValue('logo', fileUrl);
  };

  const filterOrgDetails = React.useMemo(() => {
    let orgData = { ...orgDetails };
    if (orgData.organizationDetails) {
      const filterType = OrganizationType.filter(
        (org) => org.id === orgData.organizationDetails.orgTypeId
      )[0];

      if (filterType)
        orgData.organizationtype = {
          value: orgData.organizationDetails.orgTypeId,
          label: filterType.name,
          isTaxExempt: filterType.isTaxExempt,
        };
    }
    if (orgData.organizationDocuments) {
      const filterDetermination = orgData.organizationDocuments.filter(
        (doc) => doc.documentType === 'DeterminationLetter'
      );
      if (filterDetermination.length)
        orgData.DeterminationLetter =
          filterDetermination[filterDetermination.length - 1].fileURL;

      const filterLocation = orgData.organizationDocuments.filter(
        (doc) => doc.documentType === 'ProofOfLocation'
      );

      if (filterLocation.length)
        orgData.ProofOfLocation =
          filterLocation[filterLocation.length - 1].fileURL;
    }
    return orgData;
  }, [orgDetails, OrganizationType]);

  return (
    <div className='content'>
      <Row>
        <Col md='12'>
          {loading ? (
            <div className='text-center'>
              <Spinner />
            </div>
          ) : (
            <Formik
              enableReinitialize={true}
              initialValues={initialValues({
                logo: logoUrl,
                ...filterOrgDetails,
              })}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit,
                errors,
                touched,
                setFieldValue,
                values,
                isSubmitting,
              }) => {
                const labelClasses = (name) =>
                  classnames('has-label', {
                    'has-danger': errors[name] && touched[name],
                  });
                return (
                  <FormikForm>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>
                          {id ? 'Edit' : 'New'} Organization
                        </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col md={3}>
                            <FormGroup>
                              <div className='img-avatar'>
                                <label>Logo</label>
                                <div className='text-center'>
                                  <ImageUpload
                                    accept='image/*'
                                    onChange={(data) =>
                                      handleLogoChange(data, setFieldValue)
                                    }
                                    defaultValue={
                                      values.logo
                                        ? `data:image/jpeg;base64,${values.logo}`
                                        : ''
                                    }
                                  />
                                </div>
                                {errorMessage('logo')}
                              </div>
                            </FormGroup>
                          </Col>
                          <Col md={9}>
                            <FormGroup className={labelClasses('name')}>
                              <label>Name</label>
                              <Field
                                component={Input}
                                name='name'
                                maxLength={80}
                              />
                              {errorMessage('name')}
                            </FormGroup>
                            <Row>
                              <Col md={6}>
                                <FormGroup className={labelClasses('address1')}>
                                  <label>Street Address</label>
                                  <Field
                                    component={Input}
                                    name='address1'
                                    maxLength={80}
                                  />
                                  {errorMessage('address1')}
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup className={labelClasses('address2')}>
                                  <label> Ste, Room, Bldg</label>
                                  <Field
                                    component={Input}
                                    name='address2'
                                    maxLength={80}
                                  />
                                  {errorMessage('address2')}
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <FormGroup className={labelClasses('city')}>
                              <label> City</label>
                              <Field
                                component={Input}
                                name='city'
                                maxLength={80}
                              />
                              {errorMessage('city')}
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup className={labelClasses('state')}>
                              <label> State</label>
                              <Field
                                component={Select}
                                name='state'
                                options={usStates}
                              />
                              {errorMessage('state')}
                            </FormGroup>
                          </Col>

                          <Col>
                            <FormGroup className={labelClasses('zipcode')}>
                              <label> Postal Code</label>
                              <Field
                                component={Input}
                                name='zipcode'
                                maxLength={6}
                              />
                              {errorMessage('zipcode')}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <FormGroup
                              className={labelClasses('organizationtype')}
                            >
                              <label> Organization Type </label>
                              <Field
                                component={Select}
                                name='organizationtype'
                                options={OrganizationType}
                              />
                              {errorMessage('organizationtype')}
                            </FormGroup>
                          </Col>
                          {values.organizationtype &&
                            values.organizationtype.label ===
                              'Municipality or State' && (
                              <Col md={4}>
                                <FormGroup
                                  className={labelClasses('municipality')}
                                >
                                  <label>Municipality or State Name</label>
                                  <Field
                                    component={Input}
                                    name='municipality'
                                    maxLength={80}
                                  />
                                  {errorMessage('municipality')}
                                </FormGroup>
                              </Col>
                            )}
                          {values.organizationtype &&
                            values.organizationtype.label ===
                              'Other Organization Type' && (
                              <Col md={4}>
                                <FormGroup
                                  className={labelClasses('irsTaxEntity')}
                                >
                                  <label>IRS Tax Entity Type</label>
                                  <Field
                                    component={Input}
                                    name='irsTaxEntity'
                                    maxLength={80}
                                  />
                                  {errorMessage('irsTaxEntity')}
                                </FormGroup>
                              </Col>
                            )}
                          <Col md={4}>
                            <FormGroup className={labelClasses('ein')}>
                              <label>Ein</label>
                              <Field
                                component={Input}
                                name='ein'
                                maxLength={80}
                              />
                              {errorMessage('ein')}
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup className={labelClasses('siteName')}>
                              <label> Site Name(if different)</label>
                              <Field
                                component={Input}
                                name='siteName'
                                maxLength={80}
                              />
                              {errorMessage('siteName')}
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup className={labelClasses('websiteUrl')}>
                              <label> Website URL</label>
                              <Field
                                component={Input}
                                name='websiteUrl'
                                maxLength={80}
                              />
                              {errorMessage('websiteUrl')}
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup className={labelClasses('contactName')}>
                              <label> Contact Name</label>
                              <Field
                                component={Input}
                                name='contactName'
                                maxLength={80}
                              />
                              {errorMessage('contactName')}
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup className={labelClasses('contactEmail')}>
                              <label> Contact Email</label>
                              <Field
                                component={Input}
                                name='contactEmail'
                                type='email'
                                maxLength={80}
                              />
                              {errorMessage('contactEmail')}
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup className={labelClasses('phoneNumber')}>
                              <label> Contact Phone Number</label>
                              <Field
                                component={Input}
                                name='phoneNumber'
                                type='text'
                                maxLength={15}
                              />
                              {errorMessage('phoneNumber')}
                            </FormGroup>
                          </Col>
                          {values.organizationtype.isTaxExempt && (
                            <Fragment>
                              <Col md='4'>
                                <FormGroup
                                  className={labelClasses('determinationDate')}
                                >
                                  <label>Tax Exempt Determination Date</label>
                                  <Field
                                    component={DatePicker}
                                    name='determinationDate'
                                  />
                                  {errorMessage('determinationDate')}
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup
                                  className={labelClasses('budgetRange')}
                                >
                                  <label> Annual budget</label>
                                  <Field
                                    component={Select}
                                    name='budgetRange'
                                    getOptionLabel={(option) => option}
                                    getOptionValue={(option) => option}
                                    value={ANNUAL_BUDGET.filter(function (
                                      option
                                    ) {
                                      return option === values.budgetRange;
                                    })}
                                    options={ANNUAL_BUDGET}
                                  />
                                  {errorMessage('budgetRange')}
                                </FormGroup>
                              </Col>
                            </Fragment>
                          )}
                        </Row>
                        <Row>
                          {values.organizationtype.isTaxExempt && (
                            <Col md={4}>
                              <FormGroup
                                className={
                                  'img-avatar ' +
                                  labelClasses('DeterminationLetter')
                                }
                              >
                                <label className='mb-3'>
                                  EIN/NonProfit Determination Letter
                                </label>
                                <ImageUpload
                                  documentType='DeterminationLetter'
                                  accept='application/pdf,image/*'
                                  onChange={(data, e) => {
                                    handleFileChange(data, setFieldValue);
                                  }}
                                  normal={true}
                                />
                                {id &&
                                  filterOrgDetails &&
                                  filterOrgDetails.DeterminationLetter && (
                                    <a
                                      href={
                                        filterOrgDetails.DeterminationLetter
                                      }
                                      target='_blank'
                                      rel='noopener noreferrer'
                                    >
                                      View uploaded File
                                    </a>
                                  )}
                                {errorMessage('DeterminationLetter')}
                              </FormGroup>
                            </Col>
                          )}
                          <Col md={12}>
                            <FormGroup
                              className={
                                'img-avatar ' + labelClasses('ProofOfLocation')
                              }
                            >
                              <label className='mb-3 mt-3'>
                                To help us authenticate your organization’s new
                                Eleveight account, please upload either: (1) a
                                recent utility bill, or (2) a document where
                                your organization paid a bill, that contains the
                                name and address of your organization.
                              </label>
                              <ImageUpload
                                documentType='ProofOfLocation'
                                accept='application/pdf,image/*'
                                onChange={(data) => {
                                  handleFileChange(data, setFieldValue);
                                }}
                                normal={true}
                              />
                              {id &&
                                filterOrgDetails &&
                                filterOrgDetails.ProofOfLocation && (
                                  <a
                                    href={filterOrgDetails.ProofOfLocation}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                  >
                                    View uploaded File
                                  </a>
                                )}
                              {errorMessage('ProofOfLocation')}
                            </FormGroup>
                          </Col>
                          <Col md={12}>
                            <FormGroup check className='text-left mt-3'>
                              <Label check>
                                <Field
                                  type='checkbox'
                                  component={Input}
                                  name='isTermsMarked'
                                />
                                <span className='form-check-sign' /> I agree to
                                the welfare and safety of the Eleveight
                                community. Professional: The content posted and
                                shared by our organization will be relevant and
                                on topic with the mission and practices of our
                                organization and those we serve. Real: The
                                information provided by our organization and
                                those who administer our organization, will use
                                our true identities and share information that
                                is real and authentic. Safe: Our organization
                                agrees to engage with others in a civil and
                                respectful manner. I understand that these
                                guidelines will be updated regularly for the
                                welfare and safety of the Eleveight community.
                              </Label>
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                      <CardFooter className='text-right'>
                        <Button
                          color='default mr-3'
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </Button>
                        <Button
                          color='primary'
                          type='submit'
                          disabled={isSubmitting || !values.isTermsMarked}
                        >
                          {id ? 'Update' : 'Create'}
                          {isSubmitting && (
                            <Spinner size='sm' className='ml-2' />
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </FormikForm>
                );
              }}
            </Formik>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapReduxStateToProps = (state) => {
  return {
    userId: state.auth.userId,
  };
};

export default connect(mapReduxStateToProps, null)(withRouter(Organization));
