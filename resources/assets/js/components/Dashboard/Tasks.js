import React, { Component } from 'react';
export default class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks:[]
        };
        this.startTimer = this.startTimer.bind(this);
        this.checkIfInRange = this.checkIfInRange.bind(this);
        this.allowDrop = this.allowDrop.bind(this);
        this.drag = this.drag.bind(this);
        this.drop = this.drop.bind(this);
    }

    componentDidMount() {
        this.state.tasks = this.props.tasks;
    }

    componentWillReceiveProps() {
        this.setState({
            tasks: this.props.tasks
        });
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.setData("task-id", ev.target.dataset.taskId);
        ev.dataTransfer.setData("date", ev.target.dataset.date);
    }

    drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        //TODO get correct element
        var target = ev.target;
        while(target.tagName != "TD") {
            target = target.parentElement;
        }
        //TODO check task id match"task-id"));
        if(target.dataset.taskId == ev.dataTransfer.getData("task-id")) {
            console.log("it's a match");
        } else {
            console.log("it's not a match");
        }
        //TODO check start >= end
        var currenttask = this.state.tasks.find(task=>{
            return task.id == target.dataset.taskId;
        });
        var currenttaskindex = this.state.tasks.findIndex(task=>{
            return task.id==target.dataset.taskId;
        });
        var currentstart = this.props.calendar.convertFromTeamworkDate(currenttask['start-date']);
        var currentend = this.props.calendar.convertFromTeamworkDate(currenttask['due-date']);
        var currentdate = new Date(target.dataset.date);
        console.log(currentdate);
        if(data.includes("start")) {
            if(currentdate > currentend) {
                console.log("start cannot be greater than end date");
                return;
            }
            currenttask['start-date'] = this.props.calendar.convertToTeamworkDate(currentdate);
        } else if(data.includes("end")) {
            if(currentdate < currentstart) {
                console.log("end cannot be less than start date");
                return;
            }
            currenttask['due-date'] = this.props.calendar.convertToTeamworkDate(currentdate);
        }
        //TODO make change
        var newtasks = Object.assign([], this.state.tasks);
        newtasks[currenttaskindex] = currenttask;
        this.setState({
            tasks:newtasks
        });
        //TODO append
        ev.target.appendChild(document.getElementById(data));
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
        if(Array.isArray(this.state.tasks) && !this.state.tasks.length) {
            return (<tbody><tr></tr></tbody>);
        }
        const calendar = this.props.calendar;
        const tasks = this.state.tasks;
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
                    var rangedate = calendar.range[i][j];
                    var current = new Date(rangedate.year, rangedate.month, rangedate.day);
                    if(task['start-date'] !== "" && task['due-date'] !== "") {
                        var startdate = calendar.convertFromTeamworkDate(task['start-date']);
                        var duedate = calendar.convertFromTeamworkDate(task['due-date']);


                        if(current >= startdate && current <= duedate) {
                            var taskspanname = "taskGraph taskSpan-"+i+"-"+j;
                            timespan.push(
                                <td style={{ "padding":"0"}} key={task.id+"-"+i+"-"+j}
                                    id={task.id+"-"+i+"-"+j} className="taskSpan"
                                    data-date={current.toDateString()}
                                    data-task-id={task.id}
                                    onDrop={this.drop} onDragOver={this.allowDrop}>

                                    <div className={taskspanname}>
                                        {current.toDateString() == startdate.toDateString()
                                        && <span className="task-change-date glyphicon glyphicon-option-vertical"
                                                 id={task.id+"-start"}
                                                 data-task-id={task.id}
                                                 draggable={true}
                                                 onDragStart={this.drag}></span>}
                                        <span className="task-hours">{dailyhours}</span>
                                        {current.toDateString() == duedate.toDateString()
                                        && <span className="task-change-date glyphicon glyphicon-option-vertical"
                                                 id={task.id+"-end"}
                                                 data-task-id={task.id}
                                                 draggable={true}
                                                 onDragStart={this.drag}></span>}
                                    </div>

                                </td>);
                        } else {
                            timespan.push(<td key={task.id+"-"+i+"-"+j}
                                              id={task.id+"-"+i+"-"+j}
                                              data-date={current.toDateString()}
                                              data-task-id={task.id}
                                              onDrop={this.drop} onDragOver={this.allowDrop}></td>);
                        }
                    } else {
                        timespan.push(<td key={task.id+"-"+i+"-"+j}
                                          id={task.id+"-"+i+"-"+j}
                                          data-date={current.toDateString()}
                                          data-task-id={task.id}
                                          onDrop={this.drop} onDragOver={this.allowDrop}></td>);
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

