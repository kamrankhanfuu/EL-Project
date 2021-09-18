import React, { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, Button } from 'reactstrap';
import { connect } from 'react-redux';
import ReactSelect from "react-select";
import moment from 'moment';
const NotesGrid = (props) => {

    const [noteDate, setNoteDate] = useState();
    const [noteWriter, setNoteWriter] = useState();
    const [noteText, setNoteText] = useState();
    
    useEffect(() => {        
        setNoteDate(moment(props.noteObject.createdDate).format('MMMM DD, YYYY'));
        setNoteText(props.noteObject.note);
        setNoteWriter(props.participant);
    },[]); 

    return (
        <>
        <div className="row">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-auto col-sm-3">
                        <label className="text text-uppercase text-white">{noteWriter}</label>
                    </div>
                    <div className="col-md-2 col-sm-3">
                    <label className="text text-bold">{noteDate}</label>
                    </div>
                </div>
            </div>
            <div className="col-md-12">
                <div className="mt-2 row col-md-12">
                    <p>{props.noteObject.note}</p>                    
                </div>
            </div>
        </div>
        <hr className="w-100" />
        </>
    );
}

const mapReduxStateToProps = (state) => ({
    user: state.auth.user,
    userId: state.auth.userId,
  });
export default connect(mapReduxStateToProps)(withRouter(NotesGrid));