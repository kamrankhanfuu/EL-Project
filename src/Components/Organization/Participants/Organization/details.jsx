import { Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Input } from 'Components/Common/Form/elements';
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import FormGroup from 'reactstrap/lib/FormGroup';
import Row from 'reactstrap/lib/Row';
import { Link, withRouter } from 'react-router-dom';
import Api from 'Helpers/Api';
import CardImg from 'reactstrap/lib/CardImg';
import { URL_ORGANIZATION } from 'Helpers/urls';
import Spinner from 'reactstrap/lib/Spinner';

const OrganizationDetail = (props) => {
  const { idx } = props?.location.state;
  const [logo, setLogo] = useState('');
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrganizationDetails = async () => {
      try {
        if (idx) {
          setLoading(true);
          const result = await Api.getOrganizationById(idx);
          result.contactEmail = result.email;
          result.state = {
            label: result.state,
            value: result.state,
          };
          setLoading(false);
          setDetails(result);
        }
      } catch (error) {
        console.error('getOrganizationDetails -> error', error);
      }
    };
    const getOrganizationLogo = async () => {
      if (idx) {
        try {
          const result = await Api.getOrganizationLogo(idx);
          setLogo(result);
        } catch (error) {
          console.error('Organization -> error', error);
        }
      }
    };

    const getOrganizationUsers = async () => {
      if (idx) {
        try {
          const result = await Api.getOrganizationUsers(idx);
        } catch (error) {
          console.error('Organization -> error', error);
        }
      }
    };
    getOrganizationDetails();
    getOrganizationLogo();
    getOrganizationUsers();
  }, [idx]);

  const {
    name,
    address1,
    address2,
    city,
    state,
    zipcode,
    organizationDetails: {
      ein,
      siteName,
      webSiteURL,
      contactName,
      email,
      phoneNumber,
    } = {},
  } = details;

  return (
    <div className='content'>
      {loading ? (
        <div className='text-center'>
          <Spinner />
        </div>
      ) : (
        <Formik enableReinitialize={true}>
          {() => {
            return (
              <Card>
                <CardHeader>
                  <CardTitle tag='h4' className='float-left'>
                    Organization Details
                  </CardTitle>
                  <Link to={URL_ORGANIZATION}>
                    <Button
                      className='btn-link float-right d-flex align-items-center'
                      color='info'
                    >
                      <i className='tim-icons icon-minimal-left mr-2' /> Go back
                    </Button>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <div className='img-avatar'>
                          <label>Logo</label>
                          <div
                            className='text-center m-auto thumbnail'
                            style={{ width: '150px', height: '100px' }}
                          >
                            <CardImg
                              src={`data:image/jpeg;base64,${logo}`}
                              alt='logo'
                            />
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md={9}>
                      <FormGroup>
                        <label>Name</label>
                        <Field
                          component={Input}
                          name='name'
                          value={name}
                          disabled={true}
                        />
                      </FormGroup>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <label>Street Address</label>
                            <Field
                              component={Input}
                              name='address1'
                              value={address1}
                              disabled={true}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <label> Ste, Room, Bldg</label>
                            <Field
                              component={Input}
                              name='address2'
                              value={address2}
                              disabled={true}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <label> City</label>
                        <Field
                          component={Input}
                          name='city'
                          value={city}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <label> State</label>
                        <Field
                          component={Input}
                          name='state'
                          value={state?.value}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label> Postal Code</label>
                        <Field
                          component={Input}
                          name='zipcode'
                          value={zipcode}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <label> Organization Type </label>
                        <Field
                          component={Input}
                          name='organizationtype'
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <label>Ein</label>
                        <Field
                          component={Input}
                          name='ein'
                          value={ein}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <label> Site Name(if different)</label>
                        <Field
                          component={Input}
                          name='siteName'
                          value={siteName}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <label> Website URL</label>
                        <Field
                          component={Input}
                          name='websiteUrl'
                          value={webSiteURL}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <label> Contact Name</label>
                        <Field
                          component={Input}
                          name='contactName'
                          value={contactName}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <label> Contact Email</label>
                        <Field
                          component={Input}
                          name='contactEmail'
                          type='email'
                          value={email}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <label> Contact Phone Number</label>
                        <Field
                          component={Input}
                          name='phoneNumber'
                          type='text'
                          value={phoneNumber}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row></Row>
                </CardBody>
              </Card>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default withRouter(OrganizationDetail);
