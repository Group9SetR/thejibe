import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Calendar from '../../calendar.js';
import Tasks from './Tasks.js';
import Timer from './Timer.js';
import FilterBar from './FilterBar.js';
import TableHeader from './TableHeader.js';
import ColumnHeader from './ColumnHeader.js';

const appElement = document.getElementById('dashboard');
const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        height                : '300px',
        width                 : '300px'
    }
};

class RefactorDashboard extends Component {

    constructor() {
        super();
        this.state = {
            tasks: [],
            currentprofile: [],
            calendar: [],
            currenttimer: [],
            modalIsOpen: false
        }
        this.state.calendar = new Calendar();
        this.state.calendar.init();
        this.taskList = this.taskList.bind(this);
        this.currentProfile  = this.currentProfile.bind(this);
        this.header = this.header.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleTimer = this.handleTimer.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this.taskList();
        this.currentProfile();
    }

    //https://thejibe.teamwork.com/tasks.json?startdate=20170515&enddate=20170519&responsible-party-ids=173890
    taskList() {
        //TODO Read id from current profile
        var startdate = this.state.calendar.convertToTeamworkDate(this.state.calendar.start);
        var enddate = this.state.calendar.convertToTeamworkDate(this.state.calendar.end);
        var request = 'https://thejibe.teamwork.com/tasks.json'+'?startdate='+startdate
            +'&enddate='+enddate+'&responsible-party-ids='+auth_id;
        fetch(request, this.header())
            .then(response => {
                return response.json();
            })
            .then(tasks => {
                this.setState({ tasks:tasks['todo-items'] });
            });
    }

    /**
     * The current profile should actually be stored upon login.
     */
    currentProfile() {
        fetch('https://thejibe.teamwork.com/me.json', this.header())
            .then(response => {
                return response.json();
            })
            .then(currentprofile => {
                this.setState({ currentprofile:currentprofile.person });
            });
    }

    header() {
        var key = auth_api_token;
        console.log(auth_api_token);
        var base64 = new Buffer(key+":xxx").toString("base64");
        var obj = {
            method:"GET",
            dataType: 'json',
            headers: {
                'Authorization': 'BASIC '+base64,
                'Content-Type': 'application/json'
            }
        };
        return obj;
    }

    handleFilter(filter) {
        switch(filter.type) {
            case "date":
                var temp = new Calendar();
                temp.init(filter.value);
                this.setState({calendar:temp}, this.taskList);
                break;
            case "project":
                break;
            case "priority":
                break;
            case "company":
                break;
        }
    }

    handleTimer(task) {
        this.setState({currenttimer:task});
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render() {
        return (
            <div>
                <FilterBar
                    calendar={this.state.calendar}
                    tasks={this.state.tasks}
                    onFilterChange={this.handleFilter}/>
                <div className="container" id="wrapper">
                    <table className="table table-bordered " id="task_table">
                        <ColumnHeader calendar={this.state.calendar} />

                        <TableHeader calendar={this.state.calendar}
                                profile={this.state.currentprofile}/>
                        <Tasks
                            calendar={this.state.calendar}
                            tasks={this.state.tasks}
                            onTimerChange={this.handleTimer}/>
                    </table>
                    <button onClick={this.openModal}>Open Modal</button>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        <h2>Log Time</h2>
                        <button onClick={this.closeModal}>close</button>
                    </Modal>

                    <Timer timer={this.state.currenttimer}/>
                </div>
            </div>
        );
    }
}

export default RefactorDashboard;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<RefactorDashboard />, document.getElementById('dashboard'));
}