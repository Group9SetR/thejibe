import React, { Component } from 'react';

export default class Profile extends Component {

    constructor(props) {
        super(props);
    }
    //data-toggle="collapse" data-target=".tasks" className="accordion-toggle"

    render() {
        if(Array.isArray(this.props.profile)) {
            return (<tr></tr>);
        }
        const profile = this.props.profile;
        const utilization = this.props.calendar.range.length * 5;
        var dailyhours = [];
        for(let i=0; i<this.props.calendar.range.length; i++) {
            for(let j=0; j<5; j++) {
                var counter = 0;
                var taskspanname = "taskSpan-"+i+"-"+j;
                var dailyspans = document.getElementsByClassName(taskspanname);
                if(dailyspans) {
                    for(let k=0; k<dailyspans.length; k++) {
                        console.log(dailyspans[k]);
                        counter+=Number(dailyspans[k].dataset.taskhours, 10);
                    }
                }
                if((counter/8) < 0.5 || (counter/8) > 0.9) {
                    dailyhours.push(
                        <td className="utilizationbar nohighlight" key={"utilization-"+i+"-"+j}>
                            <div className="utilizationbar-top"></div>
                            <div className="bg-danger utilizationbar-bottom">{counter}</div>
                        </td>);
                } else {
                    dailyhours.push(
                        <td className="utilizationbar nohighlight" key={"utilization-"+i+"-"+j}>
                            <div className="utilizationbar-top"></div>
                            <div className="bg-primary utilizationbar-bottom">{counter}</div>
                        </td>);
                }
            }
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
                        <div className = "col-sm-1" id = "expandBtn">
                            <button type="button" className="btn btn-default btn-sm accordion-toggle"
                                    id="expandTasksBtn"
                                    data-toggle="collapse" data-target=".tasks" >
                                <span className="glyphicon glyphicon-chevron-down"></span>
                            </button>
                        </div>
                    </div>
                </th>
                {dailyhours}
            </tr>
        );
    }
}
