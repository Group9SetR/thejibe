import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: []
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
    }

    renderTasks() {
        return this.state.tasks.map(task => {
            return (
                <tr key={task.id}>
                    <th scope="row">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                { task.description }
                                {
                                    (task.priority === "") ? <span></span>:
                                        <span className="panel panel-primary" style={{ "float":"right"}}>{ task.priority }</span>
                                }
                            </div>
                            <div className="panel-body">
                                <p>{ task['company-name'] }</p>
                                <p>{ task['project-name'] }</p>
                                <p>{ task['created-on'] }</p>
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
                <table className="table table-bordered" id="task_table">
                    <thead>
                        <tr>
                            <th rowSpan="2" style={{"width": "12%"}}></th>
                            <th className="text-center" colSpan="5"> 9-13 Jan</th>
                            <th className="text-center" colSpan="5"> 16-20 Jan</th>
                        </tr>
                        <tr>
                            <th>9</th>
                            <th>10</th>
                            <th>11</th>
                            <th>12</th>
                            <th>13</th>
                            <th>16</th>
                            <th>17</th>
                            <th>18</th>
                            <th>19</th>
                            <th>20</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">
                            <div className = "row" id ="profile">
                                <div className="col-sm-2">
                                    <img src="1.png" className="img-circle" alt="profile picture" width="50" height="50"/>
                                </div>
                                <div className="col-sm-5" id = "name">
                                    <p id = "name"><strong>Hansol Lee</strong></p>
                                </div>
                                <div className="col-xs-1 pull-right">
                                    <button type="button" className="btn btn-link">
                                        <span className="glyphicon glyphicon-chevron-down"> </span>
                                    </button>
                                </div>
                            </div>
                        </th>
                        <td colSpan="10"> 65h/ 80h(81%)scheduled</td>
                    </tr>
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