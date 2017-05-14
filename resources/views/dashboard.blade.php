@extends('layouts.app')
@section('nav')
    <!--<div class="secondnav" id="mySecondnav">
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
                    {{ Form::open(['url'=>'/select_date']) }}
                    <div class ="form-inline">
                        {{ Form::date('start_date', '', ['id'=>'start_date', 'class'=>'form-control']) }}
                        {{ Form::date('end_date', '', ['id'=>'end_date', 'class'=>'form-control']) }}
                        {{ Form::select('date_filter',
                            ['0'=>'',
                             '1'=>'Week',
                             '2'=>'Biweek',
                             '3'=>'Month',
                             '4'=>'90-Days'], '',
                             ['class'=>'form-control',
                              'id'=>'date_filter']) }}
                    </div>
                    {{ Form::close() }}
                </ul>
            </div>
        </div>
    </div>-->

@endsection
@section('content')
    <div id="dashboard"></div>
@endsection