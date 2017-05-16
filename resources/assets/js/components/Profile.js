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
        this.setState({currenttab:'selection'});
    }

    handleTabChange(selection) {

    }

    render() {
        return (
            <div id="wrapper">
                <div class="row">
                    <div class="col-md-3">
                        <Sidebar onTabChange={this.handleTabChange}/>
                    </div>
                    <div class="col-md-9">
                        <Content current={this.state.currenttab}/>
                    </div>
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
            <div class="panel panel-default content">
                <div class="panel-heading">
                    {current}
                </div>
                <div class="panel-body"></div>
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
            <ul class="list-group">
                <li class="list-group-item">Schedule</li>
                <li class="list-group-item">Preferences</li>
                <li class="list-group-item disabled">Nothing here</li>
                <li class="list-group-item disabled">Nothing here</li>
                <li class="list-group-item disabled">Nothing here</li>
            </ul>
        );
    }
}

export default Profile;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Profile />, document.getElementById('content'));
}
