import React, { Component } from 'react';

export default class Tasks extends Component {

    constructor(props) {
        super(props);
        this.startTimer = this.startTimer.bind(this);
        this.checkIfInRange = this.checkIfInRange.bind(this);
    }


    startTimer(e) {
        // set guards so user cannot start another timer without first finishing current one
        $('.timerBtn').attr('disabled', true);
        $('.logtimer').css('visibility', 'visible');
        var timer = {"id":e.target.dataset.taskId, "content":e.target.dataset.taskDesc};
        this.props.onTimerChange(timer);
    }

    /**
     * In range if no start/end date assigned, start date in range AND end date in range.
     * @param taskstart
     * @param taskend
     * @returns {boolean}
     */
    checkIfInRange(taskstart, taskend) {
        //Check if task within current time period
        const calendar = this.props.calendar;
        var start = calendar.convertFromTeamworkDate(taskstart);
        var end = calendar.convertFromTeamworkDate(taskend);
        var rangestart = new Date(calendar.range[0][0].year, calendar.range[0][0].month, calendar.range[0][0].day);
        var lastinrange = calendar.range[calendar.range.length-1][4];
        var rangeend = new Date(lastinrange.year, lastinrange.month, lastinrange.day);

        if(taskstart != "" && taskend != ""){
            if(!((start >= rangestart && start <= rangeend) || (end >= rangestart && end <= rangeend))) {
                return false;
            }
        }
        return true;
    }

    sliderChange(id) {
        var key = auth_api_token;
        var base64 = new Buffer(key+":xxx").toString("base64");
        var progress = $('#' + id + 'slider').val();
        var progressjson = {"todo-item": { "progress": progress } };
        $.ajax({
            url: 'https://thejibe.teamwork.com/tasks/' + id + '.json',
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify(progressjson),
            success: function(data) {
            },
            error: function() { console.log('PUT request to progress failed'); },
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
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data['projects'][0]['tasklist']['task']['time-estimates']['total-hours-estimated'] != 0) {
                        estimated = (data['projects'][0]['tasklist']['task']['time-estimates']['total-hours-estimated']);
                        totalhours = (data['projects'][0]['tasklist']['task']['time-totals']['total-hours-sum']);
                        completion = Math.floor(
                            totalhours
                            / estimated * 100);
                        $('#progress-' + task.id).prop("aria-valuenow", completion);
                        $('#progress-' + task.id).css("width", completion+"%");
                        $('#progress-' + task.id).text(completion+"%");
                        $('#hours-' + task.id).text(totalhours + "/" + estimated);
                    }
                },
                error: function() { console.log('GET request to time totals failed'); },
                beforeSend: setHeader
            });
            function setHeader(xhr) {
                xhr.setRequestHeader('Authorization', 'BASIC ' + base64);
                xhr.setRequestHeader('Content-Type', 'application/json');
            }

            if(!this.checkIfInRange(task['start-date'], task['due-date'])){
                return;
            }



            var timespan = [];
            var dailyhours = (Array.isArray(this.props.taskhours) && !this.props.taskhours.length)?0:
                this.props.taskhours[task.id].toFixed(2);

            for(let i=0; i<calendar.range.length; i++) {
                for(let j=0; j<5; j++) {
                    if(task['start-date'] !== "" && task['due-date'] !== "") {
                        var startdate = calendar.convertFromTeamworkDate(task['start-date']);
                        var duedate = calendar.convertFromTeamworkDate(task['due-date']);

                        var rangedate = calendar.range[i][j];
                        var current = new Date(rangedate.year, rangedate.month, rangedate.day);
                        if(current >= startdate && current <= duedate) {
                            var taskspanname = "taskGraph taskSpan-"+i+"-"+j;
                            timespan.push(<td style={{ "padding":"0"}} key={task.id+"-"+i+"-"+j} className="taskSpan">
                                <div className={taskspanname}>
                                    <span>{dailyhours}</span>
                                </div></td>);
                        } else {
                            timespan.push(<td key={task.id+"-"+i+"-"+j}></td>);
                        }
                    } else {
                        timespan.push(<td key={task.id+"-"+i+"-"+j}></td>);
                    }
                }
            }
            var taskrowclass = "tasks collapse ";
            taskrowclass += "project-"+task['project-id'] + " company-"+task['company-id']+" ";
            if(task.priority == "medium") {
                taskrowclass+= "task-priority-medium " ;
            } else if(task.priority == "high") {
                taskrowclass+= "task-priority-high ";
            } else if(task.priority == "low") {
                taskrowclass+= "task-priority-low ";
            } else {
                taskrowclass+= "task-priority-none ";
            }
            if(task['start-date'] === "" || task['due-date'] === "") {
                taskrowclass += "unscheduled-tasks ";
            }
            return (
                <tr key={task.id} className={taskrowclass}>
                    <th scope="row">
                        <div>
                            <div className="row">
                                <div className="col-sm-8">
                                    <div className ="taskName">
                                        <a href={"https://thejibe.teamwork.com/index.cfm#tasks/" + task.id} target="_blank">{ task.content }</a>
                                        <div>
                                            <a href={"https://thejibe.teamwork.com/index.cfm#/projects/" + task['project-id'] + "/overview/summary"} target="_blank"><p className ="projectName"> {task['project-name']} : {task['company-name']} </p></a>
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

                                    <div style={{ "float":"right"}} className="barToggleBtn">
                                        <a data-toggle="collapse" href={'#taskscol-' + task.id}
                                           aria-expanded="false" aria-controls="collapseExample">
                                            <i className="fa fa-chevron-up pull-right"></i>
                                            <i className="fa fa-chevron-down pull-right"></i>
                                        </a>

                                    </div>
                                </div>
                            </div>
                            <div className = "taskscol collapse" id={'taskscol-'+task.id}>
                                <div className = "row sliderBardiv">
                                    <div id = "sliderBar" style={{ "float":"left"}} >
                                        <input style={{"width":"280px"}} type="range"  min="0" step="10" max="100" id={task.id + "slider"} onChange={this.sliderChange.bind(this, task.id)} defaultValue={task.progress}/>
                                        <span id={task.id + "display"} style={{ "fontSize":"small"}}>{task.progress}%</span>
                                    </div>
                                    <div className ="col-sm-3" style={{ "float":"right"}}>
                                        <button type="button" onClick={this.startTimer}
                                                data-task-id={task.id} data-task-desc={task.content}
                                                className="btn btn-default btn-sm pull-right glyphicon glyphicon-time timerBtn">
                                        </button>
                                    </div>
                                </div>
                                <div className ="row progressBardiv">
                                    <div className="progress progressBar" style={{ "float":"left"}}>
                                        <div id={"progress-" + task.id} className="progress-bar  " role="progressbar"
                                             aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{ "width" : "0%"}}>
                                            N/A
                                        </div>
                                    </div>
                                    <div className="col-sm-3" style={{ "float":"right"}}>
                                        <p id={"hours-" + task.id} style={{ "fontSize": "x-small", "alignment" : "center"}}>N/A</p>
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

