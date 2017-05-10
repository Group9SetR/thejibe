import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Example extends Component {

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
                    <td>{ task['project-name'] }</td>
                    <td>{ task.id }</td>
                    {
                        task.completed?<td>Y</td> : <td>N</td>
                    }
                    <td>{ task.description }</td>
                    <td>{ task['created-on'] }</td>
                </tr>
            );
        })
    }

    render() {
        return (
            <div>
                <h2>Tasks</h2>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Project</th>
                        <th>ID</th>
                        <th>Completed</th>
                        <th>Description</th>
                        <th>Created</th>
                    </tr>
                    </thead>

                    <tbody>
                    { this.renderTasks() }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Example;

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}