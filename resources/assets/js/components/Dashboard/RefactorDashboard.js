import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Calendar from '../../calendar.js';
import Tasks from './Tasks.js';
import Timer from './Timer.js';
import FilterBar from './FilterBar.js';
import TableHeader from './TableHeader.js';
import ColumnHeader from './ColumnHeader.js';

const appElement = document.getElementById('dashboard');


class RefactorDashboard extends Component {

    constructor() {
        super();
        this.state = {
            tasks: [],
            currentprofile: [],
            utilizationhours: [],
            calendar: [],
            currenttimer: [],
            taskhours: [],
            companies: [],
            projects: []
        }
        this.state.calendar = new Calendar();
        this.state.calendar.init();
        this.taskList = this.taskList.bind(this);
        this.taskDetails = this.taskDetails.bind(this);
        this.calculateTaskHours = this.calculateTaskHours.bind(this);
        this.currentProfile  = this.currentProfile.bind(this);
        this.header = this.header.bind(this);
        this.handleDateFilter = this.handleDateFilter.bind(this);
        this.handleTimer = this.handleTimer.bind(this);
    }

    componentDidMount() {
        this.taskList();
        this.currentProfile();
    }

    taskList() {
        //var startdate = this.state.calendar.convertToTeamworkDate(this.state.calendar.start);
        //var enddate = this.state.calendar.convertToTeamworkDate(this.state.calendar.end);
        //var request = 'https://thejibe.teamwork.com/tasks.json'+'?startdate='+startdate
        //    +'&enddate='+enddate+'&responsible-party-ids='+auth_id+'&include=nodate';
        var request = 'https://thejibe.teamwork.com/tasks.json'+'?responsible-party-ids='+auth_id;
        fetch(request, this.header())
            .then(response => {
                return response.json();
            })
            .then(tasks => {
                this.setState({ tasks:tasks['todo-items']},this.taskDetails);
            });
    }

    /**
     * The current profile should actually be stored upon login.
     */
    currentProfile() {
        fetch('https://thejibe.teamwork.com/me.json', this.header())
            .then(response => {
                return response.json();
            })
            .then(currentprofile => {
                this.setState({ currentprofile:currentprofile.person });
            });
    }

    taskDetails() {
        var taskhours = [];
        var utilizationhours = []; //TODO set utilization hours here
        //initialize utilization hours to 0 for each day in range
        var companyset = new Set(); //TODO remove this
        var companyarr = []; //TODO remove this
        var projectset = new Set(); //TODO remove this
        var projectarr = []; //TODO remove this
        this.state.tasks.map(task=>{
            taskhours[task.id] = this.calculateTaskHours(task, utilizationhours)['hoursperday'];
            if(!companyset.has(task['company-id'])) {
                companyset.add(task['company-id']);
                companyarr.push({"company-id":task['company-id'], "company-name":task['company-name']});
            }
            if(!projectset.has(task['project-id'])) {
                projectset.add(task['project-id']);
                projectarr.push({"project-id":task['project-id'],"project-name":task['project-name']});
            }
        });
        this.setState({
            taskhours:taskhours,
            utilizationhours:utilizationhours,
            companies:companyarr,
            projects:projectarr
        });
    }

    header() {
        var key = auth_api_token;
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
        var temp = new Calendar();
        temp.init(type);
        this.setState({calendar:temp}, this.taskList);
    }

    handleTimer(task) {
        this.setState({currenttimer:task});
    }

    calculateTaskHours(task, utilizationhours) {
        var counter = 1;
        var hoursperday =0;
        var hours = new Array();
        if(task['start-date'] == "" || task['due-date'] == "") {
            return {"hoursperday":hoursperday};
        } else {
            const calendar = this.state.calendar;
            var startdate = calendar.convertFromTeamworkDate(task['start-date']);
            var duedate = calendar.convertFromTeamworkDate(task['due-date']);
            var dateincrement = new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate());
            while (dateincrement.toDateString() != duedate.toDateString()) {
                var dayofweek = dateincrement.getDay();
                if (dayofweek != 0 && dayofweek != 6) {
                    counter++;
                }
                dateincrement.setDate(dateincrement.getDate() + 1);
            }
            //TODO for every day in calendar range, add hoursperday to utilizationhours
            hoursperday = (task['estimated-minutes'] / 60) / counter;
            for(let i=0; i<calendar.range.length; i++) {
                for(let j=0; j<5; j++) {
                    if(task['start-date'] !== "" && task['due-date'] !== "") {
                        var rangedate = calendar.range[i][j];
                        var current = new Date(rangedate.year, rangedate.month, rangedate.day);
                        if(current >= startdate && current <= duedate) {
                            hours.push(hoursperday);
                        } else {
                            hours.push(0);
                        }
                    } else {
                        hours.push(0);
                    }
                }
            }
            utilizationhours.push(hours);

            return {"hoursperday": hoursperday};
        }
    }

    render() {
        return (
            <div>
                <FilterBar
                    calendar={this.state.calendar}
                    companies={this.state.companies}
                    projects={this.state.projects}
                    onDateFilterChange={this.handleDateFilter}/>
                <div className="container" id="wrapper">
                    <table className="table table-bordered " id="task_table">
                        <ColumnHeader calendar={this.state.calendar} />

                        <TableHeader calendar={this.state.calendar}
                            profile={this.state.currentprofile}
                            utilizationhours={this.state.utilizationhours}
                            />
                        <Tasks
                            calendar={this.state.calendar}
                            tasks={this.state.tasks}
                            taskhours={this.state.taskhours}
                            onTimerChange={this.handleTimer}/>
                    </table>


                    <Timer timer={this.state.currenttimer}/>
                </div>
            </div>
        );
    }
}

export default RefactorDashboard;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<RefactorDashboard />, document.getElementById('dashboard'));
}