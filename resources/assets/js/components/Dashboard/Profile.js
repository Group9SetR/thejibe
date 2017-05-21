import React, { Component } from 'react';

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            utilization:[]
        };
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
        for(let i=0; i<nextProps.calendar.range.length*5; i++) {
            temp.push(0);
        }
        if(nextProps.utilizationhours.length > 0) {
            for(let i=0; i<nextProps.calendar.range.length*5; i++) {
                for(let j=0; j<nextProps.utilizationhours.length; j++) {
                    temp[i] += nextProps.utilizationhours[j][i];
                }
            }
        }
        this.setState({
            utilization:temp
        });
    }

    render() {
        if(Array.isArray(this.props.profile)) {
            return (<tr></tr>);
        }
        const profile = this.props.profile;

        var dailyhours = [];

        for(let i=0; i<this.state.utilization.length; i++) {
            var ratio = this.state.utilization[i]/8;
            var type = "utilizationbar-bottom w3-hover-text-white ";
            if(ratio < 0.5) {
                type += "w3-yellow";
            } else if(ratio < 0.7){
                type += "w3-blue";
            } else if(ratio < 0.9) {
                type += "w3-green";
            } else {
                type += "w3-red";
            }
            dailyhours.push(
                <td className="utilizationbar nohighlight" key={"utilization-"+i}>
                    <div className="utilizationbar-top"></div>
                    <div className={type}>{this.state.utilization[i]}</div>
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
