import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, Button } from 'reactstrap';
import { connect } from 'react-redux';
import Api from 'Helpers/Api';
import { decodeId } from 'Helpers/utils';
import ReactSelect from "react-select";
import NotesGrid from "./notes"
import { option } from 'yargs';

const Notes = (props) => {
    const [orgId, setOrgId] = useState();
    const [participantId, setparticipantId] = useState(decodeId(props.match.params.participantId));
    const [orgProjects, setOrgProjects] = useState([]);    
    const [projectNotes, setprojectNotes] = useState([]);
    const [participantName, setParticipantName] = useState();
    const [selection, setSelection] = useState();
    const [projectIds, setProjectIds] = useState([]);
    const [projectsInfo, setProjects] = useState([]);  

    let scroll = 0;
    
    const getParticipantInfo = async() => {
        try
        {
            const info = await Api.getUser(participantId);
            setParticipantName(info.model.userName);
        }
        catch(error)
        {
            console.log(error);
        }
    } 

    const getOrganizationProjects = async() => {
        try{
            const result = await Api.getProjectByParticipant(participantId);
            if(result.length > 0)
            {     
                if(props.match.params.projectId)
                {
                    const projectById = await Api.getProjectDetails(decodeId(props.match.params.projectId));
                    if(exists(projectById, result) === false)
                    result.unshift(projectById);
                } 
                const projects = [];         
                result.map((project) => {
                    projects.push({
                        label: project.name,
                        value: project.id,
                    });
                    projectIds.push(project.id);
                });
                setOrgProjects(projects);
                setProjects(result);
                setOrgId(result[0].primaryOrganizationGuid);                
                setSelection(projects[0]);
                if(projectIds.length > 0)
                getNotesByProjectAndOrganizationId(participantId, projectIds[0], result[0].primaryOrganizationGuid);
            } 
        }
        catch(error)
        {
            console.log(error);
        }
    } 

    const getNotesByProjectAndOrganizationId = async (participantId, projectId, orgId) => {
        try
        {
            const result = await Api.getNotesByProjectAndOrganizationId(participantId, projectId, orgId);
            setprojectNotes(result);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    useEffect(() => {
        getOrganizationProjects();  
        if(orgId) getParticipantInfo();
    }, [orgId]);
 
    const handleChange = (option) => {
        setSelection(option);
        let org_Id = projectsInfo.find((p) => p.id == option.value).primaryOrganizationGuid;
        getNotesByProjectAndOrganizationId(participantId, option.value, org_Id);
    };

    const getscroll = async () => {
        var div = document.getElementById('scrollDiv');
        var st = div.scrollTop;
        if (st >= scroll){
            if (div.offsetHeight + div.scrollTop >= div.scrollHeight) {
                const lastRecordDate = projectNotes[projectNotes.length-1].createdDate; 
                const result = await Api.getNotesByDate(participantId, selection.value, orgId, lastRecordDate);
                if(result.length !== 0)
                {
                    let notes = [];
                    projectNotes.map((note) => notes.push(note));
                    result.map((note) => notes.push(note));
                    setprojectNotes(notes);
                } 
            }            
        }
        scroll = st <= 0 ? 0 : st;
    }
    
    return (
        <div className='content'>
          <Card>
            <CardHeader>
              <CardTitle tag='h4' className='float-left'>
                User Notes
              </CardTitle>              
            </CardHeader>
            <CardBody>   
            <div className='col-md-3 mr-3'>
                <label>Projects:</label>
                {orgProjects.length == 0 ? <></> :  
                    <ReactSelect
                        onChange={(option) => handleChange(option)}
                        className="react-select react-select-primary"
                        classNamePrefix="react-select"
                        name="projectSelection"
                        defaultValue={orgProjects[0]}
                        options={orgProjects}
                    />
                }
              </div>                     
              <div className="container w-100" >
                <hr className="w-100 bg-light"/>
                <div id='scrollDiv' onScroll={getscroll} style={{maxHeight:300, overflowY:"scroll", overflowX:"hidden"}}>
                    {projectNotes.map((note) => <NotesGrid key={note.id} noteObject={note} participant={participantName} />)}
                </div>                    
              </div>
            </CardBody>
          </Card>
        </div>
      );
}

function exists(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id === obj.id) {
            return true;
        }
    }    
    return false;
}
const mapReduxStateToProps = (state) => ({
    user: state.auth.user,
    userId: state.auth.userId,
  });
export default connect(mapReduxStateToProps)(withRouter(Notes));