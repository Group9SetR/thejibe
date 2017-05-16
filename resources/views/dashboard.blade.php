@extends('layouts.app')
@section('title')
    <title>Dashboard - {{ config('app.name', 'Laravel') }}</title>
@endsection
@section('css')
    <link href="{{asset('css/dashboard.css')}}" rel="stylesheet">
    <link href="{{asset('css/timer.css')}}" rel="stylesheet">
@endsection
@section('script')
    <script>
        document.ready=startTimer();
        var myVar;

        function startTimer() {
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