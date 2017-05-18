import React, { Component } from 'react';

export default class ColumnHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        var columns = [];
        const calendar = this.props.calendar;
        for(var i=0; i < calendar.range.length; i++) {
            var range = calendar.range[i];
            for(var j=0; j<range.length; j++) {
                var col = (range[j].full == new Date().toDateString()) ?
                    <col key={"col-"+i+"-"+j} className="currentDate success"></col>:<col key={"col-"+i+"-"+j}></col>;
                columns.push(col);
            }
        }
        return (
            <colgroup>
                <col className="task_table_header"></col>
                {columns}
            </colgroup>
        );
    }
}

