import React, { Component } from 'react';

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            utilization:[],
            total:0
        };
        this.setColourIdentifier = this.setColourIdentifier.bind(this);
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

    render() {
        if(Array.isArray(this.props.profile)) {
            return (<tr></tr>);
        }
        const profile = this.props.profile;

        var dailyhours = [];
        var result = this.state.total/(this.props.calendar.range.length*5*8);
        var timeframeutilization = "utilizationbar-top w3-hover-text-white";

        timeframeutilization = this.setColourIdentifier(result, timeframeutilization);

        for(let i=0; i<this.state.utilization.length; i++) {
            var ratio = this.state.utilization[i] / 8;
            var type = "utilizationbar-bottom w3-hover-text-white ";
            type = this.setColourIdentifier(ratio, type);
            var utilizationformatted = this.state.utilization[i].toFixed(2);
            dailyhours.push(
                <td className="utilizationbar nohighlight" key={"utilization-"+i}>
                    <div className={timeframeutilization}>{this.state.total+'/'+this.props.calendar.range.length*5*8 }</div>
                    <div className={type}>{utilizationformatted}</div>
                </td>);
        }
        return (
            <tr key={profile.id} >
                <th scope="row" className="nohover">
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
                {dailyhours}
            </tr>
        );
    }
}
