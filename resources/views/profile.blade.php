@extends('layouts.app')
@section('title')
    <title>Profile - {{ config('app.name', 'Laravel') }}</title>
@endsection
@section('css')
    <link href="{{asset('css/profile.css')}}" rel="stylesheet">
@endsection

@section('content')
    <div id="wrapper">
        <div class="row">
            <ul class="col-md-3 list-group">
                <li class="list-group-item">Schedule</li>
                <li class="list-group-item">Preferences</li>
                <li class="list-group-item disabled">Nothing here</li>
                <li class="list-group-item disabled">Nothing here</li>
                <li class="list-group-item disabled">Nothing here</li>
            </ul>
            <div class="col-md-9">
                <div id="content"></div>
                <div class="panel panel-default content">
                    <div class="panel-heading">
                        Temporary Section Heading
                    </div>
                    <div class="panel-body"></div>
                </div>
            </div>
        </div>
    </div>
@endsection