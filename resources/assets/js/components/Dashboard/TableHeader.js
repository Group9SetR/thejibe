import React, { Component } from 'react';
//import Profile from './Profile.js';

export default class TableHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            utilization:[],
            total:0
        };
        this.setColourIdentifier = this.setColourIdentifier.bind(this);
        this.renderProfile = this.renderProfile.bind(this);
    }

    componentDidMount() {
        var temp = [];
        for(let i=0; i<this.props.calendar.range.length*5; i++) {
            temp.push(0);
        }
        this.setState({
            utilization:temp
        });
    }

    componentWillReceiveProps(nextProps) {
        var temp = [];
        var total = 0;
        for(let i=0; i<nextProps.calendar.range.length*5; i++) {
            temp.push(0);
        }
        if(nextProps.utilizationhours.length > 0) {
            for(let i=0; i<nextProps.calendar.range.length*5; i++) {
                for(let j=0; j<nextProps.utilizationhours.length; j++) {
                    temp[i] += nextProps.utilizationhours[j][i];
                }
                total += temp[i];
            }
        }
        this.setState({
            utilization:temp,
            total:total
        });
    }

    setColourIdentifier(ratio, classvar) {
        var result = classvar;

        if(ratio <0.3) {
            result += 'w3-orange';
        } else if(ratio < 0.5) {
            result += 'w3-yellow';
        } else if(ratio < 0.7) {
            result+= 'w3-blue';
        } else if(ratio < 0.9) {
            result+= 'w3-green';
        } else {
            result += 'w3-red';
        }
        return result;
    }

    renderProfile() {
        if(this.props.profile.length == 0) {
            return (<tr></tr>);
        }
        const profile = this.props.profile;
        var result = this.state.total/(this.props.calendar.range.length*5*8);
        var timeframeutilization = "utilizationbar-top w3-text-white w3-x-large w3-left-align ";
        timeframeutilization = this.setColourIdentifier(result, timeframeutilization);
        return(
            <tr key={profile.id} >
                <th scope="row" className="nohover" rowSpan="2" >
                    <div className="profile">
                        <div className = "col-sm-2">
                            <img id ="userpic"  alt = "Profile picture" src={ profile['avatar-url']} />
                        </div>
                        <div className = "col-sm-8" id = "name" >
                            <p>{ profile['first-name'] } {profile['last-name']}</p>
                        </div>
                        <div className = "col-sm-1" id="expandBtn">
                            <a className="accordion-toggle" id="expandBtnToggle" data-toggle="collapse" data-parent="#accordion" href=".tasks"></a>
                        </div>
                    </div>
                </th>
                <td colSpan={this.props.calendar.range.length*5} className={timeframeutilization}>
                    <b>{this.state.total.toFixed(2)+'/'+this.props.calendar.range.length*5*8+" "}
                        {"("+((this.state.total/(this.props.calendar.range.length*5*8))*100).toFixed(0)+"%) scheduled"}</b>
                </td>
            </tr>
        );
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

        var dailyhours = [];

        for(let i=0; i<this.state.utilization.length; i++) {
            var ratio = this.state.utilization[i] / 8;
            var type = "utilizationbar-bottom w3-hover-text-white ";
            type = this.setColourIdentifier(ratio, type);
            var utilizationformatted = this.state.utilization[i].toFixed(2);
            dailyhours.push(
                <td key={"utilization-"+i} className={type}>
                    {utilizationformatted}
                </td>);
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
            {this.renderProfile()}
            <tr>{dailyhours}</tr>
            </thead>
        );
    }
}