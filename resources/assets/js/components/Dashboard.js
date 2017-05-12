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
            default: true
        };
        this.calendar = new Calendar();
        this.calendar.init();
    }

    componentDidMount() {
        var key = "twp_WUI8GI94aBL8p97JiiyXue8epq9A";
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
    }

    /**
     * Render the individual tasks and time spans.
     * @returns {Array}
     */
    renderTasks() {
        return this.state.tasks.map(task => {
            return (
                <tr key={task.id}>
                    <th scope="row">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                { task.description }
                                {
                                    (task.priority === "") ? <span></span>:
                                        <span className="panel panel-primary" style={{ "float":"right"}}>{ task.priority }</span>
                                }
                            </div>
                            <div className="panel-body">
                                <p>{ task['company-name'] }</p>
                                <p>{ task['project-name'] }</p>
                                <p>{ task['created-on'] }</p>
                            </div>
                        </div>
                    </th>
                    <td colSpan="10">TIMESPAN</td>
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
                dates.push(<th>{range[j].day}</th>);
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
        return (
            <div>
                <table className="table table-bordered" id="task_table">
                    { this.renderCalendar() }
                    <tbody>
                    <tr>
                        <th scope="row">
                            <div className = "row" id ="profile">
                                <div className="col-sm-2">
                                    <img src="1.png" className="img-circle" alt="profile picture" width="50" height="50"/>
                                </div>
                                <div className="col-sm-5" id = "name">
                                    <p id = "name"><strong>Hansol Lee</strong></p>
                                </div>
                                <div className="col-xs-1 pull-right">
                                    <button type="button" className="btn btn-link">
                                        <span className="glyphicon glyphicon-chevron-down"> </span>
                                    </button>
                                </div>
                            </div>
                        </th>
                        <td colSpan="10"> 65h/ 80h(81%)scheduled</td>
                    </tr>
                    { this.renderTasks() }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Dashboard;
if (document.getElementById('dashboard')) {

    ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
}