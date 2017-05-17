@extends('layouts.app')
@section('title')
    <title>Dashboard - {{ config('app.name', 'The Jibe: TeamWork') }}</title>
@endsection
@section('css')
    <link href="{{asset('css/dashboard.css')}}" rel="stylesheet">
    <link href="{{asset('css/timer.css')}}" rel="stylesheet">
@endsection
@section('script')
    <script>
        var auth_id ="{{$auth['id']}}";
        var auth_first_name = "{{$auth['first_name']}}";
        var auth_last_name = "{{$auth['last_name']}}";
        var auth_api_token = "{{$auth['api_token']}}";
        var auth_user_name = "{{$auth['user_name']}}";
        document.ready=startTimer();
        document.ready=startLoader();
        var myVar;

        function startLoader() {
            myVar = setTimeout(showPage, 3000);
        }

        function showPage() {
            document.getElementById("loader").style.display = "none";
            document.getElementById("app").style.display = "block";
        }
    </script>
@endsection


@section('content')
    <div id="dashboard"></div>
@endsection