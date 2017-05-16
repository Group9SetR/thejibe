@extends('layouts.app')
@section('title')
    <title>Profile - {{ config('app.name', 'Laravel') }}</title>
@endsection
@section('css')
    <link href="{{asset('css/profile.css')}}" rel="stylesheet">
@endsection

@section('content')
    <div id="wrapper">
    </div>
@endsection