import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Profile extends Component {
    constructor(){
        super();
        this.state = {
            currenttab:""
        };
        this.handleTabChange = this.handleTabChange.bind(this);
    }
    componentDidMount() {
    }

    handleTabChange(selection) {
        this.setState({currenttab:selection});
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <Sidebar onTabChange={this.handleTabChange}/>
                </div>
                <div className="col-md-9">
                    <Content current={this.state.currenttab}/>
                </div>
            </div>
        );
    }
}

class Content extends Component {
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

class Sidebar extends Component {
    constructor(props){
        super(props);
        this.changeContent = this.changeContent.bind(this);
    }

    changeContent(e) {
        this.props.onTabChange(e.target.dataset.section);
    }

    render() {
        return(
            <ul className="list-group">
                <li className="list-group-item" data-section="Schedule" onClick={this.changeContent}>Schedule</li>
                <li className="list-group-item" data-section="Preferences" onClick={this.changeContent}>Preferences</li>
                <li className="list-group-item disabled">Nothing here</li>
                <li className="list-group-item disabled">Nothing here</li>
                <li className="list-group-item disabled">Nothing here</li>
            </ul>
        );
    }
}

export default Profile;

if (document.getElementById('wrapper')) {
    ReactDOM.render(<Profile />, document.getElementById('wrapper'));
}
