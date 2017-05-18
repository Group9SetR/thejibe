import React, { Component } from 'react';

export default class Timer extends Component {

    constructor(props) {
        super(props);
        this.state={
            current: [],
            seconds: 0
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
    }

    //componentWillUnmount() {
        //TODO write this to remove timer
    //}


    log_time() {
        var key = "twp_29i8q9BH4BGyLykU4jSMZVkj1OnI";
        var base64 = new Buffer(key + ":xxx").toString("base64");
        var date = new Date();
        fetch('https://thejibe.teamwork.com/tasks/7576391/time_entries.json', {
            method: 'POST',
            headers: {
                'Authorization': "BASIC " + base64,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "time-entry": {
                    "description": "Testing Dates",
                    "person-id": "173892",
                    "date": date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2),
                    "time": date.getHours() + ":" + date.getMinutes(),
                    "hours": "2",
                    "minutes": "00",
                    "isbillable": "1"
                }
            })
        })
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
                                <button onClick={this.handle_start} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-play" aria-hidden="true"></span>
                                </button>
                                <button onClick={this.handle_pause} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-pause" aria-hidden="true"></span>
                                </button>
                                <button onClick={this.handle_clear} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-stop" aria-hidden="true"></span>
                                </button>
                                <button onClick={this.log_time} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-time" aria-hidden="true"></span>
                                </button>
                                &nbsp;&nbsp;&nbsp;
                                {this.get_hours()}:{this.get_minutes()}:{this.get_seconds()}
                                <a className="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne"></a>
                            </h4>
                        </div>
                        <div id="collapseOne" className="panel-body panel-collapse collapse">
                            <div id="demo">
                                <p>Task: { current.content }</p>
                                <form onSubmit={this.handle_logTimeSubmit}>
                                    <div className="form-group">
                                        <textarea name="description" className="form-control" value="" onChange={this.handle_descChange} rows="3"/>
                                        <br/>
                                        <span className="pull-left">
                                                <input name="billable" type="checkbox"/>&nbsp;Billable
                                            </span>
                                    </div>
                                    <br/>
                                    <button className="btn btn-success openTimerConfirmModal col-sm-4" data-toggle="modal" data-target="#confirmTimerModal">
                                        Log Time
                                    </button>
                                    <button className="btn btn-danger pull-right">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
