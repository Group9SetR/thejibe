import React, { Component } from 'react';
import Modal from 'react-modal';
import Modal2 from 'react-modal';

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
            modalIsOpen: false,
            modalIsOpen2: false
        };
        this.timer = null;
        this.log_time = this.log_time.bind(this);
        this.handle_logTimeSubmit = this.handle_logTimeSubmit.bind(this);
        this.get_hours = this.get_hours.bind(this);
        this.get_minutes = this.get_minutes.bind(this);
        this.get_seconds = this.get_seconds.bind(this);
        this.handle_start = this.handle_start.bind(this);
        this.handle_pause = this.handle_pause.bind(this);
        this.handle_clear = this.handle_clear.bind(this);
        this.handle_descChange = this.handle_descChange.bind(this);
        this.handle_logTimeSubmit = this.handle_logTimeSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openModal2 = this.openModal2.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.afterOpenModal2 = this.afterOpenModal2.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    log_time(id, description) {
        this.handle_pause();
        var key = "twp_29i8q9BH4BGyLykU4jSMZVkj1OnI";
        var base64 = new Buffer(key + ":xxx").toString("base64");
        var date = new Date();
        var hours = this.get_hours();
        var minutes = this.get_minutes();
        var entry = {
            "time-entry": {
                "description": "Testing Dates",
                "person-id": auth_id,
                "date": date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2),
                "time": date.getHours() + ":" + date.getMinutes(),
                "hours": hours,
                "minutes": minutes,
                "isbillable": "1"
            }
        };

        console.log('id passed ' + id);
        console.log('person-id ' + auth_id);
        console.log("hours:" + this.get_hours() + "  minutes:" + this.get_minutes() + "  seconds:" + this.get_seconds() + "  = logged time");
        console.log('date  ' + date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2));
        console.log('time  ' + date.getHours() + ":" + date.getMinutes());
        console.log(entry);

        if (minutes > 0) {
            $.ajax({
                url: 'https://thejibe.teamwork.com/tasks/' + id + '/time_entries.json',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(entry),
                success: function(data) {
                    // clear current timer
                    clearInterval(this.timer);
                    this.setState({
                        seconds: 0
                    });
                    console.log("time logged");
                },
                error: function() { console.log('GET request to time totals failed'); },
                beforeSend: setHeader
            });

            function setHeader(xhr) {
                xhr.setRequestHeader('Authorization', 'BASIC ' + base64);
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
        } else {
            alert('Cannot log time for under a minute');
        }
    }

    get_hours() {
        let hours = Math.floor(this.state.seconds / 3600)
        return ("0" + hours).slice(-2);
    }

    get_minutes() {
        let minutes = Math.floor(this.state.seconds / 60)
        return ("0" + minutes).slice(-2);
    }
    get_seconds() {
        let seconds = Math.floor(this.state.seconds % 60)
        return ("0" + seconds).slice(-2);
    }

    handle_start() {
        this.timer = setInterval( () =>
                this.setState({
                    seconds: this.state.seconds + 1
                })
            , 1000);
    }

    handle_pause() {
        clearInterval(this.timer);
    }

    handle_clear() {
        clearInterval(this.timer);
        this.setState({
            seconds: 0
        });
    }

    handle_descChange(event) {
        this.setState({value: event.target.value});
    }

    handle_logTimeSubmit() {
        // send to teamwork?
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }
    openModal2(){
        this.setState({modalIsOpen2: true});
    }

    afterOpenModal() {


    }
    afterOpenModal2() {


    }

    closeModal() {
        this.setState({modalIsOpen: false});
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
                                <button onClick={this.handle_start} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-play" aria-hidden="true"></span>
                                </button>
                                <button onClick={this.handle_pause} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-pause" aria-hidden="true"></span>
                                </button>
                                <button onClick={this.handle_clear} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-stop" aria-hidden="true"></span>
                                </button>
                                &nbsp;
                                {this.get_hours()}:{this.get_minutes()}:{this.get_seconds()}
                                <a className="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne"></a>
                                </div>
                            </h4>
                        </div>
                        <div id="collapseOne" className="panel-body panel-collapse collapse">
                            <div >
                                <form onSubmit={this.handle_logTimeSubmit}>
                                    <div className="form-group">
                                        <textarea name="description" placeholder="Optional Description"className="form-control" value="" onChange={this.handle_descChange} rows="2"/>
                                        <br/>
                                        <span className="pull-left">
                                                <input name="billable" type="checkbox"/>&nbsp;Billable
                                        </span>
                                    </div>
                                    <br/>
                                    <Modal
                                        isOpen={this.state.modalIsOpen}
                                        onAfterOpen={this.afterOpenModal}
                                        onRequestClose={this.closeModal}
                                        style={customStyles}
                                        contentLabel=" Modal"
                                    >
                                        <div className ="modalContainer">
                                            <div className="modalHeader">
                                                <h3 className="col-sm-7" style={{"float":"left"}}>Log This Time?</h3>
                                                <button className="col-sm-1 btn btn-default" id ="closeBtn" style={{"float":"right"}}
                                                        onClick={this.closeModal}><strong>X</strong></button>
                                            </div>
                                            <div className="modalSection">
                                                <p className="modalcontent">Are you sure you want to stop this timer and log the time?</p>
                                                <div className="modalFooter">
                                                <button className="col-sm-3 btn btn-default" id ="closeBtn" style={{"float":"left"}}
                                                        onClick={this.closeModal}>Cancel</button>
                                                <button onClick={this.log_time.bind(this, current.id)} className="col-sm-3 btn btn-success" id ="closeBtn" style={{"float":"right"}}
                                                        >Ok</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>

                                    <Modal2
                                        isOpen={this.state.modalIsOpen2}
                                        onAfterOpen={this.afterOpenModal2}
                                        onRequestClose={this.closeModal}
                                        style={customStyles}
                                        contentLabel=" Modal2"
                                    >
                                        <div className ="modalContainer">
                                            <div className="modalHeader">
                                                <h3 className="col-sm-7" style={{"float":"left"}}>Are you sure?</h3>
                                                <button className="col-sm-1 btn btn-default" id ="closeBtn" style={{"float":"right"}}
                                                        onClick={this.closeModal}><strong>X</strong></button>
                                            </div>
                                            <div className="modalSection">
                                                <p className="modalcontent">Are you sure you want to cancel this timer and time?</p>
                                                <div className="modalFooter">
                                                    <button className="col-sm-3 btn btn-default" id ="closeBtn" style={{"float":"left"}}
                                                            onClick={this.closeModal}>Cancel</button>
                                                    <button className="col-sm-3 btn btn-success" id ="closeBtn" style={{"float":"right"}}
                                                    >Ok</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal2>
                                </form>
                                <button className="btn btn-success openTimerConfirmModal col-sm-4" onClick={this.openModal}>
                                    Log Time
                                </button>
                                <button className="btn btn-danger pull-right" onClick={this.openModal2}>
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
