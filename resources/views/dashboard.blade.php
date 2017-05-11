@extends('layouts.app')
@section('dashboardnav')
    <div class="secondnav" id="mySecondnav">
        <div class="form-group">
            <div class="col-sm-2">
                <select class="form-control" id="client">
                    <option>All Clients</option>
                    <option>client 1</option>
                    <option>client 2</option>
                </select>
            </div>
            <div class="col-sm-2">
                <select class="form-control" id="project">
                    <option>All Projects</option>
                    <option>project 1</option>
                    <option>project 2</option>
                </select>
            </div>
            <div class="col-sm-2">
                <select class="form-control" id="priority">
                    <option>All Priorities</option>
                    <option>Priorities 1</option>
                    <option>Priorities 2</option>
                </select>
            </div>



            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right ">
                    {{ Form::open(['url'=>'/select-date']) }}
                    <div class ="form-inline">
                        {{ Form::date('start-date', '', ['id'=>'start-date', 'class'=>'form-control']) }}
                        {{ Form::date('end-date', '', ['id'=>'end-date', 'class'=>'form-control']) }}
                    </div>
                    {{ Form::close() }}

                </ul>
            </div><!--/.nav-collapse -->
        </div>
    </div>

@endsection
@section('content')
    <div class = "container" id="wrapper">
        <div id="dashboard"></div>

        <!--
        <div class="left-half">
            <div class = "row" id ="profile">
                <div class="col-sm-2">
                    <img src="1.png" class="img-circle" alt="profile picture" width="50" height="50">
                </div>
                <div class="col-sm-5">
                    <P id = "name"><strong>Hansol Lee</strong></P>
                </div>
                <div class="col-xs-1 pull-right">
                    <button type="button" class="btn btn-link">
                        <span class="glyphicon glyphicon-chevron-down"></span>
                    </button>
                </div>
            </div>
        </div>
        <div class="right-half">

        </div>
        -->
    </div>
@endsection
