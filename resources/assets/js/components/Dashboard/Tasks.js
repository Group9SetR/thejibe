import React, { Component } from 'react';

export default class Tasks extends Component {

    constructor(props) {
        super(props);
        this.startTimer = this.startTimer.bind(this);
    }

    startTimer(e) {
        // set guards so user cannot start another timer without first finishing current one
        $('.timer-btn').attr('disabled', true);
        $('.logtimer').css('visibility', 'visible');
        var timer = {"id":e.target.dataset.taskId, "content":e.target.dataset.taskDesc};
        this.props.onTimerChange(timer);
    }

    sliderChange(id) {
        var key = "twp_WUI8GI94aBL8p97JiiyXue8epq9A";
        var base64 = new Buffer(key+":xxx").toString("base64");
        var progress = $('#' + id + 'slider').val();
        var progressjson = {"todo-item": { "progress": progress } };
        $.ajax({
            url: 'https://thejibe.teamwork.com/tasks/' + id + '.json',
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify(progressjson),
            success: function(data) {
                console.log("prog changed")
            },
            error: function() { console.log('GET request to time totals failed'); },
            beforeSend: setHeader
        });
        $('#' + id + 'display').text(progress + "%");

        function setHeader(xhr) {
            xhr.setRequestHeader('Authorization', 'BASIC ' + base64);
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
    }

    render() {
        if(Array.isArray(this.props.tasks) && !this.props.tasks.length) {
            return (<tbody><tr></tr></tbody>);
        }
        const calendar = this.props.calendar;
        const tasks = this.props.tasks;
        var elements = tasks.map(task => {
            var key = auth_api_token;
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

            var timespan = [];
            for(let i=0; i<calendar.range.length; i++) {
                for(let j=0; j<5; j++) {
                    if(task['start-date'] !== "" && task['due-date'] !== "") {
                        var startdate = calendar.convertFromTeamworkDate(task['start-date']);
                        var duedate = calendar.convertFromTeamworkDate(task['due-date']);

                        var rangedate = calendar.range[i][j];
                        var current = new Date(rangedate.year, rangedate.month, rangedate.day);
                        if(current >= startdate && current <= duedate) {
                            timespan.push(<td style={{ "padding":"0"}} key={task.id+"-"+i+"-"+j} className="taskSpan">
                                <div className= "taskGraph"></div></td>);
                        } else {
                            timespan.push(<td key={task.id+"-"+i+"-"+j}></td>);
                        }
                    } else {
                        timespan.push(<td key={task.id+"-"+i+"-"+j}></td>);
                    }
                }
            }
            return (
                <tr key={task.id} className="tasks collapse">
                    <th scope="row">
                        <div>
                            <div className="row">
                                <div className="col-sm-8">
                                    <div className ="taskName">
                                        { task.content }
                                        <div>
                                            <p className ="projectName">{task['company-name']} : {task['project-name']}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className ="col-sm-4">
                                    <div style={{ "float":"left"}}>
                                        {
                                            (task.priority === "") ? <span></span>:
                                                (task.priority === "medium") ?
                                                    <button type="button" className="priorityBtn btn btn-warning btn-sm" style={{ "float":"right"}}><bold>Medium</bold></button>:
                                                    (task.priority === "low") ?
                                                        <button type="button" className= "priorityBtn btn btn-success btn-sm" style={{ "float":"right" }}><bold>Low</bold></button>:
                                                        <button type="button" className= "priorityBtn btn btn-danger btn-sm" style={{ "float":"right"}}><bold>High</bold></button>

                                        }
                                    </div>
                                    <div style={{ "float":"right"}}>
                                        <button type="button" className="btn btn-default btn-sm" id = "collapseBtn"
                                                data-toggle="collapse" data-target={'#taskscol-' + task.id} >
                                            <span className="glyphicon glyphicon-chevron-down"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div className = "taskscol collapse" id={'taskscol-'+task.id}>
                                <div className = "row sliderBardiv">
                                    <div id = "sliderBar" style={{ "float":"left"}} className="col-sm-9">
                                        <input type="range"  min="0" step="10" max="100" id={task.id + "slider"} onChange={this.sliderChange.bind(this, task.id)} defaultValue={task.progress}/>
                                        <span id={task.id + "display"}>{task.progress}%</span>
                                    </div>
                                    <div className ="col-sm-3" style={{ "float":"right"}}>
                                        <button type="button" onClick={this.startTimer}
                                                data-task-id={task.id} data-task-desc={task.content}
                                                className="btn btn-default btn-sm pull-right glyphicon glyphicon-time timer-btn">
                                        </button>
                                    </div>

                                </div>
                                <div className ="row progressBardiv">
                                    <div className="col-sm-9 progress progressBar" style={{ "float":"left"}}>
                                        <div className="progress-bar  " role="progressbar"
                                             aria-valuenow={completion} aria-valuemin="0" aria-valuemax="100" style={{ "width" : completion + "%"}}>
                                            {completion}%
                                        </div>
                                    </div>
                                    <div className="col-sm-3" style={{ "float":"right"}}>
                                        <p>{totalhours}/{estimated}</p>
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
