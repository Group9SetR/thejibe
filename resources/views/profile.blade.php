@extends('layouts.app')
@section('title')
    <title>Profile - {{ config('app.name', 'The Jibe: Teamwork Dashboard') }}</title>
@endsection
@section('css')
    <link href="{{asset('css/profile.css')}}" rel="stylesheet">
@endsection

@section('content')
    <div id="wrapper">
        {{Auth::user()->account_id}}
    </div>
@endsection