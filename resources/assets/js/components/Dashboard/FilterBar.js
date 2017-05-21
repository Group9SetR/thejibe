import React, { Component } from 'react';

export default class FilterBar extends Component {
    constructor(props) {
        super(props);
        this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleDateFilterChange(e) {
        this.props.onDateFilterChange(e.target.value);
        document.getElementById('expandTasksBtn').click();
    }

    handleFilterChange(e){
        if(e.target.value == "tasks") {
            $('.tasks').each(function () {
                $(this).attr('style', 'display:table-row');
            });
        } else {
            $(".tasks:not(."+e.target.value+")").each(function() {
                $(this).attr('style', 'display: none');
            });
            $('.'+e.target.value).each(function() {
                $(this).attr('style','display:table-row');
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
                    console.log(companyList['companies'].length);
                    $("#client-filter").append(new Option(
                        companyList['companies'][i]['name'],
                        "company-" + companyList['companies'][i]['id']));
                }
            });
    }

    getProjectList() {
        fetch('https://thejibe.teamwork.com/projects.json', this.getHeader())
            .then( (response) => {
                return response.json();
            }).then( function(projectList) {
            for(let i = 0; i < projectList['projects'].length; i++) {
                console.log(projectList['projects'].length);
                $("#project-filter").append(new Option(
                    projectList['projects'][i]['name'],
                    "project-" + projectList['projects'][i]['id']));
            }
        });
    }

    render() {
        var calendar = this.props.calendar;
        var startDate = calendar.start.toISOString().substr(0,10);
        var endDate = calendar.end.toISOString().substr(0,10);
        /*if(this.props.companies.length > 0){
            for(let i=0; i<this.props.companies.length; i++) {
                companies.push(<option value={"company-"+this.props.companies[i]['company-id']}>{this.props.companies[i]['company-name']}</option>);
            }
        }
        if(this.props.projects.length > 0){
            console.log("projects"+this.props.projects);
            for(let i=0; i<this.props.projects.length; i++) {
                projects.push(<option value={"project-"+this.props.projects[i]['project-id']}>{this.props.projects[i]['project-name']}</option>);
            }
        }*/

        return (
            <div>
                <div className="secondnav" id="mySecondnav">
                    <div className="form-group">
                        <div className="col-sm-2">
                            <select className="form-control" id="client-filter" onChange={this.handleFilterChange}>
                                <option value="tasks">All Companies</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="project-filter" onChange={this.handleFilterChange}>
                                <option value="tasks">All Projects</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="priority-filter" onChange={this.handleFilterChange}>
                                <option value="tasks">All Priorities</option>
                                <option value="task-priority-high">High</option>
                                <option value="task-priority-medium">Medium</option>
                                <option value="task-priority-low">Low</option>
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

    componentDidMount() {
        this.getCompanyList();
        this.getProjectList();
    }
}
