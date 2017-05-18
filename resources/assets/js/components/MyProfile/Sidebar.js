import React, { Component } from 'react';

export default class Sidebar extends Component {
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
