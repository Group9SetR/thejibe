import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Calendar from '../calendar.js';

class RefactorDashboard extends Component {

    constructor() {
        super();
        this.state = {
            tasks: [],
            currentprofile: [],
            calendar: []
        }
        this.state.calendar = new Calendar();
        this.state.calendar.init();
        this.taskList = this.taskList.bind(this);
        this.currentProfile  = this.currentProfile.bind(this);
        this.header = this.header.bind(this);
    }

    componentDidMount() {

        this.taskList();
        this.currentProfile();
    }

    taskList() {
        fetch('https://thejibe.teamwork.com/tasks.json', this.header())
            .then(response => {
                return response.json();
            })
            .then(tasks => {
                this.setState({ tasks:tasks['todo-items'] });
            });
    }

    currentProfile() {
        fetch('https://thejibe.teamwork.com/me.json', this.header())
            .then(response => {
                return response.json();
            })
            .then(currentprofile => {
                this.setState({ currentprofile:currentprofile.person });
            });

    }

    header() {
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
        return obj;
    }

    handleDateFilter(type) {
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

        var temp = new Calendar();
        temp.init(type);
        this.setState({calendar:temp});
    }

    render() {
        var columns = [];
        const calendar = this.state.calendar;
        for(var i=0; i < calendar.range.length; i++) {
            var range = calendar.range[i];
            for(var j=0; j<range.length; j++) {
                var col = (range[j].full == new Date().toDateString()) ?
                    <col key={"col-"+i+"-"+j} className="currentDate success"></col>:<col key={"col-"+i+"-"+j}></col>;
                columns.push(col);
            }
        }
        return (
            <div>
                <FilterBar
                    calendar={this.state.calendar}
                    onDateFilterChange={this.handleDateFilter}/>
                <div className="container" id="wrapper">
                    <table className="table table-bordered " id="task_table">

                        <colgroup>
                            <col className="task_table_header"></col>
                            {columns}
                        </colgroup>
                        <Header calendar={this.state.calendar}
                                profile={this.state.currentprofile}/>
                        <Tasks
                            calendar={this.state.calendar}
                            tasks={this.state.tasks}/>
                    </table>
                </div>
            </div>
        );
    }
}

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const calendar = this.props.calendar;

        var headings = [];
        var dates = [];

        for(var i=0; i < calendar.range.length; i++) {
            var range = calendar.range[i];
            headings.push(<th key={"tweek-"+i} className="text-center" colSpan="5">
                {range[0].day} {calendar.Month_Enum.properties[range[0].month]} - {range[range.length - 1].day} {calendar.Month_Enum.properties[range[range.length - 1].month]}</th>);
            for (var j = 0; j < range.length; j++) {
                dates.push(<th key={"tday-"+i+"-"+j} className="text-center calendar-day-headers">{range[j].day}</th>);
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
                <Profile profile={this.props.profile}
                         calendar={this.props.calendar}/>
            </thead>
        );
    }
}

class FilterBar extends Component {
    constructor(props) {
        super(props);
    }

    handleDateFilterChange(e) {
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
        this.props.onDateFilterChange(e.target.value);
        //TODO change parameters of tasks called
        fetch('https://thejibe.teamwork.com/tasks.json', obj)
            .then(response => {
                return response.json();
            })
            .then(tasks => {
                this.setState({ tasks:tasks['todo-items'] });
            });
    }

    handleProjectFilterChange(e) {

    }

    handlePriorityFilterChange(e) {

    }

    handleClientFilterChange(e) {

    }

