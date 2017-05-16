@extends('layouts.app')
@section('title')
    <title>Profile - {{ config('app.name', 'Laravel') }}</title>
@endsection
@section('css')
    <link href="{{asset('css/profile.css')}}" rel="stylesheet">
@endsection

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-3 sidebar">
                <ul class="list-group">
                    <li class="list-group-item">Schedule</li>
                    <li class="list-group-item">Preferences</li>
                    <li class="list-group-item disabled">Nothing here</li>
                    <li class="list-group-item disabled">Nothing here</li>
                    <li class="list-group-item disabled">Nothing here</li>
                </ul>
            </div>
            <div class="col-md-9 content">

            </div>
        </div>
    </div>
@endsection