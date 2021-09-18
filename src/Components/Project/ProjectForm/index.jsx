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
  Label,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import { errorMessage } from "Helpers/Validation";
import { initialValues, validationSchema } from "./validation";
import { URL_PROJECT } from "Helpers/urls";
import { Input, Select, DatePicker } from "Components/Common/Form/elements";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import Api from "Helpers/Api";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { isEmpty } from "Helpers/utils";

const ProjectForm = (props) => {
  const { className } = props;
  const { id } = props.match.params;
  const [projectDetails, setProjectDetails] = useState({});
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocument] = useState([]);
  const [documentsModel, setDocumentsModel] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);  
  const toggle = () => setModal(!modal);
  const [modal, setModal] = useState(false);
  const [deletedDocument, setDeletedDocument] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [downloadDocumentLoading, setDownloadDocumentLoading] = useState({
    loading: false,
    index: null,
  });

  let isEdit = false;

  const getLastItem = props.match.url.substring(props.match.url.lastIndexOf('/') + 1)
  if(getLastItem === 'edit'){
    isEdit = true;
  }

  const handleCancelClick = () => props.history.push(URL_PROJECT);

  const handleEditProject = async (values) => {
    try {
      // Append required id's
      values.id = projectDetails.id;
      values.createdDate = projectDetails.createdDate;
      values.createdBy = projectDetails.createdBy;

      await Api.editProject(values);
      Swal.fire({
        icon: "success",
        title: "Project edited successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    } finally {
      setLoading(false);
    }
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
 
  const openDeleteModal = (e, document) => {
    toggle();
    setDeletedDocument(document);
  };

  const handleAddProject = async (values) => {
    try {
      await Api.addProject(values);
      Swal.fire({
        icon: "success",
        title: "Project added successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    // Modify Select values
    values.primaryOrganizationGuid = values.primaryOrganizationGuid.id;
    if (id) return handleEditProject(values);
    return handleAddProject(values);
  };

  const getProjectDetails = async () => {
    try {
      if (id) {
        const result = await Api.getProjectDetails(window.atob(id));
        result.projectOrganizations.map((org) => {
          org.id = org.organizationId;
          org.name = org.organization.name;
          if (org.organizationId === result.primaryOrganizationGuid)
            result.primaryOrganizationGuid = org;
          return org;
        });
        setProjectDetails(result);
      }
    } catch (error) {
      console.error("getProjectDetails -> error", error);
    }
  };

  const getOrganizations = async () => {
    try {
      const result = await Api.getOrganizations({
        userId: props.userId,
      });

      setOrganizations(result);
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  const getProjectData = async () => {
    await Promise.all([getProjectDetails(), getOrganizations()]);
  };

  const getInitData = async () => {
    setLoading(true);
    await Promise.all([getProjectDetails(), getDocument()]);
    setLoading(false);
  };
  
  useEffect(() => {
    getProjectData();
    getInitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleFileInputChange = (e) => {
    let files = e.target.files;
    let data = [];

    for (const [key, value] of Object.entries(files)) {
      getBase64(value)
        .then((result) => {
          value['base64'] = result;
          data.push({
            name: value.name,
            data: value.base64.split(',')[1],
          });
        })
        .catch((err) => {
          console.error(key, err);
        });
    }
    setDocumentsModel(data);
  };

  const getDocument = async () => {
    try {
      const result = await Api.getProjectDocument(window.atob(id));
      setDocument(result.reverse());
    } catch (error) {
      console.error('getProjectDetails -> error', error);
    }
  };

  const uploadFiles = async () => {
    if (documentsModel.length) {
      let file = document.getElementById('file');
      setUploadLoading(true);
      try {
        await Api.addProjectDocument({
          projectId: window.atob(id),
          documentsModel: documentsModel,
        });
        getDocument();
        file.value = '';
        setUploadLoading(false);
      } catch (error) {
        file.value = '';
        console.error('deleteDocument -> error', error);
        setUploadLoading(false);
      }
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md={isEdit ? 6 : 12}>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues(projectDetails)}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, errors, touched, setFieldValue, values }) => {
              const labelClasses = (name) =>
                classnames("has-label", {
                  "has-danger": errors[name] && touched[name],
                });
              return (
                <FormikForm onSubmit={handleSubmit} id="RegisterValidation">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Project Form</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormGroup className={labelClasses("name")}>
                        <label>Name</label>
                        <Field component={Input} name="name" maxLength={80} />
                        {errorMessage("name")}
                      </FormGroup>
                      <FormGroup className={labelClasses("description")}>
                        <label>Description</label>
                        <Field
                          type="textarea"
                          component={Input}
                          name="description"
                          maxLength={5000}
                        />
                        {errorMessage("description")}
                      </FormGroup>
                      <FormGroup
                        className={labelClasses("primaryOrganizationGuid")}
                      >
                        <label>Primary Organization</label>
                        <Field
                          component={Select}
                          className="react-select info form-control"
                          classNamePrefix="react-select"
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          name="primaryOrganizationGuid"
                          options={
                            isEmpty(projectDetails)
                              ? organizations
                              : projectDetails.projectOrganizations
                          }
                        />
                        {errorMessage("primaryOrganizationGuid")}
                      </FormGroup>
                      <Row>
                        <Col md={6}>
                          <FormGroup className={labelClasses("startDate")}>
                            <label>Start Date</label>
                            <Field component={DatePicker} name="startDate" />
                            {errorMessage("startDate")}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className={labelClasses("endDate")}>
                            <label>End Date</label>
                            <Field component={DatePicker} name="endDate" />
                            {errorMessage("endDate")}
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup
                        check
                        className={"mt-3 " + labelClasses("isPublic")}
                      >
                        <Label check>
                          <Field
                            type="checkbox"
                            component={Input}
                            name="isPublic"
                          />
                          <span className="form-check-sign" />
                          Is this a public project?
                        </Label>
                        {errorMessage("isPublic")}
                      </FormGroup>
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
       {isEdit && (
        <Col md="6">
          <Card>
            <CardHeader>
              <CardTitle tag='h4'>Upload Documents</CardTitle>
            </CardHeader>
            <CardBody className='d-flex align-items-center justify-content-between'>
              <input
                type='file'
                id='file'
                name='file'
                multiple
                onChange={handleFileInputChange}
              />
              <Button
                color='primary'
                onClick={uploadFiles}
                disabled={uploadLoading}
              >
                {uploadLoading ? 'Loading...' : 'Upload'}
              </Button>
            </CardBody>
          </Card>
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
                style={{ height: '450px' }}
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
                  <div>There is no documents</div>
                )}
              </div>
            </CardBody>
          </Card>

        </Col>
       )} 

      </Row>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(ProjectForm));
