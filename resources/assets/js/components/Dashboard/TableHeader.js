import React, { Component } from 'react';
import Profile from './Profile.js';

export default class TableHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const calendar = this.props.calendar;

        var headings = [];
        var dates = [];

        for(var i=0; i < calendar.range.length; i++) {
            var range = calendar.range[i];
            headings.push(<th key={"tweek-"+i} className="text-center" colSpan="5">
                {range[0].day} {calendar.Month_Enum.properties[range[0].month]} - {range[range.length - 1].day} {calendar.Month_Enum.properties[range[range.length - 1].month]}</th>);
            for (var j = 0; j < range.length; j++) {
                dates.push(<th key={"tday-"+i+"-"+j} className="text-center calendar-day-headers">{range[j].day}</th>);
            }
        }

        return (

            <thead>
            <tr>
                <th rowSpan="2" style={{"width": "12%"}}></th>
                {headings}
            </tr>
            <tr>
                {dates}
            </tr>
            <Profile profile={this.props.profile}
                     utilizationhours={this.props.utilizationhours}
                     calendar={this.props.calendar}/>
            </thead>
        );
    }
}