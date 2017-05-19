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
        switch(e.target.id){
            case 'priority-filter':
                if(e.target.value == "priorities-all") {
                    $('.'+e.target.value).each(function() {
                        $(this).attr('style', 'display:table-row');
                    });
                } else {
                    $('.tasks').each(function() {
                        $(this).attr('style', 'display: none');
                    });
                    $('.'+e.target.value).each(function() {
                        $(this).attr('style','display:table-row');
                    });
                }

                break;
            case 'project-filter':
                switch(e.target.value){}
                break;
            case 'case-filter':
                switch(e.target.value){}
                break;
        }
    }

    render() {
        var calendar = this.props.calendar;
        var startDate = calendar.start.toISOString().substr(0,10);
        var endDate = calendar.end.toISOString().substr(0,10);
        return (
            <div>
                <div className="secondnav" id="mySecondnav">
                    <div className="form-group">
                        <div className="col-sm-2">
                            <select className="form-control" id="client-filter" onChange={this.handleFilterChange}>
                                <option>All Clients</option>
                                <option>client 1</option>
                                <option>client 2</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="project-filter" onChange={this.handleFilterChange}>
                                <option>All Projects</option>
                                <option>project 1</option>
                                <option>project 2</option>
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