    render() {
        var calendar = this.props.calendar;
        var startDate = calendar.start.toISOString().substr(0,10);
        var endDate = calendar.end.toISOString().substr(0,10);
        return (
            <div>
                <div className="secondnav" id="mySecondnav">
                    <div className="form-group">
                        <div className="col-sm-2">
                            <select className="form-control" id="client" onChange={this.handleClientFilterChange}>
                                <option>All Clients</option>
                                <option>client 1</option>
                                <option>client 2</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="project" onChange={this.handleProjectFilterChange}>
                                <option>All Projects</option>
                                <option>project 1</option>
                                <option>project 2</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="priority" onChange={this.handlePriorityFilterChange}>
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
                                                defaultValue={calendar.default} onChange={this.handleDateFilterChange}>
                                            <option value={calendar.Type_Enum.WEEK}>Week</option>
                                            <option value={calendar.Type_Enum.BIWEEK}>Biweek</option>
                                            <option value={calendar.Type_Enum.MONTH}>Month</option>
                                            <option value={calendar.Type_Enum.TRIMONTH}>90-days</option>
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
}

class Tasks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(Array.isArray(this.props.tasks) && !this.props.tasks.length) {
            return (<tbody><tr></tr></tbody>);
        }

        const calendar = this.props.calendar;
        const tasks = this.props.tasks;
        var elements = tasks.map(task => {
            var key = "twp_WUI8GI94aBL8p97JiiyXue8epq9A";
            var base64 = new Buffer(key+":xxx").toString("base64");
            var completion = 0;
            var totalhours = 0;
            var estimated = 0;
            $.ajax({
                url: 'http://thejibe.teamwork.com/tasks/' + task.id + '/time/total.json',
                async: false,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data['projects'][0]['tasklist']['task']['time-estimates']['total-hours-estimated'] != 0) {
                        estimated = (data['projects'][0]['tasklist']['task']['time-estimates']['total-hours-estimated']);
                        totalhours = (data['projects'][0]['tasklist']['task']['time-totals']['total-hours-sum']);
                        completion = Math.floor(
                            totalhours
                            / estimated * 100);
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
            for(let i=0; i<calendar.range.length; i++) {
                for(let j=0; j<5; j++) {
                    if(task['start-date'] !== "" && task['due-date'] !== "") {
                        var startdate = convertTeamworkDate(task['start-date']);
                        var duedate = convertTeamworkDate(task['due-date']);

                        var rangedate = calendar.range[i][j];
                        var current = new Date(rangedate.year, rangedate.month, rangedate.day);
                        if(current >= startdate && current <= duedate) {
                            timespan.push(<td key={task.id+"-"+i+"-"+j} className="taskSpan"><div></div></td>);
                        } else {
                            timespan.push(<td key={task.id+"-"+i+"-"+j}>NO</td>);
                        }
                    } else {
                        timespan.push(<td key={task.id+"-"+i+"-"+j}>NO</td>);
                    }
                }
            }
            return (
                <tr key={task.id} className="tasks collapse">
                    <th scope="row">
                        <div>
                            <div>
                                <div className="row">
                                    <div className="col-sm-9">
                                        <div className ="taskName">
                                            { task.content }
                                            <div>
                                                <p className ="projectName">{task['company-name']}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
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
                                        <p>{totalhours}/{estimated}</p>
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

                                        <button type="button" className="btn btn-default btn-sm pull-right" >
                                            <span className="glyphicon glyphicon glyphicon-time" aria-hidden="true"></span>
                                        </button>

                                        <button type="button" className="btn btn-default btn-sm pull-right">
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
        });
        return (<tbody>{elements}</tbody>);
    }
}

//class Timer extends Component {}
class Profile extends Component {

    constructor(props) {
        super(props);
    }
    //data-toggle="collapse" data-target=".tasks" className="accordion-toggle"
    render() {
        if(Array.isArray(this.props.profile)) {
            return (<tr></tr>);
        }
        const profile = this.props.profile;
        const utilization = this.props.calendar.range.length * 5;
        return (
            <tr key={profile.id} >
                <th scope="row">
                    <div className="profile">
                        <div className = "col-sm-2">
                            <img id ="userpic"  alt = "Profile picture" src={ profile['avatar-url']} />
                        </div>
                        <div className = "col-sm-8" id = "name" >
                            <p>{ profile['first-name'] } {profile['last-name']}</p>
                        </div>
                        <div className = "col-sm-1" id = "expandBtn">
                            <button type="button" className="btn btn-default btn-sm accordion-toggle"
                                    data-toggle="collapse" data-target=".tasks" >
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

}

export default RefactorDashboard;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<RefactorDashboard />, document.getElementById('dashboard'));
}