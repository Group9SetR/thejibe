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
            currentprofile: []
        };
        this.startTime = this.startTime.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.calendar = new Calendar();
        this.calendar.init();
    }

    startTime() {
        document.getElementById("timerbox").style.visibility = 'visible';
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
        var utilization = this.calendar.range.length * 5;
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
                <td colSpan={utilization} className="nohover nohighlight">
                    <div>
                        <div id="scheduledBar"><p id="scheduledText">65h/ 80h(81%) scheduled</p></div>
                        <div></div>
                    </div>
                </td>
            </tr>
        );
    }

    /**
     * Render the individual tasks and time spans.
     * @returns {Array}
     */
    renderTasks() {


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

            function convertTeamworkDate(datestring) {
                var year = datestring.substr(0,4);
                var month = datestring.substr(4,2);
                var day = datestring.substr(6,2);
                var temp = new Date(year, month, 1);
                temp.setMonth(temp.getMonth()-1);
                temp.setDate(day);
                return temp;
            }

            var timespan = [];
            for(let i=0; i<this.calendar.range.length; i++) {
                for(let j=0; j<5; j++) {
                    if(task['start-date'] !== "" && task['due-date'] !== "") {
                        var startdate = convertTeamworkDate(task['start-date']);
                        var duedate = convertTeamworkDate(task['due-date']);

                        var rangedate = this.calendar.range[i][j];
                        var current = new Date(rangedate.year, rangedate.month, rangedate.day);
                        if(current >= startdate && current <= duedate) {
                            timespan.push(<td className="taskSpan"><div></div></td>);
                        } else {
                            timespan.push(<td>NO</td>);
                        }
                    } else {
                        timespan.push(<td>NO</td>);
                    }
                }
            }
            return (
                <tr key={task.id}>
                    <th scope="row">
                        <div >
                            <div>
                                <div className="row">
                                    <div className="col-sm-8">
                                        <div className ="taskName">
                                            { task.content }
                                            <div>
                                                <p className ="projectName">ProjectName:{ task['project-name'] }</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        {
                                            (task.priority === "") ? <span></span>:
                                                (task.priority === "medium") ?
                                                    <button type="button" className="priorityBtn btn btn-warning btn-sm" style={{ "float":"right"}}><bold>Medium</bold></button>:
                                                    (task.priority === "low") ?
                                                        <button type="button" className= "priorityBtn btn btn-success btn-sm" style={{ "float":"right" }}><bold>Low</bold></button>:
                                                        <button type="button" className= "priorityBtn btn btn-danger btn-sm" style={{ "float":"right"}}><bold>High</bold></button>

                                        }
                                    </div>
                                </div>
                                <div className = "row sliderBardiv">
                                    <div className="col-sm-9">
                                        <div className="sliderBar" style={{ "float":"left"}}>
                                            <input type="range"  min="0" max="100" />
                                        </div>
                                    </div>
                                    <div className="col-sm-3" style={{ "float":"right"}}>
                                        <p>4.32h/ 10h</p>
                                    </div>
                                </div>
                                <div className ="row progressBardiv">
                                    <div className="col-sm-9 progress progressBar" style={{ "float":"left"}}>
                                        <div className="progress-bar  " role="progressbar"
                                             aria-valuenow={completion} aria-valuemin="0" aria-valuemax="100" style={{ "width" : completion + "%"}}>
                                            {completion}%
                                        </div>
                                    </div>
                                    <div className ="col-sm-3" style={{ "float":"right"}}>

                                        <button onClick={this.startTime} type="button" className="btn btn-default btn-sm pull-right" >
                                            <span className="glyphicon glyphicon glyphicon-time" aria-hidden="true"></span>
                                        </button>

                                        <button onClick={this.startTime} type="button" className="btn btn-default btn-sm pull-right">
                                            <span className="glyphicon glyphicon glyphicon-play" aria-hidden="true"></span>
                                        </button>
                                    </div>

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
                {range[0].day} {this.calendar.Month_Enum.properties[range[0].month]} - {range[range.length - 1].day} {this.calendar.Month_Enum.properties[range[range.length - 1].month]}</th>);
            for (var j = 0; j < range.length; j++) {
                dates.push(<th className="text-center calendar-day-headers">{range[j].day}</th>);
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

    renderNav() {
        var calendar = this.calendar;
        var startDate = calendar.start.toISOString().substr(0,10);
        var endDate = calendar.end.toISOString().substr(0,10);
        return (
            <div>
                <div className="secondnav" id="mySecondnav">
                    <div className="form-group">
                        <div className="col-sm-2">
                            <select className="form-control" id="client">
                                <option>All Clients</option>
                                <option>client 1</option>
                                <option>client 2</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="project">
                                <option>All Projects</option>
                                <option>project 1</option>
                                <option>project 2</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="priority">
                                <option>All Priorities</option>
                                <option>Priorities 1</option>
                                <option>Priorities 2</option>
                            </select>
                        </div>



                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right ">
                                <form>
                                    <div className ="form-inline">
                                        <input type="date" name="start_date" id="start_date" className="form-control"
                                            defaultValue={startDate} />
                                        <input type="date" name="end_date" id="end_date" className="form-control"
                                            defaultValue={endDate} />
                                        <select className="form-control" id="date_filter"
                                                defaultValue={this.calendar.default} onChange={this.filterDate}>
                                            <option value={this.calendar.Type_Enum.WEEK}>Week</option>
                                            <option value={this.calendar.Type_Enum.BIWEEK}>Biweek</option>
                                            <option value={this.calendar.Type_Enum.MONTH}>Month</option>
                                            <option value={this.calendar.Type_Enum.TRIMONTH}>90-days</option>
                                        </select>
                                    </div>
                                </form>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    filterDate(e) {
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
        this.calendar.init(e.target.value);
        //TODO change parameters of tasks called
        fetch('https://thejibe.teamwork.com/tasks.json', obj)
            .then(response => {
                return response.json();
            })
            .then(tasks => {
                this.setState({ tasks:tasks['todo-items'] });
            });
    }

    setDateStart(e) {

    }

    setDateEnd(e) {

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
                var col = (range[j].full == new Date().toDateString()) ?
                    <col className="currentDate success"></col>:<col></col>;
                columns.push(col);
            }
        }
        return (
            <div>
                {this.renderNav()}

                <div className="container" id="wrapper">

                    <table className="table table-bordered" id="task_table">
                        <colgroup>
                            <col className="task_table_header"></col>
                            {columns}
                        </colgroup>
                            {this.renderCalendar()}
                        <tbody>
                            { this.renderCurrentProfile() }
                            { this.renderTasks() }

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Dashboard;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
}