@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Login</div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form" method="POST" action="{{ url('/login') }}">
                        {!! csrf_field() !!}
                        @if(Session::has("error"))
                            <p class="alert {{ Session::get('alert-class', 'alert-info') }}">{{ Session::get('error') }}</p>
                        @endif
                        <div class="form-group{{ $errors->has('api_token') ? ' has-error' : '' }}">
                            <label class="col-md-4 control-label">Api-Token</label>

                            <div class="col-md-6">
                                <input type="password" class="form-control" name="api_token" value="{{ old('api_token') }}">

                                @if ($errors->has('api_token'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('api_token') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <button id="login-submit" type="submit" class="btn btn-primary">
                                    <i class="fa fa-btn fa-sign-in"></i>Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
