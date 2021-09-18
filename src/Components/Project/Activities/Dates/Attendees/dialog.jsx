import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { initialValues, validationSchema } from "./validation";
import classnames from "classnames"; 
import {
  Button,
  FormGroup,
  Spinner,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Input } from "Components/Common/Form/elements";
import { errorMessage } from "Helpers/Validation";
import Api from "Helpers/Api";
import Swal from "sweetalert2";
import { decodeId } from "Helpers/utils";
import { Link } from 'react-router-dom';
import { encodeId } from 'Helpers/utils';
const noteScroll = {
  width: '100%',
  maxHeight: '200px',
  overflowY: 'auto',
  border: '1px solid #ccc',
  padding: '10px'
}

const AttendeeModal = (props) => {
  const [notes, setNotes] = useState("");
  const {
    toggle,
    data: { name, participantNotesId, isOpen, participantId, activityDatesId, projectId, organizationId },
  } = props;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await Api.saveAttendeeNotes({
        id: participantNotesId || "00000000-0000-0000-0000-000000000000",
        participantId: participantId,
        activityDatesId: activityDatesId,
        note: values.notes,
        projectId: projectId,
        organizationId: decodeId(organizationId)
      });
      setNotes(values.note);
      Swal.fire({
        icon: "success",
        title: "Mark as Attendee successfully!",
      });
      toggle();
    } catch (error) {
      console.error("error", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getNotes = async () => {
    try {
      const result = await Api.getAttendeeNotes({
        participantNotesId,
      });
      setNotes(result.note);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (participantNotesId) getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantNotesId]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{name}</ModalHeader>
      <ModalBody>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, errors, touched, isSubmitting }) => {
            const labelClasses = (name) =>
              classnames("has-label", {
                "has-danger": errors[name] && touched[name],
              });
            return (
              <FormikForm onSubmit={handleSubmit}>
                <FormGroup
                  check
                  className={"mb-2 pl-0 " + labelClasses("isAttendee")}
                >
                  <Label check className="text-secondary">
                    <Field
                      type="checkbox"
                      component={Input}
                      name="isAttendee"
                    />
                    <span className="form-check-sign" />
                    Check if participant attended
                  </Label>
                  {errorMessage("isAttendee")}
                </FormGroup>
                <FormGroup className={labelClasses("notes")}>
                  <label>Notes</label>
                  <Field
                    type="textarea"
                    component={Input}
                    name="notes"
                    maxLength={1000}
                    rows="4"
                    className="text-secondary horizontal-scroll"
                  />
                  {errorMessage("notes")}
                </FormGroup>
                <FormGroup
                  className={"mb-2 pl-0 " + labelClasses("isAttendee")}
                >
                  <Label className="text-secondary">Previous note:</Label>
                  <Link style={{float:'right'}} to={{pathname: `/project/${window.btoa(projectId)}/participant/${encodeId(participantId)}/notes`}}>
                      <span>View all notes</span> 
                  </Link>
                  <div style={noteScroll}>
                    <p style={{whiteSpace: 'break-spaces', lineHeight: '1.2'}}>{notes}</p>
                  </div>
                </FormGroup>
                <div className="text-center">
                  <Button color="default mr-3" onClick={toggle}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" disabled={isSubmitting}>
                    Add
                    {isSubmitting && <Spinner size="sm" className="ml-2" />}
                  </Button>
                </div>
              </FormikForm>
            );
          }}
        </Formik>
      </ModalBody>
    </Modal>
  );
};

export default AttendeeModal;
