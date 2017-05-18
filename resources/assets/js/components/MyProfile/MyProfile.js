import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './Sidebar.js';
import Content from './Content.js';
class MyProfile extends Component {
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

export default MyProfile;

if (document.getElementById('wrapper')) {
    ReactDOM.render(<MyProfile />, document.getElementById('wrapper'));
}
