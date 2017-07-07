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
        this.handleAccordion = this.handleAccordion.bind(this);
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

    handleAccordion() {
        if($('.tasks.in').length > 0) {
            $('.tasks').removeClass('in').attr('aria-enabled', false);
            $('datafilter').val('tasks');
        }  else {
            var filters ="";
            $('.datafilter').each(function(){
                if($(this).val() != "tasks") {
                    filters+='.'+$(this).val();
                }
            });
            if(filters == "") {
                $('.tasks').addClass('in').attr('aria-expanded', true);
                if($('#unscheduled-filter').prop('checked') == false) {
                    $('.unscheduled-tasks').removeClass('in').attr('aria-expanded', false);
                }
            } else {
                if($('#unscheduled-filter').prop('checked') == false) {
                    filters+=":not(.unscheduled-tasks)";
                }
                $(filters).each(function(){
                    $(this).addClass('in');
                    $(this).attr('aria-expanded', true);
                });
            }
        }
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
            <tr key={profile.id}>
                <th scope="row" className="nohover" rowSpan="2" >
                    <div className="profile">
                        <div className = "col-sm-2">
                            <img id ="userpic"  alt = "Profile picture" src={ profile['avatar-url']} />
                        </div>
                        <div className = "col-sm-8" id = "name" >
                            <p>{ profile['first-name'] } {profile['last-name']}</p>
                        </div>
                        <div className = "col-sm-1 expandBtnToggle" id="accordion">
                            <a data-toggle="collapse" onClick={this.handleAccordion} id="expandBtnToggle"
                               aria-expanded="false" aria-controls="collapseExample">
                                <i className="fa fa-chevron-up pull-right"></i>
                                <i className="fa fa-chevron-down pull-right"></i>
                            </a>

                        </div>
                    </div>
                </th>
                <td colSpan={this.props.calendar.range.length*5} className={timeframeutilization} id ="schedualedBarShow">
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
                dates.push(<th key={"tday-"+i+"-"+j} className="text-center calendar-day-headers">{calendar.Week_Enum.properties[j]}
                {range[j].day}</th>);
            }
        }

        var dailyhours = [];

        for(let i=0; i<this.state.utilization.length; i++) {
            var ratio = this.state.utilization[i] / 8;
            var type = "utilizationbar-bottom w3-hover-text-white ";
            type = this.setColourIdentifier(ratio, type);
            var utilizationformatted = (((this.state.utilization[i])/8)*100).toFixed(0) +"%";
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