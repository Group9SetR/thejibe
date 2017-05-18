import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Calendar from '../../calendar.js';
import Tasks from './Tasks.js';
import Timer from './Timer.js';
import FilterBar from './FilterBar.js';
import TableHeader from './TableHeader.js';
import ColumnHeader from './ColumnHeader.js';

class RefactorDashboard extends Component {

    constructor() {
        super();
        this.state = {
            tasks: [],
            currentprofile: [],
            calendar: [],
            currenttimer: [],
            taskhours: []
        }
        this.state.calendar = new Calendar();
        this.state.calendar.init();
        this.taskList = this.taskList.bind(this);
        this.taskHours = this.taskHours.bind(this);
        this.calculateTaskHours = this.calculateTaskHours.bind(this);
        this.currentProfile  = this.currentProfile.bind(this);
        this.header = this.header.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleTimer = this.handleTimer.bind(this);
    }

    componentDidMount() {
        this.taskList();
        this.currentProfile();
    }

    taskList() {
        //TODO Read id from current profile
        var startdate = this.state.calendar.convertToTeamworkDate(this.state.calendar.start);
        var enddate = this.state.calendar.convertToTeamworkDate(this.state.calendar.end);
        var request = 'https://thejibe.teamwork.com/tasks.json'+'?startdate='+startdate
            +'&enddate='+enddate+'&responsible-party-ids='+auth_id;
        fetch(request, this.header())
            .then(response => {
                return response.json();
            })
            .then(tasks => {
                this.setState({ tasks:tasks['todo-items']},this.taskHours);
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

    taskHours() {
        var taskhours = [];
        this.state.tasks.map(task=>{
            taskhours[task.id] = this.calculateTaskHours(task)['hoursperday'];
        });
        this.setState({
            taskhours:taskhours
        });
    }

    header() {
        var key = auth_api_token;
        console.log(auth_api_token);
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

    handleFilter(filter) {
        switch(filter.type) {
            case "date":
                var temp = new Calendar();
                temp.init(filter.value);
                this.setState({calendar:temp}, this.taskList);
                break;
            case "project":
                break;
            case "priority":
                break;
            case "company":
                break;
        }
    }

    handleTimer(task) {
        this.setState({currenttimer:task});
    }

    calculateTaskHours(task) {
        var counter = 1;
        var hoursperday =0;
        if(task['start-date'] == "" || task['due-date'] == "") {
            return {"hoursperday":hoursperday};
        } else {
            var startdate = this.state.calendar.convertFromTeamworkDate(task['start-date']);
            var duedate = this.state.calendar.convertFromTeamworkDate(task['due-date']);
            while (startdate.toDateString() != duedate.toDateString()) {
                var dayofweek = startdate.getDay();
                if (dayofweek != 0 && dayofweek != 6) {
                    counter++;
                }
                startdate.setDate(startdate.getDate() + 1);
            }
            hoursperday = (task['estimated-minutes'] / 60) / counter;

            return {"hoursperday": hoursperday};
        }
    }

    render() {
        return (
            <div>
                <FilterBar
                    calendar={this.state.calendar}
                    tasks={this.state.tasks}
                    onFilterChange={this.handleFilter}/>
                <div className="container" id="wrapper">
                    <table className="table table-bordered " id="task_table">
                        <ColumnHeader calendar={this.state.calendar} />

                        <TableHeader calendar={this.state.calendar}
                            profile={this.state.currentprofile}
                            tasks={this.state.tasks}
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