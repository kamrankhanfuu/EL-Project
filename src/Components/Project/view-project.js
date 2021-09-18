import React, { useEffect, useState } from 'react';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
} from 'reactstrap';
import { URL_PROJECT } from 'Helpers/urls';
import { withRouter, Link } from 'react-router-dom';
import Api from 'Helpers/Api';
import moment from 'moment';
import OrganizationUsers from './OrganizationUsers';

const LabelStyle = {
  fontSize: '13px',
  display: 'inline-block',
  background: '#2b69f5',
  lineHeight: '1',
  padding: '2px 5px',
  marginLeft: '5px',
};

const ViewProject = (props) => {
  const { className } = props;

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggle = () => setModal(!modal);
  const { id } = props.match.params;
  const [documents, setDocument] = useState([]);
  const [deletedDocument, setDeletedDocument] = useState([]);
  const [uploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [orgData, setOrgData] = useState({});
  const [downloadDocumentLoading, setDownloadDocumentLoading] = useState({
    loading: false,
    index: null,
  });
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: '',
    primaryOrganizationGuid: '',
    projectOrganizations: '',
    startDate: '',
    endDate: '',
  });

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = '';
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const getDocument = async () => {
    try {
      const result = await Api.getProjectDocument(window.atob(id));
      setDocument(result.reverse());
    } catch (error) {
      console.error('getProjectDetails -> error', error);
    }
  };

  const getProjectDetails = async () => {
    try {
      const result = await Api.getProjectDetails(window.atob(id));
      result.projectOrganizations.map((org) => {
        org.name = org.organization.name;
        // Adding primary organization name field
        if (org.organizationId === result.primaryOrganizationGuid) {
          result.primaryOrganizationGuid = org.organization.name;
        }
        return org;
      });
      setOrgData({
        logo: result.projectOrganizations[0].organizationLogo,
        name: result.projectOrganizations[0].organization.name,
        details:
          result.projectOrganizations[0].organization.organizationDetails,
      });
      setProjectDetails(result);

      // setOrgData()
    } catch (error) {
      console.error('getProjectDetails -> error', error);
    }
  };

  const openDeleteModal = (e, document) => {
    toggle();
    setDeletedDocument(document);
  };

  const downloadDocument = async (e, file, index) => {
    e.preventDefault();
    setDownloadDocumentLoading({ loading: true, index: index });
    try {
      const result = await Api.downloadDocument({
        projectId: file.projectId,
        documentId: file.document.id,
        documentName: file.document.name,
      });

      var dlnk = document.getElementById('dwnldLnk' + index);
      dlnk.href = 'data:application/octet-stream;base64,' + result;
      dlnk.click();
      setDownloadDocumentLoading({ loading: false, index: index });
    } catch (error) {
      setDownloadDocumentLoading({ loading: false, index: index });
      console.error('getProjectDetails -> error', error);
    }
  };

  const deleteDocument = async () => {
    setDeleteLoading(true);
    try {
      await Api.deleteProjectDocument({
        projectId: deletedDocument.projectId,
        documentsModel: [
          {
            id: deletedDocument.document.id,
            name: deletedDocument.document.name,
          },
        ],
      });
      setDeleteLoading(false);
      getDocument();
      toggle();
    } catch (error) {
      setDeleteLoading(false);
      console.error('deleteDocument -> error', error);
    }
  };

  const getInitData = async () => {
    setLoading(true);
    await Promise.all([getProjectDetails(), getDocument()]);
    setLoading(false);
  };

  useEffect(() => {
    getInitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    name,
    description,
    projectOrganizations,
    startDate,
    endDate,
    isPublic,
  } = projectDetails;

  return (
    <div className='content'>
      <Row>
        <Col md='6'>
          {loading ? (
            <Card>
              <CardHeader>
                <div
                  style={{
                    width: '100%',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Loading...
                </div>
              </CardHeader>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className='float-left' tag='h4'>
                    {name}
                    {isPublic && <span style={LabelStyle}>Public</span>}
                  </CardTitle>

                  <Link to={URL_PROJECT}>
                    <Button className='btn-link float-right mr-3' color='info'>
                      <i className='tim-icons icon-minimal-left' /> Go back
                    </Button>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg='3'>
                      <h5 className='text-muted'>Start Date</h5>
                      <p className='mb-4'>
                        {startDate && moment(startDate).format('do MMMM yyyy')}
                      </p>
                    </Col>
                    <Col lg='3'>
                      <h5 className='text-muted'>End Date</h5>
                      <p className='mb-4'>
                        {endDate && moment(endDate).format('do MMMM yyyy')}
                      </p>
                    </Col>
                    <Col md={12}>
                      <h5 className='text-muted'>Project Description</h5>
                      <p className='mb-4'>{description}</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Primary Organization</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={5}>
                      <div className='org-image'>
                        <img
                          src={
                            orgData.logo
                              ? `data:image/jpeg;base64,${orgData.logo}`
                              : ''
                          }
                          alt='logo'
                          height={200}
                          width='100%'
                        />
                      </div>
                    </Col>
                    <Col lg={7} className='pl-5 d-flex align-items-center'>
                      <Row>
                        <Col md={12}>
                          <h2 className='info-text float-middle'>
                            {orgData.name}
                          </h2>
                        </Col>
                        <Col md={12}>
                          <h5 className='text-muted'>Contact Email</h5>
                          <p className='mb-4'>{orgData.details?.email}</p>
                        </Col>
                        {orgData.details?.webSiteURL && (
                          <Col md={12}>
                            <h5 className='text-muted'>Website URL</h5>
                            <p className='mb-4'>
                              {orgData.details?.webSiteURL}
                            </p>
                          </Col>
                        )}
                      </Row>
                    </Col>
                  </Row>

                  <Row className='mt-3'>
                    <Col sm='12'>
                      <h5 className='text-muted'>Organizations</h5>
                      {projectOrganizations &&
                        projectOrganizations.map((org) => (
                          <p className='mb-4' key={org.organizationId}>
                            {org.name}
                          </p>
                        ))}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </>
          )}
        </Col>
        <Col md='6'>
          <Card className='position-relative'>
            {uploadLoading ? (
              <div className='loading-table'>Loading...</div>
            ) : (
              ''
            )}
            <CardHeader>
              <CardTitle tag='h4'>Documents</CardTitle>
            </CardHeader>
            <CardBody>
              <div
                className='table-full-width table-responsive'
                style={{ height: '480px' }}
              >
                {documents.length ? (
                  <Table className='document-table'>
                    <tbody>
                      {documents.map((item, i) => (
                        <tr key={i}>
                          <td style={{ width: '27px' }}>
                            <i className='fa fa-file-alt'></i>
                          </td>
                          <td>{item.document.name}</td>
                          <td
                            style={{ textAlign: 'right' }}
                            className='position-relative'
                          >
                            <div className='d-inline'>
                              {downloadDocumentLoading.loading &&
                              downloadDocumentLoading.index === i ? (
                                <div className='download-document-loading'>
                                  Downloading...
                                </div>
                              ) : (
                                ''
                              )}
                              <a
                                id={'dwnldLnk' + i}
                                href={'data:image/png;base64,' + item.base64}
                                download={item.document.name}
                                style={{ display: 'none' }}
                              >
                                Downloading
                              </a>
                              <button
                                style={{ outline: 'none' }}
                                disabled={downloadDocumentLoading.loading}
                                onClick={(e) => downloadDocument(e, item, i)}
                                className='btn-icon btn-link like'
                              >
                                <i className='tim-icons icon-attach-87' />
                              </button>
                            </div>

                            <Button
                              color='danger'
                              size='sm'
                              className='btn-icon btn-link like'
                              disabled={downloadDocumentLoading.loading}
                              onClick={(e) => openDeleteModal(e, item)}
                            >
                              <i className='tim-icons icon-trash-simple' />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <Modal isOpen={modal} toggle={toggle} className={className}>
                      <ModalHeader toggle={toggle}>
                        <i
                          className='tim-icons icon-alert-circle-exc mr-2'
                          style={{ fontSize: '20px' }}
                        ></i>
                        Delete Document
                      </ModalHeader>
                      <ModalBody>
                        <p>
                          Are you sure you want to delete the document? The
                          document will be deleted immediately. You can't undo
                          this action.
                        </p>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color='primary'
                          onClick={deleteDocument}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>{' '}
                        <Button color='secondary' onClick={toggle}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </Table>
                ) : (
                  <div>There are no available documents</div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row> 
    </div>
  );
};

export default withRouter(ViewProject);
