import React, { Component } from 'react';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        height                : '204px',
        width                 : '430px',
        padding               : '0px',
        margin                : '0px',
    }
};

export default class Timer extends Component {

    constructor(props) {
        super(props);
        this.state={
            current: [],
            seconds: 0,
            logtimeModalOpen: false,
            deleteModalOpen: false,
        };
        this.timer = null;
        this.logTime = this.logTime.bind(this);
        this.getHours = this.getHours.bind(this);
        this.getMinutes = this.getMinutes.bind(this);
        this.getSeconds = this.getSeconds.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.logtimeModalOpen = this.logtimeModalOpen.bind(this);
        this.deleteModalOpen = this.deleteModalOpen.bind(this);
        this.logtimeModalClose = this.logtimeModalClose.bind(this);
        this.deleteModalClose = this.deleteModalClose.bind(this);
        this.deleteTimer = this.deleteTimer.bind(this);
    }

    /**
     * Logs time under the task with the provided id
     */
    logTime(id) {
        var self = this;
        var key = auth_api_token;
        var base64 = new Buffer(key + ":xxx").toString("base64");
        var date = new Date();
        var hours = this.getHours();
        var minutes = this.getMinutes();
        var description = $('#timerDescription').val();
        var billable = $('#timerBillable').prop('checked') ? "1" : "0";
        if (minutes == '00') {
            minutes = '01';
        }

        // Checks to see if Complete Task is ticked, if so completeTask is called which completes the task
        if(document.getElementById('timerComplete').checked) {
            this.completeTask(id);
        }
        var entry = {
            "time-entry": {
                "description": description,
                "person-id": auth_id,
                "date": date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2),
                "time": date.getHours() + ":" + date.getMinutes(),
                "hours": hours,
                "minutes": minutes,
                "isbillable": billable
            }
        };

        $.ajax({
            url: 'https://thejibe.teamwork.com/tasks/' + id + '/time_entries.json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(entry),
            success: function(data) {
                self.handleClear();
                self.logtimeModalClose();
                $('#timerDescription').val('');
                $('#timerBillable').prop('checked', true);
                $('.logtimer').css('visibility', 'hidden');
                $('.timerBtn').removeAttr('disabled');
            },
            error: function() { console.log('POST request to time tracking failed'); },
            beforeSend: setHeader
        });

        function setHeader(xhr) {
            xhr.setRequestHeader('Authorization', 'BASIC ' + base64);
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
    }

    getHours() {
        let hours = Math.floor(this.state.seconds / 3600)
        return ("0" + hours).slice(-2);
    }
    getMinutes() {
        let minutes = Math.floor(this.state.seconds / 60)
        return ("0" + minutes).slice(-2);
    }
    getSeconds() {
        let seconds = Math.floor(this.state.seconds % 60)
        return ("0" + seconds).slice(-2);
    }

    handleStart() {
        this.timer = setInterval( () =>
                this.setState({
                    seconds: this.state.seconds + 1
                })
            , 1000);
        $('#startBtn').attr('disabled', true);
    }
    handlePause() {
        clearInterval(this.timer);
        $('#startBtn').removeAttr('disabled');
    }
    handleClear() {
        clearInterval(this.timer);
        this.setState({
            seconds: 0
        });
        $('#startBtn').removeAttr('disabled');
    }

    logtimeModalOpen() {
        this.handlePause();
        this.setState({logtimeModalOpen: true});
    }
    deleteModalOpen() {
        this.handlePause();
        this.setState({deleteModalOpen: true});
    }
    logtimeModalClose() {
        this.setState({logtimeModalOpen: false});
    }
    deleteModalClose() {
        this.setState({deleteModalOpen: false});
    }

    deleteTimer() {
        this.handleClear();
        this.deleteModalClose();
        $('#timerDescription').val('');
        $('#timerBillable').prop('checked', true);
        $('.logtimer').css('visibility', 'hidden');
        $('.timerBtn').removeAttr('disabled');
    }

    /**
     *  Completes task with the provided id
     */
    completeTask(id) {
        fetch('https://thejibe.teamwork.com/tasks/' + id + '/complete.json', this.putHeader());
    }

    /**
     * Basic header for PUT requests
     */
    putHeader() {
        var key = auth_api_token;
        var base64 = new Buffer(key+":xxx").toString("base64");
        var obj = {
            method:"PUT",
            dataType: 'json',
            headers: {
                'Authorization': 'BASIC '+base64,
                'Content-Type': 'application/json'
            }
        };
        return obj;
    }

