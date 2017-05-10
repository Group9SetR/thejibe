@extends('layouts.app')

@section('content')
    <section class="container">
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
    </section>
@endsection
