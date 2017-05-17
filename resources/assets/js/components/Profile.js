import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Profile extends Component {
    constructor(){
        super();
        this.state = {
            currenttab:[]
        };
        this.handleTabChange = this.handleTabChange.bind(this);
    }
    componentDidMount() {
        this.setState({currenttab:'Schedule'});
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
    }
    render() {
        var current = this.props.current || 'Schedule';
        return(
            <div className="panel panel-default content">
                <div className="panel-heading">
                    {current}
                </div>
                <div className="panel-body"></div>
            </div>
        );
    }
}

class Sidebar extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <ul className="list-group">
                <li className="list-group-item">Schedule</li>
                <li className="list-group-item">Preferences</li>
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
