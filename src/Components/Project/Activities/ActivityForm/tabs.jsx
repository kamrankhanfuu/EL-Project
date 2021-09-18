import * as React from "react";
// reactstrap components
import ReactWizard from "react-bootstrap-wizard";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Api from "Helpers/Api";
import Swal from "sweetalert2";
import { RECURRENCE_TYPES } from "Helpers/constants";
import { Spinner } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const generateWeekDays = () =>
  weekDays.map((day, idx) => ({ label: day, value: idx, isChecked: false }));

const ActivityTabs = (props) => {
  const [state, setState] = React.useState({
    recurrence: "",
    recurrenceType: "",
    startDate: "",
    endDate: "",
    recurrenceState: "",
    recurrenceTypeState: "",
    weekdaysState: "",
    startDateState: "",
    endDateState: "",
    startTimeState: "",
    endTimeState: "",
    allWeekDays: generateWeekDays(),
    isCreating: false,
    isWeekDayChanged: false,
  });
  const history = useHistory();
  const match = useParams();
  const { id, activityId } = match;

  const handleChange = (value, stateName) => {
    let stateVal = "has-danger";
    if (value) stateVal = "has-succes";
    
    if(value === 'One Time' && state.isWeekDayChanged === true){
      setState((prev) => ({
        ...prev,
        isWeekDayChanged: false,
      }));
    }

    const { recurrence } = state;
    if (recurrence === "One Time" && stateName === "startDate")
      setState((prev) => ({
        ...prev,
        endDate: value,
        endDateState: stateVal,
      }));

    setState((prev) => ({
      ...prev,
      [stateName]: value,
      [stateName + "State"]: stateVal,
    }));
  };

  const handleCheckboxs = (event) => {
    let allWeekDays = state.allWeekDays;
    let weekdaysState = "has-danger";
    allWeekDays.forEach((week) => {
      if (week.value === parseInt(event.target.value))
        week.isChecked = event.target.checked;
    });
    // one checkbox should be checked
    const anyChecked = allWeekDays.filter((w) => w.isChecked);
    if (anyChecked.length) weekdaysState = "has-succes";

    setState((prev) => ({
      ...prev,
      allWeekDays,
      weekdaysState,
      isWeekDayChanged: true,
    }));
  };

  const toggleWeekChanged = () => {
    setState((prev) => ({
      ...prev,
      isWeekDayChanged: false,
    }));
  };

  React.useEffect(() => {
    let { isOnetime, recurrenceType, activityDates, recurrenceDaysList } =
      props.activityDetails;

    // Default week days selected
    const allWeekDays = state.allWeekDays;
    let weekDays = recurrenceDaysList ? recurrenceDaysList.split(",") : [];
    allWeekDays.map((w) => {
      let selected = weekDays.filter((a) => parseInt(a) === w.value)[0];
      if (selected) w.isChecked = true;
      return w;
    });

    setState((prev) => ({
      ...prev,
      recurrence: isOnetime ? "One Time" : "Recurring",
      recurrenceType: RECURRENCE_TYPES.filter(
        (r) => r.value === recurrenceType
      )[0],
      startDate:
        activityDates && activityDates.length > 0
          ? activityDates[0].startDate
          : "",
      endDate:
        activityDates && activityDates.length > 0
          ? activityDates[activityDates.length - 1].endDate
          : "",
    }));
  }, [props.activityDetails, state.allWeekDays]);

  const handleCancelClick = () => history.goBack();

  const handleEditProjectActivity = async (values) => {
    try {
      // Append required id's
      values.id = window.atob(activityId);

      await Api.editActivity(values);
      Swal.fire({
        icon: "success",
        title: "Project activity edited successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  const handleAddProjectActivity = async (values) => {
    try {
      values.createdBy = props.userId;
      await Api.addActivity(values);
      Swal.fire({
        icon: "success",
        title: "Project activity added successfully!",
      }).then(() => handleCancelClick());
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  const apiPayload = (values) => {
    // Modify fields as per endpoint
    const { activityDetails } = props;
    const assignedStaff = values.assignedStaff.map((staff) => {
      return {
        activityId: activityDetails ? activityDetails.id : null,
        userId: staff.id,
      };
    });
    const selectedeDays = values.allWeekDays.filter((w) => w.isChecked);
    const recurrenceDays = selectedeDays.map((d) => d.value);
    const organizationIds = values.organizationIds.map((org) => org.value);
    const recurrenceType = values.recurrenceType
      ? values.recurrenceType.value
      : 0;

    return {
      projectId: window.atob(id),
      organizationIds,
      name: values.name,
      description: values.description,
      location: values.location,
      color: values.color,
      isOnetime: values.recurrence === "One Time",
      minAttendees: values.minAttendees,
      maxAttendees: values.maxAttendees,
      isRecurring: true,
      recurrenceType,
      recurrenceDaysList: recurrenceDays.toString(),
      activityDates: values.recurrenceDates,
      assignedStaff,
      type: values.type.value,
    };
  };

  const handleSubmit = async (values) => {
    try {
      const data = await apiPayload(values);

      if (activityId) {
        await handleEditProjectActivity(data);
      } else {
        await handleAddProjectActivity(data);
      }
      setState((prev) => ({
        ...prev,
        isCreating: false,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const finishButtonClick = (allStates) => {
    setState((prev) => ({ ...prev, isCreating: true }));
    handleSubmit({
      ...allStates["Activity Form"],
      ...state,
      ...allStates["Activity Dates"],
    });
  };

  const { title } = props;
  const { isCreating } = state;
  const steps = [
    {
      stepName: "Activity Form",
      stepIcon: "tim-icons icon-single-02",
      component: Step1,
      stepProps: {
        ...props,
        match,
      },
    },
    {
      stepName: "Recurrence",
      stepIcon: "tim-icons icon-settings-gear-63",
      component: Step2,
      stepProps: {
        ...props,
        ...state,
        handleChange: handleChange,
        handleCheckboxs: handleCheckboxs,
        match,
      },
    },
    {
      stepName: "Activity Dates",
      stepIcon: "tim-icons icon-delivery-fast",
      component: Step3,
      stepProps: {
        ...props,
        ...state,
        toggleWeekChanged: toggleWeekChanged,
      },
    },
  ];

  return (
    <ReactWizard
      steps={steps}
      navSteps
      validate={true}
      title={title}
      headerTextCenter
      finishButtonClasses={`btn-wd btn-info ${isCreating ? "disabled" : ""}`}
      nextButtonClasses="btn-wd btn-info"
      previousButtonClasses="btn-wd"
      progressbar
      color="blue"
      finishButtonText={
        <span className="d-flex">
          {activityId ? "Update" : "Create"}
          {isCreating && <Spinner size="sm" className="ml-2 p-1" />}
        </span>
      }
      finishButtonClick={finishButtonClick}
    />
  );
};

export default ActivityTabs;
