import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class TimeTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0
        };
        this.timer = null;
        this.startTime = this.startTime.bind(this);
        this.handle_start = this.handle_start.bind(this);
        this.handle_clear = this.handle_clear.bind(this);
        this.handle_pause = this.handle_pause.bind(this);
        this.log_time = this.log_time.bind(this);
    }

    startTime() {
        document.getElementById("timerbox").style.visibility = 'visible';
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

    render_footer() {
        return (
            <footer id="timerbox" style={{position: 'fixed', bottom : 0, display: 'block', width: 300 + 'px', visibility: 'visible'}}>
                <div className="panel-group" id="accordion">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a className="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
                                    TIMER - Pause - Log Time
                                </a>
                            </h4>
                        </div>
                        <div id="collapseOne" className="panel-collapse collapse in">
                            <div className="panel-body" style={{width: 300 + 'px'}}>
                                <div id="demo">
                                    <p>Task: Create time-tracking widget</p>
                                    <div className="form-group">
                                        <textarea className="form-control " rows="1"  id="description" ></textarea>
                                    </div>
                                    <button className="btn btn-success openTimerConfirmModal col-sm-4" data-toggle="modal" data-target="#confirmTimerModal">Log Time</button>
                                    <button className="btn" style={{float: 'right'}}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

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

    render() {
        return (
            <div>
                <h1>{this.get_hours()}:{this.get_minutes()}:{this.get_seconds()}</h1>
                <button onClick={this.handle_start}>Start</button>
                <button onClick={this.handle_pause}>Pause</button>
                <button onClick={this.handle_clear}>Reset</button>
                <button onClick={this.log_time}>Log Time</button>
            </div>
        );
    }
}

export default app;

if (document.getElementById('time')) {
    ReactDOM.render(<TimeTracker />, document.getElementById('time'));
}