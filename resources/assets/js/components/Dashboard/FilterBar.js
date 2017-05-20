import React, { Component } from 'react';

export default class FilterBar extends Component {
    constructor(props) {
        super(props);
        this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleDateFilterChange(e) {
        $('.tasks').each(function() {
            $(this).removeClass('in');
        });
        this.props.onDateFilterChange(e.target.value);
    }

    handleFilterChange(e){
        if(e.target.value == "tasks") {
            $('.tasks').each(function () {
                $(this).addClass('in');
            });
        } else {
            $(".tasks:not(."+e.target.value+")").each(function(){
                $(this).removeClass('in');
            });
            $('.'+e.target.value).each(function() {
                $(this).addClass('in');
            });
        }
    }

    render() {
        var calendar = this.props.calendar;
        var startDate = calendar.start.toISOString().substr(0,10);
        var endDate = calendar.end.toISOString().substr(0,10);
        var companies = [];
        var projects = [];
        if(this.props.companies.length > 0){
            for(let i=0; i<this.props.companies.length; i++) {
                companies.push(<option value={"company-"+this.props.companies[i]['company-id']}>{this.props.companies[i]['company-name']}</option>);
            }
        }
        if(this.props.projects.length > 0){
            for(let i=0; i<this.props.projects.length; i++) {
                projects.push(<option value={"project-"+this.props.projects[i]['project-id']}>{this.props.projects[i]['project-name']}</option>);
            }
        }

        return (
            <div>
                <div className="secondnav" id="mySecondnav">
                    <div className="form-group">
                        <div className="col-sm-2">
                            <select className="form-control" id="client-filter" onChange={this.handleFilterChange}>
                                <option value="tasks">All Companies</option>
                                {companies}
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="project-filter" onChange={this.handleFilterChange}>
                                <option value="tasks">All Projects</option>
                                {projects}
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
}
