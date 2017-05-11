import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            currentprofile: []
        }
    }

    componentDidMount() {
        var key = "twp_WUI8GI94aBL8p97JiiyXue8epq9A";
        var base64 = new Buffer(key+":xxx").toString("base64");
        var obj = {
            method:"GET",
            dataType: 'json',
            headers: {
                'Authorization': 'BASIC '+base64,
                'Content-Type': 'application/json'
            }
        };

        fetch('https://thejibe.teamwork.com/tasks.json', obj)
            .then(response => {
                return response.json();
            })
            .then(tasks => {
                console.log(tasks);
                this.setState({ tasks:tasks['todo-items'] });
            });

        fetch('https://thejibe.teamwork.com/me.json', obj)
            .then(response => {
                return response.json();
            })
            .then(currentprofile => {
                this.setState({ currentprofile:currentprofile.person });
                console.log(this.state.currentprofile);
            });
    }


    renderCurrentProfile() {
        var pic = this.state.currentprofile['avatar-url'];
        console.log(pic);
            return (
                <tr key={this.state.currentprofile.id}>
                    <th scope="row">
                        <div className="profile">
                            <div className = "col-sm-2">
                                <img id ="userpic"  src={ this.state.currentprofile['avatar-url']} />
                            </div>
                            <div className = "col-sm-8" id = "name" >
                                <p>{ this.state.currentprofile['first-name'] } {this.state.currentprofile['last-name']}</p>
                            </div>
                            <div className = "col-sm-1" id = "expandBtn">
                                <button type="button" className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon-chevron-down"></span>
                                </button>
                            </div>
                        </div>
                    </th>
                    <td colSpan="10"><div id="scheduledBar"><p id="scheduledText">65h/ 80h(81%) scheduled</p></div></td>
                </tr>
            );
    }

    renderTasks() {
        return this.state.tasks.map(task => {
            return (
                <tr key={task.id}>
                    <th scope="row">
                        <div >
                            <div>
                                <div className ="taskName">
                                { task.description }
                                </div>
                                {
                                    (task.priority === "") ? <span></span>:
                                        <button type="button" className="btn btn-warning btn-sm" style={{ "float":"right"}}>{ task.priority }</button>
                                }
                            </div>
                            <div>
                                <p className ="projectName">ProjectName:{ task['project-name'] }</p>
                                <p className ="companyName">{ task['company-name'] }</p>
                            </div>
                            <div className="progress" id ="progressBar">
                                <div className="progress-bar progress-bar-striped active" role="progressbar"
                                     aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{"width":"40%"}}>
                                    40%
                                </div>
                            </div>
                        </div>
                    </th>
                    <td colSpan="10">TIMESPAN</td>
                </tr>
            );
        })
    }


    render() {
        return (
            <div>
                <table className="table table-bordered " id="task_table">
                    <thead >
                        <tr>
                            <th rowSpan="2" style={{"width": "12%"}}></th>
                            <th className="text-center" colSpan="5"> 9-13 Jan</th>
                            <th className="text-center" colSpan="5"> 16-20 Jan</th>
                        </tr>
                        <tr >
                            <th className="text-center">9</th>
                            <th className="text-center">10</th>
                            <th className="text-center">11</th>
                            <th className="text-center">12</th>
                            <th className="text-center">13</th>
                            <th className="text-center">16</th>
                            <th className="text-center">17</th>
                            <th className="text-center">18</th>
                            <th className="text-center">19</th>
                            <th className="text-center">20</th>
                        </tr>
                    </thead>
                    <tbody>
                    { this.renderCurrentProfile() }
                    { this.renderTasks() }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Dashboard;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
}