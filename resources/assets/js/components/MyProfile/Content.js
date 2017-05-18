import React, { Component } from 'react';

export default class Content extends Component {
    constructor(props){
        super(props);
        this.handleAvailabilityForm = this.handleAvailabilityForm.bind(this);
        this.handleHolidaysForm = this.handleHolidaysForm.bind(this);
    }
    handleAvailabilityForm() {}
    handleHolidaysForm() {}
    render() {
        var current = this.props.current || "Schedule";
        console.log(current);
        return(
            <div className="panel panel-default content">
                <div className="panel-heading">
                    {current}
                </div>
                <div className="panel-body">
                    <form onSubmit={this.handleAvailabilityForm}>
                        <h4>Availability</h4>
                        <div className="form-group">
                            <label>Date effective:&nbsp;</label>
                            <input type="date" name="week"/>
                        </div>
                        <div className="form-group">
                            <table className= "table table-striped table-bordered table-hover table-condensed">
                                <thead>
                                <tr className="info">
                                    <th>Mon</th><th>Tues</th><th>Wed</th><th>Thurs</th><th>Fri</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><input type="checkbox" name="mon"/></td>
                                    <td><input type="checkbox" name="tues"/></td>
                                    <td><input type="checkbox" name="wed"/></td>
                                    <td><input type="checkbox" name="thurs"/></td>
                                    <td><input type="checkbox" name="fri"/></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <input className="btn btn-primary" type="submit" value="Save"/>
                    </form>
                    <form onSubmit={this.handleHolidaysForm}>
                        <h4>Holidays</h4>
                        <div className="form-group">
                            <table className= "table table-striped table-bordered table-hover table-condensed">
                                <tr>
                                    <th>2017</th>
                                </tr>
                                <tr>
                                    <td><input type="checkbox" name=""/>&nbsp;New Year's Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Family Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Good Friday</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Victoria Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Canada Day</td>
                                </tr>
                                <tr>
                                    <td><input type="checkbox" name=""/>&nbsp;B.C. Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Labour Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Thanksgiving Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Remembrance Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Christmas Day</td>
                                </tr>
                            </table>
                        </div>
                        <div className="form-group">
                            <table className= "table table-striped table-bordered table-hover table-condensed">
                                <tr>
                                    <th>2018</th>
                                </tr>
                                <tr>
                                    <td><input type="checkbox" name=""/>&nbsp;New Year's Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Family Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Good Friday</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Victoria Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Canada Day</td>
                                </tr>
                                <tr>
                                    <td><input type="checkbox" name=""/>&nbsp;B.C. Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Labour Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Thanksgiving Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Remembrance Day</td>
                                    <td><input type="checkbox" name=""/>&nbsp;Christmas Day</td>
                                </tr>
                            </table>
                        </div>
                        <input className="btn btn-primary" type="submit" value="Save"/>
                    </form>
                </div>
            </div>
        );
    }
}
