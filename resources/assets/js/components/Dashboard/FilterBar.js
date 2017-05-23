import React, { Component } from 'react';

export default class FilterBar extends Component {
    constructor(props) {
        super(props);
        this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleDateSelectorChange = this.handleDateSelectorChange.bind(this);
        //this.handleDateDirectionChange = this.handleDateDirectionChange.bind(this);
    }

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
        $('.tasks').each(function() {
            $(this).removeClass('in');
            $(this).attr('aria-expanded', false);
        });
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

    getCompanyList() {
        fetch('https://thejibe.teamwork.com/companies.json', this.getHeader())
            .then( (response) => {
                return response.json();
            }).then( function(companyList) {
                for(let i = 0; i < companyList['companies'].length; i++) {
                    $("#client-filter").append(new Option(
                        companyList['companies'][i]['name'],
                        "company-" + companyList['companies'][i]['id']));
                }
            //$("#client-filter").select2();
        });
    }

    getProjectList() {
        fetch('https://thejibe.teamwork.com/projects.json', this.getHeader())
            .then( (response) => {
                return response.json();
            }).then( function(projectList) {
            for(let i = 0; i < projectList['projects'].length; i++) {
                $("#project-filter").append(new Option(
                    projectList['projects'][i]['name'],
                    "project-" + projectList['projects'][i]['id']));
            }
            //$("#project-filter").select2();
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
                        <div className="navbar">
                            <ul className="nav navbar-nav navbar-left ">
                                <div className="form-group ">
                                    <select className="form-control datafilter" id="client-filter" onChange={this.handleFilterChange}>
                                        <option value="tasks">All Companies</option>
                                    </select>
                                    <select className="form-control datafilter" id="project-filter" onChange={this.handleFilterChange}>
                                        <option value="tasks">All Projects</option>
                                    </select>
                                    <select className="form-control datafilter" id="priority-filter" onChange={this.handleFilterChange}>
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
                            <ul className="nav navbar-nav navbar-right ">
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
        );
    }

    componentDidMount() {
        this.getCompanyList();
        this.getProjectList();
        //$("#client-filter").select2();
        //$("#project-filter").select2();
    }
}
