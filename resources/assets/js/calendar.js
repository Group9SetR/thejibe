/**
 * Handles the dashboard calendar display.
 * Week, 2-week, month, 3-month, custom views.
 * @author Vincent Lee
 * @version 10/05/2017
 */
export default function Calendar()
{
    this.Type_Enum = Object.freeze({
        DEFAULT:0,
        WEEK:1,
        BIWEEK:2,
        MONTH:3,
        TRIMONTH:4,
        CUSTOM:5,
        properties: {
            1: {name:"week", weeks:1},
            2: {name:"biweek", weeks:2},
            3: {name:"month", weeks:4},
            4: {name:"trimonth", weeks:12}
        }
    });
    this.Month_Enum = Object.freeze({
        JANUARY:0,
        FEBRUARY:1,
        MARCH:2,
        APRIL:3,
        MAY:4,
        JUNE:5,
        JULY:6,
        AUGUST:7,
        SEPTEMBER:8,
        OCTOBER:9,
        NOVEMBER:10,
        DECEMBER:11,
        properties: {
            0: "Jan",
            1: "Feb",
            2: "Mar",
            3: "Apr",
            4: "May",
            5: "Jun",
            6: "Jul",
            7: "Aug",
            8: "Sep",
            9: "Oct",
            10: "Nov",
            11: "Dec"
        }
    });
    this.custom = "";
    this.default = this.Type_Enum.BIWEEK;
    this.start = "";
    this.end = "";
    this.type = "";
    this.range = [];
    this.init = function(type) { //initialize range of dates
        this.range = [];
        this.type = (type === undefined) ? this.default : this.getType(type);
        this.start = getStart(this.type, this.Type_Enum);
        this.setRange();
        var last = this.range[this.range.length-1][4];
        this.end = new Date(last.year, last.month, last.day);
    };
    this.setRange = function () {
        var current = new Date();
        current.setTime(this.start.getTime());
        if(this.type === this.Type_Enum.WEEK || this.type === this.Type_Enum.BIWEEK) {
            for(let i=0; i<this.Type_Enum.properties[this.type].weeks; i++) {
                var next = new Date(current.getFullYear(), current.getMonth(), current.getDate()+7);
                this.range.push(getWeekDates(current));
                current = next;
            }
        } else if(this.type === this.Type_Enum.MONTH) {
            while(current.getMonth() == this.start.getMonth()) {
                var next = new Date(current.getFullYear(), current.getMonth(), current.getDate()+7);
                this.range.push(getWeekDates(current));
                current = next;
            }
        } else if(this.type === this.Type_Enum.TRIMONTH) {
            var temp = new Date();
            temp.setTime(this.start.getTime());
            temp.setMonth(temp.getMonth()+3);
            while(current.getMonth() != temp.getMonth()) {
                var next = new Date(current.getFullYear(), current.getMonth(), current.getDate()+7);
                this.range.push(getWeekDates(current));
                current = next;
            }
        }
    };
    this.getType = function (type) {
        if(type == this.Type_Enum.WEEK) {
            return this.Type_Enum.WEEK;
        } else if(type == this.Type_Enum.BIWEEK) {
            return this.Type_Enum.BIWEEK;
        } else if (type == this.Type_Enum.MONTH) {
            return this.Type_Enum.MONTH;
        } else if (type == this.Type_Enum.TRIMONTH) {
            return this.Type_Enum.TRIMONTH;
        } else if (type == this.Type_Enum.DEFAULT) {
            return this.Type_Enum.DEFAULT;
        } else if (type == this.Type_Enum.CUSTOM) {
            return this.Type_Enum.CUSTOM;
        }

    }
}

/*
 * Given a calendar date, find the week dates in the same week.
 * Return an array holding the calendar dates of the week days in that week.
 * i.e. Monday will be 0-index, Friday will be 4-index.
 */
function getWeekDates(date) {
    var current = date;
    var day_of_week = current.getDay();
    var range = [5]; //array to return
    if(day_of_week !== 1) {
        current.setHours(-24 * (day_of_week-1));
        day_of_week = 1;
    }
    while(day_of_week < 6) {
        var date_array = {year:current.getFullYear(), month:current.getMonth(),
            day:current.getDate(), full:current.toDateString()};
        range[day_of_week-1] = date_array;
        current.setHours(24);
        day_of_week++;
    }
    return range;
}

/**
 * Derive the date of the start of a week given a Date object.
 * @param date a Date object
 * @return date of Monday of that week
 */
function getWeekStart(date) {
    var current = date;
    var day_of_week = date.getDay();

    if(day_of_week !== 1) { //set current to Monday of that week
        current.setHours(-24 * (day_of_week-1));
    }
    return current;
}

function getMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getStart(type, typeenum) {
    var current = new Date();
    if(type == typeenum.WEEK || type == typeenum.BIWEEK) {
        return getWeekStart(current);
    } else if (type == typeenum.MONTH || type == typeenum.TRIMONTH) {
        return getMonthStart(current);
    } else {
        return current;
    }
}