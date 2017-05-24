import React, { Component } from 'react';

export default class FilterBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendar: []
        };
        this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleDateSelectorChange = this.handleDateSelectorChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            calendar:this.props.calendar
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            calendar:newProps.calendar
        }, this.handleFilterChange);
    }
    /*
    componentDidUpdate(newProps, newState) {
        this.handleFilterChange();
    }*/

    handleDateSelectorChange(e) {
        var startdate = new Date(this.props.calendar.convertHTMLDate(document.getElementById('start_date').value));
        var enddate = new Date(this.props.calendar.convertHTMLDate(document.getElementById('end_date').value));
        if(startdate <= enddate) {
            this.props.onDateSelectorChange(startdate, enddate);

        } else {
            alert("Start date cannot be greater than end date");
        }
        e.preventDefault();
    }

    handleDateFilterChange(e) {
        this.props.onDateFilterChange(e.target.value);
    }

    /**
     * Company, project, priority, and scheduled v unscheduled filters
     * @param e
     */
    handleFilterChange(e){
        $('.tasks.in').removeClass('in').attr('aria-expanded', false);
        var filters = "";
        $('.datafilter').each(function(){
            if($(this).val() != "tasks") {
                filters+='.'+$(this).val();
            }
        });
        if(filters == "") {
            $('.tasks').addClass('in').attr('aria-expanded', true);
            if($('#unscheduled-filter').prop('checked') == false) {
                $('.unscheduled-tasks').removeClass('in').attr('aria-expanded', false);
            }
        } else {
            if($('#unscheduled-filter').prop('checked') == false) {
                filters+=":not(.unscheduled-tasks)";
            }
            $(filters).each(function(){
                $(this).addClass('in');
                $(this).attr('aria-expanded', true);
            });
        }
    }

    /**
     * Basic header for GET requests.
     */
    getHeader() {
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

    /**
     *  Populates filters for Companies and Projects with
     *  1. Active Projects
     *  2. Active Clients (Clients with at least 1 active project
     */
    populateFilters() {
        fetch('https://thejibe.teamwork.com/projects.json', this.getHeader())
            .then( (response) => {
                return response.json();
            }).then( function(projectList) {
                var activeCompanies = new Array();
                for(let i = 0; i < projectList['projects'].length; i++) {
                    if (projectList['projects'][i]['status'] == "active") {
                        // Populate #project-filter drop down with Projects with status == "active"
                        $("#project-filter").append(new Option(
                            projectList['projects'][i]['name'],
                            "project-" + projectList['projects'][i]['id']));

                        // Creates array of active Companies with key being the company-id and value being the name
                        activeCompanies[projectList['projects'][i]['company']['id']] = projectList['projects'][i]['company']['name'];
                    }
                }
                // Populate #client-filter drop down with Companies that have at least one project with status == "active"
                for (var id in activeCompanies) {
                    $("#client-filter").append(new Option(activeCompanies[id], "company-" + id));
                }
            });
    }

    render() {
        var calendar = this.props.calendar;
        var startDate = calendar.start.toISOString().substr(0,10);
        var endDate = calendar.end.toISOString().substr(0,10);
        return (
            <div>
                <div className="secondnav" id="mySecondnav">
                    <div className="form-inline">
                        <div className="navbar container">
                            <div className="row">
                                <div className="col-md-6">
                                    <ul className="nav navbar-nav navbar-left ">
                                        <div className="form-group pull-left">
                                            <select className="form-control datafilter pull-left" id="client-filter" onChange={this.handleFilterChange} style={{maxWidth: 25 + '%'}}>
                                                <option value="tasks">All Companies</option>
                                            </select>
                                            <select className="form-control datafilter pull-left" id="project-filter" onChange={this.handleFilterChange} style={{maxWidth: 25 + '%'}}>
                                                <option value="tasks">All Projects</option>
                                            </select>
                                            <select className="form-control datafilter pull-left" id="priority-filter" onChange={this.handleFilterChange} style={{maxWidth: 25 + '%'}}>
                                                <option value="tasks">All Priorities</option>
                                                <option value="task-priority-high">High</option>
                                                <option value="task-priority-medium">Medium</option>
                                                <option value="task-priority-low">Low</option>
                                                <option value="task-priority-none">None</option>
                                            </select>
                                            &nbsp;
                                            <input type="checkbox" id="unscheduled-filter"
                                                   className="form-control" onChange={this.handleFilterChange}/>&nbsp;
                                            <label className="control-label w3-small">Show unscheduled</label>
                                        </div>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="nav navbar-nav navbar-right">
                                        <div className ="form-group">
                                            <input type="date" name="start_date" id="start_date" className="form-control"
                                                   value={startDate} onChange={this.handleDateSelectorChange}/>
                                            <input type="date" name="end_date" id="end_date" className="form-control"
                                                   value={endDate} onChange={this.handleDateSelectorChange}/>
                                            <select className="form-control" id="date_filter"
                                                    defaultValue={calendar.default} onChange={this.handleDateFilterChange}>
                                                <option value={calendar.Type_Enum.WEEK}>Week</option>
                                                <option value={calendar.Type_Enum.BIWEEK}>2-week</option>
                                                <option value={calendar.Type_Enum.MONTH}>Month</option>
                                                <option value={calendar.Type_Enum.TRIMONTH}>90-days</option>
                                            </select>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.populateFilters();
    }
}
