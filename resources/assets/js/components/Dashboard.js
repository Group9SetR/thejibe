import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Calendar from '../calendar.js';

/**
 * Manages the task table display of the Dashboard view.
 */
class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            currentprofile: [],
            seconds: 0
        }
        this.calendar = new Calendar();
        this.calendar.init();

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
            <footer id="timerbox" style={{position: 'fixed', bottom : 0, display: 'block', width: 300 + 'px', visibility: 'hidden'}}>
                <div className="panel-group" id="accordion">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a className="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
                                    <button onClick={this.handle_start}>Start</button>
                                    <button onClick={this.handle_pause}>Pause</button>
                                    <button onClick={this.handle_clear}>Reset</button>
                                    <button onClick={this.log_time}>Log Time</button>
                                </a>
                            </h4>
                        </div>
                        <div id="collapseOne" className="panel-collapse collapse in">
                            <div className="panel-body" style={{width: 300 + 'px'}}>
                                <div id="demo">
                                    <h1>{this.get_hours()}:{this.get_minutes()}:{this.get_seconds()}</h1>
                                    <p>Task: Create time-tracking widget</p>
                                    <div className="form-group">
                                        <textarea class="form-control " placeholder="Optional Description" rows="1"  id="description" ></textarea>
                                    </div>
                                    <button className="btn btn-success openTimerConfirmModal col-sm-4" data-toggle="modal" data-target="#confirmTimerModal">Log Time</button>
                                    <div class ="deleteBtn" style={{float: 'right', 'padding-top': 10 + 'px'}}>
                                        <a style={{color: '#CC000'}}>Delete</a>
                                    </div>
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

    componentDidMount() {
        var key = "twp_sSjnN8X8GtBBozG0OepWU03xa6mx";
        var base64 = new Buffer(key+":xxx").toString("base64");
        var obj = {
            method:"GET",
            dataType: 'json',
            headers: {
                'Authorization': 'BASIC '+base64,
                'Content-Type': 'application/json'
            }
        };

        fetch('https://thejibe.teamwork.com/tasks.json', obj)
            .then(response => {
                return response.json();
            })
            .then(tasks => {
                this.setState({ tasks:tasks['todo-items'] });
            });

        fetch('https://thejibe.teamwork.com/me.json', obj)
            .then(response => {
                return response.json();
            })
            .then(currentprofile => {
                this.setState({ currentprofile:currentprofile.person });
            });

    }


    renderCurrentProfile() {
        var pic = this.state.currentprofile['avatar-url'];
        return (
            <tr key={this.state.currentprofile.id}>
                <th scope="row">
                    <div className="profile">
                        <div className = "col-sm-2">
                            <img id ="userpic"  alt = "Profile picture" src={ this.state.currentprofile['avatar-url']} />

                        </div>
                        <div className = "col-sm-8" id = "name" >
                            <p>{ this.state.currentprofile['first-name'] } {this.state.currentprofile['last-name']}</p>
                        </div>
                        <div className = "col-sm-1" id = "expandBtn">
                            <button type="button" className="btn btn-default btn-sm">
                                <span className="glyphicon glyphicon-chevron-down"></span>
                            </button>
                        </div>
                    </div>
                </th>
                <td colSpan="10"><div id="scheduledBar"><p id="scheduledText">65h/ 80h(81%) scheduled</p></div></td>
            </tr>
        );
    }

    /**
     * Render the individual tasks and time spans.
     * @returns {Array}
     */
    renderTasks() {
        var timespan = [];
        for(let i=0; i<this.calendar.range.length*5;i++) {
            timespan.push(<td>span</td>);
        }
        return this.state.tasks.map(task => {
            var key = "twp_WUI8GI94aBL8p97JiiyXue8epq9A";
            var base64 = new Buffer(key+":xxx").toString("base64");
            var completion = 0;
            $.ajax({
                url: 'http://thejibe.teamwork.com/tasks/' + task.id + '/time/total.json',
                async: false,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data['projects'][0]['tasklist']['task']['time-estimates']['total-hours-estimated'] != 0) {
                        completion = Math.floor(
                            (data['projects'][0]['tasklist']['task']['time-totals']['total-hours-sum'])
                            / (data['projects'][0]['tasklist']['task']['time-estimates']['total-hours-estimated']) * 100);
                    }
                },
                error: function() { console.log('GET request to time totals failed'); },
                beforeSend: setHeader
            });

            function setHeader(xhr) {
                xhr.setRequestHeader('Authorization', 'BASIC ' + base64);
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
            return (
                <tr key={task.id}>
                    <th scope="row">
                        <div >
                            <div>
                                <div className ="taskName">
                                    { task.content }
                                </div>
                                {
                                    (task.priority === "") ? <span></span>:
                                        (task.priority === "medium") ?
                                            <button type="button" id = "priorityBtn" className="btn btn-warning btn-sm" style={{ "float":"right"}}><bold>Medium</bold></button>:
                                            (task.priority === "low") ?
                                                <button type="button" id = "priorityBtn" className="btn btn-success btn-sm" style={{ "float":"right" }}><bold>Low</bold></button>:
                                                <button type="button" id = "priorityBtn" className="btn btn-danger btn-sm" style={{ "float":"right"}}><bold>High</bold></button>

                                }
                            </div>
                            <div>
                                <p className ="projectName">ProjectName:{ task['project-name'] }</p>
                                <p className ="companyName">{ task['company-name'] }</p>
                            </div>


                            <div className = "row" id = "sliderBardiv">
                                <div id = "sliderBar" style={{ "float":"left"}}>
                                    <input type="range"  min="0" max="100" />
                                </div>
                                <div className="col-sm-3" style={{ "float":"right"}}>
                                    <p>4.32h/ 10h</p>
                                </div>

                            </div>

                            <div className ="row" id = "progressBardiv">
                                <div className="progress" id ="progressBar" style={{ "float":"left"}}>
                                    <div className="progress-bar  " role="progressbar"
                                         aria-valuenow={completion} aria-valuemin="0" aria-valuemax="100" style={{ "width" : completion + "%"}}>
                                        {completion}%
                                    </div>
                                </div>
                                <div className ="col-sm-3" style={{ "float":"right"}}>

                                    <button onClick={this.startTime} type="button" className="btn btn-default btn-sm pull-right">
                                        <span className="glyphicon glyphicon glyphicon-time" aria-hidden="true"></span>
                                    </button>

                                    <button onClick={this.startTime} type="button" className="btn btn-default btn-sm pull-right">
                                        <span className="glyphicon glyphicon glyphicon-play" aria-hidden="true"></span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </th>
                    {timespan}
                </tr>
            );
        })
    }

    /**
     * Renders the calendar heading of the Dashboard task display table.
     * @returns {XML}
     */
    renderCalendar() {
        var headings = [];
        var dates = [];
        for(var i=0; i < this.calendar.range.length; i++) {
            var range = this.calendar.range[i];
            headings.push(<th className="text-center" colSpan="5">
                {range[0].day} {this.calendar.Month_Enum.properties[range[0].month]}-
                {range[4].day} {this.calendar.Month_Enum.properties[range[4].month]}</th>);
            for(var j=0; j<range.length; j++) {
                dates.push(<th className="text-center">{range[j].day}</th>);
            }
        }
        return (

            <thead>
            <tr>
                <th rowSpan="2" style={{"width": "12%"}}></th>
                {headings}
            </tr>
            <tr>
                {dates}
            </tr>
            </thead>
        );
    }

    /**
     * Renders the Dashboard task table.
     * @returns {XML}
     */
    render() {
        var columns = [];
        for(var i=0; i < this.calendar.range.length; i++) {
            var range = this.calendar.range[i];
            for(var j=0; j<range.length; j++) {
                var col = (range[j].day == new Date().getDate()) ?
                    <col className="currentDate"></col>:<col></col>;
                columns.push(col);
            }
        }
        return (
            <div>
                <table className="table table-bordered " id="task_table">
                    <colgroup>
                        <col></col>
                        {columns}
                    </colgroup>
                    {this.renderCalendar()}
                    <tbody>
                    { this.renderCurrentProfile() }
                    { this.renderTasks() }
                    </tbody>
                </table>
                {this.render_footer()}
            </div>
        );
    }
}

export default Dashboard;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
}