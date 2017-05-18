import React, { Component } from 'react';

export default class FilterBar extends Component {
    constructor(props) {
        super(props);
        this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
    }

    handleDateFilterChange(e) {
        this.props.onFilterChange({"type":"date", "value":e.target.value});
    }

    handleProjectFilterChange(e) {

    }

    handlePriorityFilterChange(e) {

    }

    handleClientFilterChange(e) {

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
                            <select className="form-control" id="client" onChange={this.handleClientFilterChange}>
                                <option>All Clients</option>
                                <option>client 1</option>
                                <option>client 2</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="project" onChange={this.handleProjectFilterChange}>
                                <option>All Projects</option>
                                <option>project 1</option>
                                <option>project 2</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="priority" onChange={this.handlePriorityFilterChange}>
                                <option>All Priorities</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
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
