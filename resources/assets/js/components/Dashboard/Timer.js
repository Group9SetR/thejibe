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
                                <button onClick={this.log_time.bind(this, current.id)} className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon glyphicon-time" aria-hidden="true"></span>
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