    render() {
        if(Array.isArray(this.props.timer) && !this.props.timer.length) {
            return (<div></div>);
        }
        var current = this.props.timer;
        return (
            <div className="logtimer" style={{visibility: 'visible', position: 'sticky', width: 300 + 'px', bottom: 0}} value={current.id}>
                <div className="panel-group" id="accordion">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <div className="panelTitle">
                                <p id="panelTask">Task : { current.content }</p>
                                </div>
                                <div className="timerDiv">
                                <button id='startBtn' onClick={this.handleStart} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-play" aria-hidden="true"></span>
                                </button>
                                <button id='pauseBtn' onClick={this.handlePause} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-pause" aria-hidden="true"></span>
                                </button>
                                <button id='stopBtn' onClick={this.handleClear} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-stop" aria-hidden="true"></span>
                                </button>
                                &nbsp;
                                {this.getHours()}:{this.getMinutes()}:{this.getSeconds()}
                                    <a data-toggle="collapse" href="#taskCollapseBtn"
                                       aria-expanded="false" aria-controls="collapseExample">
                                        <i className="fa fa-chevron-up pull-right"></i>
                                        <i className="fa fa-chevron-down pull-right"></i>
                                    </a>


                                </div>

                            </h4>
                        </div>
                        <div id="taskCollapseBtn" className="panel-body panel-collapse collapse">
                            <div>
                                <div className="form-group">
                                    <textarea id="timerDescription" name="description" placeholder="Optional Description" className="form-control" defaultValue="" rows="2"/>
                                    <br/>
                                    <div id ="billable_completeBtn">
                                        <span className="pull-left">
                                            <input id="timerBillable" name="billable" type="checkbox" defaultChecked="true"/>&nbsp;Billable
                                        </span>
                                        <span className="pull-right">
                                            <input id="timerComplete" name="complete" type="checkbox" defaultChecked="true"/>&nbsp;Complete Task
                                        </span>
                                     </div>

                                </div>
                                <br/>
                                <Modal
                                    isOpen={this.state.logtimeModalOpen}
                                    onAfterOpen={this.afterLogtimeModalOpen}
                                    onRequestClose={this.logtimeModalClose}
                                    style={customStyles}
                                    contentLabel=" Modal"
                                >
                                    <div className ="modalContainer">
                                        <div className="modalHeader">
                                            <h3 className="col-sm-7" style={{"float":"left"}}>Log This Time?</h3>
                                            <button className="col-sm-1 btn btn-default" id ="closeBtn" style={{"float":"right"}}
                                                    onClick={this.logtimeModalClose}><strong>X</strong></button>
                                        </div>
                                        <div className="modalSection">
                                            <p className="modalcontent">Are you sure you want to stop this timer and log the time?</p>
                                            <div className="modalFooter">
                                            <button className="col-sm-3 btn btn-default"  id ="closeBtn" style={{"float":"left"}}
                                                    onClick={this.logtimeModalClose}>Cancel</button>
                                            <button onClick={this.logTime.bind(this, current.id)} className="col-sm-3 btn btn-success" id ="closeBtn" style={{"float":"right"}}
                                                    >Ok</button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>

                                <Modal
                                    isOpen={this.state.deleteModalOpen}
                                    onAfterOpen={this.afterDeleteModalOpen}
                                    onRequestClose={this.deleteModalClose}
                                    style={customStyles}
                                    contentLabel=" Modal2"
                                >
                                    <div className ="modalContainer">
                                        <div className="modalHeader">
                                            <h3 className="col-sm-7" style={{"float":"left"}}>Are you sure?</h3>
                                            <button className="col-sm-1 btn btn-default" id ="closeBtn" style={{"float":"right"}}
                                                    onClick={this.deleteModalClose}><strong>X</strong></button>
                                        </div>
                                        <div className="modalSection">
                                            <p className="modalcontent">Are you sure you want to cancel this timer and time?</p>
                                            <div className="modalFooter">
                                                <button className="col-sm-3 btn btn-default" id ="closeBtn" style={{"float":"left"}}
                                                        onClick={this.deleteModalClose}>Cancel</button>
                                                <button onClick={this.deleteTimer} className="col-sm-3 btn btn-danger" id ="closeBtn" style={{"float":"right"}}>
                                                    Ok
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                                <button className="btn btn-success openTimerConfirmModal col-sm-4" onClick={this.logtimeModalOpen}>
                                    Log Time
                                </button>
                                <button className="btn btn-danger pull-right" onClick={this.deleteModalOpen}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
