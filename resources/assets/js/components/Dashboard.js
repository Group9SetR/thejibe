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
        this.calendar = new Calendar();
        this.calendar.init();

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
                console.log(this.state.currentprofile);
            });

    }


    renderCurrentProfile() {
        var pic = this.state.currentprofile['avatar-url'];
        console.log(pic);
            return (
                <tr key={this.state.currentprofile.id}>
                    <th scope="row">
                        <div className="profile">
                            <div className = "col-sm-2">
                                <img id ="userpic"  src={ this.state.currentprofile['avatar-url']} />
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

    getCompletion() {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "Your Rest URL Here", false);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
        var response = JSON.parse(xhttp.responseText);
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
            console.log(task.id);
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
                error: function() { console.log('boo!'); },
                beforeSend: setHeader
            });
            console.log(completion);

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
                                            <button type="button" className="btn btn-warning btn-sm" style={{ "float":"right"}}>{ task.priority }</button>:
                                            (task.priority === "low") ?
                                            <button type="button" className="btn btn-success btn-sm" style={{ "float":"right"}}>{ task.priority }</button>:
                                                <button type="button" className="btn btn-danger btn-sm" style={{ "float":"right"}}>{ task.priority }</button>

                                }
                            </div>
                            <div>
                                <p className ="projectName">ProjectName:{ task['project-name'] }</p>
                                <p className ="companyName">{ task['company-name'] }</p>
                            </div>
                            <div className="progress" id ="progressBar">
                                <div className="progress-bar progress-bar-striped active" role="progressbar"
                                     aria-valuenow={completion} aria-valuemin="0" aria-valuemax="100" style={{ "width" : completion + "%"}}>
                                    {completion}%
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
                <table className="table table-bordered " id="task_table">
                    {this.renderCalendar()}
                    <tbody>
                    { this.renderCurrentProfile() }
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