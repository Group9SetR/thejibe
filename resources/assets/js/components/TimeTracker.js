import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class TimeTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0
        };
        this.timer = null;
        this.handle_start = this.handle_start.bind(this);
        this.handle_clear = this.handle_clear.bind(this);
        this.handle_pause = this.handle_pause.bind(this);
        this.log_time = this.log_time.bind(this);
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

export default TimeTracker;

if (document.getElementById('time')) {
    ReactDOM.render(<TimeTracker />, document.getElementById('time'));
}